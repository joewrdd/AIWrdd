import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import HomeFeatures from "./HomeFeatures";
import FreeTrial from "./FreeTrial";
import ai from "../../assets/ai.png";

//----- Home Component -----//
export default function Home() {
  //----- Ref For Handling Home Section -----//
  const ref = useRef(null);
  //----- Check If Home Section Is In View -----//
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <>
      <div className="bg-gray-900">
        <div ref={ref} className="relative isolate overflow-hidden pt-14">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={
              isInView ? { scale: 1, opacity: 1 } : { scale: 1.1, opacity: 0 }
            }
            transition={{ duration: 1.2 }}
            src={ai}
            alt="ai"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-black bg-opacity-90"></div>
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.2 } : { opacity: 0 }}
              transition={{ duration: 1 }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ delay: 0.4 }}
              className="hidden sm:mb-8 sm:flex sm:justify-center"
            >
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
                Announcing Wrdd AI Content Generator Full Release{" "}
                <Link to="/about" className="font-semibold text-white">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Read more <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </motion.div>
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.6 }}
                className="text-4xl font-bold tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400"
              >
                Transform Your Content Creation with WrddAI
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-lg leading-8 text-gray-300 max-w-xl mx-auto"
              >
                Elevate your digital presence with Wrdd AI's advanced content
                generation. Create compelling blog posts, marketing copy, and
                social media content powered by state-of-the-art artificial
                intelligence.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ delay: 1 }}
                className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
              >
                <Link
                  to="free-plan"
                  className="relative inline-flex items-center gap-x-2 rounded-lg bg-gradient-to-r from-[#301934] via-[#432752] to-[#5a3470] px-5 py-3 text-sm font-medium text-white shadow-xl hover:shadow-lg hover:opacity-95 transition-all duration-300 group"
                >
                  <span className="relative">
                    Start Your Free Trial
                    <span className="absolute bottom-0 left-0 w-full h-px bg-purple-300/40 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </span>
                </Link>
                <Link
                  to="free-plan"
                  className="text-sm font-medium leading-6 text-white hover:text-[#5a3470] transition-colors duration-300"
                >
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.2 } : { opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </motion.div>
        </div>
      </div>
      {/* Homepage Features */}
      <HomeFeatures />
      {/* Homepage CTA */}
      <FreeTrial />
    </>
  );
}
