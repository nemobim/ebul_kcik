import Error from '../components/error/Error'

const ErrorFallBack = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  console.log('에러사유:', error.message)

  //   useEffect(() => {
  //     // 화면 에러 발생시 전송
  //   }, [error])

  const goToHome = () => {
    window.location.href = '/'
  }

  return (
    <Error title="오류가 발생했어요!" text="잠시후 다시 시도해주세요.">
      <div className="mt-5 flex justify-center gap-4">
        <button onClick={goToHome} className="btn main2 rounded-md px-4 py-2">
          홈으로 이동
        </button>
        <button onClick={resetErrorBoundary} className="btn main3 rounded-md px-4 py-2">
          다시 시도
        </button>
      </div>
    </Error>
  )
}

export default ErrorFallBack
