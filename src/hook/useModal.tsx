import { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { twMerge } from 'tailwind-merge'

export const useModal = (isFullScreen?: boolean) => {
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null)
  const [isClosing, setIsClosing] = useState(false) // 모달 닫힘 상태를 관리
  const dialogRef = useRef<HTMLDivElement>(null)

  /** 모달 표시 */
  const showModal = useCallback((children: React.ReactNode) => {
    setModalContent(children)
    setIsClosing(false) // 모달이 열릴 때 닫힘 상태 초기화
  }, [])

  /** 모달 닫기 */
  const hideModal = useCallback(() => {
    setIsClosing(true) // 닫힘 애니메이션 트리거
  }, [])

  // 모달 열림 시 접근성 처리: 첫 focusable에 포커스, ESC 닫기, Tab 포커스 순환(focus trap)
  useEffect(() => {
    if (!modalContent || isClosing) return

    const dialog = dialogRef.current
    if (!dialog) return

    const previouslyFocused = document.activeElement as HTMLElement | null

    const getFocusable = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      )

    // 열릴 때 첫 focusable 요소로 포커스 이동
    const focusables = getFocusable()
    if (focusables.length > 0) focusables[0].focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hideModal()
        return
      }
      if (e.key !== 'Tab') return

      const items = getFocusable()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus?.() // 모달 닫힌 뒤 이전 포커스 복원
    }
  }, [modalContent, isClosing, hideModal])

  /** 모달 컴포넌트 */
  const Modal =
    modalContent &&
    ReactDOM.createPortal(
      <div
        className={twMerge(`fixed inset-0 z-50 mx-auto flex max-w-md items-center justify-center bg-black/50`, isClosing ? 'fade_out' : 'fade_in')}
        onAnimationEnd={() => {
          if (isClosing) {
            setModalContent(null) // 애니메이션이 끝난 후 모달 제거
          }
        }}
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          id="alert-box"
          className={twMerge(`flex w-[90%] items-center justify-center`, isClosing ? 'slide_out' : 'slide_in', isFullScreen && 'h-[90%] max-h-[900px]')}
        >
          {modalContent}
        </div>
      </div>,
      document.body,
    )

  return { Modal, showModal, hideModal }
}
