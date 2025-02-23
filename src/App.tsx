import { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import 'remixicon/fonts/remixicon.css'
import Error from './components/error/Error'
import ErrorFallBack from './page/ErrorFallBack'
import { AlertProvider } from './provider/AlertProvider'
import Router from './shared/Router'
import './styles/animated.css'

const App = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      //넓이 310px * 660px  이하의 화면은 게임 불가
      setIsSmallScreen(window.innerWidth <= 310 || window.innerHeight <= 660)
    }

    // 초기 화면 크기 확인
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isSmallScreen) {
    return <Error title="화면 사이즈 확인!" text="원활한 게임 플레이를 위해 권장 사이즈(310*660) 이상으로 플레이해주세요." />
  }

  console.log(navigator.mediaDevices, navigator?.userAgent)

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto flex h-screen max-w-md items-center justify-center bg-white">
        <div className="h-full max-h-[900px] w-full overflow-hidden bg-black">
          <ErrorBoundary FallbackComponent={ErrorFallBack}>
            <AlertProvider>
              <Router />
            </AlertProvider>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}

export default App
