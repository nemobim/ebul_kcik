import { describe, expect, it, vi } from 'vitest'
import { parseGameContent } from './validateContent'

const valid = {
  id: 'u1_123',
  user: '니니',
  userId: 'u1',
  score: 100,
  worryLabel: 'talk',
  content: '오늘의 흑역사',
  createdAt: { seconds: 1, nanoseconds: 0 },
  reactions: { shock: 0, laugh: 1, sad: 2 },
  reactionTotal: 3,
}

describe('parseGameContent', () => {
  it('유효한 문서를 그대로 반환한다', () => {
    expect(parseGameContent(valid)).toEqual(valid)
  })

  it('비정상 입력은 null을 반환한다', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(parseGameContent(null)).toBeNull()
    expect(parseGameContent('string')).toBeNull()
    expect(parseGameContent({ ...valid, score: '100' })).toBeNull() // score 타입 불일치
    expect(parseGameContent({ ...valid, worryLabel: 'hacking' })).toBeNull() // 허용 안 된 라벨
    expect(parseGameContent({ ...valid, reactions: { shock: 0 } })).toBeNull() // reaction 키 누락
    const missing = { ...valid, content: undefined }
    expect(parseGameContent(missing)).toBeNull() // content 누락
  })
})
