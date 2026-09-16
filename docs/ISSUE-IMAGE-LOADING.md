# ISSUE — 모바일에서 이미지가 제각각 로딩되는 문제

**등록일:** 2026-09-16
**대상:** 프로덕션 빌드(`dist/`, Vercel 배포본) / 모바일 브라우저
**상태:** 원인 규명 완료, 수정 미적용
**GitHub 이슈:** [nemobim/ebul_kcik#8](https://github.com/nemobim/ebul_kcik/issues/8)

---

## 1. 증상

모바일에서 페이지에 진입하면 한 화면을 구성하는 이미지들이 **동시에 나타나지 않고 하나씩 따로 떠오르며**, 늦게 도착한 이미지 때문에 먼저 그려진 요소들의 위치가 다시 밀린다. 데스크톱·로컬 개발 서버(`pnpm dev`)에서는 거의 체감되지 않는다.

대표적으로 튜토리얼 첫 화면(`/tutorials`)에서 **바닥 벽돌·커서·물음표는 즉시 보이는데 정작 주인공인 문(door)만 뒤늦게 나타나고**, 문이 도착하는 순간 닉네임 텍스트와 바닥 블록이 제자리로 점프한다.

---

## 2. 재현 조건

| 항목      | 값                                                        |
| --------- | --------------------------------------------------------- |
| 환경      | 프로덕션 빌드 (`pnpm build` 결과물). dev 서버는 재현 약함 |
| 네트워크  | 모바일 4G/LTE 또는 DevTools "Fast 4G" 스로틀링            |
| 캐시      | 첫 방문(빈 캐시). 재방문 시 캐시로 가려짐                 |
| 화면      | `/tutorials`(문·방·침대), 고민 카테고리 모달, 결과 화면   |

> dev 서버에서 재현이 약한 이유: Vite dev는 인라인 변환 없이 모든 이미지를 localhost에서 개별 제공하므로 지연이 사실상 0이다. 아래 3.1의 **이원화가 dev에는 존재하지 않는다.**

---

## 3. 원인

### 3.1 [주원인] 4KB 임계값으로 이미지가 두 부류로 갈린다

Vite의 기본값 `build.assetsInlineLimit = 4096 bytes`가 적용된 상태다(`vite.config.ts`는 react 플러그인만 설정). 그 결과 **4096바이트 미만 이미지는 base64로 JS 번들 안에 인라인되어 JS 실행 즉시 그려지고, 4096바이트 이상 이미지만 별도 파일로 떨어져 네트워크 왕복을 거친다.**

현재 빌드(`dist/assets/`) 실측 — 전체 이미지 54개 중 **39개 인라인 / 15개 별도 파일**, 경계는 정확히 4096B에서 갈린다.

| 구분 | 크기대 | 개수 | 대표 파일 |
| --- | --- | --- | --- |
| 인라인(base64, 즉시 표시) | 393 ~ 3,983B | 39 | `tutorial/door/bottom.webp`(2,808B), `tutorial/door/pointer.png`(3,000B), `tutorial/door/question.png`(787B), `tutorial/room/mark.png`(2,223B), 고민 아이콘 9종, 패턴 8종 |
| 별도 파일(네트워크 요청) | 4,114 ~ 41,510B | 15 | `tutorial/door/doorclose.webp`(6,502B), `dooropen.webp`(10,166B), `tutorial/room/my_room.webp`(10,878B), `tutorial/bed/phone.png`(21,100B), `game/write/etc_pattern.png`(7,509B), `game/game.webp`(5,936B), `game/result/stage1~5.webp`, `blanket.png`(4,114B), `etc/hmm.jpg`(27,835B) |

같은 화면에 두 부류가 섞이면 **한 화면이 두 번에 걸쳐 완성된다.** 화면별 조합:

| 화면 | 즉시 뜨는 것(인라인) | 늦게 뜨는 것(파일) | 체감 |
| --- | --- | --- | --- |
| 튜토리얼 문 (`Door.tsx`) | 바닥 벽돌, 커서, 물음표 | **문 본체** | 배경 소품만 뜬 빈 화면 → 문 팝인 |
| 튜토리얼 방 (`Room.tsx`) | 마커 | **방 전체 배경** | 마커가 허공에 떠 있다가 제자리로 이동 |
| 침대 대사 (`Bed.tsx`) | 다음 화살표 | **phone/sleep/wake 3종 전부** | 대사마다 이미지 영역이 비었다가 채워짐 |
| 고민 카테고리 모달 | 아이콘 9종 + 패턴 **8종** | `etc_pattern.png` **1종만** | 기타 카테고리만 배경이 늦게 깔림 |

특히 마지막 행이 "제각각"의 전형이다. 9개 패턴 중 8개는 3.1~4.0KB라 인라인, `etc_pattern.png`만 7.5KB라 파일로 떨어져 **동일한 역할의 이미지가 서로 다르게 동작한다.**

### 3.2 이미지 URL이 HTML에 없어 프리로드 스캐너가 먼저 받아올 수 없다

모든 이미지가 `import img from '../assets/...'` 형태의 JS 정적 import다(`src/utils/worry.ts`, 각 컴포넌트 상단). `index.html`에는 이미지 URL이 한 줄도 없고 `<link rel="preload">`도 없다.

따라서 브라우저 프리로드 스캐너가 HTML 파싱 단계에서 이미지를 발견할 수 없고, **요청 순서가 "번들 다운로드 → 파싱/실행 → React 렌더 → 그제서야 이미지 요청"으로 직렬화된다.** 메인 번들이 무거울수록 이미지 요청 시작점 자체가 통째로 밀린다.

메인 번들 실측:

| 파일 | 원본 | gzip |
| --- | --- | --- |
| `dist/assets/index-*.js` | 1,032,165B | 480,624B |
| `dist/assets/firebaseApi-*.js` | 288,448B | 91,081B |

메인 번들 안 base64 데이터 URI 30건의 합계는 약 **415KB**이며, 그중 **353KB 한 건은 `src/assets/lottie/splash.json`에 내장된 PNG**다(스플래시 Lottie 4개 asset 중 1개). 나머지 29건(약 62KB)이 3.1의 인라인 이미지들이다. 즉 모바일에서 첫 화면 JS를 받아 실행하기까지의 비용이 크고, 그 뒤에야 15개 파일 이미지가 순차로 붙는다.

### 3.3 이미지에 크기가 지정되어 있지 않아 컨테이너가 무너진다 (레이아웃 점프)

`<img>` 어디에도 `width`/`height` 속성이나 `aspect-ratio`가 없다. 로드 전 높이는 0이므로, **이미지 크기에 의존해 높이가 정해지는 컨테이너가 일시적으로 붕괴한다.** 그 컨테이너를 기준으로 `absolute`·`%`로 배치된 형제 요소들이 잘못된 위치에 먼저 그려졌다가, 이미지 도착 시 한꺼번에 점프한다.

- [Door.tsx:55-70](../src/components/tutorial/Door.tsx#L55-L70) — `relative` 컨테이너 높이를 문 이미지가 정하는데, 그 안의 바닥 벽돌은 `-bottom-[50%]`, 닉네임은 `top-[32%]`로 배치
- [Room.tsx:30-34](../src/components/tutorial/Room.tsx#L30-L34) — 마커가 `right-[20%] top-[40%]`로 방 배경 컨테이너 기준 배치
- [Bed.tsx:50-53](../src/components/tutorial/Bed.tsx#L50-L53) — 이미지 높이에 따라 아래 대사 박스가 밀림
- [WorryDump.tsx:28-32](../src/components/game/WorryDump.tsx#L28-L32) — `absolute inset-0`로 겹쳐 둔 고민 텍스트가 이미지 로드 전 기준을 잃음

3.1의 인라인 이미지들은 즉시 그려지므로, **"먼저 그려진 소품 + 아직 0높이인 주 이미지"** 조합이 어색함을 증폭시킨다.

### 3.4 화면 전환 시 다음 이미지를 미리 준비하지 않는다

사전 디코딩이 적용된 곳은 두 군데뿐이다.

- [KickEbul.tsx:24-36](../src/components/game/KickEbul.tsx#L24-L36) — `game.webp` 디코딩 후 "게임 시작" 버튼 활성화 (양호)
- [GameResult.tsx:24-32](../src/components/game/GameResult.tsx#L24-L32) — stage 5장 + blanket 사전 디코딩

반면 튜토리얼 구간에는 없다.

- `Door.tsx` — `dooropen.webp`(10KB)를 클릭 시점에 처음 요청한다. 문 열기 연출은 1초 뒤 다음 단계로 넘어가므로(`Door.tsx:33-38`), 느린 회선에서는 **열린 문이 보이기 전에 화면이 넘어간다.**
- `Bed.tsx` — 대사마다 이미지를 교체하지만 다음 이미지를 미리 받지 않는다.
- `Room` → `Bed` → `/game` 전환 시에도 다음 화면 이미지 준비 없음.

### 3.5 [부수] 결과 화면에서 이불이 보이기 전에 애니메이션이 진행될 수 있다

`GameResult`는 마운트와 동시에 사전 디코딩을 **시작**하지만, `blanket.png`와 `stage1.webp`는 같은 시점에 이미 렌더되고 애니메이션도 즉시 돌아간다([GameResult.tsx:70-83](../src/components/game/GameResult.tsx#L70-L83)). 사전 디코딩은 "다음 stage 전환"에는 효과가 있으나 **첫 프레임에는 효과가 없어**, 느린 회선에서는 이불이 보이지 않는 채로 비행 애니메이션이 끝나고 `onAnimationEnd`만 발화할 수 있다.

### 3.6 [부수] 결과 화면 형제 요소에 중복 key

[GameResult.tsx:71, 78](../src/components/game/GameResult.tsx#L71-L78) — 같은 부모 아래 두 `<img>`가 모두 `key={stage}`를 쓴다. React가 형제 간 key 중복 경고를 내며, 재조정 과정에서 의도치 않은 리마운트(= 이미지 재요청)를 유발할 수 있다. 위 증상과 독립적이지만 같은 파일에서 발견되어 함께 기록한다.

---

## 4. 검증 방법

원인 재확인 및 수정 후 효과 측정 절차. **수치는 반드시 실측으로 확인할 것.**

```bash
pnpm build
npx serve dist            # 또는 pnpm preview
```

1. Chrome DevTools → Network, "Fast 4G" 스로틀링 + Disable cache → `/tutorials` 진입
   - `doorclose-*.webp`, `my_room-*.webp`가 `index-*.js` **이후에** 요청되는지 확인
2. Performance 패널 녹화 → Layout Shift 항목에서 이미지 도착 시점의 점프 확인
3. 인라인/파일 분류 재확인:
   ```bash
   ls -la dist/assets/*.webp dist/assets/*.png dist/assets/*.jpg
   ```
   → 4096B 미만 원본이 목록에 없으면 인라인된 것
4. Lighthouse 모바일 프로파일에서 LCP / CLS / Total Blocking Time 기록 (수정 전후 비교)

---

## 5. 개선 방향 (제안, 미적용)

전면 개편이 아니라 **효과 대비 변경 범위가 작은 순서**로 나눠 적용하고, 각 단계마다 4장의 절차로 실측 비교할 것을 권장한다.

| 우선 | 조치 | 대상 | 기대 효과 | 범위 |
| --- | --- | --- | --- | --- |
| 1 | `build.assetsInlineLimit: 0` 으로 인라인 이원화 제거 (또는 반대로 임계값 상향으로 통일) | `vite.config.ts` | 3.1 해소. 모든 이미지가 동일한 경로로 로드되어 "제각각" 성격이 사라짐. 부수적으로 메인 번들 약 62KB 감소 | 설정 1줄 |
| 2 | 주요 이미지에 `width`/`height` 또는 `aspect-ratio` 지정 | `Door`, `Room`, `Bed`, `WorryDump` | 3.3 해소. 로드 전에도 레이아웃 확정 → 점프 제거 | 컴포넌트 4개 |
| 3 | 화면 진입 전 다음 이미지 사전 디코딩 (`KickEbul`과 동일 패턴 재사용) | `Door`(dooropen), `Bed`(대사 이미지 전체) | 3.4 해소 | 컴포넌트 2개 |
| 4 | 첫 화면 핵심 이미지에 `<link rel="preload" as="image">` 추가 | `index.html` | 3.2 완화. 단, Vite 해시 파일명이라 플러그인 또는 `public/` 이동 필요 — 비용 대비 효과 먼저 측정할 것 | 빌드 구성 |
| 5 | `splash.json` 내장 PNG(353KB) 경량화 | `src/assets/lottie/` | 메인 번들 축소 → 이미지 요청 시작 시점 앞당김. ROADMAP 「성능 잔여 항목」 1번과 동일 사안 | 에셋 교체 |
| 6 | 첫 프레임 이미지 준비 후 결과 연출 시작 | `GameResult.tsx` | 3.5 해소 | 컴포넌트 1개 |
| 7 | 형제 `key` 중복 정리 | `GameResult.tsx:71,78` | 3.6 해소 | 2줄 |

> 1번과 4번은 서로 영향을 주므로 **1번만 먼저 적용해 실측한 뒤** 4번 필요 여부를 판단할 것. 이미지 최적화 플러그인 도입 등 빌드 파이프라인 확장은 위 조치로 부족할 때만 검토한다(현재 전체 에셋 1.6MB 규모에서는 과설계 소지).

---

## 6. 문서 정합화 (반영 완료)

[ARCHITECTURE.md](./ARCHITECTURE.md) §6.4 말미에 있던 다음 서술은 이번 실측과 어긋나 2026-09-16에 수정했다.

> (이전) "static import가 이미지 파일 자체를 JS 번들에 인라인하거나 …"

실제로는 4096B 미만 이미지 39개가 base64로 번들에 인라인되어 있다. 현재 §6.1에 `assetsInlineLimit` 기본값(4096B)과 인라인/파일 이원화가, §6.4에 미적용 최적화 목록이 기록되어 있으며, 본 문서를 참조하도록 연결해 두었다.

관련 항목은 [ROADMAP.md](./ROADMAP.md) 「성능 잔여 항목」 7번, [PRD.md](./PRD.md) §7.2에도 연결되어 있다.
