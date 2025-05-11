import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import StatusMessage from "../Alert/StatusMessage";

import {
  selectTranscript,
  selectIsListening,
  selectSpeechSupported,
  selectVoiceError,
  setTranscript,
  appendTranscript,
  clearTranscript,
  setIsListening,
  setSpeechSupported,
  setVoiceError,
  clearVoiceError,
} from "../../redux/slices/voiceSlice";

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

const VoiceContentGenerator = () => {
  const dispatch = useDispatch();
  const profileFetchedRef = useRef(false);
  const recognitionRef = useRef(null);

  const transcript = useSelector(selectTranscript);
  const isListening = useSelector(selectIsListening);
  const speechSupported = useSelector(selectSpeechSupported);
  const voiceError = useSelector(selectVoiceError);

  const generatedContent = useSelector(selectContent);
  const contentLoading = useSelector(selectContentLoading);
  const contentStatus = useSelector(selectContentStatus);
  const contentError = useSelector(selectContentError);

  const user = useSelector(selectUser);
  const profileLoading = useSelector(selectUserLoading);
  const profileError = useSelector(selectUserError);
  const creditAllocation = useSelector(selectCreditAllocation);
  const remainingCredits = useSelector(selectRemainingCredits);

  useEffect(() => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      dispatch(setSpeechSupported(false));
      dispatch(
        setVoiceError(
          "Speech Recognition Is Not Supported In Your Browser. Please Try Chrome, Edge, or Safari."
        )
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      const current = event.resultIndex;
      if (event.results[current].isFinal) {
        const transcriptResult = event.results[current][0].transcript;
        dispatch(appendTranscript(transcriptResult));
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      dispatch(setVoiceError(`Error: ${event.error}. Please try again.`));
      dispatch(setIsListening(false));
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [dispatch]);

  useEffect(() => {
    if (!profileFetchedRef.current && (!user || !user.username)) {
      profileFetchedRef.current = true;
      dispatch(fetchUserProfile());
    }

    return () => {
      profileFetchedRef.current = false;
    };
  }, [user, dispatch]);

  const toggleListening = () => {
    if (!speechSupported) return;

    if (isListening) {
      recognitionRef.current.stop();
      dispatch(setIsListening(false));
    } else {
      dispatch(clearVoiceError());
      recognitionRef.current.start();
      dispatch(setIsListening(true));
    }
  };

  const handleClearTranscript = () => {
    dispatch(clearTranscript());
  };

  const handleGenerateContent = () => {
    if (!transcript.trim()) {
      dispatch(
        setVoiceError("Please record some speech before generating content.")
      );
      return;
    }

    dispatch(
      generateContent(
        `Generate content based on the following transcript: ${transcript}`
      )
    );
  };

  const handleTranscriptChange = (e) => {
    dispatch(setTranscript(e.target.value));
  };

  if (profileLoading) {
    return <StatusMessage type="loading" message="Loading please wait..." />;
  }

  if (profileError) {
    return (
      <StatusMessage
        type="error"
        message="Failed to load user profile. Please try again later."
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
                AI Voice-to-Content Generator
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

        {/* Speech Recognition Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
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
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
            Voice Input
          </h3>

          {!speechSupported ? (
            <div className="bg-red-50 p-4 rounded-lg mb-4">
              <p className="text-red-600">
                {voiceError ||
                  "Speech recognition is not supported in your browser."}
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                  onClick={toggleListening}
                  disabled={!speechSupported}
                >
                  <div className="bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470] rounded-full p-5">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  </div>
                  {isListening && (
                    <motion.div
                      className="absolute -inset-2 rounded-full border-4 border-purple-300"
                      animate={{
                        scale: [1, 1.1, 1.2, 1.1, 1],
                        opacity: [0.7, 0.5, 0.3, 0.5, 0.7],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              </div>

              <div className="mb-4 text-center">
                <div className="text-sm font-medium">
                  {isListening ? (
                    <span className="text-green-600">
                      Listening... Click mic to stop
                    </span>
                  ) : (
                    <span className="text-gray-600">
                      Click mic to start speaking
                    </span>
                  )}
                </div>
              </div>

              {voiceError && (
                <div className="bg-red-50 p-3 rounded-lg mb-4">
                  <p className="text-red-600 text-sm">{voiceError}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4 min-h-[120px] mb-4 border border-gray-200">
                <textarea
                  className="w-full bg-transparent border-none resize-none focus:ring-0 text-gray-700 min-h-[100px]"
                  placeholder="Your speech will appear here. You can edit it if needed..."
                  value={transcript}
                  onChange={handleTranscriptChange}
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleClearTranscript}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Transcript
                </button>
                <button
                  type="button"
                  onClick={handleGenerateContent}
                  disabled={!transcript.trim() || contentLoading}
                  className="px-4 py-2 flex-1 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470] hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                >
                  Generate Content
                </button>
              </div>
            </>
          )}
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

        {contentError && (
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
            <span className="text-red-700 font-medium">{contentError}</span>
          </div>
        )}

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

export default VoiceContentGenerator;
