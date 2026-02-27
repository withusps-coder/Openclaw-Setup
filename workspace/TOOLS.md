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

Add whatever helps you do your job. This is your cheat sheet.
