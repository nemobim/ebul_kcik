# 이불뚫고 지붕킥 — 프로젝트 문서

> 잠 못 이루는 고민과 흑역사를 이불에 실어 멀리 날려보내는 모바일 웹 탭 게임

**배포 URL:** [https://ebul-kcik.vercel.app](https://ebul-kcik.vercel.app)

---

## 문서 목차

| 문서                                         | 설명                                                  | 대상 독자          |
| -------------------------------------------- | ----------------------------------------------------- | ------------------ |
| [PRD.md](./PRD.md)                           | 제품 개요, 사용자 플로우, 기능 명세, 점수 체계        | 기획, 전체         |
| [ARCHITECTURE.md](./ARCHITECTURE.md)         | 기술 스택, 폴더 구조, Firebase 스키마, 상태/에셋 패턴 | 개발               |
| [UI-UX.md](./UI-UX.md)                       | UI/UX 현황 분석 및 개선 제안                          | 기획, 디자인, 개발 |
| [GAME-EXPERIENCE.md](./GAME-EXPERIENCE.md)   | 타격 게임 및 이불 애니메이션 개선 제안                | 기획, 디자인, 개발 |
| [AUDIO.md](./AUDIO.md)                       | 배경음악·효과음 설계 및 구현 방향                     | 기획, 개발         |
| [ROADMAP.md](./ROADMAP.md)                   | Phase별 개발 로드맵 및 추가 기능                      | 기획, 전체         |
| [DEVELOPMENT.md](./DEVELOPMENT.md)           | 로컬 실행, 환경 변수, 검증 및 배포 절차               | 개발               |
| [SECURITY-PRIVACY.md](./SECURITY-PRIVACY.md) | Firestore 권한, UGC, 개인정보 및 운영 점검            | 기획, 개발, 운영   |

---

## 문서 구분 원칙

- **현황 문서** (`PRD`, `ARCHITECTURE`, `DEVELOPMENT`): 코드베이스와 검증 결과 기준의 사실 기록
- **개선 문서** (`UI-UX`, `GAME-EXPERIENCE`, `AUDIO`, `ROADMAP`): 분석 결과를 바탕으로 한 제안 및 향후 작업 항목 (코드 위험·성능 잔여 항목은 `ROADMAP`에 통합)
- **운영 기준** (`SECURITY-PRIVACY`): 코드만으로 확인 가능한 위험과 배포 전 확인 항목

---

## 빠른 참조

### 기술 스택 요약

React 18 · TypeScript 5.5 · Vite 7 (lockfile 7.3.2) · TanStack Query v5 · Firebase v11 · Tailwind CSS 3

### 핵심 게임 흐름

스플래시 → 튜토리얼(닉네임) → 고민 작성 → 20초 연타 → 이불 날리기 → 랭킹/모아보기

### 알려진 주요 이슈

- 오디오 미구현 (→ [AUDIO.md](./AUDIO.md))
- 게임 연출·접근성 개선 미착수 (→ [GAME-EXPERIENCE.md](./GAME-EXPERIENCE.md), [UI-UX.md](./UI-UX.md))
- 남은 성능 정리 항목: splash 자산 최적화, Galmuri 폰트 self-host (→ [ROADMAP.md](./ROADMAP.md) 「성능 잔여 항목」). 코드 위험·정리 7건은 2026-06-11 완료

> 최종 코드 대조일: 2026-06-11
