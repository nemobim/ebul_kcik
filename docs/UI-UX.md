# UI-UX — 개선사항

현재 UI/UX 현황 분석 및 개선 제안 문서입니다.

---

## 1. 현재 UX 강점

| 항목          | 설명                                           | 파일                                 |
| ------------- | ---------------------------------------------- | ------------------------------------ |
| 재방문 SKIP   | `isPlay` localStorage 기준, 튜토리얼 생략 가능 | `src/components/tutorial/Room.tsx`   |
| 연타 피드백   | CountCombo pop + 10회 burst 애니메이션         | `src/components/game/CountCombo.tsx` |
| 결과 차별화   | 5단계 stage별 배경·아이콘 변화                 | `src/components/game/GameResult.tsx` |
| 모바일 셸     | 폭 448px 상한, `100dvh` viewport 대응          | `src/App.tsx`                        |
| 일관된 비주얼 | Galmuri 폰트, border-[3px] 카툰 스타일         | `src/styles/index.css`               |
| 탭 네비게이션 | 랭킹 ↔ 모아보기 전환                          | `src/components/rank/RankTab.tsx`    |

---

## 2. 에러 및 피드백 UX

### 2.1 현재 문제

| 문제                            | 위치                                | 영향                                   |
| ------------------------------- | ----------------------------------- | -------------------------------------- |
| ~~`alert()` 사용~~ (해결됨)     | ResultModal, InfoModal, firebaseApi | `utils/toast.ts` 인앱 토스트로 교체 완료 |
| ~~isError → 무한 로딩~~ (해결됨) | Rank.tsx, Content.tsx               | `ErrorRetry`(재시도) + `EmptyState`(빈 목록)로 처리 완료 |
| ErrorFallBack 관측성 부족       | ErrorFallBack.tsx                   | 홈/재시도는 있으나 오류 전송·추적 없음 |

### 2.2 개선 제안

1. ~~**통합 피드백 컴포넌트** — Toast 또는 인앱 알림 모달~~ → `utils/toast.ts`로 구현 완료 (ResultModal·InfoModal·firebaseApi)
2. ~~**에러 상태 UI** — "다시 시도" 버튼 (React Query `refetch`)~~ → `components/ErrorRetry.tsx`로 구현 완료 (Rank/Content `isError` 시 노출)
3. **ErrorBoundary 개선** — 현재 홈/재시도 유지 + 에러 리포팅과 오류 ID 추가
4. **mutation 피드백 통일** — 현재 공감 수는 성공 후에만 증가하므로 rollback은 불필요. pending/error/success 상태를 인앱 UI로 표시

---

## 3. 폼 UX

### 3.1 RoomNameModal

**파일:** `src/components/game/Modal/RoomNameModal.tsx`

| 이슈             | 현재                            | 제안                           |
| ---------------- | ------------------------------- | ------------------------------ |
| maxLength 불일치 | validate 5자, input maxLength 8 | 둘 다 5로 통일                 |
| label 연결       | htmlFor 없음                    | `<label htmlFor="nickname">`   |
| 에러 메시지      | React Hook Form errors          | 인라인 에러 텍스트 스타일 통일 |

### 3.2 WorryContentModal

**파일:** `src/components/game/Modal/WorryContentModal.tsx`

| 이슈                | 현재                              | 제안                                 |
| ------------------- | --------------------------------- | ------------------------------------ |
| label 연결          | textarea label 없음               | `aria-label` 또는 `<label htmlFor>`  |
| 글자 수 표시        | 500자 제한만                      | "123/500" 카운터                     |
| 카테고리 선택       | 3×3 grid                          | 선택 상태 시각적 강조 (border/scale) |
| 마운트 시 강제 오픈 | WorryDump mount → modal auto open | 의도적이면 OK, 닫기 UX 확인          |

### 3.3 Content 정렬 select

**파일:** `src/page/Content.tsx`

```tsx
// 현재: uncontrolled
<select defaultValue={sortType} onChange={handleSortChange}>

// 제안: controlled
<select value={sortType} onChange={handleSortChange}>
```

현재 사용 방식에서는 동작하지만, 상태를 단일 기준으로 유지하려면 controlled select가 더 명확합니다.

---

## 4. 접근성 (Accessibility)

### 4.1 잘 된 부분

- `index.html` `lang="ko"`
- 대부분 `<img>`에 `alt` 속성
- Content select `aria-label="정렬 기준 선택"`
- SpecialThanks 폭죽 버튼 `aria-label`

### 4.2 개선 필요

#### 모달 (`useModal.tsx`)

| 항목       | 현재                 | 제안                                                     |
| ---------- | -------------------- | -------------------------------------------------------- |
| role       | 없음                 | `role="dialog"`, `aria-modal="true"`                     |
| focus trap | 없음                 | Tab 키 순환, 모달 열릴 때 첫 focusable 포커스            |
| ESC 닫기   | 없음                 | `keydown` Escape handler                                 |
| backdrop   | 클릭해도 닫히지 않음 | 정책을 정한 뒤 backdrop 닫기 여부와 안내를 일관되게 적용 |

#### 게임 입력 (`KickEbul.tsx`)

- `onPointerDown`만 사용 → 키보드/스위치 접근 불가
- 제안: Space/Enter 키 대안, `role="button"`, `tabIndex={0}`, `aria-label="이불 차기"`

#### 클릭 가능 div

| 파일        | 현재                       | 제안                                       |
| ----------- | -------------------------- | ------------------------------------------ |
| Content.tsx | `<div onClick>` 카드       | `<button>` 또는 `role="button"` + keyboard |
| Bed.tsx     | `<div onClick>`            | `<button>`                                 |
| Door.tsx    | 이미지가 들어간 `<button>` | 버튼 목적을 설명하는 `aria-label` 추가     |

#### 모션 민감 사용자

- `prefers-reduced-motion` 미적용 (`animated.css`)
- 제안: `@media (prefers-reduced-motion: reduce)` 에서 blanket-fly, bounce, pulse 비활성화

#### 전역 CSS (해결됨)

- 과거 `index.css`의 전역 `touch-action: none` / `user-select: none`은 제거됨 → Content/Rank 스크롤·텍스트 선택 영향 해소
- 연타가 핵심인 게임 영역에서 스크롤 간섭이 다시 문제되면, 전역이 아닌 게임 컴포넌트 한정으로 `touch-action`을 재적용하는 방식을 권장

---

## 5. 레이아웃 및 타이포그래피

### 5.1 폰트 FOUT

- Galmuri 폰트 CDN (`fastly.jsdelivr.net`) 로드
- 제안: `index.html`에 `<link rel="preload" href="..." as="font" crossorigin>`

### 5.2 반응형

| breakpoint  | 사용처                  |
| ----------- | ----------------------- |
| xxs (310px) | tailwind.config.js 정의 |
| xs (380px)  | WorryContentModal gap   |
| md (768px)  | CountCombo text size만  |

대부분 퍼센트/고정값 기반. 극소형 기기(310px 이하) 테스트 권장.

### 5.3 스크롤 UX

- Content: `FloatBtn` 스크롤 top 버튼 제공
- Rank: 별도 스크롤 top/정보 버튼 없음
- 앱 셸 `overflow-y-auto` — 긴 콘텐츠 스크롤 가능

---

## 6. 모달 및 공통 UI

### 6.1 반복 패턴

다음 스타일이 여러 컴포넌트에 반복:

```
rounded-xl border-[3px] border-black bg-white p-3
```

**영향 파일:** Room.tsx, SpecialThanks.tsx, InfoModal.tsx

**제안:** `ModalCard` 공통 컴포넌트 추출 (3회+ 반복, 안정적 패턴).

### 6.2 버튼 시스템

`src/styles/index.css`에 `.btn`, `.btn.main2`, `.btn.main3` 정의.

- disabled 상태 시각적 피드백 확인 (ResultModal `isPending`)
- 로딩 중 spinner 또는 텍스트 변경 추가 검토

---

## 7. 페이지별 UX 개선

### 7.1 Splash

- Lottie 완료 후 자동 이동 — 스킵 버튼 없음
- 제안: 탭하여 스킵 옵션

### 7.2 Tutorials (Bed)

- 타이핑 중 대화창을 탭하면 현재 문장을 즉시 완성할 수 있음
- 다음 문장 이동도 같은 클릭 영역에 묶여 있으므로 키보드 접근 가능한 버튼 구조로 변경 권장

### 7.3 KickEbul (게임)

| 영역       | 현재                           | 제안                               |
| ---------- | ------------------------------ | ---------------------------------- |
| 카운트다운 | bounce 숫자                    | progress ring, "준비" 텍스트       |
| 타이머     | pulse 숫자                     | progress bar, 마지막 5초 색상 변화 |
| 게임 시작  | 버튼 클릭                      | 첫 터치 = 시작 (optional)          |
| 배경 로딩  | CSS background, 로드 감지 없음 | skeleton 또는 spinner              |

상세 게임 개선: [GAME-EXPERIENCE.md](./GAME-EXPERIENCE.md)

### 7.4 GameResult

- stage 전환 시 배경 `<img>` 즉시 교체 → 깜빡임 가능
- 제안: crossfade transition (preload는 코드 반영 완료)

### 7.5 Rank

- TOP 3 시상대 + 4~100 리스트 — 시각적으로 잘 구분됨
- 내 순위 플로팅 — `isPlay` 없으면 미표시 (의도 확인 필요)
- `score || '-'`, `rank.myScore` 조건 때문에 0점은 `-`로 보이거나 내 순위가 숨겨짐
- 데이터가 0건일 때 `EmptyState`로 안내 메시지 표시 (구현 완료)

### 7.6 Content

- 2열 그리드, 카드 클릭 → ContentModal
- 제안: 카드 hover/active 상태 (모바일 tap feedback)
- 데이터가 0건일 때 `EmptyState`로 안내 메시지 표시 (구현 완료)

---

## 8. 우선순위

> ~~취소선~~ 항목은 완료됨 (toast·ErrorRetry·EmptyState·전역 touch-action 게임 영역 제한 등).

| 우선순위 | 항목                                           | 공수  |
| -------- | ---------------------------------------------- | ----- |
| ~~높음~~ | ~~Rank/Content 에러 UI~~ (완료: ErrorRetry)    | —     |
| ~~높음~~ | ~~alert → 인앱 피드백~~ (완료: toast.ts)       | —     |
| 높음     | 0점 표시 조건 수정 (empty state는 완료)        | 0.5일 |
| 중간     | 모달 접근성 (focus trap, ESC)                  | 1~2일 |
| 중간     | 폼 label/maxLength 정리                        | 0.5일 |
| 중간     | prefers-reduced-motion                         | 0.5일 |
| 낮음     | ModalCard 추출                                 | 0.5일 |
| 낮음     | Splash/Bed 스킵 UX                             | 0.5일 |

---

## 9. 관련 문서

- 게임 피드백/연출: [GAME-EXPERIENCE.md](./GAME-EXPERIENCE.md)
- 남은 성능 항목: [ROADMAP.md](./ROADMAP.md) 「성능 잔여 항목」
- 사운드 피드백: [AUDIO.md](./AUDIO.md)
- 전체 일정: [ROADMAP.md](./ROADMAP.md)
