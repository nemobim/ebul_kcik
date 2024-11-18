import { useState } from 'react'
import sleepUserImg from '../../assets/sleep_user.png'
import { useModal } from '../../hook/useModal'
import WorryWrite from './Modal/WorryWrite'

const WorryDump = ({ handleNextStep }: { handleNextStep: () => void }) => {
  const { Modal, hideModal, showModal } = useModal()

  const [worryContent, setWorryContent] = useState<{
    worryText: string
    worryTheme: string
  }>({
    worryText: '',
    worryTheme: '',
  })

  /** 고민 적기 열기 */
  const handleShowWorryModal = () => {
    showModal({
      title: '고민 적기',
      children: <WorryWrite hideModal={hideModal} worryContent={worryContent} setWorryContent={setWorryContent} />,
    })
  }

  return (
    <div className="relative flex h-screen flex-col items-center justify-center gap-5 bg-black">
      {worryContent.worryText && (
        <div className="w-[80%] rounded-lg bg-white p-4">
          <div className="whitespace-pre-line">{worryContent.worryText}</div>
          <span className="text-sm text-slate-600">라는 생각이 머리 속에서 벗어나질 않아!</span>
        </div>
      )}
      {/* 배경 이미지 */}
      <img src={sleepUserImg} alt="잠자는 사용자" className="relative opacity-25" />
      {!worryContent.worryText ? (
        <button onClick={handleShowWorryModal} className="absolute right-[7rem] top-[24rem] rounded-full bg-white px-8 py-2 text-amber-300 hover:scale-150 hover:text-red-500">
          <span className="blink text-3xl">!</span>
        </button>
      ) : (
        <>
          <p className="text-slate-200">이 다음부터는 글 수정이 어려워요.</p>
          <div className="flex gap-2">
            <button className="bg-zinc-200 p-2" onClick={handleShowWorryModal}>
              다시 작성
            </button>
            <button className="bg-red-200 p-2" onClick={handleNextStep}>
              다음
            </button>
          </div>
        </>
      )}

      {Modal}
    </div>
  )
}

export default WorryDump
