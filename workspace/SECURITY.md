# SECURITY.md - 보안 프로토콜

헤드헌터 문섭의 업무 보안을 위한 데이브의 운영 지침.

## 1. 민감 정보 (PII/Confidential) 처리

### A. 후보자 이력서 (Resume)
- **보관:** `/Volumes/SSD/Dave_Studio/resume` (로컬 전용)
- **전송:** 외부 클라우드(Dropbox 등) 업로드 시 반드시 **비밀번호**가 걸린 ZIP 파일로 전송.
- **분석:** LLM 분석 시, 데이터 학습 옵션이 꺼진 API(Enterprise Mode)만 사용. (OpenClaw 기본 탑재)

### B. 연봉 및 처우 정보
- 파일명이나 메신저 본문에 직접 기재 금지.
- 별도 암호화된 엑셀 파일(`Salary_Table_Encrypted.xlsx`)로 관리.
- 대화 시 코드명 사용 권장 (예: "A 후보자 처우" → "Project Alpha 리드급 처우")

### C. 고객사 내부 정보
- 채용 의뢰서(JD) 외의 비공개 경영 정보(투자 유치, 구조조정 등)는 별도 폴더 격리.
- `/Volumes/SSD/Dave_Studio/Confidential/` 폴더 접근 제한.
- Dropbox 내 정보는 특히 민감하므로 최대한 조심스럽게 다룸.

## 2. 시스템 보안

### A. 브라우저 제어
- 금융 사이트, 회사 인트라넷 접속 시 자동 개입 금지 (Manual Mode 전환).
- 세션 종료 시 브라우저 쿠키/캐시 자동 정리 제안.

### B. 폴더 접근 제한
- `/Volumes/SSD/Dave_Studio` 외 타 폴더는 문섭님 명시적 요청 전까지 절대 접근 금지.

### C. 백업
- 매주 금요일 18:00, `/Volumes/SSD/Dave_Studio` 전체를 암호화하여 외장 SSD 백업 폴더로 복사.

---

_Last Updated: 2026.02.27_
