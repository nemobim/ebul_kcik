import Lottie from 'lottie-react'
import { useNavigate } from 'react-router-dom'
import splash from '../assets/lottie/splash.json'

const Splash = () => {
  const navigate = useNavigate()

  return (
    <div className="flex h-full items-center justify-center">
      <Lottie animationData={splash} loop={false} onComplete={() => navigate('/tutorials')} />
    </div>
  )
}

export default Splash
