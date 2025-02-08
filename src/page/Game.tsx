import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GameResult from '../components/game/GameResult'
import KickEbul from '../components/game/KickEbul'
import WorryDump from '../components/game/WorryDump'
import { TworryLabel } from '../utils/worry'

export type TGameState = {
  worryLabel: TworryLabel | undefined
  score: number
  user: string
}

const Game = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  //게임 상태 관리
  const [gameState, setGameState] = useState<TGameState>({
    worryLabel: undefined,
    score: 0,
    user: '',
  })

  /**다음 단계로 넘기기 */
  const handleNextStep = () => {
    setStep(prev => prev + 1)
  }

  /**게임 초기화 */
  const initGame = () => {
    setGameState(prev => ({ ...prev, score: 0 }))
    setStep(1)
  }

  useEffect(() => {
    const nickname = localStorage.getItem('nickname')
    if (nickname) {
      setGameState(prev => ({ ...prev, user: nickname }))
    } else {
      navigate('/')
    }
  }, [navigate])

  /**튜토리얼 스텝
   * 0: 고민 적기
   * 1: 게임 시작
   * 2: 이불 날리기(결과)
   */
  const gameSteps = [
    <WorryDump handleNextStep={handleNextStep} setGameState={setGameState} />,
    <KickEbul handleNextStep={handleNextStep} setGameState={setGameState} />,
    <GameResult gameState={gameState} initGame={initGame} />,
  ]

  return <div className="h-full w-full">{gameSteps[step]}</div>
}

export default Game
