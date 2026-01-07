import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    useStripe,
    useElements,
    CardElement,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || ""
);

const SubscriptionCheckoutForm = ({
    priceId,
    onSuccess,
}: {
    priceId: string;
    onSuccess: () => void;
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [customer, setCustomer] = useState<any>(null);

    useEffect(() => {
    // Fetch or create customer
    const initializeCustomer = async () => {
      // In a real app, you would typically fetch the customer from your backend
        // This is a simplified example
        const customer = await fetch("/api/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
        setCustomer(customer);
    };

    initializeCustomer();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !customer) return;

    setLoading(true);
    setError(null);

    try {
      // Create payment method
        const { error: paymentMethodError, paymentMethod } =
            await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)!,
            });

        if (paymentMethodError) {
            throw new Error(paymentMethodError.message);
        }

      // Create subscription
        const response = await fetch("/api/payments/subscriptions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            customerId: customer.id,
            priceId,
            paymentMethodId: paymentMethod.id,
            }),
        });

        const subscription = await response.json();

        if (subscription.error) {
            throw new Error(subscription.error);
        }

        onSuccess();
        } catch (err: any) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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
        <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
            {loading ? "Processing..." : "Subscribe"}
        </button>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </form>
    );
    };

    const SubscriptionPlans = () => {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
    const navigate = useNavigate();

    const plans = [
        {
        id: "price_1P9R9T2eZvKYlo2C4s6t3X4L", // Replace with your actual price ID
        name: "Basic",
        price: "$9.99",
        features: ["Feature 1", "Feature 2", "Feature 3"],
        },
        {
        id: "price_1P9R9T2eZvKYlo2C4s6t3X4M", // Replace with your actual price ID
        name: "Pro",
        price: "$19.99",
        features: ["All Basic features", "Feature 4", "Feature 5"],
        },
        {
        id: "price_1P9R9T2eZvKYlo2C4s6t3X4N", // Replace with your actual price ID
        name: "Enterprise",
        price: "$49.99",
        features: ["All Pro features", "Feature 6", "Priority Support"],
        },
    ];

    if (subscriptionSuccess) {
        return (
        <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Subscription Successful!</h2>
            <p className="mb-6">Thank you for subscribing to our service.</p>
            <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
            Go to Dashboard
            </button>
        </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Choose Your Plan</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
            <div
                key={plan.id}
                className={`border rounded-lg p-6 ${
                selectedPlan === plan.id
                    ? "border-blue-500 ring-2 ring-blue-300"
                    : "border-gray-200"
                }`}
            >
                <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
                <p className="text-3xl font-bold mb-4">
                {plan.price}
                <span className="text-sm font-normal text-gray-500">/month</span>
                </p>

                <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                    <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                        />
                    </svg>
                    {feature}
                    </li>
                ))}
                </ul>

                <button
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full py-2 px-4 rounded ${
                    selectedPlan === plan.id
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                >
                {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                </button>
            </div>
            ))}
        </div>

        {selectedPlan && (
            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Complete Your Subscription</h2>
            <Elements stripe={stripePromise}>
                <SubscriptionCheckoutForm
                priceId={selectedPlan}
                onSuccess={() => setSubscriptionSuccess(true)}
                />
            </Elements>
            </div>
        )}
        </div>
    );
};

export default SubscriptionPlans;
