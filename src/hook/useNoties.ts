import { useContext } from 'react'
import { NotificationContext } from '../provider/AlertProvider'

/**잘못된 호출시 경고처리 */
export const useNoties = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('경고! 여기서는 알림을 쓸 수 없음!')
  }
  return context
}
