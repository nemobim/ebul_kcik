import { Link } from 'react-router-dom'
import askBanner from '../../assets/etc/askBanner.png'
import close from '../../assets/game/write/close.png'

const InfoModal = ({ hideModal }: { hideModal: () => void }) => {
  return (
    <div className="flex w-[90%] flex-col gap-2 rounded-xl border-[3px] border-black bg-white p-3">
      <div className="flex items-start justify-between">
        <a href="https://form.typeform.com/to/GQMWYmKC" target="_blank" rel="noopener noreferrer">
          <img src={askBanner} alt="logo" className="w-full" />
        </a>
        <button className="w-[2rem]" onClick={hideModal}>
          <img src={close} alt="닫기" />
        </button>
      </div>
      <Link to="/game" className="btn main3 text-center">{`새로운 이불 던지기 >`}</Link>
      <button className="btn main2">{`지붕 뚫고 이불킥 링크 공유 >`}</button>
      <div className="mt-1 flex flex-col items-end gap-1 text-sm text-gray1">
        <a href="https://www.instagram.com/nini_neuru/?igsh=MTYxOHhpOXpud2Rpeg%3D%3D#" target="_blank" rel="noopener noreferrer" className="hover:text-main2">
          기획/디자인: @nini_neuru
        </a>
        <a href="https://github.com/nemobim" target="_blank" rel="noopener noreferrer" className="hover:text-main2">
          개발: @nemobim
        </a>
        <Link to="/special-thanks" className="hover:text-main3">
          @제작후기
        </Link>
      </div>
    </div>
  )
}

export default InfoModal
