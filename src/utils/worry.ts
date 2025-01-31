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
import shock from '../assets/rank/shock.png'
import laugh from '../assets/rank/cryingLaugh.png'
import sad from '../assets/rank/hing.png'

export const worryList = [
  { img: talk, label: '말', text: '입이 문제야', bgImg: talk_pattern },
  { img: young, label: '어린시절', text: '귀엽지만은 않은 어린시절', bgImg: young_pattern },
  { img: school, label: '학교', text: '교실에 묻어둔 이야기', bgImg: school_pattern },
  { img: work, label: '직장', text: '회사에서 또 무슨 일이...', bgImg: work_pattern },
  { img: alcohol, label: '술', text: '술이 웬수야', bgImg: alcohol_pattern },
  { img: home, label: '집', text: '베개에만 털어놓는 사연들', bgImg: home_pattern },
  { img: idol, label: '덕질', text: '덕질이 나를 ... 이렇게', bgImg: idol_pattern },
  { img: heart, label: '사랑', text: '사랑이 죄는 아닌데...', bgImg: heart_pattern },
  { img: etc, label: '기타', text: '별별 일들이 많잖아요..?', bgImg: etc_pattern },
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

export type TworryLabel = 'talk' | 'young' | 'school' | 'work' | 'alcohol' | 'home' | 'idol' | 'heart' | 'etc'

export type TworryContent = {
  id: number
  user: string
  score: number
  reaction: number
  worryLabel: TworryLabel
  worryContent: string
}

export type TworryReaction = 'shock' | 'laugh' | 'sad'

export const reactionIcon: Record<TworryReaction, string> = {
  shock: shock,
  laugh: laugh,
  sad: sad,
}

export const RANK_CONTENT: TworryContent[] = [
  {
    id: 1,
    user: '하늘맘',
    score: 160,
    reaction: 142,
    worryLabel: 'school',
    worryContent:
      '고등학교 때 교실에서 졸다가 침 흘린 게 아직도 트라우마에요. 옆자리 친구가 깨워줬는데, 책상에 침 자국이 커다랗게 남아있었고 반 애들이 다 봤어요. 그 때부터 학교에서 절대 조는 걸 용납 못하게 됐습니다...',
  },
  {
    id: 2,
    user: '구름이',
    score: 120,
    reaction: 231,
    worryLabel: 'work',
    worryContent: "신입사원 시절 중요한 회의 도중 상사 이름을 완전 다르게 불러버렸어요. 김부장님을 박부장님이라고... 그 이후로 1년 내내 제 별명이 '박부장님'이 되었답니다.",
  },
  {
    id: 3,
    user: '달토끼',
    score: 178,
    reaction: 167,
    worryLabel: 'alcohol',
    worryContent: "회식 때 너무 취해서 사장님 어깨에 기대서 잠들어버렸어요. 다음 날 사장님께서 '어제 잘 주무셨어요?' 하시는데 땅이 갈라져서 들어가고 싶었습니다...",
  },
  {
    id: 4,
    user: '바다롱',
    score: 88,
    reaction: 195,
    worryLabel: 'heart',
    worryContent: "소개팅에서 첫만남에 상대방 이름을 까먹어서 2시간 내내 이름을 한 번도 못 불렀어요. 급한 김에 연락처를 교환할 때 '저기 있잖아요...'라고 불렀더니 그 자리에서 차였습니다.",
  },
  {
    id: 5,
    user: '꿈나무',
    score: 55,
    reaction: 278,
    worryLabel: 'idol',
    worryContent: '팬사인회에서 너무 긴장한 나머지 준비해간 편지를 떨어뜨렸는데, 줍다가 테이블에 머리를 쿵 박았어요. 아이돌이 놀라서 일어났고, 팬들이 다 쳐다봤죠...',
  },
  {
    id: 6,
    user: '별빛달',
    score: 82,
    reaction: 145,
    worryLabel: 'talk',
    worryContent: '친구랑 카페에서 수다 떨다가 옆 테이블 손님 험담을 했는데, 알고보니 그분이 한국어를 아주 잘하는 외국인이었어요. 째려보시더라고요...',
  },
  {
    id: 7,
    user: '봄날이',
    score: 91,
    reaction: 234,
    worryLabel: 'young',
    worryContent: '중학생 때 짝사랑하는 애한테 고백편지를 썼는데, 하필 그날 담임선생님이 가방검사를 하셨어요. 편지가 발견되어서 전교생 앞에서 읽히는 수모를 당했죠.',
  },
  {
    id: 8,
    user: '산들맘',
    score: 87,
    reaction: 198,
    worryLabel: 'home',
    worryContent: '집들이에 친구들을 초대했는데, 새로 산 강아지가 너무 신이 났는지 친구 가방에다 실수를 해버렸어요. 명품가방이었다는게 함정...',
  },
  {
    id: 9,
    user: '물방울',
    score: 93,
    reaction: 256,
    worryLabel: 'etc',
    worryContent: '지하철에서 잠들어서 종점까지 가버렸는데, 깨어보니 제 침이 옆사람 어깨에 흘러내려있었어요. 그분이 깨우시면서 휴지를 건네주시더라고요...',
  },
  {
    id: 10,
    user: '햇살맘',
    score: 89,
    reaction: 187,
    worryLabel: 'school',
    worryContent: '수학여행 때 단체사진 찍는데 뒷줄에서 방귀를 뀌었어요. 다들 누군지 모르니까 서로 쳐다보면서 수군거렸는데, 저만 괜히 고개 숙이고 있었더니 들킨 거 같아요...',
  },
  {
    id: 11,
    user: '강냥이',
    score: 86,
    reaction: 165,
    worryLabel: 'work',
    worryContent: '재택근무 중 화상회의할 때 카메라 켜는 걸 깜빡하고 마스크팩 하고 있었는데, 갑자기 상사가 카메라 켜달라고 하셔서 민망한 모습을 보여줬어요.',
  },
  {
    id: 12,
    user: '달빛별',
    score: 94,
    reaction: 245,
    worryLabel: 'heart',
    worryContent: '소개팅 나갔다가 화장실 가는 길에 넘어져서 무릎에 피가 났어요. 바지가 찢어져서 결국 집에 가겠다고 하고 도망쳤죠...',
  },
  {
    id: 13,
    user: '꽃님이',
    score: 83,
    reaction: 178,
    worryLabel: 'talk',
    worryContent: '친구랑 통화하면서 상사 욕을 하고 있었는데, 통화가 제대로 안 끊겨서 회사 전체 단톡방에 음성이 그대로 전송됐어요. 다음날 출근을 어떻게 했는지...',
  },
  {
    id: 14,
    user: '바람솔',
    score: 90,
    reaction: 223,
    worryLabel: 'alcohol',
    worryContent: '술자리에서 전 애인 얘기하다가 울어버렸는데, 그게 SNS 실시간 방송 중이었다는 거... 다음날 조회수가 만단위였어요.',
  },
  {
    id: 15,
    user: '숲이랑',
    score: 85,
    reaction: 156,
    worryLabel: 'young',
    worryContent: '초등학교 때 짝꿍 좋아한다고 쪽지 건넸다가 바로 옆 반 애한테 전달됐어요. 그 애가 교실로 찾아와서 대판 거절하는 바람에 온 학교가 다 알게 됐죠.',
  },
  {
    id: 16,
    user: '파도롱',
    score: 96,
    reaction: 289,
    worryLabel: 'idol',
    worryContent: '콘서트에서 최전방 자리였는데 너무 신나서 응원봉 놓쳐서 날아가버렸어요. 하필 무대 위로 날아가서 아이돌이 그거 피하느라 안무가 흐트러졌죠...',
  },
  {
    id: 17,
    user: '하늘맘',
    score: 88,
    reaction: 198,
    worryLabel: 'home',
    worryContent: '이사 첫날밤에 현관문 비밀번호를 까먹어서 경비실에 신고했는데, 알고보니 옆집을 계속 두들기고 있었어요. 그 뒤로 이웃이랑 인사도 못 해요.',
  },
  {
    id: 18,
    user: '구름양',
    score: 92,
    reaction: 234,
    worryLabel: 'etc',
    worryContent: "지하철에서 핸드폰 보면서 웃고 있었는데, 옆자리 아저씨가 '무슨 웃긴 걸 보나' 하면서 핸드폰을 들여다보셨어요. 하필 그때 보고 있던 게 제 개인사진이었죠...",
  },
  {
    id: 19,
    user: '달빛맘',
    score: 87,
    reaction: 167,
    worryLabel: 'school',
    worryContent: '학교 축제 때 장기자랑으로 춤을 췄는데, 바지가 찢어진 줄도 모르고 끝까지 췄어요. 영상이 학교 커뮤니티에 올라가서 한동안 학교 전설이 됐습니다.',
  },
  {
    id: 20,
    user: '별마루',
    score: 91,
    reaction: 212,
    worryLabel: 'work',
    worryContent: '중요한 프레젠테이션 하는데 PPT가 안 넘어가서 당황했는데, 알고보니 마우스 배터리가 다 된 거였어요. 결국 키보드로 넘기면서 진행했는데, 너무 떨려서 말도 더듬고...',
  },
]
