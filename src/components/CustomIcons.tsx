import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: string | number;
  strokeWidth?: string | number;
  color?: string;
  className?: string;
}

export function Fork({ size = 24, strokeWidth = 1.5, color = 'currentColor', className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Fork Handle (matching spoon exactly, perfectly centered) */}
      <path d="M14 11L4.5 20.5a1.5 1.5 0 1 1-2-2l9.5-9.5" />
      
      {/* Beautiful, realistic 3-tined fork head with solid thickness */}
      <path 
        d="M12 12 C 11 9.5, 11 8, 12.7 6.3 L 16.5 2.5 L 17.5 3.5 L 14.3 7 C 14.4 7.2, 14.7 7.2, 14.8 7 L 18.0 3.5 L 19.0 4.5 L 15.8 8 C 15.9 8.2, 16.2 8.2, 16.3 8 L 19.5 4.5 L 20.5 5.5 L 17.3 10.5 C 15.5 11.5, 13.7 12.3, 12 12 Z" 
      />
    </svg>
  );
}

export function Spoon({ size = 24, strokeWidth = 1.5, color = 'currentColor', className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Spoon Handle */}
      <path d="M12 12L3.5 20.5a1.5 1.5 0 1 1-2-2l8.5-8.5" />
      {/* Spoon Bowl */}
      <path d="M18.5 3.5c-2.5-2.5-6.5 1.5-6.5 5.5l-2 1 2 2 1.5-1.5c4 0 8-4.5 5-7z" fill="none" />
    </svg>
  );
}

export function Knife({ size = 24, strokeWidth = 1.5, color = 'currentColor', className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      overflow="visible"
      className={className}
      {...props}
    >
      <g transform="translate(12, 12) scale(1.2) translate(-12, -12)">
        {/* Restaurant Knife: uniform blade width for 90% of length, tapering to a pointed tip at the end */}
        <path d="M8.6 12.6L20.5 2C20.6 3.8 19.4 5.8 18.5 7.1L10.8 14.8L10.2 14.2L3.8 20.8a1.2 1.2 0 1 1-1.6-1.6L8.6 12.6Z" />
        {/* Bolster collar */}
        <line x1="8.6" y1="12.6" x2="10.8" y2="14.8" />
      </g>
    </svg>
  );
}

export function Ring({ size = 24, strokeWidth = 1.5, color = 'currentColor', className, ...props }: IconProps) {
  const numericStroke = typeof strokeWidth === 'number' ? strokeWidth : parseFloat(String(strokeWidth || 1.5));
  const bandStroke = isNaN(numericStroke) ? 2.4 : numericStroke * 1.6;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Circular Ring Band (thicker) */}
      <circle cx="12" cy="15" r="5.5" strokeWidth={bandStroke} />
      
      {/* Diamond Gemstone Outline */}
      <path d="M9 3.5h6l2.5 3L12 10.5 5.5 6.5z" />
      
      {/* Diamond Gemstone Inner Facets */}
      <path d="M5.5 6.5h11" />
      <path d="M9 3.5l3 3 3-3" />
      <path d="M12 6.5v4" />
    </svg>
  );
}

export function Smartphone({ size = 24, strokeWidth = 1.5, color = 'currentColor', className, ...props }: IconProps) {
  const numericStroke = typeof strokeWidth === 'number' ? strokeWidth : parseFloat(String(strokeWidth || 1.5));
  const thinnerStroke = isNaN(numericStroke) ? 1.2 : numericStroke * 0.8;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Outer Phone Body (thinner and taller) */}
      <rect x="6" y="1.5" width="12" height="21" rx="2.5" />
      
      {/* Modern Bezel-less Display covering almost the full screen including the bottom */}
      <rect x="6.8" y="2.5" width="10.4" height="19.2" rx="1.5" />
      
      {/* Selfie Camera Punch-hole inside the top screen area (positioned lower from top edge) */}
      <circle cx="12" cy="4.8" r="0.6" fill={color} />
      
      {/* Minimal speaker grill at the very top of the phone bezel */}
      <line x1="10.5" y1="2" x2="13.5" y2="2" strokeWidth={thinnerStroke} />
      
      {/* Modern iOS-style home indicator line (positioned higher from bottom edge) */}
      <line x1="10" y1="19.8" x2="14" y2="19.8" strokeWidth={thinnerStroke} />
    </svg>
  );
}

export function BottleWine({ size = 24, strokeWidth = 1.5, color = 'currentColor', className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      overflow="visible"
      className={className}
      {...props}
    >
      {/* Cap / Rim */}
      <path d="M10 0.8h4" />
      {/* Neck (Unchanged height 6.5) */}
      <path d="M10 0.8v6.5" />
      <path d="M14 0.8v6.5" />
      {/* Shoulder & Body (+30% longer straight cylinder) */}
      <path d="M10 7.3c-2.5 1-3.5 2-3.5 4.5v12.4c0 .8.7 1.5 1.5 1.5h8c.8 0 1.5-.7 1.5-1.5v-12.4c0-2.5-1-3.5-3.5-4.5Z" />
      {/* Beer / Wine Label (+30% longer) */}
      <rect x="9" y="13.2" width="6" height="9" rx="1" strokeWidth={Number(strokeWidth) * 0.8} />
    </svg>
  );
}

export function Key({ size = 24, strokeWidth = 1.5, color = 'currentColor', className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Classic Padlock / Yale Key Bow (Head) */}
      <circle cx="5.5" cy="12" r="4" />
      {/* Keyring Hole */}
      <circle cx="4.5" cy="12" r="1.2" />

      {/* Shoulder, Blade Spine, Tip and Serrated Padlock Teeth */}
      <path d="M 8.5 9.5 L 9.8 9.5 L 9.8 10.5 L 20.5 10.5 L 22.5 12 L 21 13.5 L 19.2 13.5 L 18 11.2 L 16.5 13.5 L 15 11.8 L 13.8 13.5 L 12.2 11.2 L 10.8 13.5 L 9.8 13.5 L 9.8 14.5 L 8.5 14.5" />

      {/* Longitudinal Milled Keyway Groove */}
      <line x1="10.5" y1="12" x2="19.5" y2="12" strokeWidth={Number(strokeWidth) * 0.8} />
    </svg>
  );
}

export function PenTool({ size = 24, strokeWidth = 1.5, color = 'currentColor', className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Elongated Pen Body & Clean Cone Tip */}
      <path d="M 18 3 L 21 6 L 9 18 L 3 21 L 6 15 Z" />
      
      {/* Tip Separation Ring */}
      <line x1="6" y1="15" x2="9" y2="18" />
      
      {/* Top Clicker Button */}
      <path d="M 18.5 2.5 L 20 1 L 23 4 L 21.5 5.5" />
      
      {/* Profile Pocket Clip */}
      <path d="M 20.2 5.2 L 22.2 7.2 L 17 12.4 L 15.8 11.2" />
    </svg>
  );
}

export function Lighter({ size = 24, strokeWidth = 1.5, color = 'currentColor', className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Lighter Body */}
      <rect x="7" y="9.5" width="10" height="12.5" rx="2" />
      {/* Metal Windshield / Hood */}
      <path d="M 7 9.5 V 5.5 C 7 4.5 8 4 9 4 H 13 V 9.5" />
      {/* Windshield Air Vent Hole */}
      <circle cx="10" cy="6.8" r="0.8" />
      {/* Flint Spark Wheel / Push Lever on right */}
      <path d="M 13 8 H 16.5 V 5.5 C 16.5 4.7 15.8 4 15 4 C 14.2 4 13.5 4.7 13.5 5.5 V 8" />
    </svg>
  );
}

export function Mug({ size = 24, strokeWidth = 1.5, color = 'currentColor', className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Mug Body */}
      <path d="M 5 6.5 H 16.5 V 17 C 16.5 19.5 14.5 21 10.75 21 C 7 21 5 19.5 5 17 Z" />
      {/* Mug Handle */}
      <path d="M 16.5 9 C 19.5 9 21 10.2 21 12.5 C 21 14.8 19.5 16 16.5 16" />
      {/* Steam lines */}
      <path d="M 8 4.5 C 7.5 3.5 8.5 2.5 8 1.5" />
      <path d="M 11 4.5 C 10.5 3.2 11.5 2.2 11 1.2" />
      <path d="M 14 4.5 C 13.5 3.5 14.5 2.5 14 1.5" />
    </svg>
  );
}


