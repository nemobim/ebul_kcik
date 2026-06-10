import { TGameContent, TworryLabel } from '../types/game'

const WORRY_LABELS: TworryLabel[] = ['talk', 'young', 'school', 'work', 'alcohol', 'home', 'idol', 'heart', 'etc']
const REACTION_KEYS = ['shock', 'laugh', 'sad'] as const

/**
 * Firestore에서 읽은 raw 데이터를 TGameContent로 검증한다.
 * 누락 필드·타입 불일치·허용되지 않은 worryLabel을 가진 비정상 문서는 null을 반환하고
 * 콘솔에 경고를 남겨 UI 런타임 오류로 번지지 않도록 격리한다.
 */
export const parseGameContent = (data: unknown): TGameContent | null => {
  if (typeof data !== 'object' || data === null) return null
  const d = data as Record<string, unknown>

  const isString = (v: unknown): v is string => typeof v === 'string'
  const isNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

  const reactions = d.reactions as Record<string, unknown> | undefined
  const reactionsValid = !!reactions && REACTION_KEYS.every(k => isNumber(reactions[k]))

  // createdAt은 Firestore Timestamp(또는 { seconds, nanoseconds } 형태)로 저장된다.
  const createdAt = d.createdAt as Record<string, unknown> | undefined
  const createdAtValid = !!createdAt && typeof createdAt === 'object' && isNumber(createdAt.seconds)

  const valid =
    isString(d.id) &&
    isString(d.user) &&
    isString(d.userId) &&
    isNumber(d.score) &&
    isString(d.worryLabel) &&
    WORRY_LABELS.includes(d.worryLabel as TworryLabel) &&
    isString(d.content) &&
    createdAtValid &&
    reactionsValid &&
    isNumber(d.reactionTotal)

  if (!valid) {
    console.warn('[validateContent] 비정상 문서 격리:', d?.id ?? '(id 없음)')
    return null
  }

  return data as TGameContent
}
