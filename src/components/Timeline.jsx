"use client";
import {
  useScroll,
  useTransform,
  useSpring,
  useInView,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

/**
 * Animated milestone dot that scales up and glows when its section enters the viewport.
 * Activation fires once and persists (does not toggle on scroll-out).
 */
const TimelineDot = () => {
  const dotRef = useRef(null);
  const isInView = useInView(dotRef, { once: true, margin: "-100px" });

  return (
    <div
      ref={dotRef}
      className="absolute flex items-center justify-center w-10 h-10 rounded-full -left-[15px] bg-midnight"
    >
      <motion.div
        animate={
          isInView
            ? {
                scale: 1,
                boxShadow: "0 0 12px 3px rgba(122, 87, 219, 0.5)",
                borderColor: "rgba(122, 87, 219, 0.7)",
                backgroundColor: "rgba(122, 87, 219, 0.3)",
              }
            : {
                scale: 0.6,
                boxShadow: "0 0 0px 0px rgba(122, 87, 219, 0)",
                borderColor: "rgba(64, 64, 64, 1)",
                backgroundColor: "rgba(38, 38, 38, 1)",
              }
        }
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          duration: 0.4,
        }}
        className="w-4 h-4 p-2 border rounded-full"
      />
    </div>
  );
};

export const Timeline = ({ data }) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  // Spring-smoothed scroll progress — eliminates jagged jumps
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const heightTransform = useTransform(smoothProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(smoothProgress, [0, 0.1], [0, 1]);

  return (
    <div className="c-space section-spacing" ref={containerRef}>
      <h2 className="text-heading">My Work Experience</h2>
      <div ref={ref} className="relative pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky z-40 flex flex-col items-center self-start max-w-xs md:flex-row top-40 lg:max-w-sm md:w-full">
              <TimelineDot />
              <div className="flex-col hidden gap-2 text-xl font-bold md:flex md:pl-20 md:text-4xl text-neutral-300">
                <h3>{item.date}</h3>
                <h3 className="text-3xl text-neutral-400">{item.title}</h3>
                <h3 className="text-3xl text-neutral-500">{item.job}</h3>
              </div>
            </div>

            <div className="relative w-full pl-20 pr-4 md:pl-4">
              <div className="block mb-4 text-2xl font-bold text-left text-neutral-300 md:hidden ">
                <h3>{item.date}</h3>
                <h3>{item.job}</h3>
              </div>
              {item.contents.map((content, index) => (
                <p className="mb-3 font-normal text-neutral-400" key={index}>
                  {content}
                </p>
              ))}
            </div>
          </div>
        ))}
        {/* Track Layer — static full-height background line */}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-1 left-1 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          {/* Progress Layer — spring-animated fill */}
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-lavender/50 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
