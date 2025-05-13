import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import StatusMessage from "../Alert/StatusMessage";
import axios from "axios";
import config from "../../config";
import {
  fetchUserProfile,
  fixSubscription,
  updateEffectiveSubscription,
  selectUser,
  selectUserLoading,
  selectUserError,
  selectCreditAllocation,
  selectUsedCredits,
  selectRemainingCredits,
  selectCurrentCycleUsedCredits,
  selectEffectiveSubscription,
} from "../../redux/slices/userSlice";
import {
  setIsFixing,
  setFixStatus,
  setLocalError,
  clearLocalError,
  hideStatusMessage,
  setRefreshCompleted,
  selectIsFixing,
  selectFixStatus,
  selectLocalError,
  selectStatusMessageVisible,
  selectRefreshCompleted,
} from "../../redux/slices/processSlice";

const STATUS_MESSAGE_TIMEOUT = 4000;

//----- User Dashboard Component -----//
const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //----- Ref For Handling Profile Fetching -----//
  const profileFetchedRef = useRef(false);
  const paramsCleared = useRef(false);
  const autoFixAttemptedRef = useRef(false);

  //----- Selectors For Handling Redux State -----//
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const creditAllocation = useSelector(selectCreditAllocation);
  const totalUsedCredits = useSelector(selectUsedCredits);
  const currentCycleUsedCredits = useSelector(selectCurrentCycleUsedCredits);
  const remainingCredits = useSelector(selectRemainingCredits);
  const currentSubscription = useSelector(selectEffectiveSubscription);

  const isFixing = useSelector(selectIsFixing);
  const fixStatus = useSelector(selectFixStatus);
  const localError = useSelector(selectLocalError);
  const statusMessageVisible = useSelector(selectStatusMessageVisible);
  const refreshCompleted = useSelector(selectRefreshCompleted);

  //----- Search Params For Handling URL Search Params -----//
  const searchParams = new URLSearchParams(location.search);
  const fromPayment = searchParams.get("payment") === "true";
  const forceRefresh = searchParams.get("forcerefresh") === "true";

  //----- Update Effective Subscription When User Changes -----//
  useEffect(() => {
    if (user && user.payments) {
      dispatch(updateEffectiveSubscription());
    }
  }, [user, dispatch]);

  //----- Navigate To Dashboard When Payment Is Made -----//
  useEffect(() => {
    if ((fromPayment || forceRefresh) && !paramsCleared.current) {
      paramsCleared.current = true;
      navigate("/dashboard", { replace: true });
    }
  }, [fromPayment, forceRefresh, navigate]);

  //----- Hide Status Message When Fixing -----//
  useEffect(() => {
    let timeoutId;
    if (fixStatus && !isFixing && statusMessageVisible) {
      timeoutId = setTimeout(() => {
        dispatch(hideStatusMessage());
      }, STATUS_MESSAGE_TIMEOUT);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [fixStatus, isFixing, statusMessageVisible, dispatch]);

  //----- Fetch User Profile When Component Mounts -----//
  useEffect(() => {
    if (!profileFetchedRef.current) {
      profileFetchedRef.current = true;
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  //----- Fetch User Profile When Payment Is Made -----//
  useEffect(() => {
    if ((fromPayment || forceRefresh) && !refreshCompleted && user) {
      dispatch(setRefreshCompleted(true));

      if (fromPayment) {
        dispatch(fixSubscription())
          .unwrap()
          .then(() => {
            profileFetchedRef.current = false;
            dispatch(fetchUserProfile());
          })
          .catch((err) => {
            console.error("Error Fixing Subscription, fromPayment:", err);
          });
      } else {
        const timeoutId = setTimeout(() => {
          profileFetchedRef.current = false;
          dispatch(fetchUserProfile());
        }, 3000);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [dispatch, fromPayment, forceRefresh, refreshCompleted, user]);

  //----- Auto Fix Subscription When User Is Loaded -----//
  useEffect(() => {
    const autoFixSubscription = async (userData) => {
      if (autoFixAttemptedRef.current) return;

      if (
        ((userData?.subscription === "Premium" ||
          userData?.subscription === "Basic") &&
          (!userData.payments || userData.payments.length === 0)) ||
        fromPayment
      ) {
        autoFixAttemptedRef.current = true;

        try {
          dispatch(setIsFixing(true));
          dispatch(clearLocalError());
          const response = await axios.get(
            `${config.API_URL}/api/stripe/fix-subscription`,
            { withCredentials: true }
          );
          dispatch(
            setFixStatus({
              success: true,
              message:
                response.data.message || "Subscription Updated Successfully",
            })
          );

          const timeoutId = setTimeout(() => {
            profileFetchedRef.current = false;
            dispatch(fetchUserProfile());
          }, 1000);

          return () => clearTimeout(timeoutId);
        } catch (error) {
          console.error("Error Fixing Subscription:", error);
          dispatch(setLocalError(error.message || "An Error Occurred"));
          dispatch(
            setFixStatus({
              success: false,
              message:
                error.response?.data?.message ||
                "Could Not Update Subscription Automatically.",
            })
          );
        } finally {
          dispatch(setIsFixing(false));
        }
      }
    };

    //----- Auto Fix Subscription When User Is Loaded -----//
    if (user && !isFixing && !fixStatus) {
      autoFixSubscription(user).catch((err) => {
        console.error("Error In autoFixSubscription:", err);
        dispatch(setLocalError(err.message || "Failed To Fix Subscription"));
      });
    }

    return () => {
      profileFetchedRef.current = false;
      paramsCleared.current = false;
      autoFixAttemptedRef.current = false;
    };
  }, [user, isFixing, fixStatus, dispatch, fromPayment]);

  //----- Render Loading -----//
  if (isLoading) {
    return <StatusMessage type="loading" message="Loading please wait..." />;
  }

  //----- Render Error -----//
  if (error || localError) {
    return (
      <StatusMessage
        type="error"
        message={localError || error || "Error loading profile"}
      />
    );
  }

  //----- Render No User -----//
  if (!user) {
    return <StatusMessage type="error" message="No user data available" />;
  }

  //----- Just Subscribed -----//
  const justSubscribed = fromPayment && currentSubscription !== "Trial";

  //----- Has Active Subscription -----//
  const hasActiveSubscription =
    currentSubscription !== "Trial" && !user.trialActive;

  //----- Payments -----//
  const payments = user.payments || [];
  const hasPayments = payments.length > 0;

  //----- Render Dashboard -----//
  return (
    <div className="mx-auto p-4 bg-gray-900 w-screen">
      {justSubscribed && statusMessageVisible && (
        <div className="mb-6 max-w-3xl mx-auto">
          <div className="bg-green-900/30 text-green-300 p-4 rounded-lg shadow-md border border-green-800 flex items-center">
            <svg
              className="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <h3 className="text-lg font-medium">Subscription Activated!</h3>
              <p className="text-sm">
                Your {currentSubscription} Plan Is Now Active. Enjoy Your
                Enhanced Features!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Auto-fix status message */}
      {isFixing && statusMessageVisible && (
        <div className="mb-6 max-w-3xl mx-auto">
          <div className="bg-blue-900/30 text-blue-300 p-4 rounded-lg shadow-md border border-blue-800 flex items-center">
            <svg
              className="animate-spin w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            <div>
              <h3 className="text-lg font-medium">Syncing Subscription</h3>
              <p className="text-sm">We're Updating Your Account Details...</p>
            </div>
          </div>
        </div>
      )}

      {!isFixing && fixStatus && statusMessageVisible && (
        <div className="mb-6 max-w-3xl mx-auto">
          <div
            className={`${
              fixStatus.success
                ? "bg-green-900/30 text-green-300 border-green-800"
                : "bg-yellow-900/30 text-yellow-300 border-yellow-800"
            } p-4 rounded-lg shadow-md border flex items-center`}
          >
            <svg
              className="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  fixStatus.success
                    ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                }
              ></path>
            </svg>
            <div>
              <h3 className="text-lg font-medium">
                {fixStatus.success ? "Subscription Synced" : "Sync Notice"}
              </h3>
              <p className="text-sm">{fixStatus.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center mb-8">
        <div className="bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470] rounded-lg p-1">
          <div className="bg-gray-900 rounded-md px-6 py-2">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470]">
              User Dashboard
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Section */}
        <div className="mb-6 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg rounded-xl border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-blue-50 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Profile Information
            </h2>
          </div>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <label
                className="block text-gray-600 text-sm font-medium mb-1"
                htmlFor="username"
              >
                Name
              </label>
              <p className="text-gray-800 font-semibold" id="username">
                {user?.username}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <label
                className="block text-gray-600 text-sm font-medium mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <p className="text-gray-800 font-semibold" id="email">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Credit Usage Section */}
        <div className="mb-6 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg rounded-xl border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-green-50 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Credit Usage
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
              <span className="text-gray-600">Monthly Credit Allocation</span>
              <span className="font-semibold text-gray-800">
                {creditAllocation} Credits
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
              <span className="text-gray-600">Current Cycle Used</span>
              <span className="font-semibold text-gray-800">
                {currentCycleUsedCredits} Credits
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
              <span className="text-gray-600">Remaining Credits</span>
              <span className="font-semibold text-gray-800">
                {remainingCredits} Credits
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
              <span className="text-gray-600">
                Total Credits Used (All Time)
              </span>
              <span className="font-semibold text-gray-800">
                {totalUsedCredits} Credits
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
              <span className="text-gray-600">Next Billing Date</span>
              <span className="font-semibold text-gray-800">
                {user?.nextBillingDate
                  ? new Date(user?.nextBillingDate).toLocaleDateString()
                  : "No Billing Date"}
              </span>
            </div>
          </div>
        </div>

        {/* Payment and Plans Section */}
        <div className="mb-6 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg rounded-xl border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-purple-50 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Payment & Plans
            </h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
              <p className="text-gray-600 mb-4">
                Current Plan:{" "}
                <span
                  className={`font-semibold ${
                    currentSubscription === "Premium"
                      ? "text-purple-700"
                      : currentSubscription === "Basic"
                      ? "text-blue-700"
                      : "text-gray-800"
                  }`}
                >
                  {currentSubscription || "No Plan"}
                </span>
              </p>
              {currentSubscription === "Trial" && (
                <p className="border mb-2 rounded w-full py-2 px-3 text-gray-700 leading-tight">
                  Trial: 25 Monthly Requests
                </p>
              )}
              {currentSubscription === "Free" && (
                <p className="border mb-2 rounded w-full py-2 px-3 text-gray-700 leading-tight">
                  Free: 5 Monthly Requests
                </p>
              )}
              {currentSubscription === "Basic" && (
                <p className="border mb-2 rounded w-full py-2 px-3 text-gray-700 leading-tight">
                  Basic: 50 Monthly Requests
                </p>
              )}
              {currentSubscription === "Premium" && (
                <p className="border mb-2 rounded w-full py-2 px-3 text-gray-700 leading-tight">
                  Premium: 100 Monthly Requests
                </p>
              )}
              {currentSubscription !== "Premium" && (
                <Link
                  to="/plans"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470] hover:shadow-lg hover:opacity-95 transition-all duration-300"
                >
                  Upgrade Plan
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Trial Information Section */}
        <div className="mb-6 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg rounded-xl border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-yellow-50 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Trial Information
            </h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
              <p className="text-gray-600 mb-2">
                Trial Status:{" "}
                <span className="font-semibold text-gray-800">
                  {hasActiveSubscription ? (
                    <span className="text-green-500">
                      Upgraded To {currentSubscription}
                    </span>
                  ) : (
                    <span
                      className={
                        user?.trialActive ? "text-green-500" : "text-red-600"
                      }
                    >
                      {user?.trialActive ? "Active" : "Inactive"}
                    </span>
                  )}
                </span>
              </p>
              {hasActiveSubscription ? (
                <p className="text-gray-600 mb-4">
                  Next Billing Date:{" "}
                  <span className="font-semibold text-gray-800">
                    {user?.nextBillingDate
                      ? new Date(user?.nextBillingDate).toLocaleDateString()
                      : "Not Set"}
                  </span>
                </p>
              ) : (
                <p className="text-gray-600 mb-4">
                  Trial Expires on:{" "}
                  <span className="font-semibold text-gray-800">
                    {user?.trialExpires
                      ? new Date(user?.trialExpires).toLocaleDateString()
                      : "Not Available"}
                  </span>
                </p>
              )}
              {currentSubscription !== "Premium" && (
                <Link
                  to="/plans"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470] hover:shadow-lg hover:opacity-95 transition-all duration-300"
                >
                  Upgrade to Premium
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="mb-6 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg rounded-xl border border-gray-100 col-span-1 md:col-span-2">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-indigo-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Payment History
            </h2>
          </div>
          {hasPayments ? (
            <ul className="divide-y divide-gray-100">
              {payments.map((payment) => (
                <li
                  key={payment._id}
                  className="py-4 px-4 hover:bg-gray-50 rounded-lg transition duration-150 ease-in-out"
                >
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div className="mb-2 sm:mb-0">
                      <p className="text-sm font-medium text-indigo-600">
                        {payment?.subscriptionPlan ||
                          (payment?.amount >= 40
                            ? "Premium"
                            : payment?.amount >= 20
                            ? "Basic"
                            : "N/A")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {payment?.createdAt
                          ? new Date(payment?.createdAt).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold ${
                          payment?.status === "completed"
                            ? "text-green-700"
                            : "text-orange-500"
                        }`}
                      >
                        {payment?.status || "N/A"}
                      </span>
                      <p className="text-sm font-semibold text-gray-700 ml-2">
                        ${payment?.amount || "0.00"}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No payment history available</p>
              {currentSubscription !== "Trial" &&
                currentSubscription !== "Free" && (
                  <p className="text-sm text-gray-400 mt-2">
                    {isFixing
                      ? "Synchronizing your payment information..."
                      : "Your subscription is active, but payment information is still syncing."}
                  </p>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
