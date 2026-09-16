import { TScoreEntry } from '../types/game'

/**
 * Firestore scores 컬렉션에서 읽은 raw 데이터를 TScoreEntry로 검증한다.
 * 랭킹 표시에 필요한 필드가 하나라도 비정상이면 null을 반환해 UI 오류로 번지지 않게 격리한다.
 */
export const parseScoreEntry = (id: string, data: unknown): TScoreEntry | null => {
  if (typeof data !== 'object' || data === null) return null
  const d = data as Record<string, unknown>

  const isString = (v: unknown): v is string => typeof v === 'string'
  const isNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

  const updatedAt = d.updatedAt as Record<string, unknown> | undefined
  const updatedAtValid = !!updatedAt && typeof updatedAt === 'object' && isNumber(updatedAt.seconds)

  const valid = isString(d.userId) && isString(d.user) && isNumber(d.score) && updatedAtValid

  if (!valid) {
    console.warn('[validateScore] 비정상 문서 격리:', id)
    return null
  }

  return { id, ...(data as Omit<TScoreEntry, 'id'>) }
}
