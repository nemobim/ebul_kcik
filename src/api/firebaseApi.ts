import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { collection, doc, getCountFromServer, getDoc, getDocs, increment, limit, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../firebase/firebaseClient'
import { TGameContent, TGameState, TSortType, TworryReaction } from '../types/game'

/**게임 점수 등록 */
export const useSaveScore = () => {
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
      return snapshot.docs.map(doc => doc.data() as TGameContent)
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
      return snapshot.docs.map(doc => doc.data() as TGameContent)
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

      const snap = await getDoc(reactionRef) // 유저 리액션 기록 조회
      const alreadyReacted = snap.exists() && snap.data()[reaction] // 이미 공감을 눌렀는지 확인

      if (alreadyReacted) throw new Error('이미 이 글에 공감을 누르셨어요!')

      // 리액션 숫자 증가
      await updateDoc(contentRef, {
        [`reactions.${reaction}`]: increment(1),
        reactionTotal: increment(1),
      })

      // 리액션 기록 저장
      await setDoc(reactionRef, { [reaction]: true }, { merge: true })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['GAME_CONTENT'] }),
    onError: (error: Error) => alert(error.message ?? '문제가 발생했습니다.'),
  })
}
