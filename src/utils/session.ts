/**
 * localStorage 기반 세션 helper
 *
 * nickname/uniqueId/isPlay 키와 접근 로직을 한곳에 모아 흩어진 문자열 사용을 제거한다.
 * (인증 수단이 아니며, 보안 경계는 Firestore Rules가 담당 — firestore.rules 참고)
 *
 * localStorage 차단·용량 초과 환경(iOS Safari private mode, 사이트 데이터 차단 등)에서도
 * 앱이 오류 화면으로 빠지지 않도록 모든 접근을 try/catch로 감싸고 메모리 폴백을 둔다.
 * 폴백은 같은 세션(탭 수명) 동안만 유효하며 새로고침 시 사라진다.
 */
const KEYS = {
  nickname: 'nickname',
  uniqueId: 'uniqueId',
  lastPlayId: 'isPlay', // 가장 최근 플레이 docId (내 순위 조회용)
} as const

const memoryStore = new Map<string, string>()

function safeGet(key: string): string | null {
  try {
    const v = globalThis.localStorage?.getItem(key)
    if (v != null) return v
  } catch {
    // storage 차단·예외 → 메모리 폴백으로 fall through
  }
  return memoryStore.has(key) ? memoryStore.get(key)! : null
}

function safeSet(key: string, value: string): void {
  memoryStore.set(key, value)
  try {
    globalThis.localStorage?.setItem(key, value)
  } catch {
    // 저장 실패는 무시. 메모리 폴백만 유지되며, 이 사실은 콘솔 경고로 한 번만 알림
    warnStorageUnavailableOnce()
  }
}

let warned = false
function warnStorageUnavailableOnce(): void {
  if (warned) return
  warned = true
  // 사용자 대상 UI 안내(토스트 등)는 후속 이슈로 분리
  console.warn('[session] localStorage에 저장할 수 없어 이번 세션에서만 임시로 유지됩니다.')
}

function generateUniqueId(): string {
  const c = globalThis.crypto as Crypto | undefined
  if (c && typeof c.randomUUID === 'function') {
    try {
      return c.randomUUID()
    } catch {
      // 일부 환경에서 secure context 아님 등으로 throw할 수 있음 → 다음 폴백으로
    }
  }
  if (c && typeof c.getRandomValues === 'function') {
    try {
      const bytes = new Uint8Array(16)
      c.getRandomValues(bytes)
      // RFC 4122 v4: version과 variant 비트 세팅
      bytes[6] = (bytes[6] & 0x0f) | 0x40
      bytes[8] = (bytes[8] & 0x3f) | 0x80
      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
    } catch {
      // 다음 폴백으로
    }
  }
  // 최후 폴백: 보안·유일성 강한 보장이 아니라, 앱이 죽지 않도록 하는 것이 목적
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export const session = {
  getNickname: (): string | null => safeGet(KEYS.nickname),
  setNickname: (name: string): void => safeSet(KEYS.nickname, name),

  getUniqueId: (): string | null => safeGet(KEYS.uniqueId),

  /** uniqueId가 없으면 새로 생성해 저장한 뒤 반환한다 */
  ensureUniqueId: (): string => {
    const existing = safeGet(KEYS.uniqueId)
    if (existing) return existing
    const id = generateUniqueId()
    safeSet(KEYS.uniqueId, id)
    return id
  },

  getLastPlayId: (): string | null => safeGet(KEYS.lastPlayId),
  setLastPlayId: (docId: string): void => safeSet(KEYS.lastPlayId, docId),

  /** 닉네임과 uniqueId가 모두 있으면 게임 진입 가능한 상태로 본다 */
  hasIdentity: (): boolean => !!safeGet(KEYS.nickname) && !!safeGet(KEYS.uniqueId),
}
