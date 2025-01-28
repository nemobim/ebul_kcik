import { useEffect } from 'react'
import wakeUser from '../../assets/tutorial/bed/wake.png'
import { useModal } from '../../hook/useModal'
import WorryContentModal from './Modal/WorryContentModal'

const WorryDump = () => {
  const { Modal, hideModal, showModal } = useModal(true)

  useEffect(() => {
    showModal(<WorryContentModal hideModal={hideModal} />)
  }, [showModal, hideModal])

  return (
    <div className="bg-tutorial flex h-full flex-col items-center justify-center">
      <div className="relative w-[90%]">
        <img src={wakeUser} alt="잠자는 사용자" className="w-full" />
      </div>
      {Modal}
    </div>
  )
}

export default WorryDump
