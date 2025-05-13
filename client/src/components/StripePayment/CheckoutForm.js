import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { fetchUserProfile } from "../../redux/slices/userSlice";
import {
  setPaymentStatus,
  setErrorMessage,
  setClientSecret,
  setIsLoading,
  selectPaymentStatus,
  selectErrorMessage,
  selectClientSecret,
  selectIsLoading,
  resetPaymentState,
} from "../../redux/slices/paymentSlice";
import { FaSpinner } from "react-icons/fa";
import { createStripePaymentIntent } from "../../apis/stripePaymentAPI";

//----- Checkout Form Component -----//
const CheckoutForm = () => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { plan } = useParams();
  const location = useLocation();

  //----- Selectors For Handling Redux State -----//
  const paymentStatus = useSelector(selectPaymentStatus);
  const errorMessage = useSelector(selectErrorMessage);
  const clientSecret = useSelector(selectClientSecret);
  const isLoading = useSelector(selectIsLoading);

  const searchParams = new URLSearchParams(location.search);
  const amount = searchParams.get("amount");

  //----- Use Effect For Handling User Profile -----//
  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(resetPaymentState());

    //----- Initialize Payment -----//
    const initiatePayment = async () => {
      try {
        dispatch(setIsLoading(true));
        const paymentData = {
          amount: amount,
          subscriptionPlan: plan,
        };

        //----- Create Stripe Payment Intent -----//
        const response = await createStripePaymentIntent(paymentData);
        dispatch(setClientSecret(response.clientSecret));
      } catch (error) {
        console.error("Error Creating Payment Intent:", error);
        dispatch(
          setErrorMessage(
            error.response?.data?.message || "Failed To Initialize Payment."
          )
        );
        dispatch(setPaymentStatus("error"));
      } finally {
        dispatch(setIsLoading(false));
      }
    };

    initiatePayment();

    //----- Reset Payment State -----//
    return () => {
      dispatch(resetPaymentState());
    };
  }, [dispatch, amount, plan]);

  //----- Handle Submit -----//
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    dispatch(setPaymentStatus("processing"));

    //----- Submit Payment -----//
    try {
      const { error: submitError } = await elements.submit();

      //----- Handle Submit Error -----//
      if (submitError) {
        dispatch(setErrorMessage(submitError.message));
        dispatch(setPaymentStatus("error"));
        return;
      }

      //----- Confirm Payment -----//
      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        dispatch(setErrorMessage(result.error.message));
        dispatch(setPaymentStatus("error"));
      } else {
        //----- Set Payment Status -----//
        dispatch(setPaymentStatus("succeeded"));
        navigate(`/success?session_id=${result.paymentIntent.id}`);
      }
    } catch (error) {
      console.error("Payment Error:", error);
      dispatch(
        setErrorMessage(error.message || "An Unexpected Error Occurred.")
      );
      dispatch(setPaymentStatus("error"));
    }
  };

  //----- Return Checkout Form -----//
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{plan} Plan</h2>
          <p className="text-gray-600 mt-1">${amount} per month</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <FaSpinner className="animate-spin h-8 w-8 text-[#5a3470]" />
            <span className="sr-only">Loading payment form...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />

            {errorMessage && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Payment Error
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      {errorMessage}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={
                !stripe || paymentStatus === "processing" || !clientSecret
              }
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#432752] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paymentStatus === "processing" ? (
                <>
                  <FaSpinner className="animate-spin h-5 w-5 mr-2" />{" "}
                  Processing...
                </>
              ) : (
                "Pay Now"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CheckoutForm;
