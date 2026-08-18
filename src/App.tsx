/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Setup from './components/Setup';
import Performance from './components/Performance';
import { PerformanceObject, PerformanceState } from './types';

export default function App() {
  const [state, setState] = useState<PerformanceState>({
    selectedObjects: [],
    secretSequence: [],
    isPerforming: false,
  });

  useEffect(() => {
    // Detect if client is a smartphone
    const ua = typeof window !== 'undefined' && window.navigator ? window.navigator.userAgent : '';
    const isSmartphone = /iPhone|iPod|Android.*Mobile|BlackBerry|IEMobile|Opera Mini/i.test(ua);

    if (!isSmartphone) return;

    let wakeLockSentinel: any = null;

    const requestWakeLock = async () => {
      try {
        const nav = window.navigator as any;
        if (nav && nav.wakeLock && !wakeLockSentinel) {
          wakeLockSentinel = await nav.wakeLock.request('screen');
          
          wakeLockSentinel.addEventListener('release', () => {
            wakeLockSentinel = null;
          });
        }
      } catch (err) {
        // Fail silently or handle gracefully
        console.warn('Screen Wake Lock request failed:', err);
      }
    };

    // Request wake lock initially
    requestWakeLock();

    // Re-acquire lock if tab was hidden and becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockSentinel) {
        wakeLockSentinel.release().catch((err: any) => {
          console.warn('Screen Wake Lock release failed:', err);
        });
      }
    };
  }, []);

  const handleStartPerform = (objects: PerformanceObject[]) => {
    setState({
      ...state,
      selectedObjects: objects,
      isPerforming: true
    });
  };

  const handleReset = () => {
    setState({
      ...state,
      isPerforming: false
    });
  };

  return (
    <div className="bg-black min-h-screen text-white overflow-hidden selection:bg-white selection:text-black">
      {!state.isPerforming ? (
        <Setup onStart={handleStartPerform} />
      ) : (
        <Performance 
          state={state} 
          onReset={handleReset} 
        />
      )}
    </div>
  );
}
