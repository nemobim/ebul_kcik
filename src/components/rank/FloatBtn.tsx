import floatMark from '../../assets/rank/float_mark.png'
import { useModal } from '../../hook/useModal'
import InfoModal from './InfoModal'

const FloatBtn = () => {
  const { showModal, hideModal, Modal } = useModal()

  const handleOpenModal = () => {
    showModal(<InfoModal hideModal={hideModal} />)
  }

  return (
    <div className="sticky bottom-0 flex w-full max-w-[28rem] justify-end p-4">
      <button onClick={handleOpenModal} className="flex size-[4rem] items-center justify-center rounded-full border-[3px] border-black bg-main3 shadow-lg">
        <img src={floatMark} className="w-[80%] max-w-[1.2rem]" alt="floatMark" />
      </button>
      {Modal}
    </div>
  )
}

export default FloatBtn
