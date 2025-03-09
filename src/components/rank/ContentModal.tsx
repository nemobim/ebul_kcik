import close from '../../assets/game/write/close.png'
import { getRankImg } from '../../utils/rank'
import { reactionIcon, TworryContent, worryImage } from '../../utils/worry'

const ContentModal = ({ hideModal, content }: { hideModal: () => void; content: TworryContent }) => {
  return (
    <div
      style={{ backgroundImage: `url(${worryImage[content.worryLabel].bgImg})` }}
      className="flex h-full max-h-[90vh] min-h-[20rem] flex-col justify-between overflow-y-scroll rounded-xl border-[3px] border-black p-2"
    >
      <div>
        <div className="flex items-start justify-between">
          <div className="flex w-full items-center justify-between">
            <div className="ml-3 mt-2 font-galmuri9 text-lg text-main3">
              <p>{content.user}</p>
              <p>{content.score}m</p>
            </div>
            <img src={getRankImg(content.score)} className="mr-5 w-[4rem]" alt={content.worryLabel} />
          </div>
          <button className="w-[2rem]" onClick={hideModal}>
            <img src={close} alt="닫기" />
          </button>
        </div>
        <div className="my-2 px-2">
          <p>{content.worryContent}</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-10">
        {Object.entries(reactionIcon).map(([key, value]) => (
          <div className="text-center" key={key}>
            <img src={value} alt={key} className="w-[3rem]" />
            <p className="font-galmuri9 text-lg">0</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContentModal
