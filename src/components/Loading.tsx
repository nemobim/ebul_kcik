import Lottie from 'lottie-react'
import loading from '../assets/lottie/loading.json'

export const LottieLoading = () => {
  return (
    <div className="flex h-full items-center justify-center bg-white">
      <Lottie animationData={loading} loop={true} />
    </div>
  )
}

export const SpinnerLoading = ({ text }: { text?: string }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-white bg-opacity-50">
      <div className="h-[60px] w-[60px] animate-spin rounded-[50%] border-[4px] border-white border-t-main2 border-opacity-50"></div>
      {text && <p className="mt-5 text-white">{text}</p>}
    </div>
  )
}
