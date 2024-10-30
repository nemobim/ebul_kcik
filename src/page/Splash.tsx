import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Splash = () => {
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      navigate('/tutorials')
      //2초 후 이동
    }, 2000)
  }, [navigate])

  return (
    <div className="flex h-full items-center justify-center">
      <h1 className="text-6xl">이불 킥</h1>
    </div>
  )
}

export default Splash
