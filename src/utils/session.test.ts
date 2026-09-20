import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * session 유틸의 방어 동작을 검증한다.
 *
 * 각 테스트는 vi.resetModules로 세션 모듈을 다시 import 해서
 * 모듈 스코프의 메모리 폴백 Map이 이전 테스트 상태에 영향받지 않도록 격리한다.
 */

type Store = Record<string, string>

function makeLocalStorage(store: Store): Storage {
  return {
    get length() {
      return Object.keys(store).length
    },
    clear: () => {
      for (const k of Object.keys(store)) delete store[k]
    },
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => {
      store[k] = v
    },
    removeItem: (k: string) => {
      delete store[k]
    },
    key: (i: number) => Object.keys(store)[i] ?? null,
  }
}

function makeThrowingLocalStorage(): Storage {
  return {
    length: 0,
    clear: () => {
      throw new Error('blocked')
    },
    getItem: () => {
      throw new Error('blocked')
    },
    setItem: () => {
      throw new Error('blocked')
    },
    removeItem: () => {
      throw new Error('blocked')
    },
    key: () => null,
  }
}

async function loadSession() {
  vi.resetModules()
  const mod = await import('./session')
  return mod.session
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('session — 정상 localStorage 환경', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', makeLocalStorage({}))
    vi.stubGlobal('crypto', {
      randomUUID: () => '00000000-0000-4000-8000-000000000001',
    })
  })

  it('setNickname/getNickname 왕복 저장·조회가 동작한다', async () => {
    const session = await loadSession()
    expect(session.getNickname()).toBeNull()
    session.setNickname('테스터')
    expect(session.getNickname()).toBe('테스터')
  })

  it('ensureUniqueId는 최초 호출 시 uuid를 생성·저장하고, 이후 호출은 같은 값을 돌려준다', async () => {
    const session = await loadSession()
    const first = session.ensureUniqueId()
    expect(first).toBe('00000000-0000-4000-8000-000000000001')
    expect(session.getUniqueId()).toBe(first)
    expect(session.ensureUniqueId()).toBe(first)
  })

  it('hasIdentity는 닉네임과 uniqueId가 모두 있을 때 true', async () => {
    const session = await loadSession()
    expect(session.hasIdentity()).toBe(false)
    session.setNickname('n')
    expect(session.hasIdentity()).toBe(false)
    session.ensureUniqueId()
    expect(session.hasIdentity()).toBe(true)
  })
})

describe('session — localStorage 접근이 예외를 던지는 환경', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', makeThrowingLocalStorage())
    vi.stubGlobal('crypto', {
      randomUUID: () => '00000000-0000-4000-8000-000000000002',
    })
  })

  it('getNickname/getUniqueId/getLastPlayId는 예외 대신 null을 돌려준다', async () => {
    const session = await loadSession()
    expect(session.getNickname()).toBeNull()
    expect(session.getUniqueId()).toBeNull()
    expect(session.getLastPlayId()).toBeNull()
  })

  it('setNickname/setLastPlayId는 예외를 던지지 않고, 세션 안에서는 메모리 폴백으로 다시 읽힌다', async () => {
    const session = await loadSession()
    expect(() => session.setNickname('메모리')).not.toThrow()
    expect(() => session.setLastPlayId('doc-1')).not.toThrow()
    expect(session.getNickname()).toBe('메모리')
    expect(session.getLastPlayId()).toBe('doc-1')
  })

  it('ensureUniqueId는 저장이 실패해도 값을 반환하며, 같은 세션 내 재호출 시 동일 값을 유지한다', async () => {
    const session = await loadSession()
    const id = session.ensureUniqueId()
    expect(id).toMatch(/^[0-9a-f-]{8,}/)
    expect(session.ensureUniqueId()).toBe(id)
  })
})

describe('session — crypto.randomUUID 미지원 환경', () => {
  it('randomUUID가 없으면 getRandomValues 기반 RFC4122 v4 포맷을 생성한다', async () => {
    vi.stubGlobal('localStorage', makeLocalStorage({}))
    // getRandomValues만 지원. 결정적 바이트로 형식 검증
    vi.stubGlobal('crypto', {
      getRandomValues: <T extends ArrayBufferView>(buf: T): T => {
        const view = buf as unknown as Uint8Array
        for (let i = 0; i < view.length; i++) view[i] = i + 1
        return buf
      },
    })
    const session = await loadSession()
    const id = session.ensureUniqueId()
    // RFC4122 v4 정규식: xxxxxxxx-xxxx-4xxx-[89ab]xxx-xxxxxxxxxxxx
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })

  it('crypto가 아예 없어도 timestamp+random 폴백으로 non-empty 문자열을 반환한다', async () => {
    vi.stubGlobal('localStorage', makeLocalStorage({}))
    vi.stubGlobal('crypto', undefined)
    const session = await loadSession()
    const id = session.ensureUniqueId()
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
  })
})
