/**
 * localStorage 기반 세션 helper
 *
 * nickname/uniqueId/isPlay 키와 접근 로직을 한곳에 모아 흩어진 문자열 사용을 제거한다.
 * (인증 수단이 아니며, 보안 경계는 Firestore Rules가 담당 — SECURITY-PRIVACY.md 참고)
 */
const KEYS = {
  nickname: 'nickname',
  uniqueId: 'uniqueId',
  lastPlayId: 'isPlay', // 가장 최근 플레이 docId (내 순위 조회용)
} as const

export const session = {
  getNickname: (): string | null => localStorage.getItem(KEYS.nickname),
  setNickname: (name: string): void => localStorage.setItem(KEYS.nickname, name),

  getUniqueId: (): string | null => localStorage.getItem(KEYS.uniqueId),

  /** uniqueId가 없으면 새로 생성해 저장한 뒤 반환한다 */
  ensureUniqueId: (): string => {
    const existing = localStorage.getItem(KEYS.uniqueId)
    if (existing) return existing
    const id = crypto.randomUUID()
    localStorage.setItem(KEYS.uniqueId, id)
    return id
  },

  getLastPlayId: (): string | null => localStorage.getItem(KEYS.lastPlayId),
  setLastPlayId: (docId: string): void => localStorage.setItem(KEYS.lastPlayId, docId),

  /** 닉네임과 uniqueId가 모두 있으면 게임 진입 가능한 상태로 본다 */
  hasIdentity: (): boolean => !!localStorage.getItem(KEYS.nickname) && !!localStorage.getItem(KEYS.uniqueId),
}
