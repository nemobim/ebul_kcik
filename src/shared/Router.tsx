import { BrowserRouter, Route, Routes } from 'react-router-dom'
import History from '../page/History'
import { NotFound } from '../page/NotFound'
import Splash from '../page/Splash'
import Tutorials from '../page/Tutorials'

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} /> {/*404페이지 */}
        <Route path="/" element={<Splash />} /> {/*스플래시 애니메이션 */}
        <Route path="/history" element={<History />} /> {/*기존 접속 이력 확인 */}
        <Route path="/tutorials" element={<Tutorials />} /> {/*튜토리얼 */}
        {/* <Route path="/game" element={<Game />} /> */}
        {/*게임 진행 */}
        {/* <Route path="/rank" element={<Rank />} /> */}
        {/*랭킹 */}
        {/* <Route path="/content" element={<Content />} /> */}
        {/*모아보기*/}
      </Routes>
    </BrowserRouter>
  )
}

export default Router
