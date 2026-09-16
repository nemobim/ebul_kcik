import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import nextBtn from '../../assets/tutorial/bed/down_arrow.png'
import { bedScripts } from '../../utils/scripts'

const Bed = () => {
  const navigate = useNavigate()
  const [currentScript, setCurrentScript] = useState(0) // 스크립트 인덱스
  const [displayedText, setDisplayedText] = useState('') // 화면에 출력될 텍스트
  const [typing, setTyping] = useState(true) // 타이핑 중 여부

  // 다음 대사 이미지 사전 디코딩 — 대사 전환 시 이미지 영역이 잠깐 비는 문제 방지.
  useEffect(() => {
    const nextIdx = currentScript + 1
    if (nextIdx < bedScripts.length) {
      const img = new Image()
      img.src = bedScripts[nextIdx].img
      img.decode().catch(() => {})
    }
  }, [currentScript])

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
    // 타이핑 중이면 전체 텍스트를 한번에 표시
    if (typing) {
      setDisplayedText(bedScripts[currentScript].script)
      setTyping(false)
      return
    }

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
        {/* 모든 대사 이미지가 341x341 정방형 — 로드 전 높이 예약으로 대사 박스 위치 점프 방지 */}
        <img src={bedScripts[currentScript].img} width={341} height={341} alt="잠자는 사용자" className="h-auto w-full" />
      </div>
      {/**대사 박스 (전체 영역 클릭/키보드로 다음 진행) */}
      <button type="button" className="text-dialog mt-5 flex justify-between px-3 py-5 text-left" onClick={handleNextScript} aria-label="다음 대사">
        <p>
          {displayedText}
          {typing && <span className="animate-typing-cursor" />}
        </p>
        {/* 다음 표시 (타이핑이 끝나면 활성화) */}
        {!typing && (
          <span className="animate-glow">
            <img src={nextBtn} width={20} height={14} alt="" className="h-auto w-[90%] max-w-[100px]" />
          </span>
        )}
      </button>
    </div>
  )
}

export default Bed
