"use client";

import { useState, useEffect } from "react";
import { WorldMap } from "@/components/ui/world-map";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function HeroWithMap() {
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMapReady(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="w-full py-20 md:py-28 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white"
        >
          Explore the World <br className="hidden sm:inline-block" />
          <span className="text-blue-600">Powered by AI</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-4 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          Plan personalized itineraries, find ideal stays, and track your travels across the globe —
          all powered by smart AI planning and real-time recommendations.
        </motion.p>
      </div>

      {/* WorldMap + Loader */}
      <div className="mt-12 px-4 min-h-[300px] md:min-h-[400px] flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          {!isMapReady ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <WorldMap
                dots={[
                  { start: { lat: 40.7128, lng: -74.006 }, end: { lat: 48.8566, lng: 2.3522 } },
                  { start: { lat: 28.6139, lng: 77.209 }, end: { lat: 43.1332, lng: 131.9113 } },
                  { start: { lat: 51.5074, lng: -0.1278 }, end: { lat: -33.8688, lng: 151.2093 } },
                  { start: { lat: -1.2921, lng: 36.8219 }, end: { lat: -34.6037, lng: -58.3816 } },
                ]}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-10 flex justify-center"
      >
      </motion.div>
    </section>
  );
}
