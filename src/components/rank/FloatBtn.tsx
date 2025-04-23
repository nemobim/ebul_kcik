import floatMark from '../../assets/rank/float_mark.png'
import upMark from '../../assets/rank/up_icon.png'

import { useModal } from '../../hook/useModal'
import InfoModal from './InfoModal'

const FloatBtn = ({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement> }) => {
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
    <div className="absolute bottom-0 right-0 flex max-w-[28rem] justify-end p-4">
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
