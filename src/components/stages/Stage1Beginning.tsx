import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Stage1Beginning({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Calculate local progress within this specific section's scroll
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [50, 0, 0, -50]);

  return (
    <div ref={containerRef} className="flex min-h-[120vh] w-full items-center justify-center p-8">
      <motion.div style={{ opacity, y }} className="max-w-xl">
        <h2 className="mb-6 text-5xl font-bold tracking-tighter text-white/90 md:text-7xl">
          The Beginning
        </h2>
        <p className="text-xl font-light leading-relaxed tracking-wide text-white/70 md:text-3xl">
          Before writing my first line of code, there was curiosity and a desire to understand how things work.
        </p>
      </motion.div>
    </div>
  );
}
