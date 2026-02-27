# OpenClaw × Vertex AI 연동 매뉴얼

> 작성일: 2026-02-26
> 목표: OpenClaw의 LLM을 Google Vertex AI (gemini-2.5-pro / gemini-2.0-flash)로 연동

---

## 사전 조건

- macOS + OpenClaw 설치 완료
- Google 계정 (GCP 프로젝트 생성 가능)
- gcloud CLI 설치 완료

---

## Step 1. GCP 프로젝트 준비

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성 (또는 기존 프로젝트 사용)
3. **결제(Billing) 활성화** ← 필수. 없으면 403 BILLING_DISABLED 에러 발생
4. **Vertex AI API 활성화**
   ```bash
   gcloud services enable aiplatform.googleapis.com --project=<PROJECT_ID>
   ```
   또는 Console → API 및 서비스 → Vertex AI API 활성화

---

## Step 2. 서비스 계정 생성 및 JSON 키 발급

1. GCP Console → **IAM & Admin → Service Accounts**
2. **Create Service Account** 클릭
3. 이름 입력 (예: `vertex-express`)
4. 역할(Role) 설정: **Vertex AI User** (`roles/aiplatform.user`) 선택 → 완료
5. 생성된 서비스 계정 클릭 → **Keys 탭 → Add Key → Create new key → JSON**
6. 다운로드된 JSON 파일을 안전한 위치로 이동:
   ```bash
   cp ~/Downloads/<프로젝트명>-<키ID>.json ~/.openclaw/vertex-sa.json
   chmod 600 ~/.openclaw/vertex-sa.json
   ```

> ⚠️ 주의: 서비스 계정 생성 시 Vertex AI User 역할을 바로 부여해야 합니다.
> 나중에 추가하려면 IAM 메뉴에서 서비스 계정에 역할을 수동으로 부여해야 합니다.

---

## Step 3. OpenClaw 설정 파일 수정

`~/.openclaw/openclaw.json` 수정:

### 3-1. `env` 블록 추가 (최상위 레벨)
```json
"env": {
  "GOOGLE_CLOUD_PROJECT": "<YOUR_PROJECT_ID>",
  "GOOGLE_CLOUD_LOCATION": "us-central1",
  "GOOGLE_APPLICATION_CREDENTIALS": "/Users/<username>/.openclaw/vertex-sa.json"
}
```

### 3-2. 모델 설정 변경
```json
"agents": {
  "defaults": {
    "model": {
      "primary": "google-vertex/gemini-2.5-pro"
    },
    "models": {
      "google-vertex/gemini-2.0-flash": {},
      "google-vertex/gemini-2.5-pro": {}
    }
  }
}
```

---

## Step 4. Gateway 재시작 (env 적용)

```bash
openclaw gateway stop
openclaw gateway install
```

> `gateway install`을 실행해야 LaunchAgent plist에 env 변수가 반영됩니다.
> 단순 stop/start로는 환경변수가 적용되지 않습니다.

---

## Step 5. 모델 alias 설정 (선택, 편의용)

```bash
openclaw models aliases add flash google-vertex/gemini-2.0-flash
openclaw models aliases add pro google-vertex/gemini-2.5-pro
```

이후 전환:
```bash
openclaw models set pro    # gemini-2.5-pro로 전환
openclaw models set flash  # gemini-2.0-flash로 전환
```

---

## Step 6. 검증

```bash
# 모델 상태 확인
openclaw models status

# 게이트웨이 헬스 체크
openclaw health
```

Telegram에서:
```
/new        ← 새 세션 시작 (모델 전환 즉시 반영)
/model status
```

---

## Vertex AI에서 사용 가능한 Gemini 모델 (2026-02 기준)

| 모델 | openclaw ID | 특징 |
|------|-------------|------|
| Gemini 2.5 Pro | `google-vertex/gemini-2.5-pro` | 최신·최고 성능 ✅ |
| Gemini 2.0 Flash | `google-vertex/gemini-2.0-flash` | 빠르고 안정적 ✅ |
| Gemini 2.0 Flash Lite | `google-vertex/gemini-2.0-flash-lite` | 가장 가볍고 빠름 ✅ |
| Gemini 3.x | - | 미출시 (Vertex AI 미지원) ❌ |

---

## 자주 발생하는 에러

| 에러 | 원인 | 해결 |
|------|------|------|
| `BILLING_DISABLED` | GCP 결제 미활성화 | Console에서 결제 계정 연결 |
| `IAM_PERMISSION_DENIED` | 서비스 계정에 권한 없음 | IAM에서 Vertex AI User 역할 부여 |
| `404 Not Found` | 모델이 Vertex AI에 없음 | 위 모델 목록 참고하여 변경 |
| 세션이 이전 모델 유지 | 기존 세션 캐시 | Telegram에서 `/new` 입력 |

---

## 최종 설정 파일 구조 요약

```json
{
  "env": {
    "GOOGLE_CLOUD_PROJECT": "gen-lang-client-xxxxxxxxxx",
    "GOOGLE_CLOUD_LOCATION": "us-central1",
    "GOOGLE_APPLICATION_CREDENTIALS": "/Users/kms/.openclaw/vertex-sa.json"
  },
  "auth": {
    "profiles": {
      "google:default": {
        "provider": "google",
        "mode": "api_key"
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "google-vertex/gemini-2.5-pro"
      },
      "models": {
        "google-vertex/gemini-2.0-flash": { "alias": "flash" },
        "google-vertex/gemini-2.5-pro": { "alias": "pro" }
      }
    }
  }
}
```
