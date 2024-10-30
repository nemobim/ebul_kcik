import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Game from '../page/Game'
import History from '../page/History'
import { NotFound } from '../page/NotFound'
import Rank from '../page/Rank'
import Score from '../page/Score'
import Splash from '../page/Splash'
import Tutorials from '../page/Tutorials'

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Splash />} />
        <Route path="/history" element={<History />} />
        <Route path="/tutorials" element={<Tutorials />} />
        <Route path="/game" element={<Game />} />
        <Route path="/score" element={<Score />} />
        <Route path="/rank" element={<Rank />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
