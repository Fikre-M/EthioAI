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
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">🌍</div>
              <div className="text-2xl font-bold text-gradient-ethiopian mb-2">EthioAI Tourism</div>
              <div className="text-lg text-gray-600">Loading...</div>
            </div>
          </div>
        }>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </Provider>
  )
}

export default App
