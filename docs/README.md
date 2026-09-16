# 이불뚫고 지붕킥 — 프로젝트 문서

> 잠 못 이루는 고민과 흑역사를 이불에 실어 멀리 날려보내는 모바일 웹 탭 게임

**배포 URL:** [https://ebul-kcik.vercel.app](https://ebul-kcik.vercel.app)

---

## 문서 목차

| 문서                                 | 설명                                                  | 대상 독자  |
| ------------------------------------ | ----------------------------------------------------- | ---------- |
| [PRD.md](./PRD.md)                   | 제품 개요, 사용자 플로우, 기능 명세, 점수 체계        | 기획, 전체 |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 기술 스택, 폴더 구조, Firebase 스키마, 상태/에셋 패턴 | 개발       |
| [AUDIO.md](./AUDIO.md)               | 배경음악·효과음 설계 및 구현 방향 (미구현)            | 기획, 개발 |
| [ROADMAP.md](./ROADMAP.md)           | Phase별 남은 작업 및 추가 기능 아이디어               | 기획, 전체 |
| [DEVELOPMENT.md](./DEVELOPMENT.md)   | 로컬 실행, 환경 변수, 검증·CI 및 배포 절차            | 개발       |
| [ISSUE-IMAGE-LOADING.md](./ISSUE-IMAGE-LOADING.md) | 모바일 이미지 로딩 불균일 이슈 — 원인 실측과 개선안 | 개발       |

---

## 문서 구분 원칙

- **현황 문서** (`PRD`, `ARCHITECTURE`, `DEVELOPMENT`): 코드베이스와 검증 결과 기준의 사실 기록
- **이슈 문서** (`ISSUE-*`): 특정 증상의 원인 분석과 개선안 (원인 규명 완료 / 수정 미적용)
- **개선 문서** (`AUDIO`, `ROADMAP`): 향후 작업 항목 (UI/UX·게임 연출 개선 제안 중 코드 적용분은 반영 완료되어 `UI-UX`·`GAME-EXPERIENCE` 문서는 제거, 잔여 항목은 `ROADMAP`에 통합)

---

## 빠른 참조

### 기술 스택 요약

React 18.3 · TypeScript 5.9 · Vite 7.3 · TanStack Query 5.90 · Firebase 11.10 (Firestore) · Tailwind CSS 3.4 · Vitest 3.2

> 패키지 매니저: **pnpm** (`pnpm@10.12.4`). 위 버전은 `pnpm-lock.yaml` 설치 기준이며, `package.json`은 caret 범위입니다.

### 핵심 게임 흐름

스플래시 → 튜토리얼(닉네임) → 고민 작성 → 5초 카운트다운 → 20초 연타 → 이불 날리기 → 랭킹/모아보기

### 검증 상태 (2026-09-16)

| 검사                  | 결과                                |
| --------------------- | ----------------------------------- |
| `pnpm run lint`       | 성공 (0 error / 0 warning)          |
| `pnpm run build`      | 성공 (메인 chunk 1,032KB, 500KB 경고) |
| `pnpm run test`       | 성공 (2 파일 / 5 테스트)            |
| `pnpm run test:rules` | 성공 (25 케이스)                    |

### 알려진 주요 이슈

- 오디오 미구현 (→ [AUDIO.md](./AUDIO.md))
- 메인 chunk 1,032KB — splash.json(372KB)·lottie-web 포함, 번들 분할 미적용 (→ [ROADMAP.md](./ROADMAP.md) 「성능 잔여 항목」)
- Firebase Auth 미사용 → Rules에서 소유권 검증 불가, UGC 신고·삭제 절차 없음 (→ [ROADMAP.md](./ROADMAP.md) Phase 4)
- 인증·App Check 부재로 자작 기록·공감 부풀리기는 구조적으로 차단 불가 (→ [DEVELOPMENT.md](./DEVELOPMENT.md) §7)
- 모바일에서 이미지가 제각각 로딩되고 레이아웃이 밀림 — 4KB 인라인 임계값 이원화가 주원인 (→ [ISSUE-IMAGE-LOADING.md](./ISSUE-IMAGE-LOADING.md))

### 최근 반영 (2026-09-16 대조 결과)

- 게임 연출: 카운트다운 progress ring·타이머 progress bar(마지막 5초 적색), 콤보 milestone(20/30/50)·실시간 거리(m), blanket easing·stage crossfade, 햅틱, resize 대응
- 접근성: 모달 `role="dialog"`·focus trap·ESC·포커스 복원, 게임 영역 키보드 입력, `prefers-reduced-motion`, 폼 label·글자 수 카운터
- 데이터 안정성: 공감 처리 `runTransaction` 원자화, `parseGameContent`로 비정상 문서 격리
- 성능: 게임 step(KickEbul·GameResult) lazy 분리, 로딩 Lottie(819KB) → CSS 스피너 교체, 결과 이미지 사전 디코딩
- 개발 환경: npm → **pnpm** 전환, GitHub Actions CI(lint·build·test + Firestore Rules 테스트)
- `alert()` → `utils/toast.ts` 인앱 토스트, Rank/Content 에러 UI(`ErrorRetry`)·빈 상태(`EmptyState`)

> 최종 코드 대조일: 2026-09-16 (코드 자체의 마지막 변경 커밋은 2026-06-17 `8350830`)
