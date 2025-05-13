import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  LifebuoyIcon,
  NewspaperIcon,
  PhoneIcon,
  CalendarIcon,
} from "@heroicons/react/20/solid";

//----- Cards For About Us Section -----//
const cards = [
  {
    name: "Innovative Solutions",
    description:
      "At Wrdd Artifical Intelligence, innovation drives our solutions. We specialize in transforming complex AI technology into user-friendly tools for content generation, ensuring our clients stay ahead in the digital content race.",
    icon: PhoneIcon,
  },
  {
    name: "Dedicated Customer Support",
    description:
      "We believe in empowering our users with continuous support. Our dedicated team is always on standby to assist with any queries, ensuring a smooth, uninterrupted experience in content creation.",
    icon: LifebuoyIcon,
  },
  {
    name: "Press & Media Collaborations",
    description:
      "Wrdd is at the forefront of AI-driven content generation. We're eager to collaborate with media and press to share insights and developments in AI technology, shaping the future of digital content.",
    icon: NewspaperIcon,
  },
  {
    name: "Full Release Roadmap",
    description:
      "While Wrdd AI is already empowering users with its core features, we're continuously expanding. Our full release in Q5 2025 will bring exciting new capabilities including advanced content analytics, enhanced customization options, and improved collaboration tools.",
    icon: CalendarIcon,
  },
];

//----- About Us Component -----//
export default function AboutUs() {
  //----- Ref For Handling About Us Section -----//
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <div
      ref={ref}
      className="relative isolate overflow-hidden bg-gray-900 min-h-screen py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl lg:mx-0"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
          >
            Wrdd AI - Redefining Content Creation
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-lg leading-8 text-gray-300"
          >
            Wrdd AI is revolutionizing the way content is created. Our
            cutting-edge AI technology automates and enhances content
            generation, enabling creators to produce high-quality, engaging
            material with ease.
          </motion.p>
        </motion.div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-12">
          {cards.map((card, index) => (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.3 * (index + 1), duration: 0.8 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.4 } }}
              className="flex flex-col rounded-2xl bg-white/5 p-8 ring-1 ring-inset ring-white/10 hover:bg-white/10 transition-colors duration-300"
            >
              <div className="flex items-center mb-4">
                <card.icon
                  className="h-8 w-8 flex-none text-[#5a3470]"
                  aria-hidden="true"
                />
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.3 * (index + 1) }}
                  className="ml-4 text-xl font-semibold text-white"
                >
                  {card.name}
                </motion.h3>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.4 * (index + 1) }}
                className="text-gray-300 text-base leading-relaxed"
              >
                {card.description}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
