"use client";
import { motion } from "framer-motion";
import { ReactNode, useRef, useState } from "react";

type MouseEvent = React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>;

export default function Magnet({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const maxDistance = 40;

  const handleMouse = (e: MouseEvent) => {
    const { clientX, clientY } = e;

    if (ref.current) {
      const { height, width, left, top } = ref.current.getBoundingClientRect();
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);

      const distance = Math.sqrt(middleX * middleX + middleY * middleY);

      if (distance > maxDistance) {
        const angle = Math.atan2(middleY, middleX);
        const x = maxDistance * Math.cos(angle);
        const y = maxDistance * Math.sin(angle);
        setPosition({ x, y });
      } else {
        setPosition({ x: middleX, y: middleY });
      }
    }
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  return (
    <motion.div
      style={{ position: "relative" }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="p-10 max-sm:p-4"
    >
      {children}
    </motion.div>
  );
}
