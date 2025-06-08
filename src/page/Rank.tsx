import { useEffect, useState, useMemo } from 'react'
import { useGetTopRanks } from '../api/firebaseApi'
import { SpinnerLoading } from '../components/Loading'
import RankTab from '../components/rank/RankTab'
import { TGameContent } from '../types/game'
import { getMyRank } from '../utils/content'
import { rankImg } from '../utils/rank'

const Rank = () => {
  const { data: ranks = [], isLoading, isError } = useGetTopRanks()
  const [myRank, setMyRank] = useState<{ rank: number; content: TGameContent } | null>(null)
  const docId = localStorage.getItem('isPlay') // 가장최근 게임아이디

  const sortedRanks = useMemo(() => ranks.slice(3), [ranks])

  useEffect(() => {
    if (ranks.length > 0 && docId) {
      const myRank = getMyRank(ranks, docId)
      setMyRank(myRank)
    }
  }, [ranks, docId])

  return (
    <div className="relative h-full">
      {isLoading || isError ? (
        <SpinnerLoading />
      ) : (
        <div className="bg-worry flex h-full flex-col items-center overflow-y-auto pb-4 pt-12">
          <RankTab />
          {/**1,2,3 위 순위 */}
          <div className="my-5 flex w-[90%]">
            {[1, 0, 2].map(rank => (
              <div key={rank} className="flex w-1/3 flex-col items-center justify-end gap-3">
                <span className="font-galmuri9 text-xl">{ranks[rank]?.user || '???'}</span>
                <p className="text-sm">{ranks[rank]?.score || '-'}m</p>
                <img src={rankImg[rank]} className="w-[80%]" alt={`rank_${rank}`} />
                <p className="text-lg font-semibold text-main3">{rank + 1}등</p>
              </div>
            ))}
          </div>
          <div className="mb-16 flex w-full flex-col gap-2">
            {sortedRanks.map((rank, index) => (
              <div key={rank.id} className="flex w-full items-center justify-between border-y-[3px] border-black bg-white px-10 py-4">
                <span className="text-sm text-main3">{index + 4}등</span>
                <span className="font-galmuri9">{rank.user}</span>
                <p className="text-sm">{rank.score} m</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* 나의 등수 플로팅 */}
      {myRank && myRank.rank && !isLoading && (
        <div className="absolute bottom-0 left-0 w-full px-4">
          <div className="mx-auto flex h-[4rem] w-full max-w-[900px] justify-between rounded-t-lg border-x-[3px] border-t-[3px] border-black bg-main2 px-6 pt-4 text-white">
            <span className="text-sm">{myRank.rank}등</span>
            <span className="font-galmuri9">{myRank.content.user}</span>
            <p className="text-sm">{myRank.content.score} m</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Rank
