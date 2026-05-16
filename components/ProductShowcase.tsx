'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ProductCard from './ProductCard';
import { coffeeProducts } from '@/data/products';

export default function ProductShowcase() {
return (
<section className="py-24 px-4 md:px-8 relative">
{/* Coffee Splash Banner */}
<motion.div
initial={{ opacity: 0, y: -100 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
className="relative h-64 mb-16 rounded-3xl overflow-hidden"
>
<div className="absolute inset-0 bg-gradient-to-r from-[#3D2418] via-[#4D3428] to-[#3D2418]" />
<Image
src="/coffee/splash-banner.png"
alt="Coffee Splash"
fill
className="object-cover mix-blend-overlay opacity-60"
/>
{/* Floating Coffee Beans */}
{[...Array(8)].map((_, i) => (
<motion.div
key={i}
initial={{ y: 0 }}
animate={{
y: [0, -20, 0],
x: [0, (i % 2 === 0 ? 15 : -15), 0],
rotate: [0, 360]
}}
transition={{
repeat: Infinity,
duration: 3 + (i % 3) * 0.5,
delay: i * 0.3
}}
className="absolute w-8 h-8 opacity-40"
style={{
left: `${10 + i * 12}%`,
top: `${20 + (i * 7) % 40}%`
}}
>
<Image src="/coffee/bean.png" alt="Coffee Bean" width={32} height={32} className="object-contain" />
</motion.div>
))}
</motion.div>
{/* Product Grid */}
<div className="max-w-7xl mx-auto">
<motion.h2
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
className="text-6xl md:text-7xl font-playfair font-bold text-center text-[#F5E6D3] mb-16"
>
Our Signature Blends
</motion.h2>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
{coffeeProducts.map((product, index) => (
<ProductCard key={product.id} product={product} index={index} />
))}
</div>
</div>
</section>
);
}
