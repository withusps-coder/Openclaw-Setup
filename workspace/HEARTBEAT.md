# HEARTBEAT.md

# Keep this file empty (or with only comments) to skip heartbeat API calls.

# Add tasks below when you want the agent to check something periodically.

## workspace 동기화 루틴

워크스페이스 파일이 변경되었을 때 openclaw-setup 레포에 동기화한다.

### 동기화 대상 파일 (memory/, MEMORY.md 제외)
- SOUL.md, AGENTS.md, IDENTITY.md, USER.md
- TOOLS.md, SECURITY.md, SKILLS_PLAN.md
- PROJECTS.md, HEARTBEAT.md

### 실행 스크립트
```bash
for f in SOUL.md AGENTS.md IDENTITY.md USER.md TOOLS.md SECURITY.md SKILLS_PLAN.md PROJECTS.md HEARTBEAT.md; do
  cp ~/.openclaw/workspace/$f ~/dev/openclaw/openclaw-setup/workspace/$f
done
cd ~/dev/openclaw/openclaw-setup
git add workspace/
git diff --staged --quiet || git commit -m "sync: workspace 동기화 $(date '+%Y-%m-%d')"
git push origin main
```

### 실행 시점
- 워크스페이스 파일(SOUL.md, TOOLS.md 등)을 직접 수정한 경우
- 문섭님이 "동기화해줘" 또는 "백업해줘"라고 요청한 경우
