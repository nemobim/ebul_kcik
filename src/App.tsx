import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import 'remixicon/fonts/remixicon.css'
import Error from './components/error/Error'
import ErrorFallBack from './page/ErrorFallBack'
import Router from './shared/Router'
import './styles/animated.css'

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 여부
        staleTime: 60 * 1000 * 10, // 데이터가 만료되기 전까지의 시간 (10분)
        retry: 1, // 재시도 횟수
      },
    },
  })

  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      //넓이 310px * 630px  이하의 화면은 게임 불가
      setIsSmallScreen(window.innerWidth <= 310 || window.innerHeight <= 629)
    }

    // 초기 화면 크기 확인
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isSmallScreen) {
    return <Error title="화면 사이즈 확인!" text="원활한 게임 플레이를 위해 권장 사이즈(310*630) 이상으로 플레이해주세요." />
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto flex h-screen max-w-md items-center justify-center bg-white">
        <div className="h-full max-h-[900px] w-full overflow-hidden bg-black">
          <QueryClientProvider client={queryClient}>
            <ErrorBoundary FallbackComponent={ErrorFallBack}>
              <Router />
            </ErrorBoundary>
          </QueryClientProvider>
        </div>
      </div>
    </div>
  )
}

export default App
