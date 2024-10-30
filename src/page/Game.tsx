import { useState } from 'react'

const Game = () => {
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
      <div className="h-[20rem] w-[10rem] rounded-sm bg-amber-800">
        <div className="mx-auto mt-10 w-[5rem] bg-amber-100 text-center">
          <button onClick={handleSetNickname}>{nickname || '?'}</button>
        </div>
      </div>
      {nickname && (
        <div className="mt-10 text-center">
          <p>해당 닉네임으로 진행하시겠습니까?</p>
          <button className="mt-5 rounded-sm bg-slate-200 px-5 py-2">게임 시작</button>
        </div>
      )}
    </div>
  )
}

export default Game
