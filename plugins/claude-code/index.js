import { createClaudeCodeTool } from "./src/claude-code-tool.js";

export default function register(api) {
  api.registerTool(createClaudeCodeTool(api), { optional: true });
}
