import React, { useState, useEffect } from 'react'
import './SkyAnimation.css'
import blanket from '../../assets/blanket.png' // 이불 이미지
import house from '../../assets/house.png' // 지붕 이미지

const SkyAnimation = () => {
  const [showHouse, setShowHouse] = useState(true) // 지붕 표시 여부
  const [startAnimation, setStartAnimation] = useState(false) // 배경 애니메이션 시작 여부
  const [score, setScore] = useState(0) // 로컬 스토리지에서 가져온 점수
  const [messageVisible, setMessageVisible] = useState(false) // 점수 표시 여부

  useEffect(() => {
    // 점수 가져오기
    const touchCount = Number(localStorage.getItem('touchCount')) || 0
    setScore(touchCount)

    // 4초 후 애니메이션 시작
    const timer = setTimeout(() => {
      setShowHouse(false)
      setStartAnimation(true)
    }, 4000)

    return () => clearTimeout(timer) // 타이머 클린업
  }, [])

  useEffect(() => {
    if (startAnimation) {
      // 배경 애니메이션이 끝난 후 점수 표시
      const animationDuration = getAnimationDuration(score)
      const timer = setTimeout(() => {
        setMessageVisible(true)
        setStartAnimation(false) // 애니메이션 종료
      }, animationDuration)

      return () => clearTimeout(timer)
    }
  }, [startAnimation, score])

  // 점수에 따른 배경 애니메이션 지속 시간 계산
  const getAnimationDuration = (score: number) => {
    if (score <= 50) return 4000 // 4초
    if (score <= 100) return 8000 // 8초
    if (score <= 150) return 12000 // 12초
    return 16000 // 16초
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 배경 */}
      <div
        className={`absolute left-0 top-0 h-full w-full ${startAnimation ? 'background-scroll' : ''}`}
        style={{
          animationDuration: `${getAnimationDuration(score)}ms`, // 점수에 따른 애니메이션 시간
        }}
      ></div>

      {/* 지붕 (초기 상태) */}
      {showHouse && <img src={house} alt="지붕" className="absolute bottom-0 left-1/2 w-48 -translate-x-1/2 transform" />}

      {/* 이불 */}
      {!messageVisible && (
        <img src={blanket} alt="이불" className={`absolute bottom-1/2 left-1/2 z-10 w-36 -translate-x-1/2 translate-y-1/2 transform ${startAnimation ? 'blanket-fly' : 'blanket-launch'}`} />
      )}

      {/* 점수 메시지 */}
      {messageVisible && <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-2xl font-bold">{score}m까지 날아갔습니다</div>}
    </div>
  )
}

export default SkyAnimation
