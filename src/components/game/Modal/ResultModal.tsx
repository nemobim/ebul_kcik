import { Link } from 'react-router-dom'
import { TGameState } from '../../../page/Game'
import { getRankImg } from '../../../utils/rank'
import { worryImage } from '../../../utils/worry'

const ResultModal = ({ gameState, initGame }: { gameState: TGameState; initGame: () => void }) => {
  //게임 상태가 없으면 모달 안 띄우기
  if (!gameState?.worryLabel) return null

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        style={{ backgroundImage: `url(${worryImage[gameState?.worryLabel].bgImg})` }}
        className="flex h-full min-h-[20rem] flex-col items-center justify-center rounded-xl border-[3px] border-black px-4 text-[1.5rem]"
      >
        <p>이불과 함께</p>
        <p>
          <span className="font-galmuri9 text-[1.8rem]">{gameState?.user}</span>
          님의 흑역사가
        </p>
        <p>저 멀리 날라갔다!</p>
        <div className="mt-10 flex w-full items-end justify-end gap-5">
          <p className="font-galmuri9 text-[3rem] leading-[3rem] text-main3">{gameState?.score}m</p>
          <img src={getRankImg(gameState?.score)} className="w-[4.5rem]" alt={gameState?.worryLabel} />
        </div>
      </div>

      <div className="mt-5 flex w-[90%] items-center gap-5 text-lg">
        <button onClick={initGame} className="w-[30%] text-white">
          재도전
        </button>
        <Link to="/ranking" className="btn main3 w-[70%] text-center">{`랭킹보기 >`}</Link>
      </div>
    </div>
  )
}

export default ResultModal
