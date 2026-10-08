import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = "Before",
  afterAlt = "After",
  className
}: BeforeAfterSliderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isToggled, setIsToggled] = useState(false);

  const showAfter = isHovered || isToggled;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl bg-gray-200 select-none group cursor-pointer",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsToggled(!isToggled)}
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt={afterAlt}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />
      
      {/* Before Image (Foreground, fades out on hover/tap) */}
      <img
        src={beforeImage}
        alt={beforeAlt}
        className={cn(
          "absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 ease-in-out",
          showAfter ? "opacity-0" : "opacity-100"
        )}
        draggable={false}
      />

      {/* Badges */}
      <div 
        className={cn(
          "absolute top-4 left-4 bg-slate-800/90 backdrop-blur-sm text-white text-xs md:text-sm font-semibold px-3 py-1 md:px-4 md:py-1.5 rounded-full pointer-events-none z-30 shadow-md transition-opacity duration-500",
          showAfter ? "opacity-0" : "opacity-100"
        )}
      >
        {beforeAlt || "Before"}
      </div>

      <div 
        className={cn(
          "absolute top-4 right-4 bg-primary text-slate-900 text-xs md:text-sm font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full pointer-events-none z-30 shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all duration-500",
          showAfter ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        )}
      >
        {afterAlt || "After"}
      </div>

      {/* Hover Instruction Overlay */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none transition-opacity duration-500",
        showAfter ? "opacity-0" : "opacity-100"
      )}>
        <div className="bg-white/90 backdrop-blur-md text-slate-900 text-xs md:text-base font-bold px-4 py-2 md:px-6 md:py-3 rounded-full shadow-2xl whitespace-nowrap border border-white/50 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
          HOVER OR TAP TO REVEAL
        </div>
      </div>
    </div>
  );
}
