# OpenClaw 복구 플레이북

> 목적: 맥이 리셋되거나 포맷된 상황에서 **이 레포 하나만 있으면** Dave 전체 환경을 처음부터 복구할 수 있다.
> 예상 소요: 30~45분

---

## 이 레포가 커버하는 것

| 파일 | 내용 |
|------|------|
| `README.md` | 이 파일 — 제로에서 복구하는 순서 가이드 |
| `openclaw.json.template` | `~/.openclaw/openclaw.json` 기반 템플릿 |
| `SETUP_VERTEX.md` | Vertex AI 연동 상세 가이드 (GCP, 서비스 계정, 모델 설정) |
| `SETUP_SKILLS.md` | Dave 보안 프로토콜 + 업무 스킬 정의 |
| `workspace/` | Dave의 정체성·운영 지침 파일 (`~/.openclaw/workspace/`에 배포) |

---

## 사전 체크리스트

아래 항목이 모두 준비됐는지 확인 후 진행.

| 항목 | 확인 명령 | 비고 |
|------|----------|------|
| Homebrew | `brew --version` | 없으면 https://brew.sh |
| Node.js v22+ | `node --version` | 없으면 `brew install node` |
| Google Cloud SDK | `gcloud --version` | 없으면 https://cloud.google.com/sdk |
| Claude Code CLI | `~/.local/bin/claude --version` | 없으면 `npm install -g @anthropic-ai/claude-code` |
| Telegram 봇 토큰 | — | 기존 봇 토큰 확인 or @BotFather에서 재발급 |
| Vertex AI 서비스 계정 키 | — | 외장 SSD 보관 위치: Step 3 참고 |
| Nano Banana API Key | — | Google AI Studio에서 발급 |
| Notion API Key | — | Notion Integration에서 발급 |

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

인터랙티브 프롬프트에서 Telegram 봇 토큰, Gateway 토큰 등을 입력한다.
이 단계가 완료되면 `~/.openclaw/` 디렉터리와 기본 `openclaw.json`이 생성된다.

---

## Step 3. Vertex AI 서비스 계정 키 배치

서비스 계정 키 원본은 외장 SSD에 보관되어 있다:

```bash
# 원본 위치: /Volumes/SSD/OpenClaw Config/gen-lang-client-0740646035-c6de06dedc78.json
cp "/Volumes/SSD/OpenClaw Config/gen-lang-client-0740646035-c6de06dedc78.json" \
   ~/.openclaw/vertex-sa.json
chmod 600 ~/.openclaw/vertex-sa.json
```

> 키 파일이 분실된 경우: GCP Console → IAM & Admin → Service Accounts → `vertex-express` → Keys 탭 → 새 키 발급
> GCP 프로젝트: `gen-lang-client-0740646035`
> 서비스 계정: `vertex-express@gen-lang-client-0740646035.iam.gserviceaccount.com`

Vertex AI 전체 설정 (GCP 프로젝트 신규 생성 포함) → **[SETUP_VERTEX.md](./SETUP_VERTEX.md)** 참고.

---

## Step 4. openclaw.json 설정

```bash
cp ~/dev/openclaw-setup/openclaw.json.template ~/.openclaw/openclaw.json
nano ~/.openclaw/openclaw.json
```

아래 placeholder를 실제 값으로 모두 교체:

| Placeholder | 실제 값 |
|-------------|---------|
| `{{USERNAME}}` | `kms` |
| `{{GCP_PROJECT_ID}}` | `gen-lang-client-0740646035` |
| `{{TELEGRAM_BOT_TOKEN}}` | BotFather에서 받은 토큰 |
| `{{GATEWAY_TOKEN}}` | 임의의 안전한 문자열 (예: `openssl rand -hex 32`) |
| `{{NANO_BANANA_API_KEY}}` | Google AI Studio API Key |
| `{{NOTION_API_KEY}}` | Notion Integration API Key |

> **주요 설정 참고**
> - `streaming: "partial"` — 응답 생성 시작 즉시 Telegram에 타이핑 효과로 표시 (`off`로 두면 응답 완료까지 수 분간 아무것도 안 보임)
> - `keepRecentTokens: 40000` — 대화가 길어져도 추론 속도 유지

---

## Step 5. Workspace 파일 배포

Dave의 정체성, 운영 지침, 보안 프로토콜, 스킬 정의가 담긴 파일들을 workspace에 배포한다.

```bash
mkdir -p ~/.openclaw/workspace
cp -r ~/dev/openclaw-setup/workspace/* ~/.openclaw/workspace/
```

배포되는 파일:

| 파일 | 내용 |
|------|------|
| `SOUL.md` | Dave의 정체성과 행동 원칙 |
| `IDENTITY.md` | Dave의 기본 정보 |
| `USER.md` | 문섭님 프로필 및 작업 공간 경로 |
| `AGENTS.md` | 세션 시작 루틴, 메모리 관리, 그룹챗 행동 규칙 |
| `TOOLS.md` | 업무 스킬 정의 (candidate-scan, company-brief, meeting-prep) |
| `SECURITY.md` | 보안 프로토콜 (PII 처리, 폴더 접근 제한) |
| `HEARTBEAT.md` | 주기적 체크 작업 목록 |
| `PROJECTS.md` | 진행 중인 프로젝트 현황 |

Dave 보안 지침 및 스킬 상세 설명 → **[SETUP_SKILLS.md](./SETUP_SKILLS.md)** 참고.

---

## Step 6. Claude Code 플러그인 설치 (선택)

> Gemini가 필요할 때만 Claude Code CLI에 작업을 위임하는 플러그인. 필수 아님.

설치 방법 및 상세 설정 → **[openclaw-claude-code 레포 README](https://github.com/withusps-coder/openclaw-claude-code#readme)** 참고.

---

## Step 7. Gateway 재설치 (env 적용)

```bash
openclaw gateway stop
openclaw gateway install   # LaunchAgent plist에 env 변수 반영
```

> `gateway install`을 실행해야 `openclaw.json`의 `env` 블록이 시스템에 반영된다.
> 단순 `stop/start`로는 환경변수가 적용되지 않는다.

---

## Step 8. 모델 alias 설정

```bash
openclaw models aliases add flash google-vertex/gemini-2.0-flash
openclaw models aliases add pro google-vertex/gemini-2.5-pro
```

이후 전환:
```bash
openclaw models set pro    # gemini-2.5-pro (기본)
openclaw models set flash  # gemini-2.0-flash (빠른 작업)
```

---

## Step 9. 최종 검증

```bash
openclaw status
openclaw health
openclaw models status
openclaw plugins list
```

Telegram에서:
```
/new           ← 새 세션 시작
/model status  ← 현재 모델 확인
```

---

## 트러블슈팅

| 증상 | 원인 | 해결 |
|------|------|------|
| `BILLING_DISABLED` | GCP 결제 미활성화 | Console에서 결제 계정 연결 |
| `IAM_PERMISSION_DENIED` | 서비스 계정에 권한 없음 | IAM에서 Vertex AI User 역할 부여 |
| `404 Not Found` | 모델이 Vertex AI에 없음 | [SETUP_VERTEX.md](./SETUP_VERTEX.md) 모델 목록 참고 |
| 세션이 이전 모델 유지 | 기존 세션 캐시 | Telegram에서 `/new` 입력 |
| Claude Code 관련 오류 | 플러그인 문제 | [openclaw-claude-code README](https://github.com/withusps-coder/openclaw-claude-code#readme) 트러블슈팅 참고 |
