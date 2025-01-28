import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import bottomBlock from '../../assets/tutorial/door/bottom.png'
import doorClose from '../../assets/tutorial/door/doorclose.png'
import doorOpen from '../../assets/tutorial/door/dooropen.png'
import pointer from '../../assets/tutorial/door/pointer.png'
import questionMark from '../../assets/tutorial/door/question.png'
import { useModal } from '../../hook/useModal'
import RoomNameModal from '../game/Modal/RoomNameModal'

const Door = ({ handleNextStep }: { handleNextStep: () => void }) => {
  const { Modal, showModal, hideModal } = useModal()

  //TODO: 닉네임 저장
  const [roomName, setRoomName] = useState<string>('')

  //문 바꿔치기
  const [isDoorOpen, setIsDoorOpen] = useState(false)

  /**닉네임 받아오기 모달 표시 */
  const showNicknameModal = () => {
    showModal(<RoomNameModal hideModal={hideModal} roomName={roomName} setRoomName={setRoomName} />)
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

  /**닉네임 설정 */
  useEffect(() => {
    const storedName = localStorage.getItem('nickname') || ''
    setRoomName(storedName)
  }, [])

  return (
    <div className="relative flex h-full flex-col justify-center">
      {roomName && !isDoorOpen && <button onClick={showNicknameModal} className="btn absolute left-[10%] top-[10%] bg-gray2 text-lg">{`> 다시 작성`}</button>}
      <div className="relative">
        <img src={isDoorOpen ? doorOpen : doorClose} alt="방_문" className="relative z-[2] mx-auto w-[70%]" />
        <img src={bottomBlock} alt="바닥_벽돌" className={twMerge('absolute z-[1] w-full', isDoorOpen ? '-bottom-[40%]' : '-bottom-[50%]')} />
        {!isDoorOpen && (
          <>
            {roomName ? (
              <>
                <h2 className="absolute left-1/2 top-[32%] z-[3] -translate-x-1/2 -translate-y-1/2 font-semibold">{roomName}</h2>
                <button onClick={handleNext} className="animate-jump absolute bottom-[25%] right-[15%] z-[3] h-auto w-[20%] max-w-[5rem]">
                  <img src={pointer} alt="커서" />
                </button>
              </>
            ) : (
              <button onClick={showNicknameModal} className="animate-scale absolute left-1/2 top-[32%] z-[3] w-[12%] max-w-[5rem] -translate-x-1/2 -translate-y-1/2">
                <img src={questionMark} alt="닉네임 설정 버튼" />
              </button>
            )}
          </>
        )}
      </div>
      {/**벽돌 바닥 채우기 */}
      <div className="absolute bottom-0 h-[10rem] w-full bg-[#623345]" />
      {Modal}
    </div>
  )
}

export default Door
