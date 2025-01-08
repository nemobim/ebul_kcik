import bottomBlock from '../../assets/tutorial/block.png'
import closeDoorImg from '../../assets/tutorial/doorclose.png'
import bottomLight from '../../assets/tutorial/light.png'
import questionMark from '../../assets/tutorial/question_mark.png'
import { useModal } from '../../hook/useModal'
import RoomNameModal from '../game/Modal/RoomNameModal'

const Door = ({ handleNextStep }: { handleNextStep: () => void }) => {
  const { Modal, showModal, hideModal } = useModal()

  const handleShowNicknameModal = () => {
    showModal(<RoomNameModal hideModal={hideModal} />)
  }

  return (
    <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#32193e] to-[#79707f]">
      {/* 문과 빛 */}
      <div className="relative z-10 mt-[14rem] flex flex-col items-center">
        <img src={closeDoorImg} alt="닫힌_문" className="w-[90%] max-w-[20rem]" />
        <button onClick={handleShowNicknameModal}>
          <img src={questionMark} alt="물음표" className="animate-scale absolute top-[9rem] h-auto w-[3rem]" />
        </button>
        <img src={bottomLight} alt="바닥_빛" className="w-[110%] max-w-[26rem]" />
      </div>

      {/* 벽돌 바닥 */}
      <div
        className="absolute left-0 right-0 z-0"
        style={{
          top: 'calc(50% + 13rem)', // 문과 빛 아래부터 시작 (문과 빛의 높이를 포함)
          bottom: 0, // 화면의 하단까지 채우기
          backgroundImage: `url(${bottomBlock})`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'contain',
        }}
      />
      {Modal}
    </div>
  )
}

export default Door
