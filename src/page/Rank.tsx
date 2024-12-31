import RankLayout from '../elements/RankLayout'

const Rank = () => {
  return (
    <div>
      <RankLayout />
      {/* 스크롤 가능 영역 */}
      <div className="h-[calc(100vh-80px)] overflow-y-auto">
        {/* 상위 3위 영역 */}
        <div className="mt-6 flex justify-around">
          {/* 2nd */}
          <div className="text-center">
            <div className="relative mx-auto h-16 w-16 bg-gray-200">
              <div className="absolute left-1/2 top-2 -translate-x-1/2 transform text-xs text-gray-700">닉네임은</div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 transform text-xs text-gray-700">8글자로</div>
            </div>
            <p className="mt-2 text-sm text-gray-600">2nd</p>
            <p className="text-sm text-gray-800">000m</p>
          </div>
          {/* 1st */}
          <div className="text-center">
            <div className="relative mx-auto h-20 w-20 bg-gray-300">
              <div className="absolute left-1/2 top-2 -translate-x-1/2 transform text-xs text-gray-700">닉네임은</div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 transform text-xs text-gray-700">8글자로</div>
            </div>
            <p className="mt-2 text-sm text-gray-600">1st</p>
            <p className="text-sm text-gray-800">000m</p>
          </div>
          {/* 3rd */}
          <div className="text-center">
            <div className="relative mx-auto h-16 w-16 bg-gray-200">
              <div className="absolute left-1/2 top-2 -translate-x-1/2 transform text-xs text-gray-700">닉네임은</div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 transform text-xs text-gray-700">8글자로</div>
            </div>
            <p className="mt-2 text-sm text-gray-600">3rd</p>
            <p className="text-sm text-gray-800">000m</p>
          </div>
        </div>

        {/* 4th~9th 영역 */}
        <div className="mt-6 flex flex-col gap-2">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="flex items-center justify-between border-b border-gray-200 bg-yellow-100 px-4 py-2">
              <p className="font-bold text-red-500">{`${i + 4}th`}</p>
              <p className="text-gray-800">닉네임최대여덟자</p>
              <p className="text-gray-800">000m</p>
            </div>
          ))}
        </div>
      </div>

      {/* 고정된 남색 점수 영역 */}
      <div className="absolute bottom-0 flex w-full max-w-[28rem] justify-center py-4">
        <div className="mt-4 flex w-[90%] justify-between bg-blue-900 p-4 text-white">
          <p>0th</p>
          <p>침착맨</p>
          <p>000m</p>
        </div>
      </div>
    </div>
  )
}

export default Rank
