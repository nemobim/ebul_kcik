import { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import blanket from '../../assets/game/result/blanket.png'
import { useModal } from '../../hook/useModal'
import { TGameState } from '../../types/game'
import { getResultStage, resultStage } from '../../utils/rank'
import ResultModal from './Modal/ResultModal'

const GameResult = ({ gameState, initGame, nickname, uniqueId }: { gameState: TGameState; initGame: () => void; nickname: string; uniqueId: string }) => {
  const { showModal, Modal } = useModal()
  const [stage, setStage] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(() => window.innerHeight) // 회전·리사이즈 대응
  const targetStage = getResultStage(gameState.score) // 점수에 따른 목표 stage

  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  // 기기 회전·리사이즈 시 stage-height 갱신 (이불 비행 높이 calibration)
  useEffect(() => {
    const handleResize = () => setViewportHeight(window.innerHeight)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // stage 전환 깜빡임 방지를 위해 결과 이미지(stage 5장 + blanket)를 미리 디코딩
  useEffect(() => {
    ;[...resultStage, blanket].forEach(src => {
      const img = new Image()
      img.src = src
      img.decode().catch(() => {})
    })
  }, [])

  // unmount 시 진행 중인 타이머 정리 (언마운트 후 setStage/showModal 방지)
  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  /** 애니메이션 종료 후 다음 단계로 이동 */
  const handleAnimationEnd = () => {
    if (stage < targetStage) {
      timers.current.push(
        setTimeout(() => {
          setStage(prev => prev + 1) // 다음 스테이지로 변경
        }, 200), // 0.2초 후 애니메이션 재시작
      )
    } else {
      showResultModal() // 모달 표시
    }
  }

  /** 결과 모달 표시 */
  const showResultModal = () => {
    timers.current.push(
      setTimeout(() => {
        showModal(<ResultModal gameState={gameState} initGame={initGame} nickname={nickname} uniqueId={uniqueId} />)
      }, 1000),
    )
  }

  return (
    <div
      className="relative h-full w-full"
      style={
        {
          '--stage-height': viewportHeight > 900 ? '900px' : `${viewportHeight}px`,
        } as React.CSSProperties
      }
    >
      <img
        key={stage}
        src={resultStage[stage]}
        alt="background"
        className="animate-stage-fade absolute left-0 top-0 h-full w-full object-cover"
        style={{ objectFit: 'contain' }}
      />
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
