
import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo, useAnimation, useMotionValue } from 'motion/react';
import { PerformanceObject, PerformanceState, ENVELOPE_COLORS, EnvelopeColor } from '../types';
import Envelope from './Envelope';

interface PerformanceProps {
  state: PerformanceState;
  onReset: () => void;
}

type Direction = 'horizontal' | 'vertical' | null;

export default function Performance({ state, onReset }: PerformanceProps) {
  const [scrollDir, setScrollDir] = useState<Direction>(null);
  const [openedEnvelopes, setOpenedEnvelopes] = useState<Set<number>>(new Set());
  const [anchorEnvelopeIndex, setAnchorEnvelopeIndex] = useState<number | null>(null);
  
  // Carousel State
  const scrollValue = useMotionValue(0);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Secret sequence capture
  const [capturedSequence, setCapturedSequence] = useState<number[]>([]); 
  const touchStartPos = useRef<{ x: number, y: number, q: number, n2: number, time: number } | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    const { width: w, height: h } = dimensions;
    const halfW = w / 2;
    const halfH = h / 2;
    const qX = x < halfW ? 0 : 1;
    const qY = y < halfH ? 0 : 1;
    const q = qY === 0 ? (qX === 0 ? 1 : 2) : (qX === 0 ? 3 : 4);

    const localY = y - (qY * halfH);
    const third = halfH / 3;
    let subIndex = 0;
    if (localY < third) subIndex = 0;
    else if (localY < 2 * third) subIndex = 1;
    else subIndex = 2;

    const remaining = [1, 2, 3, 4].filter(n => n !== q);
    const n2 = remaining[subIndex];

    touchStartPos.current = { x, y, q, n2, time: Date.now() };

    // Long press for resetting (1.2 seconds)
    longPressTimer.current = setTimeout(() => {
      onReset();
    }, 1200);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);

    // If tapped without panning/swiping and sequence not captured yet, capture with default (Swipe Left / smaller remaining)
    if (capturedSequence.length === 0 && touchStartPos.current) {
      const { q, n2 } = touchStartPos.current;
      const allRemaining = [1, 2, 3, 4].filter(n => n !== q && n !== n2).sort((a, b) => a - b);
      setCapturedSequence([q, n2, allRemaining[0], allRemaining[1]]);
      touchStartPos.current = null;
    }
  };

  const handlePan = (event: any, info: PanInfo) => {
    if (!scrollDir) {
      const adx = Math.abs(info.offset.x);
      const ady = Math.abs(info.offset.y);
      if (adx > 5 || ady > 5) {
        setScrollDir(adx > ady ? 'horizontal' : 'vertical');
      }
      return;
    }
    
    // Stop any ongoing animation when user starts dragging
    scrollValue.stop();
    
    const delta = scrollDir === 'horizontal' ? info.delta.x : info.delta.y;
    const screenSize = scrollDir === 'horizontal' ? dimensions.width : dimensions.height;
    scrollValue.set(scrollValue.get() - delta / screenSize);
  };

  const handlePanEnd = (event: any, info: PanInfo) => {
    if (!scrollDir) return;

    // Sequence Capture Logic for Swipe:
    if (capturedSequence.length === 0 && touchStartPos.current) {
      const { q, n2 } = touchStartPos.current;
      const dx = info.offset.x;
      
      const allRemaining = [1, 2, 3, 4].filter(n => n !== q && n !== n2).sort((a, b) => a - b);
      const rem1 = allRemaining[0]; // smaller
      const rem2 = allRemaining[1]; // larger

      let n3: number, n4: number;
      if (dx > 0) {
        // Swipe Right -> larger remaining is 3rd number (più alto)
        n3 = rem2;
        n4 = rem1;
      } else if (dx < 0) {
        // Swipe Left -> smaller remaining is 3rd number (più basso)
        n3 = rem1;
        n4 = rem2;
      } else {
        // Tap / Neutral -> smaller remaining
        n3 = rem1;
        n4 = rem2;
      }

      setCapturedSequence([q, n2, n3, n4]);
    }
    
    touchStartPos.current = null;
    
    const velocity = scrollDir === 'horizontal' ? info.velocity.x : info.velocity.y;
    const screenSize = scrollDir === 'horizontal' ? dimensions.width : dimensions.height;
    
    // Convert velocity to "index units per second"
    // Negative because dragging positive delta (right/down) decreases scrollValue
    const vUnits = -velocity / screenSize;
    
    // Use inertia-based animation for a truly fluid, non-snapping feel with a soft stop
    animate(scrollValue, 0, {
      type: "inertia",
      velocity: vUnits,
      power: 1.2, // Increased power for more natural, longer travel
      timeConstant: 800, // Significantly longer decay for a "premium" soft stop feel
      restDelta: 0.001, // Ensure it stops precisely and smoothly at the very end
      onComplete: () => {
        // Keep the current scrollDir or reset it if needed
      }
    });
  };

  const handleDoubleTap = (idx: number) => {
    const wrappedIdx = (idx % 4 + 4) % 4;
    if (openedEnvelopes.has(wrappedIdx)) return;
    
    if (anchorEnvelopeIndex === null) {
      setAnchorEnvelopeIndex(wrappedIdx);
    }
    
    setOpenedEnvelopes(new Set([...openedEnvelopes, wrappedIdx]));
  };

  const getObjectForEnvelope = (envIdx: number): PerformanceObject | undefined => {
    if (anchorEnvelopeIndex === null) return undefined;
    
    // We only want to "know" the object if the envelope is open
    // to prevent any potential leaks or glitches
    const wrappedIdx = (envIdx % 4 + 4) % 4;
    if (!openedEnvelopes.has(wrappedIdx)) return undefined;

    const diff = (wrappedIdx - anchorEnvelopeIndex + 4) % 4;
    const sequence = capturedSequence.length === 4 ? capturedSequence.map(n => n - 1) : [0, 1, 2, 3];
    return state.selectedObjects[sequence[diff]];
  };

  const getEnvelopeColor = (idx: number): EnvelopeColor => {
    return ENVELOPE_COLORS[(idx % 4 + 4) % 4];
  };

  return (
    <div 
      className="fixed inset-0 bg-black overflow-hidden flex items-center justify-center touch-none select-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={() => { if (longPressTimer.current) clearTimeout(longPressTimer.current); }}
    >
      <motion.div
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        className="w-full h-full flex items-center justify-center p-0 m-0"
      >
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
          {[0, 1, 2, 3].map((idx) => {
            return (
              <VisualEnvelope
                key={idx}
                scrollValue={scrollValue}
                index={idx}
                scrollDir={scrollDir}
                dimensions={dimensions}
                openedEnvelopes={openedEnvelopes}
                getObjectForEnvelope={getObjectForEnvelope}
                getEnvelopeColor={getEnvelopeColor}
                handleDoubleTap={handleDoubleTap}
              />
            );
          })}
        </div>
      </motion.div>

    </div>
  );
}

import { useTransform, animate } from 'motion/react';

function VisualEnvelope({ 
  scrollValue, 
  index, 
  scrollDir, 
  dimensions,
  openedEnvelopes, 
  getObjectForEnvelope, 
  getEnvelopeColor, 
  handleDoubleTap 
}: any) {
  // Compute relative position once [-2, 2)
  const relativePos = useTransform(scrollValue, (val: number) => {
    let p = (index - val);
    return (((p + 2) % 4 + 4) % 4) - 2;
  });

  const x = useTransform(relativePos, (p: number) => {
    if (scrollDir === 'vertical') return 0;
    return p * dimensions.width;
  });

  const y = useTransform(relativePos, (p: number) => {
    if (scrollDir !== 'vertical' && scrollDir !== null) return 0;
    return p * dimensions.height;
  });

  const opacity = useTransform(relativePos, (p: number) => {
    const distance = Math.abs(p);
    if (distance > 1.5) return 0;
    if (distance > 0.8) return 1 - (distance - 0.8) / 0.7;
    return 1;
  });

  return (
    <motion.div
      style={{ x, y, opacity, willChange: 'transform, opacity' }}
      className="absolute w-full h-full flex items-center justify-center pointer-events-none"
    >
      <div className="w-full h-full pointer-events-auto">
        <Envelope
          color={getEnvelopeColor(index)}
          isOpen={openedEnvelopes.has(index)}
          object={getObjectForEnvelope(index)}
          onDoubleTap={() => handleDoubleTap(index)}
        />
      </div>
    </motion.div>
  );
}
