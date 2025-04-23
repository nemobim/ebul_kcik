import { useState } from 'react'
import { useReactToContent } from '../../api/firebaseApi'
import close from '../../assets/game/write/close.png'
import { TGameContent, TworryReaction } from '../../types/game'
import { getRankImg } from '../../utils/rank'
import { reactionIcon, worryImage } from '../../utils/worry'

const ContentModal = ({ hideModal, content }: { hideModal: () => void; content: TGameContent }) => {
  const [reactionState, setReactionState] = useState(content.reactions)

  const { mutate: onReaction, isPending } = useReactToContent()

  const handleReaction = async (reaction: TworryReaction) => {
    onReaction(
      { contentId: content.id, contentUserId: content.userId, reaction },
      {
        onSuccess: () => {
          setReactionState(prev => ({
            ...prev,
            [reaction]: prev[reaction] + 1,
          }))
        },
      },
    )
  }

  return (
    <div
      style={{ backgroundImage: `url(${worryImage[content.worryLabel].bgImg})` }}
      className="flex h-full max-h-[90vh] min-h-[20rem] w-full flex-col justify-between overflow-y-scroll rounded-xl border-[3px] border-black p-2"
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
          <p>{content.content}</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-10">
        {Object.entries(reactionIcon).map(([key, value]) => (
          <button className="text-center" disabled={isPending} key={key} onClick={() => handleReaction(key as TworryReaction)}>
            <img src={value} alt={key} className="size-[3rem]" />
            <p className="font-galmuri9 text-lg">{reactionState[key as TworryReaction]}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ContentModal
