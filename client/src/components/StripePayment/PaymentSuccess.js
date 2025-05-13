import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBug,
} from "react-icons/fa";
import { verifyPayment } from "../../apis/stripePaymentAPI";
import {
  setPaymentStatus,
  setSuccessMessage,
  setDebugInfo,
  incrementRetryCount,
  selectPaymentStatus,
  selectSuccessMessage,
  selectDebugInfo,
  selectRetryCount,
} from "../../redux/slices/paymentSlice";

//----- Payment Success Component -----//
export default function PaymentSuccess() {
  //----- Dispatch For Handling Redux Actions -----//
  const dispatch = useDispatch();
  //----- Location For Handling URL Search Params -----//
  const location = useLocation();

  //----- Selectors For Handling Redux State -----//
  const status = useSelector(selectPaymentStatus);
  const message = useSelector(selectSuccessMessage);
  const debugInfo = useSelector(selectDebugInfo);
  const retryCount = useSelector(selectRetryCount);

  //----- Search Params For Handling URL Search Params -----//
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get("session_id");
  const debug = searchParams.get("debug") === "true";

  //----- Use Effect For Handling Payment Status -----//
  useEffect(() => {
    if (!sessionId) {
      dispatch(setPaymentStatus("Failed"));
      dispatch(
        setSuccessMessage(
          "No Session ID Provided. Payment Verification Failed."
        )
      );
      return;
    }

    //----- Check Payment Status -----//
    const checkPaymentStatus = async () => {
      try {
        dispatch(setPaymentStatus("loading"));

        const response = await verifyPayment(sessionId);

        if (response.verified || response.paymentStatus === "succeeded") {
          dispatch(setPaymentStatus("success"));
          dispatch(
            setSuccessMessage(response.message || "Payment Successful!")
          );
          dispatch(setDebugInfo(response));
        } else {
          if (
            (response.status === "processing" ||
              response.paymentStatus === "processing") &&
            retryCount < 3
          ) {
            dispatch(incrementRetryCount());
            dispatch(setPaymentStatus("loading"));
            dispatch(setSuccessMessage("Payment Is Still Processing..."));

            setTimeout(() => checkPaymentStatus(), 2000);
          } else {
            dispatch(setPaymentStatus("failed"));
            dispatch(
              setSuccessMessage(
                response.message || "Payment Verification Failed."
              )
            );
          }
        }
      } catch (error) {
        console.error("Payment Verification Error:", error);
        dispatch(setPaymentStatus("failed"));
        dispatch(
          setSuccessMessage("An Error Occurred While Verifying Payment.")
        );
        dispatch(setDebugInfo({ error: error.message }));
      }
    };

    checkPaymentStatus();
  }, [sessionId, dispatch, retryCount]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {status === "loading" && (
            <>
              <FaSpinner className="mx-auto h-12 w-12 text-[#5a3470] animate-spin" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Processing Payment
              </h2>
              <p className="mt-2 text-gray-600">
                Please wait while we confirm your payment...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <FaCheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Payment Successful!
              </h2>
              <p className="mt-2 text-gray-600">{message}</p>
            </>
          )}

          {status === "failed" && (
            <>
              <FaExclamationTriangle className="mx-auto h-12 w-12 text-red-500" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Payment Verification Failed
              </h2>
              <p className="mt-2 text-gray-600">{message}</p>
            </>
          )}

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/dashboard?payment=true"
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470] hover:opacity-90"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/generate-content"
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Generate Content
            </Link>
          </div>

          {debug && (
            <div className="mt-6 p-3 bg-gray-100 rounded-md text-left">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                <FaBug className="mr-1" /> Debug Info
              </h3>
              <pre className="text-xs mt-2 overflow-auto max-h-40">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
