import Lottie from 'lottie-react'
import loading from '../assets/lottie/loading.json'

export const LottieLoading = () => {
  return (
    <div className="flex h-full items-center justify-center bg-white">
      <Lottie animationData={loading} loop={true} />
    </div>
  )
}
