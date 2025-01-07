import React, { createContext, useState } from 'react'
import ReactDOM from 'react-dom'
import '../styles/modal.css'

/**Notice 종류 */
type NotificationType = 'success' | 'danger' | 'info' | 'warning'

type AlertProps = {
  noti: NotificationType
  title: string
  message?: string
  btnText: string
  onClose?: () => void
}

type ConfirmProps = {
  title: string
  message: string
  btn1: string
  btn2: string
  onConfirm?: () => void
  onCancel?: () => void
}

type ToastProps = {
  message: string
  noti: NotificationType
}

interface NotificationContextProps {
  showAlert: (props: AlertProps) => void
  showConfirm: (props: ConfirmProps) => void
  showToast: (props: ToastProps) => void
}

export const NotificationContext = createContext<NotificationContextProps | null>(null)

//대표 색상
const notificationStyles = {
  success: 'bg-green-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-yellow-500',
}

//대표 아이콘
const notificationIcons = {
  success: 'ri-checkbox-circle-line',
  danger: 'ri-close-circle-line',
  info: 'ri-information-line',
  warning: 'ri-error-warning-line',
}

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<React.ReactNode | null>(null)

  /**모달 생성 */
  const showNotification = (content: React.ReactNode) => {
    setNotification(content)
  }

  /**모달 닫기 */
  const closeNotification = () => {
    setNotification(null)
  }

  const showAlert = ({ noti, title, message, btnText, onClose }: AlertProps) => {
    showNotification(
      <div className="popup_wrap fade_in">
        <div className={`popup_cont ${notificationStyles[noti]}`}>
          <i className={notificationIcons[noti]} />
          <h4>{title}</h4>
          {message && <p>{message}</p>}
          <button
            onClick={() => {
              onClose?.()
              closeNotification()
            }}
          >
            {btnText}
          </button>
        </div>
      </div>,
    )
  }

  const showConfirm = ({ title, message, btn1, btn2, onConfirm, onCancel }: ConfirmProps) => {
    showNotification(
      <div className="popup_wrap fade_in">
        <div className="popup_cont">
          <h4>{title}</h4>
          <p>{message}</p>
          <div className="button_flex">
            <button
              onClick={() => {
                onCancel?.()
                closeNotification()
              }}
            >
              {btn1}
            </button>
            <button
              onClick={() => {
                onConfirm?.()
                closeNotification()
              }}
            >
              {btn2}
            </button>
          </div>
        </div>
      </div>,
    )
  }

  const showToast = ({ message, noti }: ToastProps) => {
    showNotification(
      <div className={`toast_popup_cont ${notificationStyles[noti]} slide_in`}>
        <i className={notificationIcons[noti]} />
        <p>{message}</p>
      </div>,
    )
    setTimeout(closeNotification, 3000) // 자동 닫힘
  }

  return (
    <NotificationContext.Provider value={{ showAlert, showConfirm, showToast }}>
      {children}
      {notification && ReactDOM.createPortal(notification, document.body)}
    </NotificationContext.Provider>
  )
}
