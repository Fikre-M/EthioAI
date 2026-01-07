import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '@store/store'
import { AppRoutes } from '@routes/AppRoutes'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { ToastContainer } from '@/components/ui/ToastContainer'
import { LoadingState } from '@/components/ui/LoadingState'
import './i18n'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaymentForm from "./components/PaymentForm";
import PaymentSuccess from "./pages/PaymentSuccess";

function App() {
  return (
    <Router>
      <Routes>
        <Route path=\"/payment\" element={<PaymentForm />} />
        <Route path=\"/payment/success\" element={<PaymentSuccess />} /></Routes>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <div className="overflow-x-hidden max-w-full min-w-0">
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 overflow-x-hidden max-w-full">
                <LoadingState 
                  text="Loading EthioAI Tourism..."
                  size="lg"
                  className="text-center px-4 max-w-full min-w-0"
                />
              </div>
            }>
              <AppRoutes />
            </Suspense>
            <ToastContainer />
          </div>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
     </Routes>
    </Router>
  )
}

export default App
