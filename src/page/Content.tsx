import RankTab from '../components/rank/RankTab'
import { RANK_CONTENT, TworryContent, worryImage } from '../utils/worry'
import { useModal } from '../hook/useModal'
import FloatBtn from '../components/rank/FloatBtn'
import ContentModal from '../components/rank/ContentModal'

const Content = () => {
  const { showModal, hideModal, Modal } = useModal()

  const handleOpenModal = (content: TworryContent) => {
    showModal(<ContentModal hideModal={hideModal} content={content} />)
  }

  return (
    <div className="bg-worry relative flex h-full flex-col items-center overflow-y-auto pt-12">
      <RankTab />
      {/* 필터 버튼 */}
      <div className="my-5 flex w-[80%] items-end justify-between">
        <p className="text-sm text-gray1">이불 더미 구경하기</p>
        <select className="rounded border-[2px] border-black px-2 py-1 text-sm">
          <option>멀리 날라간 순</option>
          <option>공감 높은 순</option>
        </select>
      </div>
      {/* 이불 더미 목록 */}
      <div className="grid w-[80%] grid-cols-2 gap-4">
        {RANK_CONTENT.map(content => (
          <div key={content.id} onClick={() => handleOpenModal(content)} className="w-full rounded-lg border-[3px] border-black bg-white py-2 pr-2 text-sm">
            <div className="flex items-center justify-between">
              <img src={worryImage[content.worryLabel].img} className="w-[90%] max-w-[4rem]" alt={content.worryLabel} />
              <div className="text-right text-main3">
                <p>{content?.reaction}☺</p>
                <p>{content?.score}m</p>
              </div>
            </div>
            <p className="my-2 line-clamp-3 pl-2">{content?.worryContent}</p>
            <p className="pl-2 text-gray2"> {content?.user}</p>
          </div>
        ))}
      </div>
      {/* 플로팅 버튼 */}
      <FloatBtn />
      {Modal}
    </div>
  )
}

export default Content
