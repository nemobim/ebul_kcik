import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { collection, doc, getCountFromServer, getDoc, getDocs, increment, limit, orderBy, query, runTransaction, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { db } from '../firebase/firebaseClient'
import { TGameContent, TGameState, TScoreEntry, TSortType, TworryReaction } from '../types/game'
import { deriveUserReactions, UserReactionState } from '../utils/reaction'
import { session } from '../utils/session'
import { toast } from '../utils/toast'
import { parseGameContent } from '../utils/validateContent'
import { parseScoreEntry } from '../utils/validateScore'

/**게임 점수 등록
 *
 * contents(글 목록)는 플레이마다 누적, scores(랭킹 집계)는 사용자당 1건만 유지한다.
 * 두 컬렉션이 목적이 달라 분리했으며, contents 쓰기 실패 시 scores도 갱신하지 않는다.
 * scores upsert는 read-then-write이므로 runTransaction으로 감싸 동시 갱신 경쟁을 막는다.
 */
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

      const scoreRef = doc(db, 'scores', uniqueId)
      await runTransaction(db, async tx => {
        const snap = await tx.get(scoreRef)
        if (!snap.exists()) {
          tx.set(scoreRef, { userId: uniqueId, user: nickname, score: gameState.score, updatedAt: serverTimestamp() })
          return
        }
        const currentScore = snap.data().score
        if (typeof currentScore === 'number' && gameState.score > currentScore) {
          tx.update(scoreRef, { user: nickname, score: gameState.score, updatedAt: serverTimestamp() })
        }
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
 * scores 컬렉션에서 사용자당 1건씩 집계된 상태로 반환된다(클라이언트 dedupe 불필요).
 */
export const useGetTopRanks = () => {
  return useQuery<TScoreEntry[]>({
    queryKey: ['TOP_RANKS'],
    queryFn: async () => {
      const q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(100))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => parseScoreEntry(doc.id, doc.data())).filter((s): s is TScoreEntry => s !== null)
    },
  })
}

/** 본인 순위 조회
 * @description 쿼리키 : MY_RANK_INFO
 * scores 컬렉션 기준으로 조회한다 — 본인 이전 기록에 의해 등수가 밀리지 않는다.
 * @param myId 사용자의 uniqueId (scores 문서 id와 동일)
 */
export const useMyRankInfo = (myId: string | null) => {
  return useQuery({
    queryKey: ['MY_RANK_INFO', myId],
    queryFn: async () => {
      if (!myId) return null

      const docSnap = await getDoc(doc(db, 'scores', myId))
      if (!docSnap.exists()) return null

      const data = docSnap.data()
      const score = data.score

      const q = query(collection(db, 'scores'), where('score', '>', score))
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

/** 내가 이 글에 어떤 공감을 눌렀는지 조회 (모달 열 때 사용) */
export const useUserReaction = (contentId: string | null) => {
  const myId = session.getUniqueId()
  return useQuery<UserReactionState>({
    queryKey: ['USER_REACTION', myId, contentId],
    queryFn: async () => {
      if (!myId || !contentId) return deriveUserReactions(null)
      try {
        const snap = await getDoc(doc(db, 'userReactions', `${myId}_${contentId}`))
        return deriveUserReactions(snap.exists() ? snap.data() : null)
      } catch {
        // 조회 실패는 조용히 통과 — 게임/모달 진행을 막지 않는다
        return deriveUserReactions(null)
      }
    },
    enabled: !!contentId,
    staleTime: 5 * 60 * 1000,
  })
}

/**공감 버튼 누르기 */
export const useReactToContent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ contentId, contentUserId, reaction }: { contentId: string; contentUserId: string; reaction: TworryReaction }) => {
      const userId = session.getUniqueId()

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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['GAME_CONTENT'] })
      const myId = session.getUniqueId()
      queryClient.invalidateQueries({ queryKey: ['USER_REACTION', myId, variables.contentId] })
    },
    onError: (error: Error) => toast(error.message ?? '문제가 발생했습니다.'),
  })
}
