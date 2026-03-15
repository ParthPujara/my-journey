import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Stage4Projects({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
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
          Real Projects
        </h2>
        <p className="mb-8 text-xl font-light leading-relaxed tracking-wide text-white/70 md:text-3xl">
          With a strong structure in place, I started building real-world applications and expanding my skills.
        </p>
        <div className="flex flex-wrap gap-3">
          {['Frameworks', 'Backend Development', 'APIs', 'Databases'].map((skill) => (
            <span key={skill} className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90 backdrop-blur-sm">
              {skill}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
