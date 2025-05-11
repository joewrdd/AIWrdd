import React, { useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import StatusMessage from "../Alert/StatusMessage";
import {
  generateContent,
  selectContent,
  selectContentLoading,
  selectContentStatus,
  selectContentError,
} from "../../redux/slices/contentSlice";
import {
  selectUser,
  selectUserLoading,
  selectUserError,
  fetchUserProfile,
  selectCreditAllocation,
  selectRemainingCredits,
} from "../../redux/slices/userSlice";

const BlogPostAIAssistant = () => {
  const dispatch = useDispatch();
  const profileFetchedRef = useRef(false);

  const user = useSelector(selectUser);
  const userLoading = useSelector(selectUserLoading);
  const userError = useSelector(selectUserError);
  const creditAllocation = useSelector(selectCreditAllocation);
  const remainingCredits = useSelector(selectRemainingCredits);

  const generatedContent = useSelector(selectContent);
  const contentLoading = useSelector(selectContentLoading);
  const contentStatus = useSelector(selectContentStatus);
  const contentError = useSelector(selectContentError);

  useEffect(() => {
    if (!profileFetchedRef.current && (!user || !user.username)) {
      profileFetchedRef.current = true;
      dispatch(fetchUserProfile());
    }

    return () => {
      profileFetchedRef.current = false;
    };
  }, [user, dispatch]);

  //----- Formik Setup Handling -----
  const formik = useFormik({
    initialValues: {
      prompt: "",
      tone: "",
      category: "",
    },
    validationSchema: Yup.object({
      prompt: Yup.string().required("A prompt is required"),
      tone: Yup.string().required("Selecting a tone is required"),
      category: Yup.string().required("Selecting a category is required"),
    }),
    onSubmit: (values) => {
      dispatch(
        generateContent(`Generate a blog post:
        Topic: ${values.prompt}
        Tone: ${values.tone}
        Category: ${values.category}`)
      );
    },
  });

  //----- Loading States -----
  if (userLoading) {
    return <StatusMessage type="loading" message="Loading please wait..." />;
  }

  //----- Error Handle -----
  if (userError) {
    return (
      <StatusMessage
        type="error"
        message={userError?.response?.data?.message || "An error occurred"}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-900 flex justify-center items-center p-6">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden max-w-3xl w-full p-8">
        {/* Title Section */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470] rounded-lg p-1">
            <div className="bg-white rounded-md px-6 py-2">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470]">
                AI Blog Post Generator
              </h2>
            </div>
          </div>
        </div>
        {/* Usage Section */}
        <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Subscription Type:{" "}
                <span className="text-purple-600 font-semibold">
                  {user?.subscription || "Free"}
                </span>
              </span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Credits Remaining:{" "}
                <span className="text-blue-500 font-semibold">
                  {remainingCredits}
                </span>{" "}
                / <span className="text-gray-600">{creditAllocation}</span>
              </span>
            </div>
          </div>
        </div>
        {/* Form Section */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Prompt Input */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <label
              htmlFor="prompt"
              className="block text-gray-700 text-sm font-semibold mb-2 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Enter a topic or idea
            </label>
            <input
              id="prompt"
              type="text"
              {...formik.getFieldProps("prompt")}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#432752] focus:border-transparent transition duration-200 ease-in-out"
              placeholder="What would you like to write about?"
            />
            {formik.touched.prompt && formik.errors.prompt && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.prompt}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tone Selection */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <label
                htmlFor="tone"
                className="block text-gray-700 text-sm font-semibold mb-2 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Select Tone
              </label>
              <div className="relative">
                <select
                  id="tone"
                  {...formik.getFieldProps("tone")}
                  className="appearance-none w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-[#432752] focus:border-transparent transition duration-200 ease-in-out text-gray-700 pr-10"
                >
                  <option value="" className="text-gray-500">
                    Choose a tone...
                  </option>
                  <option value="formal" className="py-2">
                    🎩 Formal - Professional & Sophisticated
                  </option>
                  <option value="informal" className="py-2">
                    😊 Informal - Casual & Friendly
                  </option>
                  <option value="humorous" className="py-2">
                    😄 Humorous - Fun & Entertaining
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {formik.touched.tone && formik.errors.tone && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.tone}
                </div>
              )}
            </div>

            {/* Category Selection */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <label
                htmlFor="category"
                className="block text-gray-700 text-sm font-semibold mb-2 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Select Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  {...formik.getFieldProps("category")}
                  className="appearance-none w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-[#432752] focus:border-transparent transition duration-200 ease-in-out text-gray-700 pr-10"
                >
                  <option value="" className="text-gray-500">
                    Choose a category...
                  </option>
                  <option value="technology" className="py-2">
                    💻 Technology - Digital & Innovation
                  </option>
                  <option value="health" className="py-2">
                    ⚕️ Health - Wellness & Medical
                  </option>
                  <option value="business" className="py-2">
                    💼 Business - Corporate & Finance
                  </option>
                  <option value="lifestyle" className="py-2">
                    🌟 Lifestyle - Living & Culture
                  </option>
                  <option value="science" className="py-2">
                    🔬 Science - Research & Discovery
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {formik.touched.category && formik.errors.category && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.category}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              type="submit"
              className="flex-1 py-3 px-6 rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470] hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#432752] transition-all duration-300"
            >
              Generate Content
            </button>
            <Link
              to="/history"
              className="flex-1 py-3 px-6 rounded-lg text-center text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
            >
              View History
            </Link>
          </div>

          {/* Status Messages */}
          {contentLoading && (
            <div className="mt-4 flex items-center justify-center p-4 bg-purple-50 rounded-lg border border-purple-100">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-purple-600"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-purple-700 font-medium">
                Generating your content...
              </span>
            </div>
          )}

          {contentStatus === "succeeded" && (
            <div className="mt-4 flex items-center justify-center p-4 bg-green-50 rounded-lg border border-green-100">
              <svg
                className="w-5 h-5 mr-3 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-green-700 font-medium">
                Content generated successfully!
              </span>
            </div>
          )}

          {contentStatus === "failed" && (
            <div className="mt-4 flex items-center justify-center p-4 bg-red-50 rounded-lg border border-red-100">
              <svg
                className="w-5 h-5 mr-3 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-red-700 font-medium">
                {contentError || "Failed to generate content"}
              </span>
            </div>
          )}
        </form>
        {/* Generated Content Display */}
        {(generatedContent || contentLoading) && (
          <div className="mt-8 bg-gradient-to-br from-[#301934]/5 to-[#5a3470]/5 p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Generated Content
            </h3>
            <div className="bg-white p-4 rounded-lg shadow-inner">
              {contentLoading ? (
                <div className="flex items-center justify-center text-gray-500">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating content...
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {generatedContent}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostAIAssistant;
