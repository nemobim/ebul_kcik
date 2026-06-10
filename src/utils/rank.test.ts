import { describe, expect, it } from 'vitest'
import { getRankImg, getResultStage, SCORE_MULTIPLIER } from './rank'

// 임계 hitCount [140,180,220,260] × SCORE_MULTIPLIER(3) = [420,540,660,780]
describe('getResultStage', () => {
  it('점수 구간별 stage를 반환한다', () => {
    expect(getResultStage(0)).toBe(0)
    expect(getResultStage(419)).toBe(0)
    expect(getResultStage(420)).toBe(1)
    expect(getResultStage(539)).toBe(1)
    expect(getResultStage(540)).toBe(2)
    expect(getResultStage(659)).toBe(2)
    expect(getResultStage(660)).toBe(3)
    expect(getResultStage(779)).toBe(3)
    expect(getResultStage(780)).toBe(4)
    expect(getResultStage(9999)).toBe(4)
  })
})

describe('getRankImg', () => {
  it('같은 구간이면 동일 이미지, 임계 통과 시 다른 이미지를 반환한다', () => {
    expect(getRankImg(0)).toBe(getRankImg(419)) // hanger
    expect(getRankImg(0)).not.toBe(getRankImg(420)) // hanger ≠ star
    expect(getRankImg(420)).not.toBe(getRankImg(540))
    expect(getRankImg(540)).not.toBe(getRankImg(660))
    expect(getRankImg(660)).not.toBe(getRankImg(780))
  })
})

describe('SCORE_MULTIPLIER', () => {
  it('점수 배수는 3이다', () => {
    expect(SCORE_MULTIPLIER).toBe(3)
  })
})
