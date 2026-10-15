import React, { useRef, useState, useEffect } from 'react';

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260714_113715_c7e0daa0-8bdd-4486-a2da-040901f8f0ea.mp4';

// 2-second gradual crossfade dissolve duration
const CROSSFADE_SEC = 2.0;

export default function MotionBackground({ scrollY = 0 }) {
  const videoRefA = useRef(null);
  const videoRefB = useRef(null);
  const [activeVideo, setActiveVideo] = useState('A');
  const isCrossfadingRef = useRef(false);

  // Initialize playback on mount
  useEffect(() => {
    if (videoRefA.current) {
      videoRefA.current.play().catch(() => {});
    }
  }, []);

  const handleTimeUpdateA = () => {
    const vA = videoRefA.current;
    const vB = videoRefB.current;
    if (!vA || !vB || isCrossfadingRef.current || activeVideo !== 'A') return;

    // Trigger crossfade 2 seconds before Video A finishes
    if (vA.duration && vA.currentTime >= vA.duration - CROSSFADE_SEC) {
      isCrossfadingRef.current = true;
      vB.currentTime = 0;
      vB.play().catch(() => {});
      setActiveVideo('B');

      setTimeout(() => {
        isCrossfadingRef.current = false;
      }, (CROSSFADE_SEC + 0.5) * 1000);
    }
  };

  const handleTimeUpdateB = () => {
    const vA = videoRefA.current;
    const vB = videoRefB.current;
    if (!vA || !vB || isCrossfadingRef.current || activeVideo !== 'B') return;

    // Trigger crossfade 2 seconds before Video B finishes
    if (vB.duration && vB.currentTime >= vB.duration - CROSSFADE_SEC) {
      isCrossfadingRef.current = true;
      vA.currentTime = 0;
      vA.play().catch(() => {});
      setActiveVideo('A');

      setTimeout(() => {
        isCrossfadingRef.current = false;
      }, (CROSSFADE_SEC + 0.5) * 1000);
    }
  };

  const handleEndedA = () => {
    const vA = videoRefA.current;
    const vB = videoRefB.current;
    if (vA) {
      vA.pause();
      vA.currentTime = 0;
    }
    // Safety fallback: if timeupdate missed the threshold, switch immediately
    if (activeVideo === 'A' && vB) {
      vB.currentTime = 0;
      vB.play().catch(() => {});
      setActiveVideo('B');
    }
  };

  const handleEndedB = () => {
    const vA = videoRefA.current;
    const vB = videoRefB.current;
    if (vB) {
      vB.pause();
      vB.currentTime = 0;
    }
    // Safety fallback: if timeupdate missed the threshold, switch immediately
    if (activeVideo === 'B' && vA) {
      vA.currentTime = 0;
      vA.play().catch(() => {});
      setActiveVideo('A');
    }
  };

  const objectPos = `center ${Math.min(scrollY * 0.05, 45)}%`;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-[25vh] -left-[3vw] w-[106vw] h-[155vh] will-change-transform transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(0, ${Math.min(scrollY * 0.22, 220)}px, 0)`
        }}
      >
        {/* Video Player A */}
        <video
          ref={videoRefA}
          className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-[2000ms] ease-in-out will-change-[opacity,object-position] ${
            activeVideo === 'A' ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          style={{
            filter: 'saturate(1.48) contrast(1.08) brightness(1.02)',
            objectPosition: objectPos
          }}
          src={VIDEO_SRC}
          autoPlay
          muted
          playsInline
          onTimeUpdate={handleTimeUpdateA}
          onEnded={handleEndedA}
        />

        {/* Video Player B (seamless crossfade partner) */}
        <video
          ref={videoRefB}
          className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-[2000ms] ease-in-out will-change-[opacity,object-position] ${
            activeVideo === 'B' ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          style={{
            filter: 'saturate(1.48) contrast(1.08) brightness(1.02)',
            objectPosition: objectPos
          }}
          src={VIDEO_SRC}
          muted
          playsInline
          onTimeUpdate={handleTimeUpdateB}
          onEnded={handleEndedB}
        />
      </div>

      {/* Soft frosted ambient overlays */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/35 pointer-events-none" />
    </div>
  );
}
