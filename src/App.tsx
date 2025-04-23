import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import 'remixicon/fonts/remixicon.css'
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

  return (
    <div className="min-h-[100dvh] bg-gray-100">
      <div className="mx-auto flex h-[100dvh] max-w-md items-center justify-center bg-white">
        <div className="h-full max-h-[900px] w-full overflow-y-auto bg-black">
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
