import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Stage6Present({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [50, 0, 0, -50]);

  return (
    <div ref={containerRef} className="flex min-h-[120vh] w-full items-center justify-center p-8">
      <motion.div style={{ opacity, y }} className="max-w-xl">
        <h2 className="mb-6 text-5xl font-bold tracking-tighter text-white/90 md:text-7xl">
          Present Day
        </h2>
        <p className="mb-8 text-xl font-light leading-relaxed tracking-wide text-white/70 md:text-3xl">
          Today I continue building, learning, and improving because great structures are never truly finished.
        </p>
        <div className="flex flex-wrap gap-3">
          {['Portfolio Projects', 'Technical Skills', 'Tools & Technologies', 'Experience'].map((skill) => (
            <span key={skill} className="rounded-full border border-white/0 bg-[#ff7f50]/20 px-4 py-2 text-sm font-medium text-[#ff7f50] backdrop-blur-sm">
              {skill}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
