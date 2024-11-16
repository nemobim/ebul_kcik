import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import sleepUserImg from '../../assets/sleep_user.png'

const Bed = () => {
  const navigate = useNavigate()
  const scripts = useMemo(() => ['무슨 대사를 넣을까?', '너무너무 졸려요', '잠자고 싶다', '어쨌든 잠이 안 오는 어쩌고 저쩌고 대사 끝'], [])

  const [currentScript, setCurrentScript] = useState(0) // 현재 대사 인덱스
  const [displayedText, setDisplayedText] = useState('') // 화면에 출력될 텍스트
  const [typing, setTyping] = useState(true) // 타이핑 중 여부

  // 타자기 효과 구현
  useEffect(() => {
    let index = 0

    if (typing) {
      const interval = setInterval(() => {
        const currentChar = scripts[currentScript]?.[index] // 안전하게 현재 문자를 가져옴
        if (currentChar !== undefined) {
          setDisplayedText(prev => prev + currentChar)
          index++
        } else {
          clearInterval(interval)
          setTyping(false) // 타이핑 종료
        }
      }, 200) // 200ms마다 한 글자씩 추가
      return () => clearInterval(interval) // 컴포넌트 언마운트 시 정리
    }
  }, [currentScript, typing, scripts])

  // 다음 대사로 이동
  const handleNextScript = () => {
    if (!typing && currentScript < scripts.length - 1) {
      setTyping(true)
      setCurrentScript(prev => prev + 1)
      setDisplayedText('') // 다음 대사로 넘어갈 때 텍스트 초기화
    } else if (!typing && currentScript === scripts.length - 1) {
      navigate('/game')
      // 모든 대사가 끝났을 경우 페이지 이동
    }
  }

  return (
    <div className="relative flex h-screen flex-col items-center justify-center gap-5 bg-black">
      {/* 배경 이미지 */}
      <img src={sleepUserImg} alt="잠자는 사용자" className="relative opacity-25" />

      {/* 대사 박스 */}
      <div className="relative flex items-center justify-center">
        <div className="relative w-[300px] rounded-md bg-white p-5 text-lg">
          {/* 대사 출력 */}
          {displayedText}
          {typing && <span className="typing-cursor">|</span>}
          {/* 다음 버튼 - 삼각형 모양 */}
          {!typing && (
            <div className="absolute bottom-0 right-0 m-2 cursor-pointer" onClick={handleNextScript}>
              <i className="ri-arrow-down-s-fill text-3xl text-blue-500 transition-colors duration-200 hover:text-blue-600" title="다음" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Bed
