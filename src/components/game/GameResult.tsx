import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import blanket from '../../assets/game/result/blanket.png'
import { useModal } from '../../hook/useModal'
import { TGameState } from '../../page/Game'
import { getResultStage, resultStage } from '../../utils/rank'
import ResultModal from './Modal/ResultModal'

const GameResult = ({ gameState, initGame }: { gameState: TGameState; initGame: () => void }) => {
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
      showModal(<ResultModal gameState={gameState} initGame={initGame} />)
    }, 1000)
  }

  return (
    <div className="relative h-full w-full">
      <img
        src={resultStage[stage]}
        alt="background"
        className="absolute left-0 top-0 h-full w-full object-cover"
        style={{ objectFit: 'contain' }} // 비율 유지, 여백 없이 꽉 채우기
      />
      <img
        key={stage} // key 변경하여 컴포넌트 리렌더링 유도
        src={blanket}
        alt="blanket"
        onAnimationEnd={handleAnimationEnd}
        className={twMerge('absolute bottom-0 left-1/2', stage === targetStage ? 'animate-blanket-stop' : 'animate-blanket')} // 동적 클래스 적용
      />
      {Modal}
    </div>
  )
}

export default GameResult
