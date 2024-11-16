import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import sleepUserImg from '../../assets/sleep_user.png'
import { useModal } from '../../hook/useModal'

const WorryDump = () => {
  const { Modal, hideModal, showModal } = useModal()

  /** 고민 상태 */
  const [worry, setWorry] = useState({
    worryText: '',
    worryTheme: '',
  })

  /** 흑역사 조각 */
  const WORRY_THEMES = ['연애', '말실수', '어린시절', '술먹고실수', '회사', '학교', '가족', '덕질', '기타']

  /** 고민 적기 */
  const handleChangeWorry = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWorry(prev => ({ ...prev, worryText: e.target.value }))
  }

  /** 고민 테마 선택 */
  const handleSelectWorryTheme = (theme: string) => {
    setWorry(prev => ({ ...prev, worryTheme: theme }))
  }

  console.log(worry)

  /** 고민 적기 열기 */
  const handleShowWorryModal = () => {
    showModal({
      title: '고민 적기',
      children: (
        <div className="flex flex-col items-center justify-center gap-5">
          <h4 className="text-2xl">고민 적기</h4>
          <textarea onChange={handleChangeWorry} placeholder="고민을 적어주세요." className="h-[10rem] w-full border p-2 text-sm" />
          <div className="flex w-[20rem] flex-wrap gap-2">
            {WORRY_THEMES.map(theme => (
              <button
                onClick={() => handleSelectWorryTheme(theme)}
                key={theme}
                className={twMerge(
                  'rounded border px-4 py-2 transition-colors',
                  worry.worryTheme === theme ? 'border-red-500 bg-red-200 text-red-700' : 'border-gray-400 bg-gray-300 text-gray-600 hover:bg-gray-400',
                )}
              >
                {theme}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="rounded bg-gray-300 px-4 py-2" onClick={hideModal}>
              취소
            </button>
            <button className="rounded bg-blue-300 px-4 py-2 hover:bg-blue-400" onClick={hideModal}>
              작성완료
            </button>
          </div>
        </div>
      ),
    })
  }

  return (
    <div className="relative flex h-screen flex-col items-center justify-center gap-5 bg-black">
      {/* 배경 이미지 */}
      <img src={sleepUserImg} alt="잠자는 사용자" className="relative opacity-25" />
      <button onClick={handleShowWorryModal} className="absolute right-[7rem] top-[24rem] rounded-full bg-white px-8 py-2 text-amber-300 hover:scale-150 hover:text-red-500">
        <span className="blink text-3xl">!</span>
      </button>
      {Modal}
    </div>
  )
}

export default WorryDump
