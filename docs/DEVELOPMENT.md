# DEVELOPMENT — 개발 및 검증 가이드

## 1. 요구 환경

- Node.js: `pnpm-lock.yaml`의 Vite 7 기준 `^20.19.0 || >=22.12.0`
- pnpm: `package.json`의 `packageManager` 필드(`pnpm@10.12.4`) 기준
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
- 저장소에 `.env.example`이 없으므로 추가가 필요합니다.
- `package.json`에 Node `engines`가 없으므로 배포 런타임 버전을 명시하는 편이 안전합니다.
- Firebase 웹 설정값은 클라이언트에 노출될 수 있습니다. 데이터 보호는 API key 은닉이 아니라 Firestore Security Rules로 보장해야 합니다.

---

## 4. 명령어

| 명령                | 용도                                         |
| ------------------- | -------------------------------------------- |
| `pnpm run dev`       | Vite 개발 서버                               |
| `pnpm run build`     | TypeScript project build + production bundle |
| `pnpm run lint`      | ESLint 검사                                  |
| `pnpm run preview`   | production build 로컬 확인                   |
| `pnpm run test`      | Vitest 단위 테스트 (`vitest run`)            |
| `pnpm run test:rules`| Firestore Rules 테스트 (에뮬레이터 실행)     |

별도 typecheck 스크립트는 없으며 `build`가 `tsc -b`로 TypeScript 검사를 포함합니다. 포맷은 `prettier`(devDependency, `prettier-plugin-tailwindcss` 포함)로 처리합니다.

---

## 5. 현재 검증 상태

2026-06-17, `pnpm install --frozen-lockfile` 기준:

| 검사             | 결과                                       |
| ---------------- | ------------------------------------------ |
| `pnpm run lint`  | 성공. 0 error, 0 warning                   |
| `pnpm run build` | 성공. 메인 chunk 약 1,031KB로 500KB 초과 경고 |
| `pnpm run test`  | 성공. 2 파일, 5 테스트 통과                 |

> 메인 chunk 경고는 번들 분할 관련 잔여 항목으로, 동작 오류는 아닙니다. ([ROADMAP.md](./ROADMAP.md) 「성능 잔여 항목」)

완료 기준은 `pnpm install --frozen-lockfile && pnpm run lint && pnpm run build && pnpm run test` 모두 성공입니다.

---

## 6. Firebase 준비

코드가 사용하는 컬렉션:

- `contents`
- `userReactions`

현재 쿼리는 단일 필드 `orderBy`와 `score > value` count를 사용합니다. 콘솔이 인덱스를 요구하면 오류 링크를 따라 생성하되, 생성한 인덱스와 Rules는 저장소에서 형상 관리해야 합니다.

저장소에 있는 Firebase 형상: `firebase.json`, Firestore Security Rules(`firestore.rules`), 인덱스 설정(`firestore.indexes.json`). 규칙·인덱스 변경은 `firebase deploy --only firestore`로 배포해야 실제 반영됩니다.

Firestore 에뮬레이터 기반 Rules 테스트가 있습니다: `pnpm run test:rules`는 `firebase emulators:exec`로 에뮬레이터를 띄우고 `test/firestore.rules.test.mjs`(`@firebase/rules-unit-testing`)를 실행합니다. 실행에는 로컬 Java 런타임이 필요합니다.

---

## 7. 배포 확인

Vercel build command:

```bash
pnpm run build
```

확인 항목:

1. Vercel 환경 변수 설정
2. `vercel.json` SPA rewrite 동작
3. `/game`, `/ranking`, `/content` 직접 진입 새로고침
4. Firestore 읽기/쓰기 및 실패 UI
5. 모바일 viewport, 스크롤, 멀티터치
6. OG image가 절대 URL로 정상 노출되는지 확인

---

## 8. 권장 자동화

PR마다 다음을 실행합니다.

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run build
pnpm run test
```

단위 테스트는 점수/stage 로직(`src/utils/rank.test.ts`)과 고민 입력 검증(`src/utils/validateContent.test.ts`), Firestore Rules(`test/firestore.rules.test.mjs`)에 이미 존재합니다. 남은 보강 영역은 worry schema·Firestore converter 단위 테스트와 주요 사용자 흐름의 브라우저 E2E입니다.
