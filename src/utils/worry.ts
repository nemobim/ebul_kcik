import alcohol from '../assets/game/write/alcohol.png'
import alcohol_pattern from '../assets/game/write/alcohol_pattern.png'
import etc from '../assets/game/write/etc.png'
import etc_pattern from '../assets/game/write/etc_pattern.png'
import heart from '../assets/game/write/heart.png'
import heart_pattern from '../assets/game/write/heart_pattern.png'
import home from '../assets/game/write/home.png'
import home_pattern from '../assets/game/write/home_pattern.png'
import idol from '../assets/game/write/idol.png'
import idol_pattern from '../assets/game/write/idol_pattern.png'
import school from '../assets/game/write/school.png'
import school_pattern from '../assets/game/write/school_pattern.png'
import talk from '../assets/game/write/talk.png'
import talk_pattern from '../assets/game/write/talk_pattern.png'
import work from '../assets/game/write/work.png'
import work_pattern from '../assets/game/write/work_pattern.png'
import young from '../assets/game/write/young.png'
import young_pattern from '../assets/game/write/young_pattern.png'
import laugh from '../assets/rank/cryingLaugh.png'
import sad from '../assets/rank/hing.png'
import shock from '../assets/rank/shock.png'
import { TworryLabel, TworryReaction } from '../types/game'

export const WORRY_LIST: { img: string; label: string; text: string; bgImg: string; id: TworryLabel }[] = [
  { img: talk, label: '말', text: '입이 문제야', bgImg: talk_pattern, id: 'talk' },
  { img: young, label: '어린시절', text: '귀엽지만은 않은 어린시절', bgImg: young_pattern, id: 'young' },
  { img: school, label: '학교', text: '교실에 묻어둔 이야기', bgImg: school_pattern, id: 'school' },
  { img: work, label: '직장', text: '회사에서 또 무슨 일이...', bgImg: work_pattern, id: 'work' },
  { img: alcohol, label: '술', text: '술이 웬수야', bgImg: alcohol_pattern, id: 'alcohol' },
  { img: home, label: '집', text: '베개에만 털어놓는 사연들', bgImg: home_pattern, id: 'home' },
  { img: idol, label: '덕질', text: '덕질이 나를 ... 이렇게', bgImg: idol_pattern, id: 'idol' },
  { img: heart, label: '사랑', text: '사랑이 죄는 아닌데...', bgImg: heart_pattern, id: 'heart' },
  { img: etc, label: '기타', text: '별별 일들이 많잖아요..?', bgImg: etc_pattern, id: 'etc' },
]

export const worryImage: Record<TworryLabel, { img: string; bgImg: string }> = {
  talk: {
    img: talk,
    bgImg: talk_pattern,
  },
  young: {
    img: young,
    bgImg: young_pattern,
  },
  school: {
    img: school,
    bgImg: school_pattern,
  },
  work: {
    img: work,
    bgImg: work_pattern,
  },
  alcohol: {
    img: alcohol,
    bgImg: alcohol_pattern,
  },
  home: {
    img: home,
    bgImg: home_pattern,
  },
  idol: {
    img: idol,
    bgImg: idol_pattern,
  },
  heart: {
    img: heart,
    bgImg: heart_pattern,
  },
  etc: {
    img: etc,
    bgImg: etc_pattern,
  },
}

export const reactionIcon: Record<TworryReaction, string> = {
  shock: shock,
  laugh: laugh,
  sad: sad,
}
