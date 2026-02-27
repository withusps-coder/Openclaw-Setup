# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## claude-code

사용자가 "claude-code로", "claude-code를 통해", "클로드코드로" 등 명시적으로 지시할 때만 `claude-code` 도구를 사용한다. 그 외 개발/코딩 작업은 네이티브 도구(exec, read, edit 등)로 직접 처리한다.

---

## 업무 스킬 (Workflow Skills)

### `candidate-scan` (후보자 스캔)
- **기능:** PDF 이력서를 읽어 핵심 정보를 3줄로 요약 추출.
- **출력 예시:**
  > **[김철수 / 7년차 / 백엔드 개발]**
  > - **주요 경력:** 네이버(3년) → 토스(4년)
  > - **핵심 스킬:** Java, Spring Boot, Kafka, 대용량 트래픽 처리
  > - **특이 사항:** 최근 1년 내 이직 시도 없음, 판교 근무 선호

### `company-brief` (기업 브리핑)
- **기능:** 기업명 입력 시 [뉴스, 재무, 채용 현황, 경쟁사] 리포트 생성.
- **활용:** 미팅 10분 전, 모바일로 빠르게 확인 가능하도록 요약본 전송.

### `meeting-prep` (미팅 준비 비서)
- **기능:** 캘린더 일정 감지 → 미팅 1시간 전 알림 + 상대방 정보 + 이동 경로(교통/날씨) 브리핑.
- **트리거:** 구글 캘린더/애플 캘린더 연동 필요.

---

Add whatever helps you do your job. This is your cheat sheet.
