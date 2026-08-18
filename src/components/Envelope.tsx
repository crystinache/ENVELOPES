
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GlassWater, 
  Gem, 
  Watch, 
  Glasses, 
  Candy, 
  Utensils, 
  Cigarette, 
  User
} from 'lucide-react';
import { Fork, Spoon, Knife, Ring, Smartphone, BottleWine, Key, PenTool, Lighter, Mug } from './CustomIcons';
import { COLOR_MAP, EnvelopeColor, PerformanceObject } from '../types';

const ICON_COMPONENTS: Record<string, any> = {
  BottleWine,
  GlassWater,
  Smartphone,
  Gem,
  Ring,
  Watch,
  Key,
  Glasses,
  PenTool,
  Candy,
  Utensils,
  Fork,
  Spoon,
  Knife,
  Cigarette,
  Lighter,
  Mug,
  User,
};

interface EnvelopeProps {
  color: EnvelopeColor;
  object?: PerformanceObject;
  isOpen: boolean;
  onDoubleTap: () => void;
}

export default function Envelope({ color, object, isOpen, onDoubleTap }: EnvelopeProps) {
  const Icon = object ? ICON_COMPONENTS[object.iconName] : null;
  const isPersonal = object?.id === 'personal';

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center select-none"
      onDoubleClick={onDoubleTap}
    >
      <div className="relative w-[75%] h-[70%] max-w-[450px]">
        
        {/* ENVELOPE BACK (Always visible) */}
        <div 
          className="absolute inset-0 rounded-xl border border-white/5 shadow-2xl overflow-hidden"
          style={{ backgroundColor: COLOR_MAP[color], zIndex: 10 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/5" />
        </div>

        {/* PAPER (Visible only when open, on top of back) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                duration: 0.6, 
                ease: "easeOut",
                delay: 0.3
              }}
              className="absolute inset-[5%] bg-white shadow-xl flex flex-col items-center justify-center p-6 rounded-sm overflow-hidden"
              style={{ zIndex: 50 }}
            >
              <div className="text-black flex flex-col items-center justify-center w-full h-full">
                {isPersonal ? (
                  <p className="text-2xl font-bold tracking-[0.2em] uppercase text-center text-black font-sans px-4 leading-tight">
                    PERSONAL<br />OBJECT
                  </p>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-black">
                    {Icon && <Icon size="75%" strokeWidth={1.5} className="text-black" />}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ENVELOPE FRONT & FLAP (Visible only when closed, covers everything) */}
        {!isOpen && (
          <div className="absolute inset-0 z-100 pointer-events-none">
            {/* Front Body */}
            <div 
              className="absolute inset-0 rounded-xl overflow-hidden"
              style={{ backgroundColor: COLOR_MAP[color] }}
            >
               <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />
            </div>

            {/* Flap */}
            <div 
              className="absolute top-0 left-0 right-0 h-[11%] bg-black/20 backdrop-blur-sm border-b border-white/5 z-10"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)',
              }}
            />
          </div>
        )}

        {/* Base Shadow (subtle) */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-2 bg-white/5 blur-2xl rounded-full pointer-events-none" />
      </div>
    </div>
  );
}
