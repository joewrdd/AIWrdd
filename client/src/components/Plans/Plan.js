import React, { useCallback, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedPlan } from "../../redux/slices/paymentSlice";
import { CheckIcon } from "@heroicons/react/20/solid";


//----- Tiers For Plans Component -----//
const tiers = [
  {
    name: "Free",
    id: "Free",
    href: "checkout",
    price: "$0.00/month",
    amount: 0,
    description: "The essentials to provide your best work for clients.",
    features: ["5 Credits", "1 User", "Basic Support"],
    mostPopular: false,
  },

  {
    name: "Basic",
    id: "Basic",
    href: "checkout",
    price: "$20/month",
    amount: 20,
    description: "A plan that scales with your rapidly growing business.",
    features: [
      "50 Credits",
      "5 Users",
      "Priority Support",
      "Content generation history",
    ],
    mostPopular: true,
  },
  {
    name: "Premium",
    id: "Premium",
    href: "checkout",
    price: "$50/month",
    amount: 50,
    description: "Dedicated support and infrastructure for your company.",
    features: [
      "100 Credits",
      "Unlimited subscribers",
      "Advanced analytics",
      "1-hour, dedicated support response time",
      "Marketing automations",
      "Custom reporting tools",
    ],
    mostPopular: false,
  },
];

//----- Class Names For Plans Component -----//
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

//----- Plans Component -----//
export default function Plans() {
  //----- Dispatch For Handling Redux Actions -----//
  const dispatch = useDispatch();
  //----- Navigation For Plans Component -----//
  const navigate = useNavigate();
  //----- Ref For Handling Navigation -----//
  const navigationInProgressRef = useRef(false);

  //----- Handle Selected Plan -----//
  const handleSelectedPlan = useCallback(
    (plan) => {
      if (navigationInProgressRef.current) return;
      navigationInProgressRef.current = true;

      dispatch(setSelectedPlan(plan));

      if (plan?.id === "Free") {
        navigate("/free-plan", { replace: true });
      } else {
        navigate(`/checkout/${plan?.id}?amount=${plan?.amount}`, {
          replace: true,
        });
      }

      setTimeout(() => {
        navigationInProgressRef.current = false;
      }, 500);
    },
    [dispatch, navigate]
  );

  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <div ref={ref} className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base font-semibold leading-7 text-[#5a3470]"
          >
            Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Pricing plans for teams of&nbsp;all&nbsp;sizes
          </motion.p>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6 }}
          className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300"
        >
          Choose an affordable plan that is packed with the best features for
          engaging your audience, creating customer loyalty, and driving sales.
        </motion.p>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.3 * (index + 1), duration: 0.8 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.4 } }}
              className={classNames(
                tier.mostPopular
                  ? "bg-white/5 ring-2 ring-[#432752]"
                  : "ring-1 ring-white/10",
                "rounded-3xl p-8 xl:p-10"
              )}
              onClick={() => handleSelectedPlan(tier)}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.3 * (index + 1) }}
                className="flex items-center justify-between gap-x-4"
              >
                <h3
                  id={tier.id}
                  className="text-lg font-semibold leading-8 text-white"
                >
                  {tier.name}
                </h3>
                {tier.mostPopular ? (
                  <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    animate={
                      isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
                    }
                    transition={{ delay: 0.4 * (index + 1) }}
                    className="rounded-full bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470] px-2.5 py-1 text-xs font-semibold leading-5 text-white"
                  >
                    Most popular
                  </motion.p>
                ) : null}
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.3 * (index + 1) }}
                className="mt-4 text-sm leading-6 text-gray-300"
              >
                {tier.description}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.4 * (index + 1) }}
                className="mt-6 flex items-baseline gap-x-1"
              >
                <span className="text-4xl font-bold tracking-tight text-white">
                  {tier.price}
                </span>
              </motion.p>
              <motion.a
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.5 * (index + 1) }}
                whileHover={{ scale: 1.05 }}
                aria-describedby={tier.id}
                className={classNames(
                  tier.mostPopular
                    ? "bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470] cursor-pointer text-white shadow-sm hover:opacity-95 focus-visible:outline-[#432752]"
                    : "bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white",
                  "mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                )}
              >
                Buy plan
              </motion.a>
              <motion.ul
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.6 * (index + 1) }}
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10"
              >
                {tier.features.map((feature, featureIndex) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={
                      isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                    }
                    transition={{
                      delay: 0.1 * featureIndex + 0.6 * (index + 1),
                    }}
                    className="flex gap-x-3"
                  >
                    <CheckIcon
                      className="h-6 w-5 flex-none text-white"
                      aria-hidden="true"
                    />
                    {feature}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
