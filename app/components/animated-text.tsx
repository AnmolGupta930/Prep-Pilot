"use client";
import React, { useEffect } from "react";
import { stagger, useAnimate, motion } from "motion/react";

export default function AnimatedText({ text }: { text: String }) {
  useEffect(() => {
    startAnimating();
  });

  const [scope, animate] = useAnimate();

  const startAnimating = () => {
    animate(
      "span",
      {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
      },
      {
        duration: 0.5,
        ease: "easeInOut",
        delay: stagger(0.08),
      },
    );
  };

  return (
    <div ref={scope}>
      {text.split(" ").map((word, idx) => (
        <motion.span
          style={{
            opacity: 0,
            filter: "blur(40px)",
            y: 10,
          }}
          key={word + idx}
          className="inline-block"
        >
          {word} &nbsp;
        </motion.span>
      ))}
    </div>
  );
}
