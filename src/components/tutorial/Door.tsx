import { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import bottomBlock from '../../assets/tutorial/door/bottom.webp'
import doorClose from '../../assets/tutorial/door/doorclose.webp'
import doorOpen from '../../assets/tutorial/door/dooropen.webp'
import pointer from '../../assets/tutorial/door/pointer.png'
import questionMark from '../../assets/tutorial/door/question.png'
import { useModal } from '../../hook/useModal'
import { session } from '../../utils/session'
import RoomNameModal from '../game/Modal/RoomNameModal'

const Door = ({ handleNextStep }: { handleNextStep: () => void }) => {
  const { Modal, showModal, hideModal } = useModal()

  const [roomName, setRoomName] = useState<string>('')

  //문 바꿔치기
  const [isDoorOpen, setIsDoorOpen] = useState(false)

  const transitionTimer = useRef<ReturnType<typeof setTimeout>>()

  /**닉네임 받아오기 모달 표시 */
  const showNicknameModal = () => {
    showModal(<RoomNameModal hideModal={hideModal} roomName={roomName} setRoomName={setRoomName} />)
  }

  /**다음 스텝 이동 */
  const handleNext = () => {
    if (roomName) {
      //이름 설정한 다음에만 가능
      setIsDoorOpen(true)
      //문 바꿔치기 후 1초 뒤에 이동
      transitionTimer.current = setTimeout(() => {
        handleNextStep()
      }, 1000)
    }
  }

  /**닉네임 설정 */
  useEffect(() => {
    setRoomName(session.getNickname() || '')
  }, [])

  /**입장시 고유 아이디 생성 */
  useEffect(() => {
    session.ensureUniqueId()
  }, [])

  // 문 열림 이미지(dooropen)를 미리 디코딩 — 클릭 후 1초 안에 다음 화면으로 전환되므로
  // 요청이 늦으면 열린 문을 못 본 채 화면이 넘어감. 실패해도 게임 진행은 막지 않음.
  useEffect(() => {
    const img = new Image()
    img.src = doorOpen
    img.decode().catch(() => {})
  }, [])

  // unmount 시 전환 타이머 정리 (언마운트 후 state update/이동 방지)
  useEffect(() => () => clearTimeout(transitionTimer.current), [])

  return (
    <div className="relative flex h-full flex-col justify-center">
      {roomName && !isDoorOpen && <button onClick={showNicknameModal} className="btn absolute left-[10%] top-[10%] bg-gray2 text-lg">{`> 이름 수정`}</button>}
      <div className="relative">
        {/* width/height는 로드 전 높이 예약용. 닫힘/열림 이미지 aspect가 미세히 달라 닫힘 기준으로 통일. */}
        <img src={isDoorOpen ? doorOpen : doorClose} width={278} height={397} alt="방_문" className="relative z-[2] mx-auto h-auto w-[70%]" />
        <img src={bottomBlock} width={448} height={232} alt="바닥_벽돌" className={twMerge('absolute z-[1] h-auto w-full', isDoorOpen ? '-bottom-[40%]' : '-bottom-[50%]')} />
        {!isDoorOpen && (
          <>
            {roomName ? (
              <>
                <h2 className="absolute left-1/2 top-[32%] z-[3] -translate-x-1/2 -translate-y-1/2 font-semibold">{roomName}</h2>
                <button onClick={handleNext} className="animate-jump absolute bottom-[25%] right-[15%] z-[3] h-auto w-[20%] max-w-[5rem]">
                  <img src={pointer} width={95} height={98} alt="커서" className="h-auto w-full" />
                </button>
              </>
            ) : (
              <button onClick={showNicknameModal} className="animate-scale absolute left-1/2 top-[32%] z-[3] w-[12%] max-w-[5rem] -translate-x-1/2 -translate-y-1/2">
                <img src={questionMark} width={54} height={86} alt="닉네임 설정 버튼" className="h-auto w-full" />
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
