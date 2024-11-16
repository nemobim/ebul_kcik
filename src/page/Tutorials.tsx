import { useState } from 'react'
import Door from '../components/tutorial/Door'
import Room from '../components/tutorial/Room'

const Tutorials = () => {
  const [step, setStep] = useState(0)

  /**튜토리얼 스텝
   * 0: 방 문 이름 적기
   * 1: 게임 시작 전 닉네임 설정
   */
  const tutorialSteps = [<Door setStep={setStep} />, <Room />]

  return <div className="h-full w-full">{tutorialSteps[step]}</div>
}

export default Tutorials
