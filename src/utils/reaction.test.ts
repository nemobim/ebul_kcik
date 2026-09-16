import { describe, expect, it } from 'vitest'
import { deriveUserReactions, isOwnerContent, REACTION_KEYS } from './reaction'

describe('isOwnerContent', () => {
  it('내 uniqueId와 글 작성자 userId가 같으면 true', () => {
    expect(isOwnerContent('u1', 'u1')).toBe(true)
  })

  it('다르면 false', () => {
    expect(isOwnerContent('u1', 'u2')).toBe(false)
  })

  it('내 uniqueId가 null이면 false (session 확인 불가 상태)', () => {
    expect(isOwnerContent(null, 'u2')).toBe(false)
  })

  it('빈 문자열 동등도 false 처리 — 잘못된 값끼리의 우연 일치를 owner로 보지 않는다', () => {
    expect(isOwnerContent('', '')).toBe(false)
  })
})

describe('deriveUserReactions', () => {
  it('문서 데이터에서 true인 reaction만 눌린 상태로 반환', () => {
    expect(deriveUserReactions({ shock: true, laugh: false })).toEqual({
      shock: true,
      laugh: false,
      sad: false,
    })
  })

  it('undefined/null 입력은 모두 false로 정규화', () => {
    expect(deriveUserReactions(null)).toEqual({ shock: false, laugh: false, sad: false })
    expect(deriveUserReactions(undefined)).toEqual({ shock: false, laugh: false, sad: false })
  })

  it('허용된 3개 키만 판별하며 그 외 필드는 무시', () => {
    expect(deriveUserReactions({ shock: true, unknown: true })).toEqual({
      shock: true,
      laugh: false,
      sad: false,
    })
  })

  it('non-boolean truthy 값은 안전하게 false 처리 (예상치 못한 스키마 방어)', () => {
    expect(deriveUserReactions({ shock: 1 as unknown as boolean })).toEqual({
      shock: false,
      laugh: false,
      sad: false,
    })
  })

  it('REACTION_KEYS는 shock/laugh/sad 3개', () => {
    expect(REACTION_KEYS).toEqual(['shock', 'laugh', 'sad'])
  })
})
