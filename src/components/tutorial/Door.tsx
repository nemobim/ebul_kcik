import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import bottomBlock from '../../assets/tutorial/door/block.png'
import cursor from '../../assets/tutorial/door/cursor.png'
import closeDoorImg from '../../assets/tutorial/door/doorclose.png'
import openDoorImg from '../../assets/tutorial/door/dooropen.png'
import bottomLight from '../../assets/tutorial/door/light.png'
import questionMark from '../../assets/tutorial/door/question_mark.png'
import { useModal } from '../../hook/useModal'
import RoomNameModal from '../game/Modal/RoomNameModal'

const Door = ({ handleNextStep }: { handleNextStep: () => void }) => {
  const { Modal, showModal, hideModal } = useModal()

  //TODO: 닉네임 저장
  const [roomName, setRoomName] = useState(localStorage.getItem('nickname') || '')

  //문 바꿔치기
  const [isDoorOpen, setIsDoorOpen] = useState(false)

  /**닉네임 받아오기 모달 표시 */
  const showNicknameModal = () => {
    showModal(<RoomNameModal hideModal={hideModal} setRoomName={setRoomName} />)
  }

  /**다음 스텝 이동 */
  const handleNext = () => {
    if (roomName) {
      //이름 설정한 다음에만 가능
      setIsDoorOpen(true)
      //문 바꿔치기 후 2초 뒤에 이동
      setTimeout(() => {
        handleNextStep()
      }, 1000)
    }
  }

  return (
    <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden">
      {/* 문과 빛 */}
      <div className={twMerge('relative z-[1] flex w-full flex-col items-center', isDoorOpen ? 'xxs:mt-[4rem] xs:mt-0' : 'mt-[14rem]')}>
        <img
          src={isDoorOpen ? openDoorImg : closeDoorImg}
          alt="닫힌_문"
          className={twMerge('h-auto w-[80%] max-w-[20rem]', roomName && 'cursor-pointer', isDoorOpen && 'z-[1]')}
          onClick={handleNext}
        />
        {!isDoorOpen && (
          <>
            {roomName ? (
              <h2 className="absolute top-[17%] font-semibold">{roomName}</h2>
            ) : (
              <button onClick={showNicknameModal}>
                <img src={questionMark} alt="물음표" className="animate-scale absolute top-[21%] h-auto w-[12%] max-w-[5rem]" />
              </button>
            )}
            {roomName && <img src={cursor} alt="커서" className="animate-jump absolute left-[30%] top-[41%] h-auto w-[15%] max-w-[4rem]" />}
          </>
        )}
        <img src={bottomLight} alt="바닥_빛" className={twMerge('w-[90%] max-w-[26rem]', isDoorOpen && 'absolute -bottom-[40%]')} />
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
