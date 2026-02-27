# Vertex AI 서비스 계정 키 파일 안내

## 원본 키 파일 위치
/Volumes/SSD/OpenClaw Config/gen-lang-client-0740646035-c6de06dedc78.json

## GCP 정보
- 프로젝트 ID : gen-lang-client-0740646035
- 서비스 계정  : vertex-express@gen-lang-client-0740646035.iam.gserviceaccount.com
- 역할(Role)   : Vertex AI User (roles/aiplatform.user)
- 리전         : us-central1

## 재설치 시 복사 방법
cp "/Volumes/SSD/OpenClaw Config/gen-lang-client-0740646035-c6de06dedc78.json" \
   ~/.openclaw/vertex-sa.json
chmod 600 ~/.openclaw/vertex-sa.json

## 주의사항
- 키 파일을 Git 저장소에 커밋하지 말 것
- 키 파일이 분실되면 GCP Console → IAM & Admin → Service Accounts
  → vertex-express → Keys 탭에서 새 키를 발급받을 것
- 이 README.txt 에는 실제 키 내용을 포함하지 않음 (보안)
