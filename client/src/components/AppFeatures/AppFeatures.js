import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  DocumentTextIcon,
  SparklesIcon,
  ClockIcon,
} from "@heroicons/react/20/solid";

//----- Features For App Features Section -----//
const features = [
  {
    name: "AI-Powered Content Creation",
    description:
      "Our advanced AI technology transforms your ideas into polished content. Perfect for blogs, websites, and social media posts - create engaging content in seconds.",
    href: "#",
    icon: SparklesIcon,
  },
  {
    name: "Multi-Purpose Content Generation",
    description:
      "Generate various types of content for your blog, website, or social media platforms. Our AI adapts to different writing styles and content formats.",
    href: "#",
    icon: DocumentTextIcon,
  },
  {
    name: "Time-Saving Efficiency",
    description:
      "Save hours on content creation. What usually takes hours can be done in minutes, allowing you to focus on growing your online presence and engaging with your audience.",
    href: "#",
    icon: ClockIcon,
  },
];

//----- App Features Component -----//
export default function AppFeatures() {
  //----- Ref For Handling App Features Section -----//
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <div ref={ref} className="bg-gray-900 min-h-screen py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl lg:text-center"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base font-semibold leading-7 text-[#5a3470]"
          >
            Content Creation Simplified
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Transform Your Content Creation Process
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-lg leading-8 text-gray-300"
          >
            Wrdd AI Content Generator is your ultimate tool for creating
            high-quality, engaging content effortlessly. Whether you are a
            blogger, content creator, or business owner, our AI-powered platform
            helps you generate compelling content in minutes.
          </motion.p>
        </motion.div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ delay: 0.3 * (index + 1), duration: 0.8 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.4 } }}
                className="flex flex-col"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <feature.icon
                    className="h-5 w-5 flex-none text-[#5a3470]"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-6">
                    <a
                      href={feature.href}
                      className="text-sm font-semibold leading-6 text-[#5a3470]"
                    >
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
