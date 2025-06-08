import { useState, useMemo } from 'react'
import Bed from '../components/tutorial/Bed'
import Door from '../components/tutorial/Door'
import Room from '../components/tutorial/Room'

const Tutorials = () => {
  const [step, setStep] = useState(0)

  /**다음 단계로 넘기기 */
  const handleNextStep = () => {
    setStep(prev => prev + 1)
  }

  /**튜토리얼 스텝
   * 0: 방 문 이름 적기
   * 1: 방에서 침대 클릭
   * 2: 침대에서 대사 출력
   */
  const tutorialSteps = useMemo(() => [<Door key="door" handleNextStep={handleNextStep} />, <Room key="room" handleNextStep={handleNextStep} />, <Bed key="bed" />], [handleNextStep])

  return <div className="bg-tutorial h-full">{tutorialSteps[step]}</div>
}

export default Tutorials
