import axios from "axios";
import config from "../config";

const API_URL = config.API_URL;

//----- Create Stripe Checkout Session -----
export const createCheckoutSession = async (priceId) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/stripe/create-checkout-session`,
      { priceId },
      {
        withCredentials: true,
        timeout: 10000,
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Failed to create checkout session:", error.message);
    if (error.response) {
      console.error(
        "Error response:",
        error.response.status,
        error.response.data
      );
    }
    throw error;
  }
};

//----- Free Subscription -----
export const handleFreeSubscription = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/api/stripe/free-plan`,
      {},
      {
        withCredentials: true,
        timeout: 10000,
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Failed to activate free plan:", error.message);
    if (error.response) {
      console.error(
        "Error response:",
        error.response.status,
        error.response.data
      );
    }
    throw error;
  }
};

//----- Stripe Payment Intent -----
export const createStripePaymentIntent = async (payment) => {
  try {
    if (!payment) {
      throw new Error("Payment information is required");
    }

    const response = await axios.post(
      `${API_URL}/api/stripe/checkout`,
      {
        amount: Number(payment?.amount) || 0,
        subscriptionPlan: payment?.subscriptionPlan || "basic",
      },
      {
        withCredentials: true,
        timeout: 15000, // 15 second timeout - payment creation might take longer
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Failed to create payment intent:", error.message);
    if (error.response) {
      console.error(
        "Error response:",
        error.response.status,
        error.response.data
      );
    }
    throw error;
  }
};

//----- Verify Payment Intent -----
export const verifyPayment = async (paymentId) => {
  try {
    if (!paymentId) {
      throw new Error("Payment ID is required for verification");
    }

    const url = paymentId.includes("=")
      ? `${API_URL}/api/stripe/verify-payment?session_id=${paymentId}`
      : `${API_URL}/api/stripe/verify-payment/${paymentId}`;

    const response = await axios.post(
      url,
      {},
      {
        withCredentials: true,
        timeout: 5000,
      }
    );

    if (
      response.data &&
      (response.data.verified || response.data.paymentStatus === "succeeded")
    ) {
      try {
        await updateSubscription(paymentId);
      } catch (updateError) {
        console.error("Failed to update subscription:", updateError.message);
      }
    }

    return response?.data;
  } catch (error) {
    console.error("Verification Error:", error.message);
    if (error.response) {
      console.error(
        "Error response:",
        error.response.status,
        error.response.data
      );
    }
    throw error;
  }
};

const updateSubscription = async (paymentId) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/stripe/update-subscription`,
      { paymentId },
      {
        withCredentials: true,
        timeout: 5000,
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Failed to update subscription:", error.message);
    throw error;
  }
};
