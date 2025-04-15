import { Link } from 'react-router-dom'
import marker from '../../assets/tutorial/room/mark.png'
import roomImg from '../../assets/tutorial/room/my_room.webp'
import { useModal } from '../../hook/useModal'
const Room = ({ handleNextStep }: { handleNextStep: () => void }) => {
  //게임 진행여부 판단
  const isPlayedGame = localStorage.getItem('isPlay')

  const { Modal, showModal, hideModal } = useModal()

  const handleSkip = () => {
    showModal(
      <div className="flex w-[95%] flex-col gap-2 rounded-xl border-[3px] border-black bg-white p-3">
        <Link to="/game" className="btn bg-main1">
          {`> 새로운 이불 날리기`}
        </Link>
        <Link to="/content" className="btn bg-main1">
          {`> 이불동산 구경가기`}
        </Link>
        <button className="btn main2 mt-10" onClick={hideModal}>
          닫기
        </button>
      </div>,
    )
  }

  return (
    <div className="relative flex h-full flex-col items-center justify-center">
      <div className="relative w-[90%]">
        <img src={roomImg} alt="방" className="w-full" />
        <button onClick={handleNextStep}>
          <img src={marker} alt="마커" className="animate-jump absolute right-[20%] top-[40%] w-[20%] max-w-[80px]" />
        </button>
      </div>
      {isPlayedGame && (
        <button onClick={handleSkip} className="btn main3 absolute bottom-[10%] right-[10%] font-semibold">
          {`SKIP >`}
        </button>
      )}
      {Modal}
    </div>
  )
}

export default Room
