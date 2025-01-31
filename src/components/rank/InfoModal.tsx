import close from '../../assets/game/write/close.png'

const InfoModal = ({ hideModal }: { hideModal: () => void }) => {
  return (
    <div className="flex flex-col gap-2 rounded-xl border-[3px] border-black bg-white p-3">
      <div className="flex items-start gap-2">
        <div className="h-[6rem] w-full rounded-xl border-[3px] border-black bg-slate-500" />
        <button className="w-[2rem]" onClick={hideModal}>
          <img src={close} alt="닫기" />
        </button>
      </div>
      <button className="btn main3">{`새로운 이불 던지기 >`}</button>
      <button className="btn main2">{`던진 이불 공유하기 >`}</button>
    </div>
  )
}

export default InfoModal
