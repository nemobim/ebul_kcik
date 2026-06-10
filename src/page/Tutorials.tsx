import { useState } from 'react'
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
  const renderStep = () => {
    switch (step) {
      case 1:
        return <Room handleNextStep={handleNextStep} />
      case 2:
        return <Bed />
      default:
        return <Door handleNextStep={handleNextStep} />
    }
  }

  return <div className="bg-tutorial h-full">{renderStep()}</div>
}

export default Tutorials
