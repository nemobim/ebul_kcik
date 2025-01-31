import first from '../assets/rank/first.png'
import second from '../assets/rank/second.png'
import third from '../assets/rank/third.png'
import bat from '../assets/game/bat.png'
import UFO from '../assets/game/UFO.png'
import bird from '../assets/game/bird.png'
import hanger from '../assets/game/hanger.png'

export const rankImg = [first, second, third]

/**랭크에 맞는 이미지 반환 */
export const getRankImg = (score: number) => {
  if (score >= 170) return UFO
  if (score >= 140) return bird
  if (score >= 80) return bat
  return hanger
}
