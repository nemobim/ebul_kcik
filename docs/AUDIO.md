# AUDIO — 배경음악 및 효과음 설계

현재 오디오 구현이 **전무**한 상태입니다. BGM/SFX 추가를 위한 설계 및 구현 방향 문서입니다.

---

## 1. 현황

| 항목                           | 상태   |
| ------------------------------ | ------ |
| 오디오 파일 (.mp3, .wav, .ogg) | 0건    |
| Audio API / Howler.js          | 미사용 |
| mute 설정                      | 없음   |
| autoplay 처리                  | 없음   |

게임 몰입감과 타격 피드백의 핵심 요소인 **사운드가 완전히 빠져 있음**.

---

## 2. 사운드 디자인 목표

| 목표   | 설명                                     |
| ------ | ---------------------------------------- |
| 타격감 | 연타할 때마다 즉각적인 auditory feedback |
| 몰입   | 화면별 BGM으로 분위기 전환               |
| 성취   | 결과 stage별 연출 사운드로 보상감        |
| 제어   | mute toggle, autoplay 정책 준수          |
| 성능   | preload + pool, 모바일 데이터 고려       |

---

## 3. BGM (Background Music)

### 3.1 화면별 BGM

| 화면                      | 분위기                            | 재생 방식       |
| ------------------------- | --------------------------------- | --------------- |
| Splash                    | 짧은 intro jingle (3~5s)          | 1회             |
| Tutorials (Door/Room/Bed) | 잔잔한 방 ambient, lo-fi          | loop            |
| Game — 카운트다운         | tension build (tempo 상승)        | 1회 → game loop |
| Game — 연타               | 경쾌한 beat, BPM 120~140          | loop            |
| GameResult                | 성취감 rising, stage별 layer 추가 | loop → fade out |
| Ranking / Content         | 가벼운 idle BGM                   | loop            |
| SpecialThanks             | warm outro                        | 1회             |

### 3.2 BGM 전환

```
Tutorial BGM ──fade──→ Countdown SFX ──→ Game BGM
                                              │
Game BGM ──fade──→ Result BGM ──fade──→ Ranking BGM
```

- crossfade 500ms
- 같은 AudioContext에서 gain node로 volume 조절

---

## 4. SFX (Sound Effects)

### 4.1 게임플레이

| 이벤트            | 사운드           | 상세                              |
| ----------------- | ---------------- | --------------------------------- |
| 타격 (hit)        | kick / thud      | 연타 시 pitch variation (0.9~1.1) |
| 콤보 10           | burst chime      | CountCombo burst와 sync           |
| 콤보 20/30        | escalating chime | pitch/step up                     |
| 카운트다운 tick   | clock tick       | 5, 4, 3, 2, 1                     |
| GO                | short fanfare    | 게임 시작                         |
| 타이머 마지막 5초 | urgency tick     | tempo increase                    |
| 게임 종료         | whistle / ding   | timeCount === 0                   |

### 4.2 이불 연출 (GameResult)

| 이벤트              | 사운드                 |
| ------------------- | ---------------------- |
| blanket fly start   | whoosh (wind)          |
| stage 전환          | swoosh + subtle chime  |
| blanket stop (착지) | thud + fabric rustle   |
| UFO stage (4)       | sci-fi beam (optional) |
| ResultModal open    | success jingle         |

### 4.3 UI

| 이벤트          | 사운드                           |
| --------------- | -------------------------------- |
| 버튼 click      | soft tap                         |
| 모달 open/close | slide + pop                      |
| 공감 reaction   | emoji pop (shock/laugh/sad 각각) |
| 저장 성공       | success chime                    |
| 에러            | error buzz                       |

---

## 5. 기술 구현 방향

### 5.1 라이브러리 선택

| 옵션                       | 장점                        | 단점                         |
| -------------------------- | --------------------------- | ---------------------------- |
| **Web Audio API** (native) | 의존성 없음, pitch control  | 보일러플레이트 많음          |
| **Howler.js**              | sprite, pool, cross-browser | 의존성과 별도 상태 관리 추가 |
| **use-sound**              | React hook, 간단            | Howler 의존                  |

**권장:** Howler.js — sprite/pool/fade 내장, 모바일 호환 검증됨.

### 5.2 Hook 설계

```typescript
// src/hook/useAudio.ts (제안)

type TAudioContext = {
  playSfx: (name: TSfxName) => void
  playBgm: (name: TBgmName) => void
  stopBgm: () => void
  setMuted: (muted: boolean) => void
  isMuted: boolean
}

// 사용 예
const { playSfx, playBgm, setMuted } = useAudio()

// KickEbul handlePointer
playSfx('hit')

// Game mount
playBgm('game')
```

### 5.3 Autoplay 정책

모바일 브라우저는 사용자 인터랙션 없이 audio autoplay 차단.

**전략:**

1. 첫 인터랙션(Door 닉네임 입력 / "게임 시작" 버튼)에서 AudioContext unlock
2. Tutorial BGM은 Door 문 열기 클릭 후 시작
3. Game BGM은 "게임 시작" 클릭 후 시작

```typescript
const unlockAudio = () => {
  Howler.ctx?.resume()
  document.removeEventListener('click', unlockAudio)
}
document.addEventListener('click', unlockAudio, { once: true })
```

### 5.4 Mute 설정

- `localStorage.isMuted` (boolean)
- UI: InfoModal 또는 설정 버튼에 mute toggle
- 모션 감소 설정과 음소거는 별도 사용자 선호로 취급

### 5.5 Preload

```typescript
import hitUrl from '../assets/audio/sfx/hit.mp3'
import comboUrl from '../assets/audio/sfx/combo.mp3'

const SFX_MAP = {
  hit: hitUrl,
  combo: comboUrl,
  // ...
} as const

// Howler preload
Object.entries(SFX_MAP).forEach(([name, src]) => {
  sounds[name] = new Howl({ src: [src], preload: true })
})
```

- KickEbul mount 시 hit/combo preload
- GameResult mount 시 whoosh/thud preload

### 5.6 Pitch Variation (연타)

```typescript
const playHit = () => {
  const pitch = 0.95 + Math.random() * 0.1
  sounds.hit.rate(pitch)
  sounds.hit.play()
}
```

---

## 6. 에셋 디렉터리 (제안)

```
src/assets/audio/
├── bgm/
│   ├── tutorial.mp3      # ~30s loop, ambient
│   ├── game.mp3          # ~60s loop, upbeat
│   ├── result.mp3        # ~20s, rising
│   └── idle.mp3          # ranking/content
└── sfx/
    ├── hit.mp3           # ~0.1s, kick/thud
    ├── combo.mp3         # ~0.3s, chime
    ├── countdown.mp3     # ~0.1s, tick
    ├── go.mp3            # ~0.5s, fanfare
    ├── whoosh.mp3        # ~0.5s, wind
    ├── stop.mp3          # ~0.3s, thud+rustle
    ├── ui-click.mp3      # ~0.05s
    └── success.mp3       # ~0.5s
```

### 6.1 포맷 권장

| 포맷 | 용도                               |
| ---- | ---------------------------------- |
| mp3  | 주 포맷 (호환성)                   |
| ogg  | 대체 인코딩이 필요한 경우 optional |
| wav  | SFX 원본 (빌드 시 mp3 변환)        |

### 6.2 파일 크기 가이드

| 타입              | 목표 크기    |
| ----------------- | ------------ |
| SFX               | < 20KB each  |
| BGM (loop)        | < 200KB each |
| 전체 audio bundle | < 1MB        |

---

## 7. 컴포넌트별 적용 포인트

| 컴포넌트      | BGM                     | SFX                        |
| ------------- | ----------------------- | -------------------------- |
| Splash        | intro (optional)        | —                          |
| Door/Room/Bed | tutorial loop           | ui-click                   |
| KickEbul      | game loop               | hit, combo, countdown, go  |
| GameResult    | result / fade from game | whoosh, stop, stage        |
| ResultModal   | fade out                | success                    |
| Rank/Content  | idle loop               | ui-click                   |
| ContentModal  | —                       | reaction (shock/laugh/sad) |

---

## 8. 구현 단계

### Phase A — MVP (1~2일)

- [ ] Howler.js 설치
- [ ] `useAudio` hook (playSfx, playBgm, mute)
- [ ] hit.mp3 + game.mp3 (placeholder 또는 무료 에셋)
- [ ] KickEbul handlePointer → playSfx('hit')
- [ ] mute toggle (InfoModal)

### Phase B — 게임 완성 (2~3일)

- [ ] countdown, go, combo SFX
- [ ] GameResult whoosh/stop
- [ ] BGM crossfade (tutorial → game → result)
- [ ] autoplay unlock flow

### Phase C — polish (1~2일)

- [ ] pitch variation, stage별 result sound
- [ ] UI click, reaction SFX
- [ ] 독립적인 mute/volume 접근성 검증
- [ ] volume slider (optional)

---

## 9. 무료 에셋 소스 (참고)

- [Freesound.org](https://freesound.org) — CC 라이선스 SFX
- [OpenGameArt.org](https://opengameart.org) — 게임 BGM/SFX
- [Mixkit](https://mixkit.co/free-sound-effects/) — 무료 효과음

> 실제 에셋 선정 시 라이선스 확인 필수.

라이선스 URL, 저작자, 수정 여부, attribution 문구를 저장소 문서에 함께 기록해야 합니다.

---

## 10. 관련 문서

- 게임 피드백 연동: [GAME-EXPERIENCE.md](./GAME-EXPERIENCE.md)
- 남은 성능 항목: [ROADMAP.md](./ROADMAP.md) 「잔여 코드 품질 항목」
- 일정: [ROADMAP.md](./ROADMAP.md) Phase 2
