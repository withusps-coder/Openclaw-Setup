# PROJECTS.md - 진행 중인 프로젝트

## 인재풀 AI 검색 엔진 구축

### 목표
헤드헌터 문섭님의 인재 발굴 및 매칭 프로세스를 Google Cloud AI (Document AI, Vertex AI Search)로 자동화. 방대한 이력서 데이터에서 자연어 질문만으로 최적의 인재를 빠르고 정확하게 검색.

### 현황
- **진행 주체:** 문섭님(헤드헌터) & 데이브(AI 비서)
- **현재 모델:** google-vertex/gemini-2.5-flash
- **주요 작업 공간:** `/Volumes/SSD/Dave_Studio`

### 4단계 계획

**1단계: 데이터 준비 (완료)**
- 에버노트 이력서 → 로컬 SSD(`/Volumes/SSD/Dave_Studio/resume`) 추출 완료.
- 파일 형식: DOCX 또는 PDF만 사용 (PNG 조각 제외).
- 각 후보자별 폴더 구조 유지.

**2단계: Document AI 파싱 (진행 중)**
- Google Cloud Document AI OCR 프로세서 활용.
- 프로세서: `resume-ocr-processor` (ID: `734d88f38c74edf7`, 리전: `asia-southeast1`)
- 서비스 계정 키: `/Volumes/SSD/Dave_Studio/credentials/document-ai-key.json`
- 자동화 스크립트: `document_ai_parser.py` 작성 및 테스트 중.
- **향후:** 처리된 파일 목록 관리로 신규 이력서만 파싱 (비용 효율화).

**3단계: Vertex AI Search 색인화 (예정)**
- 파싱된 구조화 데이터를 Vertex AI Search에 색인화.
- 자연어 질의로 관련성 높은 후보자 검색 구현.

**4단계: 웹 인터페이스 개발 (예정)**
- 자연어 검색 입력창.
- AI 추천 후보자 리스트 및 핵심 요약.
- 원본 이력서(PDF/DOCX) 조회 기능.

### 향후 과제
- 이력서 데이터 PII 보안 강화 방안 지속 검토.
- 매일 아침 뉴스 브리핑 크론 작업 최종 설정.
- 노션(Notion) 연동 (할 일 관리 및 프로젝트 현황 업데이트).

---

_Last Updated: 2026.02.27_
