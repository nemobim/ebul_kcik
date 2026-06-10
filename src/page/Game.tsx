import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { LottieLoading } from '../components/Loading'
import WorryDump from '../components/game/WorryDump'
import { TGameState } from '../types/game'
import { session } from '../utils/session'

// 연타/결과 화면은 고민 작성 이후에만 필요하므로 lazy로 분리해 /game 초기 chunk 축소
const KickEbul = lazy(() => import('../components/game/KickEbul'))
const GameResult = lazy(() => import('../components/game/GameResult'))

const Game = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  const nickname = session.getNickname()
  const uniqueId = session.getUniqueId()

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

  /**게임 스텝
   * 0: 고민 적기
   * 1: 게임 시작
   * 2: 이불 날리기(결과)
   */
  const renderStep = () => {
    switch (step) {
      case 1:
        return <KickEbul handleNextStep={handleNextStep} setGameState={setGameState} />
      case 2:
        return <GameResult gameState={gameState} initGame={initGame} nickname={nickname} uniqueId={uniqueId} />
      default:
        return <WorryDump handleNextStep={handleNextStep} setGameState={setGameState} />
    }
  }

  return <Suspense fallback={<LottieLoading />}>{renderStep()}</Suspense>
}

export default Game
