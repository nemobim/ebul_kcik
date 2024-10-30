import { Link } from 'react-router-dom'

const History = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5">
      <Link to="/game" className="rounded-md bg-slate-200 p-2">
        새로운 이불 날리기
      </Link>
      <Link to="/rank" className="rounded-md bg-slate-200 p-2">
        이불동산 구경가기
      </Link>
    </div>
  )
}

export default History
