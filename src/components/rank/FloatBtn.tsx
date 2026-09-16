import floatMark from '../../assets/rank/float_mark.png'
import upMark from '../../assets/rank/up_icon.png'

import { useModal } from '../../hook/useModal'
import InfoModal from './InfoModal'

type FloatBtnProps = {
  scrollRef: React.RefObject<HTMLDivElement>
  /** 하단 고정 요소(예: 내 등수 바)가 있을 때 겹치지 않도록 위로 밀어 배치한다. */
  raised?: boolean
}

const FloatBtn = ({ scrollRef, raised = false }: FloatBtnProps) => {
  const { showModal, hideModal, Modal } = useModal()

  /**정보 모달 열기 */
  const handleOpenModal = () => {
    showModal(<InfoModal hideModal={hideModal} />)
  }

  /**스크롤 최상단으로 이동 */
  const handleScrollToTop = () => {
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div className={`absolute right-0 z-10 flex max-w-[28rem] justify-end p-4 ${raised ? 'bottom-[4.5rem]' : 'bottom-0'}`}>
      <div className="flex flex-col gap-2">
        <button onClick={handleScrollToTop} className="flex size-[4rem] items-center justify-center rounded-full border-[3px] border-black bg-main2 shadow-lg">
          <img src={upMark} className="w-[80%] max-w-[1.5rem]" alt="floatMark" />
        </button>
        <button onClick={handleOpenModal} className="flex size-[4rem] items-center justify-center rounded-full border-[3px] border-black bg-main3 shadow-lg">
          <img src={floatMark} className="w-[80%] max-w-[1.2rem]" alt="floatMark" />
        </button>
      </div>
      {Modal}
    </div>
  )
}

export default FloatBtn
