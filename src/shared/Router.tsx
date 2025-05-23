import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Content from '../page/Content'
import Game from '../page/Game'
import { NotFound } from '../page/NotFound'
import Rank from '../page/Rank'
import SpecialThanks from '../page/SpecialThanks'
import Splash from '../page/Splash'
import Tutorials from '../page/Tutorials'

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} /> {/*404페이지 */}
        <Route path="/" element={<Splash />} /> {/*스플래시 애니메이션 */}
        <Route path="/tutorials" element={<Tutorials />} /> {/*튜토리얼 */}
        <Route path="/game" element={<Game />} /> {/*게임 진행 */}
        <Route path="/ranking" element={<Rank />} /> {/*랭킹 */}
        <Route path="/content" element={<Content />} /> {/*모아보기*/}
        <Route path="/special-thanks" element={<SpecialThanks />} /> {/*special thanks*/}
      </Routes>
    </BrowserRouter>
  )
}

export default Router
