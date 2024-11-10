import { useState } from 'react'

const Door = ({ setStep }: { setStep: (step: number) => void }) => {
  /**닉네임 설정 */
  const [nickname, setNickname] = useState('')

  const handleSetNickname = () => {
    const nickname = prompt('닉네임을 입력하세요')
    if (nickname) {
      setNickname(nickname)
      localStorage.setItem('nickname', nickname) // 닉네임을 로컬스토리지에 저장
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center p-5">
      <img src="/images/door.png" alt="문" className="h-[20rem] w-[10rem]" />
      {nickname && (
        <div className="mt-10 text-center">
          <p>해당 닉네임으로 진행하시겠습니까?</p>
          <button className="mt-5 rounded-sm bg-slate-200 px-5 py-2">게임 시작</button>
        </div>
      )}
    </div>
  )
}

export default Door
