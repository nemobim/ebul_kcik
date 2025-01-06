import { NavLink } from 'react-router-dom'

const RankLayout = () => {
  const RANK_NAV = [
    { title: '랭킹보기', url: '/rank' },
    { title: '내용보기', url: '/content' },
  ]
  return (
    <div className="flex">
      {RANK_NAV.map(nav => (
        <NavLink to={nav.url} className={({ isActive }) => `flex-1 py-2 text-center font-bold ${isActive ? 'bg-red-300 text-white' : 'bg-gray-200 text-gray-500'}`}>
          {nav.title}
        </NavLink>
      ))}
    </div>
  )
}

export default RankLayout
