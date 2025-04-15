import { useNavigate } from 'react-router-dom'
import { useSaveScore } from '../../../api/firebaseApi'
import { TGameState } from '../../../page/Game'
import { getRankImg } from '../../../utils/rank'
import { worryImage } from '../../../utils/worry'

const ResultModal = ({ gameState, initGame, nickname, uniqueId }: { gameState: TGameState; initGame: () => void; nickname: string; uniqueId: string }) => {
  const navigate = useNavigate()
  const { mutate: saveScore, isPending } = useSaveScore()

  //게임 상태가 없으면 모달 안 띄우기
  if (!gameState?.worryLabel) return null

  /**게임 점수 저장 */
  const saveTheScore = async () => {
    if (!nickname || !uniqueId || !gameState.worryLabel || !gameState.content || !gameState.score) return alert('게임 과정 중 오류가 발생했습니다. 다시 시도해주세요.')

    saveScore(
      { nickname, uniqueId, gameState },
      {
        onSuccess: () => {
          navigate('/ranking')
        },
        onError: err => {
          console.error('에러 발생:', err)
          alert('게임 저장 과정 중 오류가 발생했습니다. 다시 시도해주세요.')
        },
      },
    )
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div
        style={{ backgroundImage: `url(${worryImage[gameState?.worryLabel].bgImg})` }}
        className="flex h-full min-h-[20rem] w-[80%] flex-col items-center justify-center rounded-xl border-[3px] border-black px-4 text-xl"
      >
        <p>
          <span className="mr-1 font-galmuri9 text-2xl font-semibold">{gameState?.user}</span>
          님의 생각들이
        </p>
        <p>방금 이불과 함께</p>
        <p>저 멀리 날라갔습니다.</p>
        <div className="mt-10 flex w-full items-center justify-between px-5">
          <p className="font-galmuri9 text-[2.5rem] leading-[3rem] text-main3">{gameState?.score}m</p>
          <img src={getRankImg(gameState?.score)} className="w-[4.5rem]" alt={gameState?.worryLabel} />
        </div>
      </div>
      <div className="mt-5 flex w-[80%] items-center gap-5 text-lg">
        <button onClick={initGame} className="w-[35%] text-white">
          재도전
        </button>
        <button disabled={isPending} onClick={saveTheScore} className="btn main3 w-[65%] text-center">{`랭킹보기 >`}</button>
      </div>
    </div>
  )
}

export default ResultModal
