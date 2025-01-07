import { useEffect, useState } from 'react'
import 'remixicon/fonts/remixicon.css'
import Error from './components/error/Error'
import { AlertProvider } from './provider/AlertProvider'
import Router from './shared/Router'
import './styles/animated.css'

const App = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      // 310px 이하의 화면은 게임 불가
      setIsSmallScreen(window.innerWidth <= 310)
    }

    // 초기 화면 크기 확인
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isSmallScreen) {
    return <Error title="화면이 너무 작아요!" text="원활한 게임 플레이를 위해 PC 또는 더 큰 화면의 기기로 접속해주세요." />
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto h-screen max-w-md bg-white">
        <AlertProvider>
          <Router />
        </AlertProvider>
      </div>
    </div>
  )
}

export default App
