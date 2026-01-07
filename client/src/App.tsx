// import { Suspense } from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Provider } from "react-redux";
// import { store } from "@store/store";
// import { AppRoutes } from "@routes/AppRoutes";
// import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
// import { ToastContainer } from "@/components/ui/ToastContainer";
// import { LoadingState } from "@/components/ui/LoadingState";
// import "./i18n";
// import PaymentForm from "./components/PaymentForm";
// import PaymentSuccess from "./pages/PaymentSuccess";

// function App() {
//   return (
//     <ErrorBoundary>
//       <Provider store={store}>
//         <BrowserRouter>
//           <div className="overflow-x-hidden max-w-full min-w-0">
//             <Suspense
//               fallback={
//                 <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 overflow-x-hidden max-w-full">
//                   <LoadingState
//                     text="Loading EthioAI Tourism..."
//                     size="lg"
//                     className="text-center px-4 max-w-full min-w-0"
//                   />
//                 </div>
//               }
//             >
//               <Routes>
//                 {/* Your existing app routes */}
//                 <Route path="/*" element={<AppRoutes />} />

//                 {/* Payment routes */}
//                 <Route path="/payment" element={<PaymentForm />} />
//                 <Route path="/payment/success" element={<PaymentSuccess />} />
//               </Routes>
//             </Suspense>
//             <ToastContainer />
//           </div>
//         </BrowserRouter>
//       </Provider>
//     </ErrorBoundary>
//   );
// }

// export default App;

import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { store } from "@store/store";
import { AppRoutes } from "@routes/AppRoutes";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { LoadingState } from "@/components/ui/LoadingState";
import "./i18n";
import PaymentForm from "./components/PaymentForm";
import PaymentSuccess from "./pages/PaymentSuccess";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
);

// Create a wrapper component for Stripe Elements
const StripeElementsWrapper = ({ children }: { children: React.ReactNode }) => (
  <Elements stripe={stripePromise} options={{}}>
    {children}
  </Elements>
);

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <div className="overflow-x-hidden max-w-full min-w-0">
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 overflow-x-hidden max-w-full">
                  <LoadingState
                    text="Loading EthioAI Tourism..."
                    size="lg"
                    className="text-center px-4 max-w-full min-w-0"
                  />
                </div>
              }
            >
              <Routes>
                {/* Your existing app routes */}
                <Route path="/*" element={<AppRoutes />} />

                {/* Payment routes wrapped with Stripe Elements */}
                <Route
                  path="/payment"
                  element={
                    <StripeElementsWrapper>
                      <PaymentForm />
                    </StripeElementsWrapper>
                  }
                />
                <Route
                  path="/payment/success"
                  element={
                    <StripeElementsWrapper>
                      <PaymentSuccess />
                    </StripeElementsWrapper>
                  }
                />
              </Routes>
            </Suspense>
            <ToastContainer />
          </div>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;