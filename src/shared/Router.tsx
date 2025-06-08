import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { LottieLoading } from '../components/Loading'
import Splash from '../page/Splash'
import Game from '../page/Game'
import Tutorials from '../page/Tutorials'
import NotFound from '../page/NotFound'

const Content = lazy(() => import('../page/Content'))
const Rank = lazy(() => import('../page/Rank'))
const SpecialThanks = lazy(() => import('../page/SpecialThanks'))

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LottieLoading />}>
        <Routes>
          <Route path="/" element={<Splash />} /> {/*스플래시 애니메이션 */}
          <Route path="/tutorials" element={<Tutorials />} /> {/*튜토리얼 */}
          <Route path="/game" element={<Game />} /> {/*게임 진행 */}
          <Route path="/ranking" element={<Rank />} /> {/*랭킹 */}
          <Route path="/content" element={<Content />} /> {/*모아보기*/}
          <Route path="/special-thanks" element={<SpecialThanks />} /> {/*special thanks*/}
          <Route path="*" element={<NotFound />} /> {/*404페이지 */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default Router
