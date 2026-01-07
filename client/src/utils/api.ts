import axios, { AxiosError } from "axios";

// Use Vite's environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies if you're using them
});

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

interface PaymentIntentResponse {
  clientSecret: string;
  // Add other fields as needed
}

export const createPaymentIntent = async (
  amount: number,
  currency: string = "usd"
): Promise<PaymentIntentResponse> => {
  try {
    const response = await api.post<PaymentIntentResponse>(
      "/payments/create-payment-intent",
      { amount, currency }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create payment intent"
    );
  }
};

// // Add other API calls as needed

// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// export const createPaymentIntent = async (amount: number, currency: string) => {
//   try {
//     const response = await axios.post(
//       `${API_URL}/payments/create-payment-intent`,
//       { amount, currency }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error creating payment intent:", error);
//     throw error;
//   }
// };