'use client';
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity } from 'framer-motion';

const TOTAL_FRAMES = 240; // Adjusted for actual frame count
const FRAME_PATH = '/frames'; // Folder containing frame_0.png to frame_239.png

export default function HeroCanvasAnimation() {
const containerRef = useRef<HTMLDivElement>(null);
const canvasRef = useRef<HTMLCanvasElement>(null);
const [images, setImages] = useState<{ [key: number]: HTMLImageElement }>({});
const [loadedFrames, setLoadedFrames] = useState<number[]>([]);
const [imagesLoaded, setImagesLoaded] = useState(false);
const [loadProgress, setLoadProgress] = useState(0);

// Scroll progress tracking
const { scrollYProgress } = useScroll({
target: containerRef,
offset: ['start start', 'end start']
});

// Smooth spring animation for buttery scroll
const smoothProgress = useSpring(scrollYProgress, {
stiffness: 100,
damping: 30,
restDelta: 0.001
});

// Anti-gravity effect based on scroll velocity
const scrollVelocity = useVelocity(scrollYProgress);
const yOffset = useTransform(
scrollVelocity,
[-1, 0, 1],
[15, 0, -15] // Floats up when scrolling down
);

// Map scroll to frame index (bi-directional)
const frameIndex = useTransform(
smoothProgress,
[0, 1],
[0, TOTAL_FRAMES - 1]
);

// Preload frames strategy
useEffect(() => {
const loadFirstFrames = async () => {
// Load first 5 frames immediately
const firstFramesToLoad = [0, 1, 2, 3, 4];
const promises = firstFramesToLoad.map((i) => {
return new Promise<void>((resolve) => {
const img = new Image();
img.src = `${FRAME_PATH}/frame_${i}.png`;
img.onload = () => {
setImages((prev) => ({ ...prev, [i]: img }));
setLoadedFrames((prev) => [...prev, i]);
resolve();
};
img.onerror = () => resolve(); // Graceful fallback or ignore error
});
});
await Promise.all(promises);
setImagesLoaded(true); // Signal that at least the first frames are ready to be displayed

// Now load the rest in the background
const loadRest = async () => {
for (let i = 5; i < TOTAL_FRAMES; i++) {
// Use requestIdleCallback or setTimeout to avoid blocking
await new Promise((resolve) => {
const schedule = (typeof window !== 'undefined' && window.requestIdleCallback) || ((cb) => setTimeout(cb, 10));
schedule(() => {
const img = new Image();
img.src = `${FRAME_PATH}/frame_${i}.png`;
img.onload = () => {
setImages((prev) => ({ ...prev, [i]: img }));
setLoadedFrames((prev) => [...prev, i]);
setLoadProgress((prev) => prev + 1);
resolve(null);
};
img.onerror = () => resolve(null); // Graceful fallback
});
});
}
};
loadRest();
};
loadFirstFrames();
}, []);

// Canvas rendering
useEffect(() => {
if (!imagesLoaded || !canvasRef.current) return;
const canvas = canvasRef.current;
const ctx = canvas.getContext('2d');
if (!ctx) return;

// Set initial size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const renderFrame = () => {
const currentFrame = Math.round(frameIndex.get());
let img = images[currentFrame];

// Fallback to nearest loaded frame if current is missing
if (!img && loadedFrames.length > 0) {
const nearest = loadedFrames.reduce((prev, curr) => {
return Math.abs(curr - currentFrame) < Math.abs(prev - currentFrame) ? curr : prev;
}, loadedFrames[0]);
img = images[nearest];
}

if (img) {
// Calculate scaling (contain fit)
const scale = Math.min(
canvas.width / img.width,
canvas.height / img.height
);

const x = (canvas.width - img.width * scale) / 2;
const y = (canvas.height - img.height * scale) / 2;
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}
};
const unsubscribe = frameIndex.on('change', renderFrame);
renderFrame(); // Initial render

// Handle window resize
const handleResize = () => {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
renderFrame();
};
window.addEventListener('resize', handleResize);
return () => {
unsubscribe();
window.removeEventListener('resize', handleResize);
};
}, [imagesLoaded, images, loadedFrames, frameIndex]);

// Text overlay animations
const section1Opacity = useTransform(smoothProgress, [0, 0.1, 0.2, 0.25], [0, 1, 1, 0]);
const section2Opacity = useTransform(smoothProgress, [0.3, 0.35, 0.5, 0.55], [0, 1, 1, 0]);
const section3Opacity = useTransform(smoothProgress, [0.6, 0.65, 0.8, 0.85], [0, 1, 1, 0]);
const section4Opacity = useTransform(smoothProgress, [0.9, 0.92, 0.98, 1], [0, 1, 1, 0]);
const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);

return (
<div ref={containerRef} className="relative h-[500vh]">
<div className="sticky top-0 h-screen w-full overflow-hidden">
<motion.div style={{ y: yOffset }} className="w-full h-full">
<canvas
ref={canvasRef}
className="w-full h-full"
/>
</motion.div>
{/* Text Overlays */}
<div className="absolute inset-0 pointer-events-none flex items-center justify-center">
<motion.div
style={{ opacity: section1Opacity }}
className="text-center px-4"
>
<h1 className="text-7xl md:text-9xl font-playfair font-bold text-amber-50 mb-4 tracking-tight">
Experience Coffee
</h1>
<p className="text-xl md:text-2xl text-amber-100/80 font-inter">
Where every sip defies gravity
</p>
</motion.div>
<motion.div
style={{ opacity: section2Opacity }}
className="text-left px-8 md:px-16 max-w-2xl"
>
<h2 className="text-5xl md:text-7xl font-playfair font-semibold text-amber-50 mb-3">
Crafted to Perfection
</h2>
<p className="text-lg md:text-xl text-amber-100/70 font-inter">
From bean to cup, excellence floats in every drop
</p>
</motion.div>
<motion.div
style={{ opacity: section3Opacity }}
className="text-right px-8 md:px-16 max-w-2xl ml-auto"
>
<h2 className="text-5xl md:text-7xl font-playfair font-semibold text-amber-50 mb-3">
Anti-Gravity Flavor
</h2>
<p className="text-lg md:text-xl text-amber-100/70 font-inter">
Defying expectations, elevating taste beyond limits
</p>
</motion.div>
<motion.div
style={{ opacity: section4Opacity }}
className="text-center px-4"
>
<h2 className="text-6xl md:text-8xl font-playfair font-bold text-amber-50 mb-6">
Discover Your Blend
</h2>
<motion.button
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
className="px-8 py-4 bg-gradient-to-r from-[#4F9C8F] to-[#3D8B7F] text-white rounded-full text-lg font-semibold shadow-2xl pointer-events-auto"
>
Explore Collection ↓
</motion.button>
</motion.div>
</div>
{/* Scroll Indicator */}
<motion.div
style={{ opacity: scrollIndicatorOpacity }}
className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
>
<p className="text-amber-100/60 text-sm font-inter tracking-wider uppercase">
Scroll to Explore
</p>
<motion.div
animate={{ y: [0, 8, 0] }}
transition={{ repeat: Infinity, duration: 1.5 }}
className="w-6 h-10 border-2 border-amber-100/40 rounded-full flex items-start justify-center p-2"
>
<div className="w-1 h-3 bg-amber-100/60 rounded-full" />
</motion.div>
</motion.div>
</div>

{/* Non-blocking progress indicator */}
{loadProgress < TOTAL_FRAMES - 5 && (
<div className="fixed bottom-4 right-4 bg-[#1A0F0A]/80 backdrop-blur-md px-4 py-2 rounded-full text-sm text-amber-100/70 z-50">
Loading Frames: {loadProgress + 5}/{TOTAL_FRAMES}
</div>
)}
</div>
);
}
