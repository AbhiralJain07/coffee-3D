'use client';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
import { CoffeeProduct } from '@/data/products';

interface ProductCardProps {
product: CoffeeProduct;
index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const relativeX = mouseX - width / 2;
    const relativeY = mouseY - height / 2;
    
    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-[#3D2820]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#5A4034] hover:border-[#4F9C8F] transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#4F9C8F]/20"
    >
{/* Star Rating */}
<div className="flex items-center gap-2 mb-4">
<span className="text-[#FFD700] text-lg">★</span>
<span className="text-[#F5E6D3] font-semibold text-sm">{product.rating}</span>
</div>
{/* Coffee Image */}
<div className="relative w-full h-56 bg-[#2D1810] rounded-xl mb-5 overflow-hidden">
<Image
src={product.image}
alt={product.name}
fill
className="object-cover hover:scale-110 transition-transform duration-500"
/>
</div>
{/* Title & Description */}
<h3 className="text-2xl font-playfair font-bold text-[#F5E6D3] mb-3">
{product.name}
</h3>
<p className="text-sm text-[#C9B8A0] mb-5 line-clamp-2 font-inter">
{product.description}
</p>
{/* Price & Add Button */}
<div className="flex items-center justify-between">
<span className="text-3xl font-bold text-[#F5E6D3] font-inter">
{product.price}
</span>
<motion.button
whileHover={{ scale: 1.1, rotate: 90 }}
whileTap={{ scale: 0.9 }}
className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4F9C8F] to-[#3D8B7F] flex items-center justify-center hover:shadow-lg hover:shadow-[#4F9C8F]/40 transition-shadow"
>
<span className="text-white text-2xl font-bold">+</span>
</motion.button>
</div>
</motion.div>
);
}
