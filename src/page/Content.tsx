import RankTab from '../components/rank/RankTab'

const Content = () => {
  return (
    <div className="bg-worry relative flex h-full flex-col items-center overflow-y-auto py-12">
      <RankTab />
      {/* 필터 버튼 */}
      <div className="my-5 flex w-[80%] items-end justify-between">
        <p className="text-gray1">이불 더미 구경하기</p>
        <select className="rounded border-[2px] border-black px-2 py-1 text-sm">
          <option>멀리 날라간 순</option>
          <option>공감 높은 순</option>
        </select>
      </div>
      {/* 이불 더미 목록 */}
      <div className="grid w-[80%] grid-cols-2 gap-4">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="w-full rounded border-[3px] border-black bg-white">
            <p className="mb-2 text-xs font-bold">000m 000m</p>
            <p className="text-xs">흑역사 미리보기</p>
            <p className="text-xs">흑역사 미리보기</p>
            <p className="text-xs">흑역사 미리보기</p>
            <p className="text-xs">닉네임은 여덟글자</p>
          </div>
        ))}
      </div>
      {/* 플로팅 버튼 */}
      <div className="fixed bottom-0 flex w-full max-w-[28rem] justify-end p-4">
        <button className="rounded-full bg-yellow-300 p-4 text-black shadow-lg">💡</button>
      </div>
    </div>
  )
}

export default Content
