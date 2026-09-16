import { useState } from 'react'
import { useReactToContent, useUserReaction } from '../../api/firebaseApi'
import close from '../../assets/game/write/close.png'
import { TGameContent, TworryReaction } from '../../types/game'
import { getRankImg } from '../../utils/rank'
import { isOwnerContent } from '../../utils/reaction'
import { session } from '../../utils/session'
import { reactionIcon, worryImage } from '../../utils/worry'

const ContentModal = ({ hideModal, content }: { hideModal: () => void; content: TGameContent }) => {
  const [reactionState, setReactionState] = useState(content.reactions)

  const isOwner = isOwnerContent(session.getUniqueId(), content.userId)
  const { data: userReactions } = useUserReaction(isOwner ? null : content.id)
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
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-10">
          {Object.entries(reactionIcon).map(([key, value]) => {
            const reactionKey = key as TworryReaction
            const alreadyReacted = !!userReactions?.[reactionKey]
            const disabled = isPending || isOwner || alreadyReacted
            const buttonClass = alreadyReacted
              ? 'text-center opacity-100'
              : disabled
                ? 'text-center opacity-50 cursor-not-allowed'
                : 'text-center'
            const imgClass = alreadyReacted ? 'size-[3rem] drop-shadow-[0_0_4px_rgba(0,0,0,0.4)]' : 'size-[3rem]'
            return (
              <button
                className={buttonClass}
                disabled={disabled}
                key={key}
                onClick={() => handleReaction(reactionKey)}
                aria-pressed={alreadyReacted}
                aria-label={alreadyReacted ? `${key} 이미 공감함` : key}
              >
                <img src={value} alt={key} className={imgClass} />
                <p className="font-galmuri9 text-lg">{reactionState[reactionKey]}</p>
              </button>
            )
          })}
        </div>
        {isOwner && <p className="font-galmuri9 text-sm text-main3">본인 글에는 공감을 누를 수 없어요</p>}
      </div>
    </div>
  )
}

export default ContentModal
