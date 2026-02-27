import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { Type } from "@sinclair/typebox";

function spawnAsync(cmd, args, opts) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { ...opts, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "", stderr = "";
    child.stdout.on("data", (d) => { stdout += d; });
    child.stderr.on("data", (d) => { stderr += d; });
    const timer = opts.timeout
      ? setTimeout(() => { child.kill(); reject(Object.assign(new Error(`timeout`), { killed: true, stdout, stderr })); }, opts.timeout)
      : null;
    child.on("close", (code) => {
      if (timer) clearTimeout(timer);
      if (code === 0) resolve({ stdout, stderr });
      else reject(Object.assign(new Error(`exit code ${code}`), { code, stdout, stderr }));
    });
    child.on("error", (err) => { if (timer) clearTimeout(timer); reject(err); });
  });
}

const CLAUDE_PATH     = "/Users/kms/.local/bin/claude";
const DEFAULT_TIMEOUT = 300_000; // 5분
const DEFAULT_PERM    = "bypassPermissions";

function resolveConfig(api) {
  const c = api.pluginConfig ?? {};
  return {
    claudePath:     (typeof c.claudePath     === "string" && c.claudePath.trim())     || CLAUDE_PATH,
    defaultWorkdir: (typeof c.defaultWorkdir === "string" && c.defaultWorkdir.trim()) || (api.config?.agents?.defaults?.workspace ?? process.env.HOME + "/dev"),
    permissionMode: (typeof c.permissionMode === "string" && c.permissionMode.trim()) || DEFAULT_PERM,
    timeoutMs:      (typeof c.timeoutMs      === "number" && c.timeoutMs > 0)         ? c.timeoutMs : DEFAULT_TIMEOUT,
  };
}

export function createClaudeCodeTool(api) {
  return {
    name: "claude-code",
    label: "Claude Code",
    description:
      "Delegates a coding task to the Claude Code CLI. " +
      "Claude Code can read, write, and edit files, run bash commands, and do real development work. " +
      "Use for any software engineering task: writing code, fixing bugs, analyzing projects. " +
      "Pass sessionId from a previous result to continue a conversation.",

    parameters: Type.Object({
      task: Type.String({ description: "The coding task to perform. Be specific." }),
      workdir: Type.Optional(Type.String({ description: "Working directory. Defaults to configured workspace." })),
      sessionId: Type.Optional(Type.String({ description: "Session ID to resume a previous Claude Code session." })),
      permissionMode: Type.Optional(Type.String({ description: "Override: acceptEdits | bypassPermissions | dontAsk" })),
      timeoutMs: Type.Optional(Type.Number({ description: "Timeout override in milliseconds." })),
    }),

    async execute(_id, params) {
      const cfg = resolveConfig(api);

      const task = typeof params.task === "string" ? params.task.trim() : "";
      if (!task) throw new Error("task parameter is required");

      const workdir       = (typeof params.workdir       === "string" && params.workdir.trim())       || cfg.defaultWorkdir;
      const permMode      = (typeof params.permissionMode=== "string" && params.permissionMode.trim())|| cfg.permissionMode;
      const timeoutMs     = (typeof params.timeoutMs     === "number" && params.timeoutMs > 0)        ? params.timeoutMs : cfg.timeoutMs;
      const sessionId     = (typeof params.sessionId     === "string" && params.sessionId.trim())     || null;

      if (!existsSync(cfg.claudePath)) throw new Error(`Claude CLI not found: ${cfg.claudePath}`);
      if (!existsSync(workdir))        throw new Error(`Working directory not found: ${workdir}`);

      const args = ["--print", "--output-format", "json", "--permission-mode", permMode];
      if (sessionId) args.push("--resume", sessionId);

      // 중첩 실행 방지용 환경변수 제거
      const env = { ...process.env };
      delete env.CLAUDECODE;
      delete env.CLAUDE_CODE_ENTRYPOINT;

      let rawOut;
      try {
        const { stdout } = await spawnAsync(cfg.claudePath, [...args, task], {
          cwd: workdir, timeout: timeoutMs, env,
        });
        rawOut = stdout;
      } catch (err) {
        if (err?.killed) throw new Error(`Claude Code timed out after ${timeoutMs}ms`);
        if (err?.stdout) { rawOut = err.stdout; }
        else {
          const stderr = err?.stderr ? `\nstderr: ${err.stderr.slice(0, 500)}` : "";
          throw new Error(`Claude Code failed: ${err?.message ?? err}${stderr}`);
        }
      }

      let parsed;
      try { parsed = JSON.parse(rawOut.trim()); }
      catch { return { content: [{ type: "text", text: rawOut.trim() || "(no output)" }] }; }

      if (parsed.is_error) throw new Error(`Claude Code error: ${parsed.result ?? "(unknown)"}`);

      const newSession = parsed.session_id ?? null;
      const cost       = typeof parsed.cost_usd === "number" ? parsed.cost_usd : null;
      const text = [
        parsed.result || "(completed)",
        newSession ? `\n\n---\nSession ID: ${newSession}` : "",
        cost !== null ? `\nCost: $${cost.toFixed(4)}` : "",
      ].join("");

      return {
        content: [{ type: "text", text }],
        details: { sessionId: newSession, costUsd: cost, workdir, permissionMode: permMode },
      };
    },
  };
}
