import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import nextBtn from '../../assets/tutorial/bed/down_arrow.png'
import { bedScripts } from '../../utils/scripts'

const Bed = () => {
  const navigate = useNavigate()
  const [currentScript, setCurrentScript] = useState(0) // 스크립트 인덱스
  const [displayedText, setDisplayedText] = useState('') // 화면에 출력될 텍스트
  const [typing, setTyping] = useState(true) // 타이핑 중 여부

  // 타자기 효과 구현
  useEffect(() => {
    let index = 0

    if (typing) {
      const interval = setInterval(() => {
        const currentChar = bedScripts[currentScript].script[index]
        if (currentChar !== undefined) {
          setDisplayedText(prev => prev + currentChar)
          index++
        } else {
          clearInterval(interval)
          setTyping(false)
        }
      }, 200)
      return () => clearInterval(interval)
    }
  }, [currentScript, typing])

  // 다음 대사로 이동
  const handleNextScript = () => {
    if (typing) return

    if (currentScript < bedScripts.length - 1) {
      setTyping(true)
      setDisplayedText('')
      setCurrentScript(prev => prev + 1)
    } else {
      navigate('/game')
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="relative w-[90%]">
        <img src={bedScripts[currentScript].img} alt="잠자는 사용자" className="w-full" />
      </div>
      {/**대사 박스 */}
      <div className="mt-5 flex w-[90%] justify-between rounded-xl border-[3px] border-black bg-main1 px-3 py-5">
        <p>
          {displayedText}
          {typing && <span className="animate-typing-cursor" />}
        </p>
        {/* 다음 버튼 (타이핑이 끝나면 활성화) */}
        {!typing && (
          <button onClick={handleNextScript} className="animate-glow">
            <img src={nextBtn} alt="다음 버튼" className="h-auto w-[90%] max-w-[100px]" />
          </button>
        )}
      </div>
    </div>
  )
}

export default Bed
