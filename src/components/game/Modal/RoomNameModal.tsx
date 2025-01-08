import { useForm } from 'react-hook-form'

const RoomNameModal = ({ hideModal }: { hideModal: () => void }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ nickname: string }>()

  /**닉네임 추적 */
  const watchNickname = watch('nickname')

  const handleSubmitNickname = ({ nickname }: { nickname: string }) => {
    console.log(nickname)
    //TODO: 닉네임 저장
    localStorage.setItem('nickname', nickname)
    hideModal()
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitNickname)} className="flex flex-col items-center gap-4 rounded-xl border-[3px] border-black bg-main1 px-[20px] py-[28px]">
      <h2 className="font-semibold">NAME</h2>
      <div className="w-full">
        <input
          {...register('nickname', {
            required: '닉네임을 입력해주세요.',
            maxLength: { value: 5, message: '닉네임은 최대 5자까지 가능합니다.' },
            validate: (value: string) => {
              const koreanRegex = /^[가-힣]+$/
              return koreanRegex.test(value) || '닉네임은 한글만 입력 가능합니다.'
            },
          })}
          placeholder="닉네임을 적어주세요."
          className="w-full rounded-lg px-4 py-[14px]"
        />
        {errors.nickname && <p className="ml-2 mt-2 text-sm text-red-500">{errors?.nickname?.message?.toString()}</p>}
      </div>
      <div className="flex w-full justify-end gap-3">
        <button type="button" className="w-[4rem] text-gray1" onClick={hideModal}>
          취소
        </button>
        <button type="submit" disabled={watchNickname?.trim() === ''} className="rounded-md border-[3px] border-black bg-main2 px-[18px] py-1 text-white disabled:bg-gray2 disabled:text-gray3">
          작성완료
        </button>
      </div>
    </form>
  )
}

export default RoomNameModal
