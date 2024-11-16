import 'remixicon/fonts/remixicon.css'
import { AlertProvider } from './provider/AlertProvider'
import './shared/animated.css'
import Router from './shared/Router'

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto h-screen max-w-md bg-white">
        <AlertProvider>
          <Router />
        </AlertProvider>
      </div>
    </div>
  )
}

export default App
