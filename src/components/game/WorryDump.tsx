import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import wakeUser from '../../assets/tutorial/bed/wake.png'
import { useModal } from '../../hook/useModal'
import { TGameState } from '../../page/Game'
import { TworryLabel } from '../../utils/worry'
import WorryContentModal from './Modal/WorryContentModal'

export type TWorryContent = {
  content: string
  label: string
  bgImg: string
  text: string
  id?: TworryLabel
}

const WorryDump = ({ handleNextStep, setGameState }: { handleNextStep: () => void; setGameState: Dispatch<SetStateAction<TGameState>> }) => {
  const { Modal, hideModal, showModal } = useModal(true)
  /**고민적기 */
  const [worryContent, setWorryContent] = useState<TWorryContent>()

  /**고민 수정 */
  const showWorryEditModal = () => {
    showModal(<WorryContentModal hideModal={hideModal} setWorryContent={setWorryContent} worryContent={worryContent} setGameState={setGameState} />)
  }

  useEffect(() => {
    if (!worryContent?.label) {
      showModal(<WorryContentModal hideModal={hideModal} setWorryContent={setWorryContent} setGameState={setGameState} />)
    }
  }, [showModal, hideModal, worryContent, setGameState])

  return (
    <div className="bg-tutorial flex h-full flex-col items-center justify-center">
      <div className="text-dialog p-3">
        <p className="font-galmuri9">{worryContent?.text}</p>
        <p className="text-sm">그 생각이 계속 떠올라...!</p>
      </div>
      <div className="relative my-3 w-[90%]">
        <div className="absolute inset-0 top-5 h-[90%] max-h-full w-full overflow-y-auto whitespace-pre-wrap p-3 text-white">{worryContent?.content}</div>
        <img src={wakeUser} alt="잠자는 사용자" className="w-full" />
      </div>
      <p className="mb-3 text-sm text-white">*이후 글 수정이 어려워요.</p>
      <div className="flex w-[90%] gap-3">
        <button onClick={showWorryEditModal} className="btn main2 w-1/2">
          수정
        </button>
        <button onClick={handleNextStep} className="btn main3 w-2/3">
          다음으로 이동
        </button>
      </div>
      {Modal}
    </div>
  )
}

export default WorryDump
