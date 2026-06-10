/** 데이터 조회 실패 시 재시도 UI */
export const ErrorRetry = ({ onRetry, message = '데이터를 불러오지 못했어요.' }: { onRetry: () => void; message?: string }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-white px-6 text-center">
      <p className="text-gray2">{message}</p>
      <button onClick={onRetry} className="btn main3 px-6">
        다시 시도
      </button>
    </div>
  )
}

/** 목록이 비어 있을 때 표시 */
export const EmptyState = ({ message }: { message: string }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center py-16 text-center">
      <p className="text-gray2">{message}</p>
    </div>
  )
}
