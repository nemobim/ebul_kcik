import { NavLink } from 'react-router-dom'

const RANK_NAV = [
  { title: '랭킹 보기', url: '/ranking' },
  { title: '내용 보기', url: '/content' },
]

const TabNavigation = () => {
  return (
    <div className="flex w-[80%] rounded-lg border-[3px] border-black bg-white">
      {RANK_NAV.map((nav, index) => (
        <NavLink
          key={nav.url}
          to={nav.url}
          className={({ isActive }) =>
            `flex-1 py-2 text-center text-xl transition-all ${isActive ? `${index === 0 ? 'rounded-r-md border-r-[3px]' : 'rounded-l-md border-l-[3px]'} border-black bg-main2 text-white` : 'text-gray3'}`
          }
        >
          {nav.title}
        </NavLink>
      ))}
    </div>
  )
}

export default TabNavigation
