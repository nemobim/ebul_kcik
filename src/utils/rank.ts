import bat from '../assets/game/bat.png'
import bird from '../assets/game/bird.png'
import hanger from '../assets/game/hanger.png'
import UFO from '../assets/game/UFO.png'
import star from '../assets/game/write/idol.png'
import first from '../assets/rank/first.png'
import second from '../assets/rank/second.png'
import third from '../assets/rank/third.png'

import stage1 from '../assets/game/result/stage1.png'
import stage2 from '../assets/game/result/stage2.png'
import stage3 from '../assets/game/result/stage3.png'
import stage4 from '../assets/game/result/stage4.png'
import stage5 from '../assets/game/result/stage5.png'

export const rankImg = [first, second, third]

/**점수 계산 배수*/
export const SCORE_MULTIPLIER = 3
/**점수 목표*/
const SCORE_TARGET = [100, 120, 140, 160]

/**랭크에 맞는 이미지 반환*/
export const getRankImg = (score: number) => {
  if (score >= SCORE_TARGET[3] * SCORE_MULTIPLIER) return UFO
  if (score >= SCORE_TARGET[2] * SCORE_MULTIPLIER) return bird
  if (score >= SCORE_TARGET[1] * SCORE_MULTIPLIER) return bat
  if (score >= SCORE_TARGET[0] * SCORE_MULTIPLIER) return star
  return hanger
}

/**점수에 맞는 배경 이미지 반환 */
export const getResultStage = (score: number) => {
  if (score >= SCORE_TARGET[3] * SCORE_MULTIPLIER) return 4
  if (score >= SCORE_TARGET[2] * SCORE_MULTIPLIER) return 3
  if (score >= SCORE_TARGET[1] * SCORE_MULTIPLIER) return 2
  if (score >= SCORE_TARGET[0] * SCORE_MULTIPLIER) return 1

  return 0
}

export const resultStage = [stage1, stage2, stage3, stage4, stage5]
