import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import wakeUser from '../../assets/tutorial/bed/wake.png'
import { useModal } from '../../hook/useModal'
import { TGameState, TWorryContent } from '../../types/game'
import WorryContentModal from './Modal/WorryContentModal'

const WorryDump = ({ handleNextStep, setGameState }: { handleNextStep: () => void; setGameState: Dispatch<SetStateAction<TGameState>> }) => {
  // 전체화면 모달 + 오버레이 실수 탭으로 입력 유실을 막기 위해 오버레이 닫기 비활성화
  const { Modal, hideModal, showModal } = useModal({ fullScreen: true, closeOnOverlayClick: false })
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
        {/* wakeUser 341x341 — 위 텍스트 오버레이가 inset-0 기준이므로 이미지가 도착하기 전에도 컨테이너 높이가 유지되어야 함 */}
        <img src={wakeUser} width={341} height={341} alt="잠자는 사용자" className="h-auto w-full" />
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
