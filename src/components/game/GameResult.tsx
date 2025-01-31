import { TGameState } from '../../page/Game'
import blanket from '../../assets/game/result/blanket.png'
import stage1 from '../../assets/game/result/stage1.png'
import { useModal } from '../../hook/useModal'
import ResultModal from './Modal/ResultModal'

const GameResult = ({ gameState, initGame }: { gameState: TGameState; initGame: () => void }) => {
  const { showModal, Modal } = useModal()

  /**결과 모달 */
  const showResultModal = () => {
    //1초 후에 모달 열기
    setTimeout(() => {
      showModal(<ResultModal gameState={gameState} initGame={initGame} />)
    }, 1000)
  }

  return (
    <div className="h-full w-full">
      {gameState?.hitCount <= 80 && (
        <div className="relative h-full w-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${stage1})` }}>
          <img
            src={blanket}
            alt="blanket"
            onAnimationEnd={showResultModal}
            className="animate-blanket absolute bottom-0 left-1/2"
            style={{ '--max-height': `60vh` } as React.CSSProperties} // CSS 변수 동적 설정
          />
        </div>
      )}
      {Modal}
    </div>
  )
}

export default GameResult
