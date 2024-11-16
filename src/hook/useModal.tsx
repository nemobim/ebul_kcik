import { useState } from 'react'
import ReactDOM from 'react-dom'
import { twMerge } from 'tailwind-merge'

type TModal = {
  title: string
  children: React.ReactNode
}

export const useModal = () => {
  const [modalContent, setModalContent] = useState<TModal | null>(null)
  const [isClosing, setIsClosing] = useState(false) // 모달 닫힘 상태를 관리

  /** 모달 표시 */
  const showModal = ({ title, children }: TModal) => {
    setModalContent({ title, children })
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
        className={twMerge(`fixed inset-0 z-50 flex items-center justify-center bg-black/50`, isClosing ? 'fade_out' : 'fade_in')}
        onAnimationEnd={() => {
          if (isClosing) {
            setModalContent(null) // 애니메이션이 끝난 후 모달 제거
          }
        }}
      >
        <div id="alert-box" className={twMerge(`min-w-[25rem] max-w-[1200px] rounded bg-white shadow-lg`, isClosing ? 'slide_out' : 'slide_in')}>
          <div className="p-5">{modalContent.children}</div>
        </div>
      </div>,
      document.body,
    )

  return { Modal, showModal, hideModal }
}
