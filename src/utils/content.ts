import { TGameContent } from '../api/firebaseApi'

export const getMyRank = (ranks: TGameContent[], userId: string) => {
  const index = ranks.findIndex(r => r.userId === userId)
  if (index === -1) return null

  return {
    rank: index + 1,
    content: ranks[index],
  }
}
