import { useNavigate } from 'react-router-dom'
import Error from '../components/error/Error'

export const NotFound = () => {
  const navigate = useNavigate()

  /**홈으로 이동 */
  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <Error title="페이지를 찾을 수 없어요!" text="해당 페이지는 존재하지 않습니다.">
      <button onClick={handleGoHome} className="btn main2 mt-4">
        홈으로 이동
      </button>
    </Error>
  )
}
