# ROADMAP — 개발 로드맵 (남은 작업)

2026-06-11 기준. 완료된 항목은 제거하고 남은 작업만 남겼습니다.

> **완료분(제거):** Phase 1 릴리스 차단 요소, Phase 2 번들·데이터 안정성, Phase 4 유지보수(세션·tier·worry 단일화, 타이머/피드백 정리), 코드 위험·정리 7건(타입·접근성 버튼화·CSS 스코프·Analytics 제거 등).

---

## 성능 잔여 항목

| #   | 작업                  | 위치/메모                                                                 |
| --- | --------------------- | ------------------------------------------------------------------------- |
| 1   | splash 자산 최적화    | `src/page/Splash.tsx` — splash.json(원본 약 372KB) Lottie 정적 import. 초기 경로(/)라 lazy 불가, WebP 시퀀스/경량화 검토 |
| 2   | Galmuri 폰트 self-host | `src/styles/index.css:1` — 현재 CDN(jsdelivr) `@2.40.3`로 버전 고정됨. 필요한 woff2 self-host 시 CDN 의존 제거 |

---

## Phase 3 — 사운드와 게임 연출 (1~2주)

**목표:** 타격감과 결과 연출 개선

### 사운드 MVP

| #   | 작업                                    | 문서            |
| --- | --------------------------------------- | --------------- |
| 1   | 오디오 에셋 라이선스 확정               | AUDIO §9        |
| 2   | audio provider/hook 및 사용자 mute 설정 | AUDIO §5        |
| 3   | hit, countdown, game BGM                | AUDIO Phase A~B |
| 4   | whoosh, stop, result sound              | AUDIO §4        |

### 게임플레이

| #   | 작업                              | 문서                     |
| --- | --------------------------------- | ------------------------ |
| 5   | 카운트다운/타이머 progress UI     | GAME-EXPERIENCE §1.5     |
| 6   | 콤보 milestone과 실시간 거리 표시 | GAME-EXPERIENCE §1.3, §3 |
| 7   | blanket easing과 stage crossfade  | GAME-EXPERIENCE §2.3~2.4 |
| 8   | 결과 연출 skip과 delay 조정       | GAME-EXPERIENCE §2.8     |
| 9   | 실제 기기 멀티터치·햅틱 검증      | GAME-EXPERIENCE §1.4~1.6 |

### 접근성

> 전역 touch-action 제한 해제와 클릭 카드 버튼화는 완료됨.

| #   | 작업                                   | 문서     |
| --- | -------------------------------------- | -------- |
| 10  | 모달 focus trap, ESC, dialog semantics | UI-UX §4 |
| 11  | 키보드 게임 입력(연타 영역 키보드 대응) | UI-UX §4 |
| 12  | `prefers-reduced-motion` 대응          | UI-UX §4 |

---

## Phase 4 — 운영 (잔여, 1~2주)

| #   | 작업                             | 문서                  |
| --- | -------------------------------- | --------------------- |
| 1   | 신고/숨김 및 삭제 요청 절차      | firestore.rules (현재 클라이언트 delete 차단) |
| 2   | Firebase Anonymous Auth 검토     | firestore.rules (헤더 주석)                   |
| 3   | Analytics 재도입 시 목적·동의 결정 (현재 초기화 제거됨) | ARCHITECTURE §5.1            |
| 4   | 브라우저 E2E와 Rules test 확대   | DEVELOPMENT §8                                |

---

## Phase 5 — 기능 확장

### 사용자·소셜

| 기능             | 설명                  | 선행 조건                 |
| ---------------- | --------------------- | ------------------------- |
| 프로필/내 기록   | 플레이 기록과 통계    | 인증, 삭제 정책           |
| 결과 이미지 공유 | canvas 기반 SNS 카드  | 개인정보 노출 검토        |
| 친구 비교        | 초대 링크와 제한 랭킹 | abuse 방지                |
| 일일 챌린지      | 카테고리/배율 변화    | Analytics와 밸런스 데이터 |

### 운영

| 기능                 | 설명                                |
| -------------------- | ----------------------------------- |
| 관리자 도구          | 신고 검토, 숨김, 삭제               |
| 비정상 점수 대응     | 서버 검증 또는 Cloud Function 집계  |
| App Check/rate limit | 자동화 abuse 완화                   |
| PWA                  | 홈 화면 추가와 제한적 오프라인 지원 |
| 다국어               | 공개 정책과 에셋 문구 포함 번역     |

### 공유 메타데이터

기본 OG 태그는 이미 `index.html`에 있습니다. 남은 작업은 상대 경로인 `og:image`를 절대 URL로 검증하고, 결과별 동적 공유 카드가 필요하면 별도 렌더링 방식을 설계하는 것입니다.

---

## 의존성 관계

```mermaid
flowchart LR
    P3["Phase 3 사운드·연출"] --> P5["Phase 5 기능 확장"]
    P4["Phase 4 운영"] --> P5
```

---

## 문서 인덱스

| 영역          | 관련 문서                                    |
| ------------- | -------------------------------------------- |
| 제품 현황     | [PRD.md](./PRD.md)                           |
| 아키텍처      | [ARCHITECTURE.md](./ARCHITECTURE.md)         |
| UI/UX         | [UI-UX.md](./UI-UX.md)                       |
| 게임 연출     | [GAME-EXPERIENCE.md](./GAME-EXPERIENCE.md)   |
| 사운드        | [AUDIO.md](./AUDIO.md)                       |
| 개발 절차     | [DEVELOPMENT.md](./DEVELOPMENT.md)           |
