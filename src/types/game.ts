/**타격 효과 */
export type TEffect = {
  id: number
  x: number
  y: number
}

/**게임 상태 */
export type TGameState = {
  worryLabel: TworryLabel | undefined // 고민 레이블
  score: number // 점수
  user: string // 유저 이름
  content: string // 고민 내용
}

/**고민 내용 적기 */
export type TWorryContent = {
  content: string
  label: string
  bgImg: string
  text: string
  id?: TworryLabel
}

/**고민 레이블 */
export type TworryLabel = 'talk' | 'young' | 'school' | 'work' | 'alcohol' | 'home' | 'idol' | 'heart' | 'etc'

/**고민 공감 반응 */
export type TworryReaction = 'shock' | 'laugh' | 'sad'

/**게임 내용 */
export type TGameContent = {
  id: string
  user: string
  userId: string
  score: number
  worryLabel: TworryLabel
  content: string
  createdAt: string
  reactions: Record<TworryReaction, number>
  reactionTotal: number
}

/** 정렬 타입 */
export type TSortType = 'createdAt' | 'score' | 'reactionTotal'
