import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ai1 from "../../assets/airobot4.png";
import blink from "../../assets/blink-sm.png";
import banner1 from "../../assets/banner1.png";
import banner2 from "../../assets/banner2.png";
import banner3 from "../../assets/banner3.png";

//----- Features For Home Section -----//
export default function HomeFeatures() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <>
      <section
        ref={ref}
        className="relative py-12 md:py-24 lg:py-32 bg-gray-900 bg-body overflow-hidden"
      >
        <motion.img
          initial={{ opacity: 0, scale: 0 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
          }
          transition={{ duration: 0.5 }}
          className="hidden sm:block absolute top-0 right-1/2 -mr-64 xl:mr-24 mt-12 h-20 animate-spinStar"
          src={blink}
          alt="Blink"
        />
        <motion.img
          initial={{ opacity: 0, scale: 0 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
          }
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden sm:block absolute bottom-0 right-0 mb-64 mr-8 h-20 animate-spinStar"
          src={blink}
          alt="Blink"
        />
        <div className="relative container mx-auto px-4">
          <div className="flex flex-wrap items-center -mx-4">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-2/5 xl:w-1/2 px-4 mb-8 lg:mb-0"
            >
              <motion.img
                animate={{
                  y: [0, 15, 0],
                  transition: {
                    duration: 4,
                    ease: "easeInOut",
                    repeat: Infinity,
                  },
                }}
                className="block w-full max-w-lg xl:max-w-xl"
                src={ai1}
                alt="Features bg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-3/5 xl:w-1/2 px-4"
            >
              <div className="relative overflow-hidden">
                <div className="hidden xs:block absolute z-10 top-0 left-0 w-full h-20 lg:h-48 bg-gradient-to-b from-darkBlue-900 via-darkBlue-900 to-transparent opacity-90" />
                <div className="hidden xs:block absolute z-10 bottom-0 left-0 w-full h-20 lg:h-48 bg-gradient-to-t from-darkBlue-900 via-darkBlue-900 to-transparent opacity-90" />
                <div className="slider">
                  <div className="slider-container space-y-16">
                    {[
                      {
                        image: banner1,
                        alt: "AI Content Creation",
                        title: "AI-Powered Content Creation",
                        description:
                          "Wrdd AI revolutionizes the way you create content. Our intelligent algorithms generate high-quality, engaging material, saving you time and enhancing your creative output.",
                      },
                      {
                        image: banner2,
                        alt: "Customizable Features",
                        title: "Customizable for Your Needs",
                        description:
                          "Whether it's blog posts, marketing copy, or creative stories, Wrdd AI tailors content to your specific needs, ensuring each piece is perfectly suited for its purpose.",
                      },
                      {
                        image: banner3,
                        alt: "Workflow Integration",
                        title: "Streamline Your Workflow",
                        description:
                          "Integrating seamlessly with various platforms, Wrdd AI becomes a natural extension of your workflow, making content generation more efficient than ever before.",
                      },
                    ].map((slide, index) => (
                      <motion.div
                        key={slide.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                          isInView
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 20 }
                        }
                        transition={{ delay: 0.2 * (index + 1) }}
                        className="slide"
                      >
                        <div className="flex items-center gap-6 mb-6">
                          <motion.img
                            animate={
                              isInView
                                ? {
                                    rotate: 360,
                                    transition: {
                                      duration: 20,
                                      ease: "linear",
                                      repeat: Infinity,
                                    },
                                  }
                                : {}
                            }
                            src={slide.image}
                            alt={slide.alt}
                            className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                          />
                          <motion.h4
                            initial={{ opacity: 0, x: 20 }}
                            animate={
                              isInView
                                ? { opacity: 1, x: 0 }
                                : { opacity: 0, x: 20 }
                            }
                            transition={{ delay: 0.3 * (index + 1) }}
                            className="text-3xl font-medium text-white"
                          >
                            {slide.title}
                          </motion.h4>
                        </div>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                          transition={{ delay: 0.4 * (index + 1) }}
                          className="text-xl text-gray-400 pl-38"
                        >
                          {slide.description}
                        </motion.p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
