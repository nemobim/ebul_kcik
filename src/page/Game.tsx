import { useState } from 'react'
import GameResult from '../components/game/GameResult'
import KickEbul from '../components/game/KickEbul'
import WorryDump from '../components/game/WorryDump'

const Game = () => {
  const [step, setStep] = useState(0)

  /**다음 단계로 넘기기 */
  const handleNextStep = () => {
    setStep(prev => prev + 1)
  }

  /**튜토리얼 스텝
   * 0: 고민 적기
   * 1: 게임 시작
   * 2: 이불 날리기
   */
  const gameSteps = [<WorryDump />, <KickEbul />, <GameResult />]

  return <div className="h-full w-full">{gameSteps[step]}</div>
}

export default Game
