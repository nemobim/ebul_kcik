import RankTab from '../components/rank/RankTab'
import { rankImg } from '../utils/rank'

const Rank = () => {
  const RANK = [
    { score: 487, user: '잠만보' },
    { score: 452, user: '고민킬러' },
    { score: 433, user: '불면증' },
    { score: 421, user: '새벽달' },
    { score: 398, user: '걱정봇' },
    { score: 376, user: '잠꾸러기' },
    { score: 354, user: '고민냠' },
    { score: 332, user: '불안이' },
    { score: 321, user: '스트맨' },
    { score: 309, user: '걱정이' },
    { score: 287, user: '잠도둑' },
    { score: 265, user: '고민제로' },
    { score: 243, user: '불면이' },
    { score: 221, user: '새벽이' },
    { score: 198, user: '걱정마' },
    { score: 176, user: '잠요정' },
    { score: 154, user: '고민이' },
    { score: 132, user: '불안맨' },
    { score: 121, user: '스트짱' },
    { score: 109, user: '걱정해' },
  ]

  const MY_RANK = {
    score: 300,
    rank: 5,
    user: '닉네임임당',
  }

  return (
    <div className="bg-worry relative flex h-full flex-col items-center overflow-y-auto pt-12">
      <RankTab />
      {/**1,2,3 위 순위 */}
      <div className="my-5 flex w-[90%]">
        {[1, 0, 2].map(rank => (
          <div key={rank} className="flex w-1/3 flex-col items-center justify-end gap-3">
            <span className="font-galmuri9 text-xl">{RANK[rank].user}</span>
            <p className="text-sm">{RANK[rank].score} mm</p>
            <img src={rankImg[rank]} className="w-[80%]" alt={`rank_${rank}`} />
            <p className="text-lg font-semibold text-main3">{rank + 1}등</p>
          </div>
        ))}
      </div>
      <div className="mb-2 flex w-full flex-col gap-2">
        {RANK.slice(3).map((rank, index) => (
          <div key={rank.user} className="flex w-full items-center justify-between border-y-[3px] border-black bg-white px-10 py-4">
            <span className="text-sm text-main3">{index + 4}등</span>
            <span className="font-galmuri9">{rank.user}</span>
            <p className="text-sm">{rank.score} mm</p>
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 flex min-h-[4rem] w-[80%] max-w-[26rem] justify-between rounded-t-lg border-x-[3px] border-t-[3px] border-black bg-main2 px-10 pt-2 text-white">
        <span className="text-sm">{MY_RANK.rank}등</span>
        <span className="font-galmuri9">{MY_RANK.user}</span>
        <p className="text-sm">{MY_RANK.score} mm</p>
      </div>
    </div>
  )
}

export default Rank
