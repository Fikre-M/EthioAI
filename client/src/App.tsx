import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '@store/store'
import { AppRoutes } from '@routes/AppRoutes'
import './i18n'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="overflow-x-hidden max-w-full min-w-0">
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 overflow-x-hidden max-w-full">
              <div className="text-center px-4 max-w-full min-w-0">
                <div className="text-6xl mb-4 animate-bounce">🌍</div>
                <div className="text-2xl font-bold text-gradient-ethiopian mb-2 line-clamp-2">EthioAI Tourism</div>
                <div className="text-lg text-gray-600">Loading...</div>
              </div>
            </div>
          }>
            <AppRoutes />
          </Suspense>
        </div>
      </BrowserRouter>
    </Provider>
  )
}

export default App
