import confetti from 'canvas-confetti'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import secret from '../assets/etc/hmm.jpg'
import { useModal } from '../hook/useModal'

const SpecialThanks = () => {
  const [secretCount, setSecretCount] = useState(0)
  const { Modal, showModal, hideModal } = useModal()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const confettiInstance = useRef<any>(null)

  useEffect(() => {
    if (canvasRef.current) {
      confettiInstance.current = confetti.create(canvasRef.current, {
        resize: true, // 캔버스 크기를 자동으로 조정
        useWorker: true, // 성능 최적화
      })
    }
  }, [])

  // 폭죽 효과 설정
  const FIREWORK_CONFIG = {
    particleCount: 150,
    spread: 70,
    origin: { y: 0.7 },
  } as const

  const handleFireworks = useCallback(() => {
    confettiInstance.current?.(FIREWORK_CONFIG)
  }, [])

  /**신사동 이스터에그 */
  const handleSecretCount = () => {
    if (secretCount >= 10) {
      showModal(
        <div className="flex w-full flex-col gap-2 rounded-xl border-[3px] border-black bg-white p-3">
          <img src={secret} alt="secret" className="w-full" />
          <button
            className="btn main2"
            onClick={() => {
              setSecretCount(0)
              hideModal()
            }}
          >
            닫기
          </button>
        </div>,
      )
    }
    setSecretCount(secretCount + 1)
  }

  return (
    <div className="relative h-full bg-gradient-to-b from-white to-gray-200">
      <div className="flex h-full flex-col items-center gap-2 overflow-y-auto py-5">
        <div className="w-full break-all p-5 text-lg leading-relaxed">
          안녕하세요! 니니입니다. 지붕뚫고 이불킥은 매일 자기 전에 생각나는 고민들과 흑역사들 덕에 잠 못 이룬 밤이 많던 저의 모습을 반영한 서비스였습니다. 원래 기획자였던 제가 얼레벌레 픽셀도 찍고
          게임 디자인도 해보는 경험이 되었네요-! 이 게임도 나중에 보면 저의 흑역사일지도 모르지만, 그런 순간들이 모여야 인생이 재밌는 것 아니겠어요? 다들 즐기면서 살아보자구요 ㅎㅎ 감사합니다
          <p className="mt-1 text-right font-semibold text-yellow-400">@nini_neuru</p>
        </div>
        <div className="w-full break-all p-5 text-lg leading-relaxed">
          '지붕뚫고 이불킥'은 잠들기 전에 떠오르는 고민거리와 지우고 싶은 흑역사들을 이불과 함께 훌훌 날려버리자는 취지에서 시작된 프로젝트입니다. 고민이 담긴 이불을 멀리 날려보니 그동안 고민했던
          것들이 한결 가볍게 느껴지시진 않으셨나요? 그랬으면 좋겠네요. 한번쯤 자바스크립트로 게임을 만들어보고 싶었는데 생각보다 고된 과정이였습니다. 간단한 게임이지만, 재밌게 즐겨주세요!
          <p className="mt-1 text-right font-semibold text-blue-800">@nemobim</p>
        </div>
        <p className="mt-1 text-[12px] font-semibold">
          ps. special thanks to
          <span onClick={handleSecretCount} className="ml-1">
            @신사동 일반인
          </span>
        </p>
        {Modal}
        {/* 폭죽 효과*/}
        <canvas ref={canvasRef} className="pointer-events-none absolute left-0 top-0 h-full w-full" />
        <button onClick={handleFireworks} className="mt-2 flex flex-col gap-1 text-4xl" aria-label="폭죽 효과 보기">
          <span aria-hidden="true">👏</span>
          <span className="text-xs">click me</span>
        </button>
        <Link to="/content" className="mb-5 rounded-md bg-slate-600 px-2 py-1 text-white">
          되돌아가기
        </Link>
      </div>
    </div>
  )
}

export default SpecialThanks
