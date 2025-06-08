import { useRef, useState, useCallback } from 'react'
import { useGetGameContent } from '../api/firebaseApi'
import { SpinnerLoading } from '../components/Loading'
import ContentModal from '../components/rank/ContentModal'
import FloatBtn from '../components/rank/FloatBtn'
import RankTab from '../components/rank/RankTab'
import { useModal } from '../hook/useModal'
import { TGameContent, TSortType } from '../types/game'
import { worryImage } from '../utils/worry'
import { ChangeEvent } from 'react'

const Content = () => {
  const [sortType, setSortType] = useState<TSortType>('createdAt')
  const { data: contents = [], isLoading, isError } = useGetGameContent(sortType)

  //스크롤 ref
  const scrollRef = useRef<HTMLDivElement>(null)

  const { showModal, hideModal, Modal } = useModal()

  // 이벤트 핸들러 메모이제이션
  const handleSortChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setSortType(e.target.value as TSortType)
  }, [])

  const handleOpenModal = (content: TGameContent) => {
    showModal(<ContentModal hideModal={hideModal} content={content} />)
  }

  return (
    <div className="relative h-full">
      {isLoading || isError ? (
        <SpinnerLoading />
      ) : (
        <div ref={scrollRef} className="bg-worry relative flex h-full flex-col items-center overflow-y-auto py-12">
          <RankTab />
          {/* 필터 버튼 */}
          <div className="my-5 flex w-[80%] items-end justify-between">
            <p className="text-sm text-gray1">이불 더미 구경하기</p>
            <select defaultValue={sortType} onChange={handleSortChange} className="rounded border-[2px] border-black px-2 py-1 text-sm" aria-label="정렬 기준 선택">
              <option value="createdAt">최신순</option>
              <option value="score">멀리 날라간 순</option>
              <option value="reactionTotal">공감 높은 순</option>
            </select>
          </div>
          {/* 이불 더미 목록 */}
          <div className="grid w-[80%] grid-cols-2 gap-4">
            {contents.map(content => (
              <div key={content.id} onClick={() => handleOpenModal(content)} className="w-full rounded-lg border-[3px] border-black bg-white py-2 pr-2 text-sm">
                <div className="flex items-center justify-between">
                  <img src={worryImage[content.worryLabel].img} className="w-[90%] max-w-[4rem]" alt={content.worryLabel} />
                  <div className="text-right text-main3">
                    <p>{content?.reactionTotal}☺</p>
                    <p>{content?.score}m</p>
                  </div>
                </div>
                <p className="my-2 line-clamp-3 pl-2">{content?.content}</p>
                <p className="pl-2 text-gray2"> {content?.user}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* 플로팅 버튼 */}
      <FloatBtn scrollRef={scrollRef} />
      {Modal}
    </div>
  )
}

export default Content
