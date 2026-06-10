/**
 * 경량 toast 알림
 *
 * alert()를 대체한다. React 트리 밖(예: firebaseApi mutation onError)에서도 호출할 수 있도록
 * DOM에 직접 요소를 추가하며, Tailwind purge 영향을 받지 않도록 인라인 스타일을 사용한다.
 */
export const toast = (message: string): void => {
  if (typeof document === 'undefined') return

  const el = document.createElement('div')
  el.textContent = message
  el.setAttribute('role', 'status')
  Object.assign(el.style, {
    position: 'fixed',
    left: '50%',
    bottom: '2.5rem',
    transform: 'translateX(-50%)',
    maxWidth: '20rem',
    padding: '0.625rem 1rem',
    borderRadius: '0.5rem',
    background: 'rgba(31, 16, 42, 0.92)',
    color: '#ffffff',
    fontSize: '0.875rem',
    lineHeight: '1.4',
    textAlign: 'center',
    zIndex: '1000',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
    opacity: '0',
    transition: 'opacity 0.25s ease',
    pointerEvents: 'none',
  } as Partial<CSSStyleDeclaration>)

  document.body.appendChild(el)
  requestAnimationFrame(() => {
    el.style.opacity = '1'
  })

  setTimeout(() => {
    el.style.opacity = '0'
    setTimeout(() => el.remove(), 250)
  }, 2200)
}
