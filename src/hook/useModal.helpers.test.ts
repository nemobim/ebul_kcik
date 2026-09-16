import { describe, expect, it } from 'vitest'
import { normalizeModalOptions, shouldCloseOnOverlayClick } from './useModal.helpers'

describe('normalizeModalOptions', () => {
  it('인자 없으면 기본값을 반환한다', () => {
    expect(normalizeModalOptions()).toEqual({ fullScreen: false, closeOnOverlayClick: true })
  })

  it('boolean 인자는 fullScreen 값으로 해석한다 (하위호환)', () => {
    expect(normalizeModalOptions(true)).toEqual({ fullScreen: true, closeOnOverlayClick: true })
    expect(normalizeModalOptions(false)).toEqual({ fullScreen: false, closeOnOverlayClick: true })
  })

  it('객체 인자를 그대로 반영하고 누락된 값은 기본값을 채운다', () => {
    expect(normalizeModalOptions({ fullScreen: true })).toEqual({ fullScreen: true, closeOnOverlayClick: true })
    expect(normalizeModalOptions({ closeOnOverlayClick: false })).toEqual({ fullScreen: false, closeOnOverlayClick: false })
    expect(normalizeModalOptions({ fullScreen: true, closeOnOverlayClick: false })).toEqual({ fullScreen: true, closeOnOverlayClick: false })
  })
})

describe('shouldCloseOnOverlayClick', () => {
  const overlay = { id: 'overlay' } as unknown as EventTarget
  const inner = { id: 'inner' } as unknown as EventTarget

  it('옵션이 꺼져 있으면 항상 false', () => {
    expect(shouldCloseOnOverlayClick(overlay, overlay, false)).toBe(false)
    expect(shouldCloseOnOverlayClick(inner, overlay, false)).toBe(false)
  })

  it('옵션이 켜져 있고 target === currentTarget 이면 true', () => {
    expect(shouldCloseOnOverlayClick(overlay, overlay, true)).toBe(true)
  })

  it('옵션이 켜져 있어도 모달 내부 클릭(target !== currentTarget)이면 false', () => {
    expect(shouldCloseOnOverlayClick(inner, overlay, true)).toBe(false)
  })
})
