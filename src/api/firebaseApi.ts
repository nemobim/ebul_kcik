import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { collection, doc, getCountFromServer, getDoc, getDocs, increment, limit, orderBy, query, runTransaction, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { db } from '../firebase/firebaseClient'
import { TGameContent, TGameState, TSortType, TworryReaction } from '../types/game'
import { parseGameContent } from '../utils/validateContent'

/**게임 점수 등록 */
export const useSaveScore = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ nickname, uniqueId, gameState, docId }: { nickname: string; uniqueId: string; gameState: TGameState; docId: string }) => {
      await setDoc(doc(db, 'contents', docId), {
        id: docId,
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
    // 저장 직후 랭킹/내 순위/모아보기 캐시를 무효화해 최신 데이터 반영
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['TOP_RANKS'] })
      queryClient.invalidateQueries({ queryKey: ['MY_RANK_INFO'] })
      queryClient.invalidateQueries({ queryKey: ['GAME_CONTENT'] })
    },
  })
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
      return snapshot.docs.map(doc => parseGameContent(doc.data())).filter((c): c is TGameContent => c !== null)
    },
  })
}

/** 본인 순위 조회
 * @description 쿼리키 : MY_RANK
 */
export const useMyRankInfo = (myId: string | null) => {
  return useQuery({
    queryKey: ['MY_RANK_INFO', myId],
    queryFn: async () => {
      if (!myId) return null

      const docSnap = await getDoc(doc(db, 'contents', myId))
      if (!docSnap.exists()) return null

      const data = docSnap.data()
      const score = data.score

      const q = query(collection(db, 'contents'), where('score', '>', score))
      const countSnap = await getCountFromServer(q)
      const rank = countSnap.data().count + 1

      return {
        rank,
        myScore: score,
        user: data.user,
      }
    },
    enabled: !!myId,
  })
}

/** 게임 내용 조회 */
export const useGetGameContent = (sortBy: TSortType) => {
  return useQuery<TGameContent[]>({
    queryKey: ['GAME_CONTENT', sortBy],
    queryFn: async () => {
      const q = query(collection(db, 'contents'), orderBy(sortBy, 'desc'), limit(100))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => parseGameContent(doc.data())).filter((c): c is TGameContent => c !== null)
    },
  })
}

/**공감 버튼 누르기 */
export const useReactToContent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ contentId, contentUserId, reaction }: { contentId: string; contentUserId: string; reaction: TworryReaction }) => {
      const userId = localStorage.getItem('uniqueId')

      if (!userId) throw new Error('유저 정보를 찾을 수 없습니다.')
      if (userId === contentUserId) throw new Error('본인 글에는 공감을 누를 수 없습니다.')

      const reactionRef = doc(db, 'userReactions', `${userId}_${contentId}`) // 유저 리액션 기록
      const contentRef = doc(db, 'contents', contentId) // 게시물 기록

      // 중복 확인 → count 증가 → 기록 저장을 트랜잭션으로 원자 처리
      // (동시 요청 중복 통과 및 부분 성공으로 인한 중복 증가 방지)
      await runTransaction(db, async tx => {
        const snap = await tx.get(reactionRef) // 유저 리액션 기록 조회
        if (snap.exists() && snap.data()[reaction]) throw new Error('이미 이 글에 공감을 누르셨어요!')

        tx.update(contentRef, {
          [`reactions.${reaction}`]: increment(1),
          reactionTotal: increment(1),
        })
        tx.set(reactionRef, { [reaction]: true }, { merge: true })
      })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['GAME_CONTENT'] }),
    onError: (error: Error) => alert(error.message ?? '문제가 발생했습니다.'),
  })
}
