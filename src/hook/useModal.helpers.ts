export interface ModalOptions {
  fullScreen?: boolean
  closeOnOverlayClick?: boolean
}

export interface NormalizedModalOptions {
  fullScreen: boolean
  closeOnOverlayClick: boolean
}

/**
 * useModal 인자를 정규화한다.
 * 하위호환: 기존 `useModal(true)`처럼 boolean만 넘어오면 fullScreen 값으로 해석.
 * 신규: 객체를 넘겨 fullScreen·closeOnOverlayClick을 지정 가능.
 * 기본값: fullScreen=false, closeOnOverlayClick=true (모바일 기본 동작 유지)
 */
export const normalizeModalOptions = (input?: boolean | ModalOptions): NormalizedModalOptions => {
  if (typeof input === 'boolean') return { fullScreen: input, closeOnOverlayClick: true }
  return {
    fullScreen: input?.fullScreen ?? false,
    closeOnOverlayClick: input?.closeOnOverlayClick ?? true,
  }
}

/**
 * 오버레이 클릭이 모달을 닫아야 하는지 판정한다.
 * 옵션이 켜져 있고, 클릭 지점이 오버레이 자체(=e.currentTarget)일 때만 true.
 * 내부 요소로 이벤트가 버블링되어 온 경우(target !== currentTarget)는 닫지 않는다.
 */
export const shouldCloseOnOverlayClick = (target: EventTarget | null, currentTarget: EventTarget | null, closeOnOverlayClick: boolean): boolean => {
  if (!closeOnOverlayClick) return false
  return target === currentTarget
}
