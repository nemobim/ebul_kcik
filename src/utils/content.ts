import { TGameContent } from '../types/game'

/** 본인 랭킹 찾기 */
export const getMyRank = (ranks: TGameContent[], docId: string) => {
  const index = ranks.findIndex(r => r.id === docId)
  if (index === -1) return null

  return {
    rank: index + 1,
    content: ranks[index],
  }
}
