import bat from '../assets/game/bat.png'
import bird from '../assets/game/bird.png'
import hanger from '../assets/game/hanger.png'
import UFO from '../assets/game/UFO.png'
import star from '../assets/game/write/idol.png'
import first from '../assets/rank/first.png'
import second from '../assets/rank/second.png'
import third from '../assets/rank/third.png'

import stage1 from '../assets/game/result/stage1.webp'
import stage2 from '../assets/game/result/stage2.webp'
import stage3 from '../assets/game/result/stage3.webp'
import stage4 from '../assets/game/result/stage4.webp'
import stage5 from '../assets/game/result/stage5.webp'

export const rankImg = [first, second, third]

/**점수 계산 배수*/
export const SCORE_MULTIPLIER = 3
/**점수 목표 (hitCount 기준)*/
const SCORE_TARGET = [140, 180, 220, 260]
/**tier 진입 점수 임계값 (배수 적용)*/
const TIER_THRESHOLDS = SCORE_TARGET.map(target => target * SCORE_MULTIPLIER)

/**tier별 등급 아이콘 (index 0~4)*/
const tierRankImg = [hanger, star, bat, bird, UFO]

/**점수로 tier(0~4) 계산 — getRankImg/getResultStage 공통 기준*/
export const getScoreTier = (score: number): number => {
  for (let i = TIER_THRESHOLDS.length - 1; i >= 0; i--) {
    if (score >= TIER_THRESHOLDS[i]) return i + 1
  }
  return 0
}

/**랭크에 맞는 이미지 반환*/
export const getRankImg = (score: number) => tierRankImg[getScoreTier(score)]

/**점수에 맞는 배경 stage(0~4) 반환 */
export const getResultStage = (score: number) => getScoreTier(score)

export const resultStage = [stage1, stage2, stage3, stage4, stage5]
