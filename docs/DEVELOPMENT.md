# DEVELOPMENT — 개발 및 검증 가이드

> 최종 검증일: **2026-09-16**

## 1. 요구 환경

- Node.js: lockfile의 Vite 7.3.2 기준 `^20.19.0 || >=22.12.0` (CI는 Node 20 사용)
- pnpm: `package.json`의 `packageManager` 필드(`pnpm@10.12.4`) 기준
- Java 17 이상: Firestore 에뮬레이터(`pnpm run test:rules`) 실행용
- Firebase 프로젝트와 Firestore

---

## 2. 설치 및 실행

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

의존성 재현은 `pnpm-lock.yaml`을 기준으로 하며 `--frozen-lockfile`로 lockfile과 설치 상태가 일치하도록 합니다.

---

## 3. 환경 변수

루트 `.env`에 아래 값을 설정합니다.

```dotenv
VITE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=
VITE_MEASUREMENT_ID=
```

- `.env`는 Git에서 제외됩니다.
- `.env.example`에 필요한 키 목록이 있습니다. 실제 값이 든 `.env`는 절대 커밋하지 마세요.
- `package.json`에 Node `engines`가 없으므로 배포 런타임 버전을 명시하는 편이 안전합니다(CI는 Node 20 고정).
- 빌드 자체는 값이 없어도 통과합니다. CI는 더미 값을 주입해 build를 검증합니다.
- Firebase 웹 설정값은 클라이언트에 노출될 수 있습니다. 데이터 보호는 API key 은닉이 아니라 Firestore Security Rules로 보장해야 합니다.

---

## 4. 명령어

| 명령                  | 용도                                         |
| --------------------- | -------------------------------------------- |
| `pnpm run dev`        | Vite 개발 서버                               |
| `pnpm run build`      | TypeScript project build + production bundle |
| `pnpm run lint`       | ESLint 검사                                  |
| `pnpm run preview`    | production build 로컬 확인                   |
| `pnpm run test`       | Vitest 단위 테스트 (`vitest run`)            |
| `pnpm run test:rules` | Firestore Rules 테스트 (에뮬레이터 실행)     |
| `pnpm run deploy:rules` | Rules 테스트 통과 시에만 Firestore Rules 배포 |

- 별도 typecheck 스크립트는 없으며 `build`가 `tsc -b`로 TypeScript 검사를 포함합니다.
- 포맷은 `prettier`(devDependency, `prettier-plugin-tailwindcss` 포함)로 처리하며 npm script는 없습니다.
- 단위 테스트 대상은 `vitest.config.ts`의 `include: ['src/**/*.test.ts']`로 한정되어, 에뮬레이터가 필요한 `test/*.mjs`는 `test:rules`로만 실행됩니다.

---

## 5. 현재 검증 상태

2026-09-16, 로컬(`pnpm@10.12.4`, Node 20 계열, Temurin JDK 17) 기준:

| 검사                  | 결과                                                     |
| --------------------- | -------------------------------------------------------- |
| `pnpm run lint`       | 성공. 0 error, 0 warning                                  |
| `pnpm run build`      | 성공. 메인 chunk 1,032.17KB (gzip 480.61KB) — 500KB 초과 경고 |
| `pnpm run test`       | 성공. 2 파일, 5 테스트 통과                               |
| `pnpm run test:rules` | 성공. 25 케이스 통과 (0 failed)                           |

빌드 산출물 주요 chunk:

| chunk              | 크기       | gzip     |
| ------------------ | ---------- | -------- |
| `index-*.js`       | 1,032.17KB | 480.61KB |
| `firebaseApi-*.js` | 288.45KB   | 91.06KB  |
| `rank-*.js`        | 19.86KB    | 14.38KB  |
| `SpecialThanks-*.js` | 13.58KB  | 5.93KB   |
| `Content-*.js`     | 12.76KB    | 7.93KB   |
| `KickEbul-*.js`    | 6.17KB     | 2.75KB   |
| `index-*.css`      | 23.58KB    | 5.53KB   |

> 메인 chunk 경고는 번들 분할 관련 잔여 항목으로, 동작 오류는 아닙니다. 주요 구성 요소는 `splash.json`(372KB) + `lottie-web`입니다. ([ROADMAP.md](./ROADMAP.md) 「성능 잔여 항목」)

완료 기준은 `pnpm install --frozen-lockfile && pnpm run lint && pnpm run build && pnpm run test` 모두 성공입니다. Rules를 수정했다면 `pnpm run test:rules`까지 포함합니다.

---

## 6. Firebase 준비

코드가 사용하는 컬렉션:

- `contents`
- `userReactions`

현재 쿼리는 단일 필드 `orderBy`와 `score > value` count를 사용합니다. `firestore.indexes.json`은 현재 빈 배열이며, 콘솔이 복합 인덱스를 요구하면 오류 링크를 따라 생성하되 생성한 인덱스와 Rules는 저장소에서 형상 관리해야 합니다.

저장소에 있는 Firebase 형상: `firebase.json`, `.firebaserc`(기본 프로젝트 별칭), Firestore Security Rules(`firestore.rules`), 인덱스 설정(`firestore.indexes.json`). 규칙·인덱스 변경은 배포해야 실제 반영됩니다.

```bash
firebase login          # 최초 1회
pnpm run deploy:rules   # rules 테스트 통과 시에만 배포
```

`deploy:rules`는 에뮬레이터 테스트(25케이스)를 먼저 돌리고 통과할 때만 `firebase deploy --only firestore:rules`를 실행합니다. 검증되지 않은 규칙이 production에 올라가는 것을 막기 위한 구성입니다.

Rules 테스트: `pnpm run test:rules`가 `firebase emulators:exec --only firestore --project demo-ebul`로 에뮬레이터를 띄우고 `test/firestore.rules.test.mjs`(`@firebase/rules-unit-testing`)를 실행합니다. 로컬 Java 런타임이 필요하며, 현재 16개 케이스가 다음을 검증합니다.

- `contents` create: 정상 저장, 음수·소수점·상한(3000m) 초과 score 거부, 미허용 worryLabel·content 500자 초과 거부, 닉네임 규칙(한글 1~5자) 위반 거부, userId 64자 초과 거부, 초기 reactionTotal ≠ 0·id ≠ docId·정의되지 않은 필드 거부
- `contents` update/delete: 공감 +1 허용, reactionTotal 누락·score·userId 변경 거부, 클라이언트 삭제 거부
- `userReactions`: `true` 기록 허용, `false`·미허용 키 거부

---

## 7. 보안 점검

### 7.1 적용된 조치 (2026-09-16)

> **배포 이력:** Firestore Rules는 2026-09-16에 배포 완료. 그 전까지 production에는 2025-04-15에 설정된 테스트 모드 규칙(`match /{document=**}`에 `allow read, create, update: if true`)이 살아 있었고, **저장소의 규칙은 한 번도 배포된 적이 없었습니다.** 즉 그동안 누구나 임의 컬렉션에 문서를 만들고 남의 글을 덮어쓸 수 있는 상태였습니다.

| 영역          | 조치                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------- |
| 비밀정보      | `.env`는 `.gitignore` 등록, Git 히스토리에 커밋 이력 없음. `.env.example`로 필요한 키만 공유 |
| 의존성        | `react-router-dom` 6.30.6, `vite` 7.3.6으로 패치 (브라우저 영향 권고문 해소)                |
| 배포 헤더     | `vercel.json`에 `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` 정의 — **다음 Vercel 배포 시 반영** |
| HSTS          | Vercel 기본 응답에 이미 포함(`max-age=63072000; includeSubDomains; preload`). 저장소에서 별도 설정하지 않음 |
| CSP           | `Content-Security-Policy-Report-Only`로 정의 (§7.4 절차로 enforce 전환) — 역시 배포 후 적용    |
| Firestore     | 점수 상한(3000m)·닉네임 형식 검증 추가, Rules 테스트 25케이스, **production 배포 완료**        |
| CI            | `permissions: contents: read`로 GITHUB_TOKEN 최소 권한화, `pnpm audit --prod` 리포트 단계 추가 |
| 패치 추적     | `.github/dependabot.yml` — npm·GitHub Actions 월 1회 업데이트 PR (minor/patch 묶음)          |

### 7.2 의존성 점검 방법

```bash
pnpm audit --prod    # 배포 앱에 실리는 의존성
pnpm audit           # 개발 도구 포함 전체
```

`pnpm audit`(전체)에는 `firebase-tools` 계열 권고문이 다수 나오지만 **CLI 전용 개발 의존성**이므로 배포 산출물과 무관합니다. `--prod` 결과 중 `@grpc/grpc-js`·`protobufjs`·`websocket-driver`도 Firebase SDK의 **Node 전용 경로**이며, 빌드 산출물에 포함되지 않음을 확인했습니다(`dist/assets/*.js`에 해당 문자열 0건).

남은 권고문: `react-router` 계열 2건(오픈 리다이렉트/SSR 하이드레이션)은 **7.18.0 이상에서만 해소**됩니다. 이 앱은 SSR을 쓰지 않고 이동 경로가 모두 하드코딩(`Router.tsx`)이라 실질 위험이 낮아 major 업그레이드는 보류 중입니다.

### 7.3 production 점검 결과 (2026-09-16)

서비스 계정 자격증명으로 실제 데이터를 조회해 확인한 값입니다.

| 항목                      | 결과                                                      |
| ------------------------- | --------------------------------------------------------- |
| `contents` 문서 수        | 66건                                                       |
| 최고 점수                 | 1809m (상한 3000m 대비 여유 있음 — 정상 플레이어 차단 없음) |
| 새 Rules 기준 위반 문서   | 0건                                                        |
| 배포 후 공감이 막히는 문서 | 0건 (`reactions` 맵·`reactionTotal` 모두 정상)             |
| `userReactions` 문서 수   | 8건                                                        |
| 배포된 규칙 vs 저장소     | 완전히 동일 (diff 없음)                                     |
| production 규칙 엔진 검증 | 정상 저장 허용 / 위조 점수·본문 덮어쓰기·임의 컬렉션·삭제 차단 (5/5) |

게임 시간이나 `SCORE_MULTIPLIER`를 변경하면 상한 3000m을 다시 계산하고, 위 최고 점수 확인을 다시 수행해야 합니다.

### 7.4 의도적으로 도입하지 않은 것

| 항목                  | 판단                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------ |
| App Check (reCAPTCHA) | 개인 프로젝트 규모에 과하다고 판단해 도입하지 않음. 자동화 스팸을 막지 못하는 상태는 유지됨 |
| Anonymous Auth        | 현재 기능(작성·조회·공감)에는 소유권 검증이 필수가 아니어서 보류. **내 기록 삭제·신고 기능을 추가하면 선행 필수** |

대신 비용·스팸 최악의 경우에 대비해 **Firebase 콘솔에서 예산 알림을 설정**하는 것을 권장합니다(코드 변경 없음).
Google Cloud 콘솔 → 결제 → 예산 및 알림 → 월 예산과 임계값(50/90/100%) 알림 등록.
쓰기 폭주가 발생해도 요금이 조용히 누적되지 않고 메일로 감지됩니다.

### 7.5 CSP를 enforce로 전환하는 절차

현재 CSP는 위반 시 차단하지 않고 콘솔에만 보고하는 Report-Only 상태입니다.

1. 배포 후 실제 기기/브라우저에서 전체 흐름(스플래시 → 튜토리얼 → 게임 → 랭킹 → 모아보기) 실행
2. DevTools 콘솔에 `Content Security Policy` 위반 보고가 없는지 확인
3. 없으면 `vercel.json`의 헤더 키를 `Content-Security-Policy-Report-Only` → `Content-Security-Policy`로 변경

> 주의: Lottie(`lottie-web`)는 애니메이션 JSON에 **expression이 포함된 경우에만** `eval`을 호출합니다. 현재 `splash.json`에는 expression이 없어 `script-src 'self'`로 충분하지만, expression이 있는 에셋을 추가하면 CSP에 걸립니다. 그 경우 `lottie_light` 빌드 사용을 검토하세요(`'unsafe-eval'` 추가는 권장하지 않음).

---

## 8. 배포 확인

Vercel build command:

```bash
pnpm run build
```

확인 항목:

1. Vercel 환경 변수 설정
2. `vercel.json` SPA rewrite 동작
3. `/game`, `/ranking`, `/content` 직접 진입 새로고침
4. Firestore 읽기/쓰기 및 실패 UI(`ErrorRetry`, `toast`)
5. 모바일 viewport, 스크롤, 멀티터치
6. OG image가 절대 URL로 정상 노출되는지 확인 (현재 `index.html`의 `og:image`는 상대 경로 `/og-main-image.webp`)
7. 보안 헤더 응답 확인: `curl -sI https://ebul-kcik.vercel.app | grep -iE "x-frame|x-content|referrer|permissions|content-security|strict-transport"`
   (HSTS는 Vercel 기본 응답에 포함되는지 실제 응답으로 확인 — 저장소에서는 설정하지 않음)

---

## 9. CI 자동화

`.github/workflows/ci.yml`이 `main`/`dev` 브랜치의 PR·push에서 다음을 실행합니다.

| job                   | 내용                                                             |
| --------------------- | ---------------------------------------------------------------- |
| `lint · build · test` | `pnpm install --frozen-lockfile` → `lint` → `build`(더미 env) → `test` → `pnpm audit --prod`(보고 전용) |
| `firestore rules test`| Java 17(temurin) 설치 후 `pnpm run test:rules`                    |

`audit` 단계는 `continue-on-error: true`로 두어 빌드를 막지 않습니다. 알려진 Node 전용 권고문(§7.2)이 남아 있어 실패 처리하면 상시 red가 되기 때문이며, **새로 생긴 배포 의존성 취약점을 로그에서 확인하는 용도**입니다.

의존성 패치는 `.github/dependabot.yml`이 월 1회 PR로 올려 줍니다. PR이 오면 §5 검증 절차(lint·build·test·test:rules)가 CI에서 그대로 돌아가므로, 통과 여부를 보고 머지 여부를 판단하면 됩니다.

로컬에서 PR 전에 동일하게 확인하려면:

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run build
pnpm run test
pnpm run test:rules   # rules 변경 시
```

현재 테스트 커버리지: 점수/stage 로직(`src/utils/rank.test.ts`), Firestore 문서 파싱·검증(`src/utils/validateContent.test.ts`), Security Rules(`test/firestore.rules.test.mjs`).

남은 보강 영역:

- `src/utils/worry.ts`·`src/utils/session.ts` 등 나머지 순수 로직 단위 테스트
- 주요 사용자 흐름(튜토리얼 → 고민 작성 → 연타 → 결과 저장)의 브라우저 E2E — 현재 컴포넌트 렌더링 테스트 환경(jsdom)은 구성되어 있지 않음
