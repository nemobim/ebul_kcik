import { useState } from 'react'
import RankLayout from '../elements/RankLayout'

const Content = () => {
  const [isModalOpen, setModalOpen] = useState(false)
  return (
    <div>
      <RankLayout />

      {/* 필터 버튼 */}
      <div className="flex items-center justify-between px-4 py-2">
        <p>이불 더미 구경하기</p>
        <select className="rounded bg-gray-300 px-2 py-1 text-sm text-gray-700">
          <option>멀리 날라간 순</option>
          <option>공감 높은 순</option>
        </select>
      </div>

      {/* 카드 그리드 */}
      <div className="grid h-[calc(100vh-100px)] grid-cols-2 gap-4 overflow-y-auto p-4">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="rounded bg-yellow-100 p-4 text-blue-900 shadow-md">
            <p className="mb-2 text-xs font-bold">000m 000m</p>
            <p className="text-xs">흑역사 미리보기</p>
            <p className="text-xs">흑역사 미리보기</p>
            <p className="text-xs">흑역사 미리보기</p>
            <p className="text-xs">닉네임은 여덟글자</p>
          </div>
        ))}
      </div>

      {/* 플로팅 버튼 */}

      <div className="absolute bottom-0 flex w-full max-w-[28rem] justify-end p-4">
        <button onClick={() => setModalOpen(true)} className="rounded-full bg-yellow-300 p-4 text-black shadow-lg">
          💡
        </button>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-80 rounded-lg bg-white p-6 text-blue-900">
            <button onClick={() => setModalOpen(false)} className="absolute right-2 top-2 font-bold text-gray-500">
              ✕
            </button>
            <div className="mb-4 flex items-center">
              <img src="https://via.placeholder.com/50" alt="썸네일" className="mr-4 h-12 w-12 rounded-full" />
              <p className="text-sm font-bold">새로운 이불 던지기</p>
            </div>
            <button className="mb-2 w-full rounded bg-blue-600 py-2 text-white">이불킥 커뮤니티 공유하기</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Content
