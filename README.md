# OpenClaw 재설치 매뉴얼

> 작성일: 2026-02-27
> 목적: 신규 Mac 또는 포맷 후 OpenClaw + Vertex AI + Claude Code 플러그인을 처음부터 복구

이 폴더의 파일들을 활용해 순서대로 따라가면 완전한 환경을 재구성할 수 있습니다.

---

## 전제 조건

설치 전 다음 항목이 준비되어 있어야 합니다.

| 항목 | 확인 방법 |
|------|----------|
| Homebrew | `brew --version` |
| Node.js v22+ | `node --version` |
| Google Cloud SDK | `gcloud --version` |
| Claude Code CLI | `~/.local/bin/claude --version` |
| 텔레그램 봇 토큰 | @BotFather에서 발급 |
| Vertex AI 서비스 계정 키 | `vertex-ai/credentials/README.txt` 참고 |

---

## Step 1. OpenClaw 설치

```bash
npm install -g openclaw
openclaw --version   # 2026.2.25 이상 확인
```

---

## Step 2. 초기 온보딩

```bash
openclaw onboard
```

텔레그램 봇 토큰, Gateway 토큰 등 초기 설정을 인터랙티브하게 입력합니다.
(이 단계에서 `~/.openclaw/` 디렉터리와 기본 `openclaw.json`이 생성됩니다.)

---

## Step 3. Vertex AI 서비스 계정 키 배치

```bash
# 키 파일 위치: vertex-ai/credentials/README.txt 참고
cp "/Volumes/SSD/OpenClaw Config/gen-lang-client-0740646035-c6de06dedc78.json" \
   ~/.openclaw/vertex-sa.json
chmod 600 ~/.openclaw/vertex-sa.json
```

---

## Step 4. openclaw.json 전체 설정

```bash
# 이 폴더의 템플릿을 기반으로 작성
cp OpenClaw_Setup/openclaw.json.template ~/.openclaw/openclaw.json
```

이후 `nano ~/.openclaw/openclaw.json`으로 열어 아래 placeholder를 실제 값으로 교체:

| Placeholder | 실제 값 |
|-------------|---------|
| `{{USERNAME}}` | `kms` (macOS 사용자명) |
| `{{GCP_PROJECT_ID}}` | `gen-lang-client-0740646035` |
| `{{TELEGRAM_BOT_TOKEN}}` | BotFather에서 받은 토큰 |
| `{{GATEWAY_TOKEN}}` | 임의의 안전한 문자열 |
| `{{NANO_BANANA_API_KEY}}` | Google AI Studio API Key |
| `{{NOTION_API_KEY}}` | Notion Integration API Key |

> Vertex AI 상세 설정은 `vertex-ai/SETUP_MANUAL.md` 참고.

---

## Step 5. Workspace 파일 설치

```bash
mkdir -p ~/.openclaw/workspace
cp -r OpenClaw_Setup/workspace/* ~/.openclaw/workspace/
```

포함 파일: `SOUL.md`, `USER.md`, `AGENTS.md`, `TOOLS.md`, `IDENTITY.md`, `HEARTBEAT.md`

---

## Step 6. Claude Code 플러그인 설치

```bash
# 플러그인 소스를 dev 폴더로 복사
cp -r OpenClaw_Setup/plugins/claude-code ~/dev/openclaw-claude-code

# 의존성 설치
cd ~/dev/openclaw-claude-code && npm install

# OpenClaw에 플러그인 등록 및 활성화
openclaw plugins install ~/dev/openclaw-claude-code
openclaw plugins enable claude-code
```

---

## Step 7. Gateway 재설치 (env 적용)

```bash
openclaw gateway stop
openclaw gateway install   # LaunchAgent plist에 env 변수 반영
```

> `gateway install`을 실행해야 `openclaw.json`의 `env` 블록이 시스템에 적용됩니다.
> 단순 stop/start로는 환경변수가 반영되지 않습니다.

---

## Step 8. 모델 alias 설정 (선택)

```bash
openclaw models aliases add flash google-vertex/gemini-2.0-flash
openclaw models aliases add pro google-vertex/gemini-2.5-pro
```

이후 전환:
```bash
openclaw models set pro    # gemini-2.5-pro
openclaw models set flash  # gemini-2.0-flash
```

---

## Step 9. 최종 검증

```bash
openclaw status
openclaw health
openclaw models status
openclaw plugins list
```

텔레그램에서:
```
/new           ← 새 세션 시작
/model status  ← 현재 모델 확인
```

Claude Code 동작 확인:
```
# 텔레그램에서 봇에게
코드 작업을 시작해줘
```

---

## 트러블슈팅

| 증상 | 원인 | 해결책 |
|------|------|--------|
| stdin hanging (프로세스가 멈춤) | claude CLI가 stdin 대기 | `spawnAsync`에 `stdio: ['ignore','pipe','pipe']` 필수 |
| tool이 agent에 노출 안 됨 | allowlist 누락 | `openclaw.json` → `agents.list[].tools.allow`에 `"claude-code"` 추가 |
| plugin id mismatch 경고 | package.json name ≠ manifest id | `package.json`의 `name`을 `openclaw.plugin.json`의 `id`와 일치시킬 것 |
| `BILLING_DISABLED` | GCP 결제 미활성화 | Console에서 결제 계정 연결 |
| `IAM_PERMISSION_DENIED` | 서비스 계정에 권한 없음 | IAM에서 Vertex AI User 역할 부여 |
| 세션이 이전 모델 유지 | 기존 세션 캐시 | 텔레그램에서 `/new` 입력 |

---

## 폴더 구조

```
OpenClaw_Setup/
├── README.md                        ← 이 파일 (마스터 설치 가이드)
├── openclaw.json.template           ← 설정 파일 템플릿
├── vertex-ai/
│   ├── SETUP_MANUAL.md              ← Vertex AI 연동 상세 가이드
│   └── credentials/
│       └── README.txt               ← 서비스 계정 키 파일 위치 안내
├── workspace/                       ← Agent 지침 파일 백업
│   ├── SOUL.md
│   ├── USER.md
│   ├── AGENTS.md
│   ├── TOOLS.md
│   ├── IDENTITY.md
│   └── HEARTBEAT.md
└── plugins/
    └── claude-code/                 ← claude-code 플러그인 소스
        ├── index.js
        ├── package.json
        ├── openclaw.plugin.json
        └── src/
            └── claude-code-tool.js
```
