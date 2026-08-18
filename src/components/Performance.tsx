
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
  const touchStartPos = useRef<{ x: number, y: number, q: number, time: number } | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const getQuadrant = (x: number, y: number) => {
    const { width: w, height: h } = dimensions;
    if (x < w / 2) return y < h / 2 ? 1 : 3;
    return y < h / 2 ? 2 : 4;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    const q = getQuadrant(x, y);
    touchStartPos.current = { x, y, q, time: Date.now() };

    // Long press for resetting (1.2 seconds)
    longPressTimer.current = setTimeout(() => {
      onReset();
    }, 1200);

    // Logic for capturing the 3rd number:
    // If we have 2 numbers, the start of the second interaction (this touch) is the 3rd number.
    if (capturedSequence.length === 2) {
      if (!capturedSequence.includes(q)) {
        completeSequence([...capturedSequence, q]);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    // Sequence capture for swipe is handled in handlePanEnd for better info.offset support
  };

  const completeSequence = (seq: number[]) => {
    const missing = [1, 2, 3, 4].find(n => !seq.includes(n)) || 4;
    setCapturedSequence([...seq, missing]);
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

    // Sequence Capture Logic for First Swipe:
    if (capturedSequence.length === 0 && touchStartPos.current) {
      const startQ = touchStartPos.current.q;
      const dx = info.offset.x;
      const dy = info.offset.y;
      const adx = Math.abs(dx);
      const ady = Math.abs(dy);
      let endQ = startQ;

      if (adx > ady) {
        if (dx > 0) { // Right
          if (startQ === 1) endQ = 2;
          else if (startQ === 2) endQ = 3;
          else if (startQ === 3) endQ = 4;
          else if (startQ === 4) endQ = 1;
        } else { // Left
          if (startQ === 1) endQ = 4;
          else if (startQ === 2) endQ = 1;
          else if (startQ === 3) endQ = 2;
          else if (startQ === 4) endQ = 3;
        }
      } else {
        if (dy > 0) { // Down
          if (startQ === 1) endQ = 3;
          else if (startQ === 2) endQ = 4;
          else if (startQ === 3) endQ = 2; 
          else if (startQ === 4) endQ = 1;
        } else { // Up
          if (startQ === 1) endQ = 4;
          else if (startQ === 2) endQ = 3;
          else if (startQ === 3) endQ = 1;
          else if (startQ === 4) endQ = 2;
        }
      }
      if (startQ !== endQ) setCapturedSequence([startQ, endQ]);
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
      className="fixed inset-0 bg-black overflow-hidden flex items-center justify-center touch-none"
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
