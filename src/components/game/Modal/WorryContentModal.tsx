import { Dispatch, SetStateAction, useState } from 'react'
import { useForm } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import close from '../../../assets/game/write/close.png'
import { TGameState } from '../../../page/Game'
import { TworryLabel, worryList } from '../../../utils/worry'
import { TWorryContent } from '../WorryDump'

const WorryContentModal = ({
  hideModal,
  setWorryContent,
  worryContent,
  setGameState,
}: {
  hideModal: () => void
  setWorryContent: Dispatch<SetStateAction<TWorryContent | undefined>>
  worryContent?: TWorryContent
  setGameState: Dispatch<SetStateAction<TGameState>>
}) => {
  const [selectedWorry, setSelectedWorry] = useState<{
    label: string
    text: string
    bgImg: string
    id?: TworryLabel
  }>({
    label: worryContent?.label || '',
    text: worryContent?.text || '',
    bgImg: worryContent?.bgImg || '',
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ content: string }>({
    defaultValues: {
      content: worryContent?.content,
    },
  })

  /**고민 조각 선택 */
  const handleWorrySelect = (worry: { label: string; text: string; bgImg: string }) => {
    setSelectedWorry(worry)
  }

  /**고민 적기 제출 */
  const onSubmit = ({ content }: { content: string }) => {
    setWorryContent({
      content,
      label: selectedWorry.label,
      text: selectedWorry.text,
      bgImg: selectedWorry.bgImg,
    })
    setGameState(prev => ({ ...prev, worryLabel: selectedWorry.id, content }))
    hideModal()
  }

  return (
    <div className="bg-worry h-full max-h-[50rem] overflow-y-scroll rounded-xl border-[3px] border-black p-5">
      <div className="flex justify-end">
        {worryContent?.content && (
          <button className="w-[2rem]" onClick={hideModal}>
            <img src={close} alt="닫기" />
          </button>
        )}
      </div>
      <form className="flex flex-col items-center" onSubmit={handleSubmit(onSubmit)}>
        <h4>고민 조각</h4>
        <div className="my-4 grid grid-cols-3 gap-6 xs:gap-8">
          {worryList.map(worry => (
            <button key={worry.id} type="button" onClick={() => handleWorrySelect(worry)} className={twMerge(selectedWorry?.label === worry.label && 'font-semibold text-main3')}>
              <img src={worry.img} alt={worry.label} className="h-auto w-full" />
              <p className="text-sm">{worry.label}</p>
            </button>
          ))}
        </div>
        <h4>고민 적기</h4>
        <div
          style={{ backgroundImage: selectedWorry.bgImg ? `url(${selectedWorry.bgImg})` : undefined }}
          className={twMerge('mt-4 h-full w-full rounded-xl border-[3px] border-black bg-cover p-4', !selectedWorry.bgImg && 'bg-white')}
        >
          {selectedWorry.label ? <p className="text-main3">{selectedWorry.text}</p> : <p>고민 조각을 선택해주세요.</p>}
          <textarea
            {...register('content', {
              required: '고민을 적어주세요.',
              maxLength: {
                value: 500,
                message: '500자 이하로 적어주세요.',
              },
            })}
            disabled={!selectedWorry.label}
            className="mt-2 w-full resize-none bg-transparent"
            rows={10}
            maxLength={500}
            placeholder="자기 전 갑자기 떠오른 흑역사나 고민을 적어주세요."
          />
        </div>
        {errors.content && <p className="mt-1 w-full text-sm text-red-500">{errors?.content.message}</p>}
        <button disabled={!selectedWorry.label} type="submit" className="btn main3 mt-4 w-full text-xl">
          작성 완료
        </button>
      </form>
    </div>
  )
}

export default WorryContentModal
