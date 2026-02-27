# Claude Code 플러그인 연동 (선택)

> OpenClaw(Gemini)가 필요할 때만 Claude Code CLI에 작업을 위임하는 플러그인.
> 일반 대화는 Gemini가 처리하고, 코드 작성/파일 조작 등 복잡한 작업만 Claude Code에 위임.

---

## Step 1. 플러그인 설치

```bash
# 소스 클론 (Private repo — GitHub 인증 필요)
git clone https://github.com/withusps-coder/openclaw-claude-code.git ~/dev/openclaw-claude-code

# 의존성 설치
cd ~/dev/openclaw-claude-code && npm install

# 플러그인 등록
openclaw plugins install ~/dev/openclaw-claude-code
openclaw gateway restart
```

---

## Step 2. openclaw.json에 툴 허용 추가

`~/.openclaw/openclaw.json`의 agent 설정에 추가:

```json
"agents": {
  "list": [
    {
      "id": "main",
      "tools": {
        "allow": ["claude-code", "configure-claude-code"]
      }
    }
  ]
}
```

---

## Step 3. 사용 방법

플러그인은 **명시적으로 지시할 때만** 호출됩니다. 일반 대화에서는 Gemini가 직접 응답합니다.

**Claude Code 작업 지시:**
```
텔레그램: "/tmp/test.txt 파일 만들어줘. 클로드코드로 해줘"
```

**세션 이어받기:** Gemini가 이전 `Session ID`를 기억해 연속 작업 가능.

---

## Step 4. 터미널 팝업 (실시간 모니터)

Claude Code 실행 시 Terminal.app이 자동 팝업되어 실시간 로그를 표시하는 기능.
기본값은 **꺼짐** (백그라운드 silent 실행). 텔레그램에서 Gemini에게 지시해 토글 가능.

```
터미널 팝업 켜줘   →  이후 실행부터 Terminal.app 팝업 + 실시간 로그
터미널 팝업 꺼줘   →  백그라운드 silent 실행으로 복귀
```

설정은 `~/.openclaw/claude-code-prefs.json`에 저장되어 재시작 후에도 유지됩니다.

**로그 파일:** `/tmp/openclaw-claude-code.log`
수동으로 확인: `tail -f /tmp/openclaw-claude-code.log`

---

## 로그 포맷 예시

```
════════════════════════════════════════════════════════════
[14:32:01] 🔵 OpenClaw → Claude Code 호출
[14:32:01] 📋 Task: /tmp/test.txt에 테스트 메시지 써줘
[14:32:01] 📁 WorkDir: /Users/kms/.openclaw/workspace
[14:32:01] 🚀 실행 시작...
────────────────────────────────────────────────────────────
[14:32:03] 🔧 TOOL → Write: {"file_path":"/tmp/test.txt"…}
[14:32:03] 📤 RESULT: File written successfully
[14:32:04] 🤖 Claude: 완료했습니다.
────────────────────────────────────────────────────────────
[14:32:04] ✅ 완료! Session: abc123def456
[14:32:04] 💰 Cost: $0.0023
════════════════════════════════════════════════════════════
```

---

## 플러그인 구성 파일

| 파일 | 역할 |
|------|------|
| `index.js` | 툴 등록 진입점 |
| `src/claude-code-tool.js` | 메인 실행 툴 (`claude-code`) |
| `src/configure-claude-code-tool.js` | 설정 툴 (`configure-claude-code`) |

---

## 비용 효율 구조

- **Gemini (Vertex AI):** 종량제 과금 — 일반 대화, 요약, 브리핑 등
- **Claude Code:** Claude Pro 구독($20/월) 활용 — API 추가 비용 없음
- **위임 원칙:** 명시적 지시 시에만 Claude Code 호출 → Gemini가 처리 가능한 작업은 Gemini로
