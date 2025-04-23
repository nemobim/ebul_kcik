import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import blanket from '../../assets/game/result/blanket.png'
import { useModal } from '../../hook/useModal'
import { TGameState } from '../../types/game'
import { getResultStage, resultStage } from '../../utils/rank'
import ResultModal from './Modal/ResultModal'

const GameResult = ({ gameState, initGame, nickname, uniqueId }: { gameState: TGameState; initGame: () => void; nickname: string; uniqueId: string }) => {
  const { showModal, Modal } = useModal()
  const [stage, setStage] = useState(0)
  const targetStage = getResultStage(gameState.score) // 점수에 따른 목표 stage

  /** 애니메이션 종료 후 다음 단계로 이동 */
  const handleAnimationEnd = () => {
    if (stage < targetStage) {
      setTimeout(() => {
        setStage(prev => prev + 1) // 다음 스테이지로 변경
      }, 200) // 0.2초 후 애니메이션 재시작
    } else {
      showResultModal() // 모달 표시
    }
  }

  /** 결과 모달 표시 */
  const showResultModal = () => {
    setTimeout(() => {
      showModal(<ResultModal gameState={gameState} initGame={initGame} nickname={nickname} uniqueId={uniqueId} />)
    }, 1000)
  }

  return (
    <div
      className="relative h-full w-full"
      style={
        {
          '--stage-height': window.innerHeight > 900 ? '900px' : `${window.innerHeight}px`,
        } as React.CSSProperties
      }
    >
      <img src={resultStage[stage]} alt="background" className="absolute left-0 top-0 h-full w-full object-cover" style={{ objectFit: 'contain' }} />
      <img
        key={stage}
        src={blanket}
        alt="blanket"
        onAnimationEnd={handleAnimationEnd}
        className={twMerge('absolute bottom-0 left-1/2', stage === targetStage ? 'animate-blanket-stop' : 'animate-blanket')}
      />
      {Modal}
    </div>
  )
}

export default GameResult
