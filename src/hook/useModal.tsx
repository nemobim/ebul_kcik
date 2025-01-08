import { useState } from 'react'
import ReactDOM from 'react-dom'
import { twMerge } from 'tailwind-merge'

export const useModal = () => {
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null)
  const [isClosing, setIsClosing] = useState(false) // 모달 닫힘 상태를 관리

  /** 모달 표시 */
  const showModal = (children: React.ReactNode) => {
    setModalContent(children)
    setIsClosing(false) // 모달이 열릴 때 닫힘 상태 초기화
  }

  /** 모달 닫기 */
  const hideModal = () => {
    setIsClosing(true) // 닫힘 애니메이션 트리거
  }

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
        <div id="alert-box" className={twMerge(`w-[85%]`, isClosing ? 'slide_out' : 'slide_in')}>
          {modalContent}
        </div>
      </div>,
      document.body,
    )

  return { Modal, showModal, hideModal }
}
