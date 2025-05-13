import React from "react";
import { motion } from "framer-motion";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useMutation } from "@tanstack/react-query";
import { handleFreeSubscription } from "../../apis/stripePaymentAPI";
import StatusMessage from "../Alert/StatusMessage";

//----- Free Plan Signup Component -----//
const FreePlanSignup = () => {
  //----- Plan Details -----//
  const planDetails = {
    name: "Free",
    price: "$0.00/month",
    features: [
      "5 AI Content Generation Credits",
      "1 User Access",
      "Basic Support",
      "Access to Essential Features",
    ],
  };

  //----- Mutation -----
  const mutation = useMutation({ mutationFn: handleFreeSubscription });

  //----- Confirm Payment -----
  const handleConfirmationPayment = () => {
    mutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl p-8 xl:p-10 bg-white/5 ring-2 ring-[#432752] max-w-md w-full"
      >
        <div className="flex items-center justify-between gap-x-4">
          <h3 className="text-lg font-semibold leading-8 text-white">
            {planDetails.name} Plan
          </h3>
        </div>

        <p className="mt-4 text-sm leading-6 text-gray-300">
          Begin your content creation journey with WrddAI. Experience the power
          of AI-driven content generation with our free plan.
        </p>

        <p className="mt-6 flex items-baseline gap-x-1">
          <span className="text-4xl font-bold tracking-tight text-white">
            {planDetails.price}
          </span>
        </p>

        <motion.button
          onClick={handleConfirmationPayment}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          className="mt-6 block w-full rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470] text-white hover:opacity-95"
        >
          Activate Free Plan
        </motion.button>

        <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-300">
          {planDetails.features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index + 0.3 }}
              className="flex gap-x-3"
            >
              <CheckIcon
                className="h-6 w-5 flex-none text-white"
                aria-hidden="true"
              />
              {feature}
            </motion.li>
          ))}
        </ul>

        <div className="mt-8 space-y-4">
          {/*is Error*/}
          {mutation?.isError && (
            <StatusMessage
              type="error"
              message={mutation?.error?.response?.data?.error}
            />
          )}

          {/*is Loading*/}
          {mutation?.isPending && (
            <div className="flex justify-center">
              <div className="w-6 h-6 border-2 border-[#432752] border-t-[#5a3470] rounded-full animate-spin"></div>
            </div>
          )}

          {/*is Success*/}
          {mutation?.isSuccess && (
            <StatusMessage type="success" message="Plan has been upgraded" />
          )}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-gray-400 text-sm mt-6"
        >
          No credit card required. Upgrade or cancel anytime.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default FreePlanSignup;
