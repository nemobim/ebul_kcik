import { describe, expect, it, vi } from 'vitest'
import { parseScoreEntry } from './validateScore'

const valid = {
  userId: 'u1',
  user: '니니',
  score: 250,
  updatedAt: { seconds: 1, nanoseconds: 0 },
}

describe('parseScoreEntry', () => {
  it('유효한 문서에 id를 붙여 반환한다', () => {
    expect(parseScoreEntry('u1', valid)).toEqual({ id: 'u1', ...valid })
  })

  it('비정상 입력은 null을 반환한다', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(parseScoreEntry('u1', null)).toBeNull()
    expect(parseScoreEntry('u1', 'string')).toBeNull()
    expect(parseScoreEntry('u1', { ...valid, score: '100' })).toBeNull()
    expect(parseScoreEntry('u1', { ...valid, user: 123 })).toBeNull()
    expect(parseScoreEntry('u1', { ...valid, updatedAt: undefined })).toBeNull()
  })
})
