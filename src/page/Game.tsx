import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import GameResult from '../components/game/GameResult'
import KickEbul from '../components/game/KickEbul'
import WorryDump from '../components/game/WorryDump'
import { TGameState } from '../types/game'

const Game = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  const nickname = localStorage.getItem('nickname')
  const uniqueId = localStorage.getItem('uniqueId')

  //게임 상태 관리
  const [gameState, setGameState] = useState<TGameState>({
    worryLabel: undefined,
    score: 0,
    user: '',
    content: '',
  })

  /**다음 단계로 넘기기 */
  const handleNextStep = useCallback(() => {
    setStep(prev => prev + 1)
  }, [])

  /**게임 초기화 */
  const initGame = useCallback(() => {
    setGameState(prev => ({ ...prev, score: 0 }))
    setStep(1)
  }, [])

  useEffect(() => {
    if (!nickname || !uniqueId) {
      navigate('/')
      return
    }

    setGameState(prev => ({ ...prev, user: nickname }))
  }, [navigate, nickname, uniqueId])

  // 닉네임이 없거나 고유 ID가 없으면 홈으로 이동
  if (!nickname || !uniqueId) return <Navigate to="/" />

  /**튜토리얼 스텝
   * 0: 고민 적기
   * 1: 게임 시작
   * 2: 이불 날리기(결과)
   */
  const gameSteps = useMemo(
    () => [
      <WorryDump key="worry" handleNextStep={handleNextStep} setGameState={setGameState} />,
      <KickEbul key="kick" handleNextStep={handleNextStep} setGameState={setGameState} />,
      <GameResult key="result" gameState={gameState} initGame={initGame} nickname={nickname} uniqueId={uniqueId} />,
    ],
    [handleNextStep, initGame, gameState, nickname, uniqueId],
  )

  return <>{gameSteps[step]}</>
}

export default Game
