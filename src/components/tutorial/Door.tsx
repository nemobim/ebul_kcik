import { useState } from 'react'
import doorImg from '../../assets/door.png'
import { useModal } from '../../hook/useModal'

const Door = ({ handleNextStep }: { handleNextStep: () => void }) => {
  const { Modal, showModal, hideModal } = useModal()

  const [nickname, setNickname] = useState({
    value: '',
    fixedNickname: localStorage.getItem('nickname') || '',
  })

  /**닉네임 받아오기 */
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(prev => ({ ...prev, value: e.target.value }))
  }

  /**닉네임 설정 */
  const handleSetNickname = () => {
    setNickname(prev => {
      const newNickname = prev.value
      localStorage.setItem('nickname', newNickname) // 상태 업데이트 이전에 저장
      return { ...prev, fixedNickname: newNickname }
    })

    hideModal()
  }

  const handleShowNicknameModal = () => {
    showModal({
      title: 'ROOM',
      children: (
        <div className="flex flex-col items-center justify-center gap-5 bg-orange-400">
          <h4 className="text-2xl">ROOM</h4>
          <input placeholder="닉네임을 적어주세요." onChange={handleChangeName} />
          <div className="flex gap-2">
            <button className="rounded bg-gray-300 px-4 py-2" onClick={hideModal}>
              취소
            </button>
            <button className="rounded bg-blue-300 px-4 py-2 hover:bg-blue-400" onClick={handleSetNickname}>
              작성완료
            </button>
          </div>
        </div>
      ),
    })
  }

  return (
    <div className="relative flex h-screen items-center justify-center bg-black">
      <img src={doorImg} alt="문" className="h-[20rem] w-[10rem] opacity-80" onClick={handleNextStep} />
      <div className="absolute top-[42%]">
        {nickname.fixedNickname ? (
          <p className="text-white">{nickname.fixedNickname}</p>
        ) : (
          <button
            onClick={handleShowNicknameModal}
            className="glow-animation bg-transparent text-3xl font-bold transition-transform duration-300 hover:scale-150 hover:animate-none hover:text-yellow-300"
          >
            ?
          </button>
        )}
      </div>
      {nickname.fixedNickname && <i className="ri-cursor-fill glow-animation absolute bottom-[26rem] right-[9.5rem] text-3xl"></i>}
      {Modal}
    </div>
  )
}

export default Door
