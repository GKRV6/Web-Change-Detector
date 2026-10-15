import React from 'react';

// Seamless continuous 20s extended loop (forward + return trajectory, 0 white flashes)
const VIDEO_SRC = '/motion_boomerang_opt.mp4';

export default function MotionBackground({ scrollY = 0 }) {
  const objectPos = `center ${Math.min(scrollY * 0.05, 45)}%`;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-[25vh] -left-[3vw] w-[106vw] h-[155vh] will-change-transform transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(0, ${Math.min(scrollY * 0.22, 220)}px, 0)`
        }}
      >
        <video
          className="w-full h-full object-cover scale-105 will-change-[object-position] transition-[object-position] duration-150 ease-out"
          style={{
            filter: 'saturate(1.48) contrast(1.08) brightness(1.02)',
            objectPosition: objectPos
          }}
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* Soft frosted ambient overlays: vibrant motion shines through with crisp text legibility */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/35 pointer-events-none" />
    </div>
  );
}
