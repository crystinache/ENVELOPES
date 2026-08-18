
import React, { useState } from 'react';
import { 
  GlassWater, 
  Gem, 
  Watch, 
  Glasses, 
  Candy, 
  Utensils, 
  Cigarette, 
  User,
  Trash2,
  Play,
  Check
} from 'lucide-react';
import { Fork, Spoon, Knife, Ring, Smartphone, BottleWine, Key, PenTool, Lighter, Mug } from './CustomIcons';
import { AVAILABLE_OBJECTS, PerformanceObject, PerformanceState } from '../types';

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

interface SetupProps {
  onStart: (objects: PerformanceObject[]) => void;
}

export default function Setup({ onStart }: SetupProps) {
  const [selected, setSelected] = useState<PerformanceObject[]>([]);

  const toggleObject = (obj: PerformanceObject) => {
    if (selected.find(s => s.id === obj.id)) {
      setSelected(selected.filter(s => s.id !== obj.id));
    } else if (selected.length < 4) {
      setSelected([...selected, obj]);
    }
  };

  const removeObject = (id: string) => {
    setSelected(selected.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans selection:bg-white selection:text-black">
      <div className="max-w-md mx-auto flex flex-col min-h-[calc(100vh-3rem)]">
        <div className="mb-10 pt-4 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-light tracking-tighter flex items-center gap-3">
              ENVELOPE 
            </h2>
          </div>
          <button
            onClick={() => selected.length === 4 && onStart(selected)}
            disabled={selected.length !== 4}
            className={`px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-sm ${
              selected.length === 4 
              ? 'bg-white text-black hover:bg-white/90 active:scale-[0.98]' 
              : 'bg-zinc-900 text-zinc-700 cursor-not-allowed border border-white/5'
            }`}
          >
            START
          </button>
        </div>

        {/* Execution Order (now 1x4 grid) */}
        <section className="mb-10">
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((index) => {
              const obj = selected[index];
              const Icon = obj ? ICON_COMPONENTS[obj.iconName] : null;
              const isPersonal = obj?.id === 'personal';
              
              return (
                <div 
                  key={index} 
                  className={`aspect-square rounded-xl border flex flex-col items-center justify-center transition-all duration-500 relative ${
                    obj ? 'bg-white border-white text-black shadow-md' : 'bg-transparent border-white/5 border-dashed'
                  }`}
                >
                  <span className={`absolute top-1 left-2 text-[8px] font-mono ${obj ? 'text-black/40' : 'text-white/25'}`}>{index + 1}</span>
                  {obj ? (
                    <>
                      {isPersonal ? (
                        <span className="text-[10px] font-bold uppercase text-center px-0.5 leading-tight text-black">PERSONAL<br />OBJECT</span>
                      ) : (
                        <Icon size={24} strokeWidth={1.5} className="text-black" />
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeObject(obj.id); }}
                        className="absolute -top-1 -right-1 bg-black text-white rounded-full p-0.5 shadow-lg"
                      >
                        <Trash2 size={8} />
                      </button>
                    </>
                  ) : (
                    <span className="text-[8px] text-white/10 uppercase tracking-widest font-bold">Empty</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-10 flex-grow">
          <h2 className="text-white text-[11px] font-bold uppercase tracking-[0.2em] mb-6">Selection Pool</h2>
          <div className="grid grid-cols-4 gap-3">
            {AVAILABLE_OBJECTS.map((obj) => {
              const Icon = ICON_COMPONENTS[obj.iconName];
              const isSelected = selected.find(s => s.id === obj.id);
              const isPersonal = obj.id === 'personal';

              return (
                <button
                  key={obj.id}
                  onClick={() => toggleObject(obj)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all duration-300 relative bg-white text-black ${
                    isSelected 
                    ? 'ring-inset ring-4 ring-red-500 shadow-[0_5px_15px_rgba(255,255,255,0.15)]' 
                    : 'border-2 border-transparent hover:opacity-90'
                  }`}
                >
                  {isPersonal ? (
                    <span className="text-[12px] font-bold uppercase leading-tight text-center px-0.5 text-black">PERSONAL<br />OBJECT</span>
                  ) : (
                    <Icon size={30} strokeWidth={1.5} className="text-black" />
                  )}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1 shadow-lg z-20">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>




      </div>
    </div>
  );
}
