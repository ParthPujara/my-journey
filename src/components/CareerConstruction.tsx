import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

const FRAME_COUNT = 224;
const CANVAS_BG_COLOR = "#050505";

import Stage1Beginning from "./stages/Stage1Beginning";
import Stage2Foundation from "./stages/Stage2Foundation";
import Stage3CoreSkills from "./stages/Stage3CoreSkills";
import Stage4Projects from "./stages/Stage4Projects";
import Stage5Advanced from "./stages/Stage5Advanced";
import Stage6Present from "./stages/Stage6Present";

export default function CareerConstruction() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // References for the 6 new layout blocks to power their scroll transforms
  const stage1Ref = useRef<HTMLDivElement>(null);
  const stage2Ref = useRef<HTMLDivElement>(null);
  const stage3Ref = useRef<HTMLDivElement>(null);
  const stage4Ref = useRef<HTMLDivElement>(null);
  const stage5Ref = useRef<HTMLDivElement>(null);
  const stage6Ref = useRef<HTMLDivElement>(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);

  const isLoaded = loadedCount === FRAME_COUNT;

  // 1. Preload 120 frames
  useEffect(() => {
    let isMounted = true;
    // Array to hold references to image objects
    const loadedImages: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new window.Image();

      const handleLoad = () => {
        if (!isMounted) return;
        loaded++;
        setLoadedCount(loaded);
      };

      img.onload = handleLoad;

      // Fallback: If the user hasn't created the images yet, generate a dynamically drawn placeholder!
      img.onerror = () => {
        const c = document.createElement("canvas");
        c.width = 1080;
        c.height = 1080;
        const ctx = c.getContext("2d");
        if (ctx) {
          ctx.fillStyle = CANVAS_BG_COLOR;
          ctx.fillRect(0, 0, 1080, 1080);

          const progress = i / FRAME_COUNT;

          // Draw Ground
          ctx.fillStyle = "#111111";
          ctx.fillRect(140, 900, 800, 20);

          // Draw Foundation Piles (0-20%)
          ctx.fillStyle = "#ff7f50";
          ctx.fillRect(400, 300, 60, 600);
          ctx.fillStyle = "#ffd700";
          ctx.fillRect(620, 300, 60, 600);

          // Draw Modular Assembly (25-70%)
          if (progress > 0.25) {
            const p = Math.min((progress - 0.25) / 0.45, 1);
            ctx.fillStyle = "#ffffff";

            if (p > 0.2) {
              ctx.globalAlpha = Math.min((p - 0.2) * 5, 1);
              ctx.fillRect(460, 700 - 100 * (1 - ctx.globalAlpha), 160, 200);
            }
            if (p > 0.5) {
              ctx.globalAlpha = Math.min((p - 0.5) * 5, 1);
              ctx.fillRect(460, 450 - 100 * (1 - ctx.globalAlpha), 160, 250);
            }
            if (p > 0.8) {
              ctx.globalAlpha = Math.min((p - 0.8) * 5, 1);
              ctx.fillRect(380, 200 - 100 * (1 - ctx.globalAlpha), 320, 100);
            }
            ctx.globalAlpha = 1;
          }

          // Draw Reveal/Car (75-100%)
          if (progress > 0.75) {
            const p = Math.min((progress - 0.75) / 0.25, 1);
            ctx.globalAlpha = p;
            ctx.fillStyle = "#888888";
            // Car body
            ctx.fillRect(250, 850 + 20 * (1 - p), 100, 40);
            ctx.fillStyle = "#ffffff";
            // Wheels
            ctx.fillRect(265, 890 + 20 * (1 - p), 20, 10);
            ctx.fillRect(315, 890 + 20 * (1 - p), 20, 10);
            ctx.globalAlpha = 1;
          }
        }

        // Disable onerror to prevent loops
        img.onerror = null;
        img.onload = handleLoad;
        img.src = c.toDataURL("image/webp");
      };

      // Set src AFTER attaching onload/onerror handlers, otherwise cached images won't trigger load events
      // Format: ezgif-frame-001.jpg
      const paddedIndex = String(i).padStart(3, '0');
      img.src = `/sequence/ezgif-frame-${paddedIndex}.jpg`;

      loadedImages.push(img);
    }
    
    setImages(loadedImages);

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Scroll logic
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // When the top of the container hits the top of the viewport
    // Until the bottom of the container hits the bottom of the viewport
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Map progress to frame index (0 to 119)
  const frameIndex = useTransform(smoothProgress, [0, 1], [0, FRAME_COUNT - 1]);

  // 3. Render logic for standard + high DPI displays
  const renderFrame = (index : number) => {
    if (!images[index] || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Retrieve display size
    const rect = canvas.getBoundingClientRect();

    // Set actual size in memory (scaled for extra pixel density)
    const dpr = window.devicePixelRatio || 1;
    const expectedWidth = Math.round(rect.width * dpr);
    const expectedHeight = Math.round(rect.height * dpr);

    if (canvas.width !== expectedWidth || canvas.height !== expectedHeight) {
      canvas.width = expectedWidth;
      canvas.height = expectedHeight;
      ctx.scale(dpr, dpr);
    }

    // Force exact background color #050505
    ctx.fillStyle = CANVAS_BG_COLOR;
    ctx.fillRect(0, 0, rect.width, rect.height);

    const img = images[index];

    // CSS "contain" scaling logic
    const imgRatio = img.width / img.height;
    const canvasRatio = rect.width / rect.height;

    let drawWidth = rect.width;
    let drawHeight = rect.height;

    if (imgRatio > canvasRatio) {
      drawHeight = rect.width / imgRatio;
    } else {
      drawWidth = rect.height * imgRatio;
    }

    const x = (rect.width - drawWidth) / 2;
    const y = (rect.height - drawHeight) / 2;

    ctx.drawImage(img, x, y, drawWidth, drawHeight);
  };

  // 4. Paint frames on scroll
  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (isLoaded) {
      requestAnimationFrame(() => renderFrame(Math.round(latest)));
    }
  });

  // Keep canvas updated on load or resize
  useEffect(() => {
    if (!isLoaded) return;
    renderFrame(0);

    const handleResize = () =>
      requestAnimationFrame(() => renderFrame(Math.round(frameIndex.get())));
    window.addEventListener("resize", handleResize);

    // Properly clean up event listeners on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [isLoaded, images]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#050505] text-white">
        <div className="mb-4 font-sans text-sm font-medium uppercase tracking-widest text-white/50">
          Loading Sequence... {Math.round((loadedCount / FRAME_COUNT) * 100)}%
        </div>
        <div className="h-1 w-64 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${(loadedCount / FRAME_COUNT) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    // The master outer shell contains both sides
    <div ref={containerRef} className="relative flex w-full bg-[#050505]" style={{ position: "relative" }}>
      
      {/* TEXT CONTENT: Scrolling Naturally stacked over the canvas */}
      <div className="w-full flex flex-col items-center z-10 relative px-4">
        <Stage1Beginning containerRef={stage1Ref} />
        <Stage2Foundation containerRef={stage2Ref} />
        <Stage3CoreSkills containerRef={stage3Ref} />
        <Stage4Projects containerRef={stage4Ref} />
        <Stage5Advanced containerRef={stage5Ref} />
        <Stage6Present containerRef={stage6Ref} />
      </div>

      {/* BACKGROUND CANVAS: Full screen, fixed behind the text with 50% opacity */}
      <div className="fixed top-0 left-0 h-screen w-full z-0 opacity-50 pointer-events-none flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="block w-full h-full object-none" />
      </div>

    </div>
  );
}
