import { TworryReaction } from '../types/game'

export const REACTION_KEYS: TworryReaction[] = ['shock', 'laugh', 'sad']

export type UserReactionState = Record<TworryReaction, boolean>

const EMPTY_STATE: UserReactionState = { shock: false, laugh: false, sad: false }

// 클라이언트 UX 판정용. 실제 방어는 useReactToContent의 서버 트랜잭션이 담당.
export const isOwnerContent = (myUniqueId: string | null | undefined, contentUserId: string): boolean => {
  if (!myUniqueId) return false
  return myUniqueId === contentUserId
}

export const deriveUserReactions = (data: Record<string, unknown> | null | undefined): UserReactionState => {
  if (!data || typeof data !== 'object') return { ...EMPTY_STATE }
  return REACTION_KEYS.reduce<UserReactionState>((acc, key) => {
    acc[key] = data[key] === true
    return acc
  }, { ...EMPTY_STATE })
}
