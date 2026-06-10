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

| 명령              | 용도                                         |
| ----------------- | -------------------------------------------- |
| `pnpm run dev`     | Vite 개발 서버                               |
| `pnpm run build`   | TypeScript project build + production bundle |
| `pnpm run lint`    | ESLint 검사                                  |
| `pnpm run preview` | production build 로컬 확인                   |

현재 test, format, typecheck 전용 스크립트는 없습니다. build가 TypeScript 검사를 포함합니다.

---

## 5. 현재 검증 상태

2026-06-10, 기존 로컬 의존성 기준:

| 검사            | 결과                             |
| --------------- | -------------------------------- |
| `npm run build` | 성공. 메인 chunk 500KB 초과 경고 |
| `npm run lint`  | 실패. 1 error, 2 warnings        |
| 자동화 테스트   | 없음                             |

lint 상세:

- `Game.tsx`: early return 이후 `useMemo` 호출 오류
- `SpecialThanks.tsx`: `useCallback` dependency warning
- `Tutorials.tsx`: 매 렌더 변경되는 callback dependency warning

수정 후 완료 기준은 `pnpm install --frozen-lockfile && pnpm run lint && pnpm run build` 모두 성공입니다.

---

## 6. Firebase 준비

코드가 사용하는 컬렉션:

- `contents`
- `userReactions`

현재 쿼리는 단일 필드 `orderBy`와 `score > value` count를 사용합니다. 콘솔이 인덱스를 요구하면 오류 링크를 따라 생성하되, 생성한 인덱스와 Rules는 저장소에서 형상 관리해야 합니다.

저장소에 있는 Firebase 형상: `firebase.json`, Firestore Security Rules(`firestore.rules`), 인덱스 설정(`firestore.indexes.json`). 규칙·인덱스 변경은 `firebase deploy --only firestore`로 배포해야 실제 반영됩니다.

아직 없는 항목: Emulator 설정.

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
```

게임 점수 계산, stage threshold, worry schema, Firestore converter부터 단위 테스트를 추가하고 주요 사용자 흐름은 브라우저 E2E로 보완합니다.
