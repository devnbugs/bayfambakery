'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="text-[#2D241E] font-sans overflow-hidden">
      {/* Hero Section */}
      <main className="flex flex-col px-6 md:px-12 py-10">
        <div className="flex flex-col md:flex-row gap-12 items-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 space-y-6"
          >
            <span className="inline-block py-1 px-3 bg-[#F3EFE9] text-[#D4A373] text-xs font-bold uppercase tracking-tighter rounded">Established 1994</span>
            <h1 className="text-5xl md:text-7xl font-serif leading-[1.1] text-[#2D241E]">
              Baked with <span className="italic text-[#D4A373]">love</span>, shared with family.
            </h1>
            <p className="text-lg text-[#6B5E54] max-w-md leading-relaxed">
              Artisanal sourdough, hand-rolled pastries, and signature family recipes delivered daily to your doorstep in the Bay Area.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href="/products" className="bg-[#2D241E] text-white px-8 py-4 rounded-md font-medium text-lg hover:opacity-90 transition-opacity shadow-lg">
                View Today's Specials
              </a>
            </div>
          </motion.div>
          
          {/* Featured Image Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2 h-[400px] bg-[#E8E2D9] rounded-2xl relative overflow-hidden"
          >
             <img src="https://picsum.photos/seed/cake/800/600" alt="Cake" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#D4A37333] to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-xl border border-white/20">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-xl">Our Signature Strawberry Cake</h3>
                  <p className="text-sm text-[#6B5E54]">Fresh local berries every day</p>
                </div>
                <span className="text-2xl font-serif text-[#D4A373]">$45.00</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Selection Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="border-[#E8E2D9] shadow-none">
            <CardHeader className="p-5">
              <CardTitle className="font-serif text-lg">Artisan Loaves</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xs text-[#6B5E54] uppercase tracking-widest">12 Varieties</p>
            </CardContent>
          </Card>
          <Card className="border-[#E8E2D9] shadow-none">
            <CardHeader className="p-5">
              <CardTitle className="font-serif text-lg">Morning Pastry</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xs text-[#6B5E54] uppercase tracking-widest">Baked at 4:00 AM</p>
            </CardContent>
          </Card>
          <Card className="border-[#E8E2D9] shadow-none">
            <CardHeader className="p-5">
              <CardTitle className="font-serif text-lg">Cakes & Tarts</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xs text-[#6B5E54] uppercase tracking-widest">Custom Orders</p>
            </CardContent>
          </Card>
          <Card className="border-[#E8E2D9] shadow-none">
            <CardHeader className="p-5">
              <CardTitle className="font-serif text-lg">Gift Boxes</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xs text-[#6B5E54] uppercase tracking-widest">Holiday Special</p>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Subtle Footer Line */}
      <footer className="px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center text-[11px] text-[#A0968E] uppercase tracking-widest border-t border-[#E8E2D9] gap-4">
        <div className="flex flex-col gap-1 items-center md:items-start">
            <div>© 2024 BayFam Bakery Co. All Rights Reserved.</div>
            <div>Contact: 555-BAKERY | hello@bayfam.co</div>
        </div>
        <div className="flex gap-6">
          <span>Instagram</span>
          <span>Facebook</span>
          <span>Pinterest</span>
        </div>
        <div>Handcrafted in San Francisco, CA</div>
      </footer>
    </div>
  );
}
