import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { createPaymentIntent } from "../utils/api";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { clientSecret } = await createPaymentIntent(1000, "usd");

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        });

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
      } else if (paymentIntent.status === "succeeded") {
        // Redirect to success page
        window.location.href = "/payment/success";
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border rounded-md p-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
