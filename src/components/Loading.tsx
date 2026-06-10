/**
 * 로딩 스피너
 *
 * 기존 Lottie(loading.json, 원본 ~819KB)를 초기 번들에서 제거하기 위해
 * 경량 CSS 스피너로 대체한다. 호출부 호환을 위해 export 이름은 유지한다.
 */
export const LottieLoading = () => {
  return (
    <div className="flex h-full items-center justify-center bg-white">
      <div className="size-12 animate-spin rounded-full border-4 border-gray2/30 border-t-main3" role="status" aria-label="로딩 중" />
    </div>
  )
}
