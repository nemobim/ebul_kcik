# GAME-EXPERIENCE — 타격 게임 및 이불 애니메이션 개선

게임플레이 핵심 경험(연타 게임 + 이불 날아가기 연출)의 현황 분석 및 개선 제안입니다.

---

## 1. 타격 게임 (KickEbul)

### 1.1 현재 메커니즘

**파일:** `src/components/game/KickEbul.tsx`

| 항목       | 값                                                                 |
| ---------- | ------------------------------------------------------------------ |
| 카운트다운 | 5초 (`countdown` state)                                            |
| 게임 시간  | 20초 (`timeCount` state)                                           |
| 입력       | `onPointerDown` (pointer events)                                   |
| 점수       | `hitCount × SCORE_MULTIPLIER` (×3)                                 |
| 종료       | `timeCount === 0` → `setGameState({ score })` → `handleNextStep()` |

### 1.2 현재 피드백 시스템

| 요소        | 구현                                   | 파일                       |
| ----------- | -------------------------------------- | -------------------------- |
| Hit effect  | kick.svg, `animate-scale-fade` 0.5s    | KickEbul.tsx, animated.css |
| Hit count   | CountCombo, 매 hit `animate-count-pop` | CountCombo.tsx             |
| Combo burst | 10회마다 `animate-burst-scale`         | CountCombo.tsx             |
| 카운트다운  | bounce 숫자                            | KickEbul.tsx               |
| 타이머      | pulse 숫자                             | KickEbul.tsx               |
| 배경        | game.webp CSS background               | KickEbul.tsx               |

### 1.3 개선 제안 — 피드백

| 영역       | 현재               | 제안                                                  |
| ---------- | ------------------ | ----------------------------------------------------- |
| 타격감     | CSS scale-fade SVG | 햅틱 (`navigator.vibrate(10)`), 화면 shake (optional) |
| 사운드     | 없음               | kick/thud SFX, pitch variation (→ AUDIO.md)           |
| 콤보       | 10회 burst만       | 20/30/50 구간별 텍스트 ("Great!", "Amazing!")         |
| 속도 변화  | 없음               | hitCount 증가에 따라 CountCombo scale/색상 변화       |
| 마지막 5초 | pulse만            | 배경 red tint, 타이머 확대, 긴급 BGM                  |

### 1.4 개선 제안 — 게임플레이

| 영역      | 현재                                           | 제안                                                    |
| --------- | ---------------------------------------------- | ------------------------------------------------------- |
| 난이도    | 단순 연타                                      | 콤보 유지 (일정 간격 내 연속 터치 시 배율)              |
| 멀티터치  | PointerDown 기반, 기기별 동시 입력 동작 미검증 | 지원 여부와 점수 공정성 정책을 실제 기기에서 결정       |
| 터치 영역 | 전체 div                                       | 시각적 가이드 (이불/발 영역 highlight)                  |
| 실수 방지 | 없음                                           | 카운트다운 중 터치 무시 (현재 OK)                       |
| 재도전    | initGame → step 1                              | hitCount/타이머 state KickEbul remount로 리셋 (현재 OK) |

### 1.5 개선 제안 — 타이머 UX

```
현재:
  [게임 시작] → 5 → 4 → 3 → 2 → 1 → 즉시 20 → ... → 0

제안:
  [게임 시작] → "준비..." + progress ring
              → 3-2-1 GO + asset readiness 확인
              → 20초 progress bar (상단)
              → 마지막 5초: bar red + 숫자 확대
```

배경은 KickEbul mount 시 `new Image()`/`decode()`로 준비되며, 준비 전에는 시작 버튼이 비활성화됩니다(코드 반영 완료). progress UI는 이와 연동해 표시합니다.

### 1.6 개선 제안 — 입력

| 항목      | 제안                                                                  |
| --------- | --------------------------------------------------------------------- |
| 키보드    | Space/Enter = hit (접근성)                                            |
| 터치 영역 | `min-h` 확보, safe-area-inset 대응                                    |
| 멀티터치  | 실제 iOS/Android 기기에서 동시 pointer 입력과 의도치 않은 제스처 검증 |
| 우클릭    | App.tsx 전역 차단 (현재 OK)                                           |

---

## 2. 이불 날아가는 애니메이션 (GameResult)

### 2.1 현재 구현

**파일:** `src/components/game/GameResult.tsx`, `src/styles/animated.css`

#### Stage 시스템

```typescript
const targetStage = getResultStage(gameState.score) // 0~4
// stage 0 → targetStage까지 순차 재생
// stage === targetStage → animate-blanket-stop (걸침)
```

#### CSS 애니메이션

**blanket-fly** (2.5s, linear):

```css
@keyframes blanket-fly {
  0% {
    transform: translate(-50%, 0) rotate(0deg);
    opacity: 1;
  }
  25% {
    transform: translate(-40%, calc(-0.25 * var(--stage-height))) rotate(10deg);
  }
  50% {
    transform: translate(-60%, calc(-0.5 * var(--stage-height))) rotate(-10deg);
  }
  75% {
    transform: translate(-40%, calc(-0.75 * var(--stage-height))) rotate(15deg);
  }
  100% {
    transform: translate(-50%, calc(-1 * var(--stage-height))) rotate(-15deg);
    opacity: 0.3;
  }
}
```

**blanket-stop** (3s):

- 45% → 65% → 85% → 100% keyframe으로 걸침 bounce
- 최종 위치: `translate(-50%, calc(-0.6 * var(--stage-height)))`

#### Stage 전환 로직

```typescript
const handleAnimationEnd = () => {
  if (stage < targetStage) {
    setTimeout(() => setStage(prev => prev + 1), 200) // STAGE_TRANSITION_MS
  } else {
    showResultModal() // 1초 delay 후 ResultModal
  }
}
```

#### CSS 변수

```typescript
'--stage-height': window.innerHeight > 900 ? '900px' : `${window.innerHeight}px`
```

### 2.2 현재 연출 흐름

```
score 확정
  → stage 0 (stage1.webp 배경)
  → blanket fly 2.5s
  → onAnimationEnd → 200ms delay
  → stage 1 (stage2.webp) ... targetStage까지 반복
  → targetStage: blanket-stop 3s
  → 1초 delay → ResultModal
```

**예시:** score 780+ (targetStage 4) → stage 0→1→2→3→4, 모달 표시까지 약 14.8초

### 2.3 개선 제안 — 물리감

| 영역    | 현재                | 제안                                              |
| ------- | ------------------- | ------------------------------------------------- |
| easing  | `linear`            | `cubic-bezier(0.25, 0.1, 0.25, 1)` ease-out       |
| 흔들림  | rotate keyframe 4점 | Perlin noise / sin wave 기반 연속 흔들림          |
| 속도    | stage마다 동일 2.5s | stage 높을수록 fly 시간 단축 (멀리 날아감 = 빠름) |
| opacity | 100% → 30%          | stage별 fade curve 차별화                         |

### 2.4 개선 제안 — 연속성

| 영역        | 현재                                   | 제안                                             |
| ----------- | -------------------------------------- | ------------------------------------------------ |
| 배경 전환   | `<img>` 즉시 교체, `key={stage}` reset | crossfade (opacity transition 300ms)             |
| 이불 sprite | stage마다 animation restart            | translateY 누적 (연속 이동), stage는 배경만 변경 |
| stage gap   | 200ms 빈 화면                          | 이불은 fly 유지, 배경만 crossfade                |

**개념:**

```
Stage 0 fly ──→ Stage 1 fly (이불 Y 위치 누적, 배경 crossfade)
              ──→ ... ──→ Stage N stop
```

### 2.5 개선 제안 — 반응형

| 영역         | 현재                          | 제안                                              |
| ------------ | ----------------------------- | ------------------------------------------------- |
| stage-height | `window.innerHeight` 1회 참조 | `useWindowHeight` hook + resize listener          |
| 대안         | —                             | CSS `100dvh` / `svh` 단위로 `--stage-height` 대체 |
| object-fit   | background `contain`          | 다양한 기기에서 이불 위치 calibration             |

### 2.6 개선 제안 — 로딩

| 영역        | 현재             | 제안                                   |
| ----------- | ---------------- | -------------------------------------- |
| stage img   | 즉시 교체        | preload (게임 20초 중) + fade-in       |
| placeholder | 없음             | 이전 stage blur 유지 until next loaded |
| blanket     | blanket.png 단일 | stage별 이불 pose sprite (optional)    |

→ stage preload/decode는 코드에 반영 완료 (GameResult.tsx)

### 2.7 개선 제안 — 연출 강화

| 아이디어         | 설명                                                 |
| ---------------- | ---------------------------------------------------- |
| Stage별 particle | stage 2+: 별/구름, stage 4: UFO beam                 |
| Lottie overlay   | stage 전환 시 짧은 Lottie (0.5s)                     |
| 사운드           | fly whoosh, stage 전환 swoosh, stop thud             |
| 카메라           | subtle scale/translate on container (멀리 보는 느낌) |
| confetti         | targetStage 4 (UFO) 도달 시 brief confetti           |

### 2.8 개선 제안 — ResultModal 연동

| 영역         | 현재                 | 제안                               |
| ------------ | -------------------- | ---------------------------------- |
| 모달 delay   | blanket-stop 후 1초  | 애니메이션 end 직후 또는 skip 버튼 |
| skip         | 없음                 | "결과 보기" 탭으로 연출 스킵       |
| score reveal | ResultModal에서 표시 | fly 중간에 floating score counter  |

---

## 3. CountCombo 개선

**파일:** `src/components/game/CountCombo.tsx`

| 현재                 | 제안                                                  |
| -------------------- | ----------------------------------------------------- |
| hitCount 숫자 pop    | hitCount + "m" 예상 거리 실시간 표시 (`hitCount × 3`) |
| 10회 burst           | milestone별 다른 burst 크기/색상                      |
| text-4xl md:text-6xl | 게임 중 adaptive font size                            |

---

## 4. WorryDump → KickEbul 전환

| 영역          | 현재               | 제안                                           |
| ------------- | ------------------ | ---------------------------------------------- |
| 전환          | step++ 즉시        | "이불 준비 완료" bridge 화면 (0.5s)            |
| 고민 미리보기 | WorryDump wake.png | KickEbul에서 고민 카테고리 아이콘 corner badge |

---

## 5. 구현 우선순위

| 우선순위 | 항목                                   | 문서           |
| -------- | -------------------------------------- | -------------- |
| 완료     | 배경 readiness + stage preload         | 코드 반영 완료 |
| P1       | blanket-fly easing (linear → ease-out) | 이 문서 2.3    |
| P1       | stage 배경 crossfade                   | 이 문서 2.4    |
| P1       | 타격음 + fly whoosh                    | AUDIO.md       |
| P2       | 카운트다운/타이머 progress UI          | 이 문서 1.5    |
| P2       | 콤보 milestone 텍스트                  | 이 문서 1.3    |
| P2       | resize 대응 (stage-height)             | 이 문서 2.5    |
| P3       | particle/Lottie 연출                   | 이 문서 2.7    |
| P3       | 콤보 배율 게임플레이                   | 이 문서 1.4    |

---

## 6. 관련 문서

- 남은 성능 항목: [ROADMAP.md](./ROADMAP.md) 「성능 잔여 항목」
- 사운드: [AUDIO.md](./AUDIO.md)
- UI/UX: [UI-UX.md](./UI-UX.md)
- 일정: [ROADMAP.md](./ROADMAP.md) Phase 3
