import { Link } from 'react-router-dom'
import askBanner from '../../assets/etc/askBanner.webp'
import close from '../../assets/game/write/close.png'

const InfoModal = ({ hideModal }: { hideModal: () => void }) => {
  const handleShare = () => {
    const shareData = {
      title: '지붕 뚫고 이불킥',
      text: '잠들지 못하게 하는 당신의 생각을 이불과 함께 날려보세요-!',
      url: window.location.href, // 현재 URL
    }

    if (navigator.share) {
      navigator.share(shareData).catch(err => {
        console.error('공유 실패:', err)
      })
    } else {
      // 데스크탑은 링크 복사
      navigator.clipboard.writeText(shareData.url)
      alert('링크가 복사되었습니다!')
    }
  }

  return (
    <div className="flex w-[90%] flex-col gap-2 rounded-xl border-[3px] border-black bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <a href="https://form.typeform.com/to/GQMWYmKC" target="_blank" rel="noopener noreferrer">
          <img src={askBanner} alt="logo" className="w-full" />
        </a>
        <button className="w-[2rem]" onClick={hideModal}>
          <img src={close} alt="닫기" />
        </button>
      </div>
      <Link to="/game" className="btn main3 text-center">{`새로운 이불 던지기 >`}</Link>
      <button onClick={handleShare} className="btn main2">
        {`이불킥 커뮤니티 공유 >`}
      </button>
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
