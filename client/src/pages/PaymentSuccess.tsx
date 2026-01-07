import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const PaymentSuccess = () => {
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user was redirected from Stripe
    const query = new URLSearchParams(location.search);
    const paymentIntent = query.get('payment_intent');
    
    if (paymentIntent) {
      // Here you would typically verify the payment on your server
      setMessage('Payment successful! Thank you for your purchase.');
    } else {
      setMessage('No payment information found.');
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          {message || 'Thank you for your purchase. Your payment was processed successfully.'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
