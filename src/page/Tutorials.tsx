import { useState } from 'react'
import Door from '../components/tutorial/Door'
import Room from '../components/tutorial/Room'

const Tutorials = () => {
  const [step, setStep] = useState(0)
  const tutorialSteps = [<Door setStep={setStep} />, <Room />]

  return <div className="w-full">{tutorialSteps[step]}</div>
}

export default Tutorials
