import { useMutation, useQuery } from '@tanstack/react-query'
import { collection, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../firebase/firebaseClient'
import { TGameState } from '../page/Game'

/**게임 점수 등록 */
export const useSaveScore = () => {
  return useMutation({
    mutationFn: async ({ nickname, uniqueId, gameState }: { nickname: string; uniqueId: string; gameState: TGameState }) => {
      const docId = `${uniqueId}_${Date.now()}`

      await setDoc(doc(db, 'contents', docId), {
        user: nickname,
        userId: uniqueId,
        score: gameState.score,
        worryLabel: gameState.worryLabel,
        content: gameState.content,
        createdAt: serverTimestamp(),
        reactions: {
          shock: 0,
          laugh: 0,
          sad: 0,
        },
        reactionTotal: 0,
      })
    },
  })
}

export type TGameContent = {
  user: string
  userId: string
  score: number
  worryLabel: string
  content: string
  createdAt: string
  reactions: {
    shock: number
    laugh: number
    sad: number
  }
  reactionTotal: number
}

/**게임 랭킹 조회
 * @description 쿼리키 : TOP_RANKS
 */
export const useGetTopRanks = () => {
  return useQuery<TGameContent[]>({
    queryKey: ['TOP_RANKS'],
    queryFn: async () => {
      const q = query(collection(db, 'contents'), orderBy('score', 'desc'), limit(100))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => doc.data() as TGameContent)
    },
  })
}

/** 게임 내용 조회 */
export const useGetGameContent = (sortBy: 'score' | 'reactionTotal') => {
  return useQuery<TGameContent[]>({
    queryKey: ['GAME_CONTENT', sortBy],
    queryFn: async () => {
      const q = query(collection(db, 'contents'), orderBy(sortBy, 'desc'), limit(100))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => doc.data() as TGameContent)
    },
  })
}
