import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const FootstepsAnimation = ({ isWalking, onWalkComplete }) => {
  const containerRef = useRef(null);
  const footstepsRef = useRef([]);

  useEffect(() => {
    if (!isWalking) return;

    const container = containerRef.current;
    if (!container) return;

    // Ensure container is relative for absolute children
    container.style.position = 'relative';

    // Clear existing footsteps
    container.innerHTML = '';
    footstepsRef.current = [];

    // Dimensions to center footsteps under the door
    const containerW = container.clientWidth || 350;
    const containerH = container.clientHeight || 192; // h-48 ~ 192px
    const centerX = Math.floor(containerW / 2);

    // Realistic walking: 4 footsteps (2 steps)
    const footstepCount = 4;
    const footsteps = [];

    // Realistic walking pattern parameters
    const stepLength = Math.max(36, Math.min(64, Math.floor(containerH / 4))); // px between steps
    const stepWidth = 26; // px between left and right foot

    for (let i = 0; i < footstepCount; i++) {
      const footstep = document.createElement('img');

      // Alternate left/right foot
      const isLeftFoot = i % 2 === 0;
      footstep.src = isLeftFoot
        ? '/img/svg/left-foot.png'
        : '/img/svg/right-foot.png';

  footstep.style.position = 'absolute';
  footstep.style.width = '32px';
  footstep.style.height = 'auto';
  footstep.style.zIndex = '20';

  // Realistic walking pattern - start near door (top of area) and walk toward viewer (downwards)
  const stepNumber = Math.floor(i / 2);
  const baseX = centerX;
  const baseYpx = 8 + (stepNumber * stepLength); // px from top of the footsteps area

  // Offset for left/right foot
  const x = baseX + (isLeftFoot ? -stepWidth / 2 : stepWidth / 2);
  const y = baseYpx + (isLeftFoot ? -4 : 4);

  // Add slight rotation for natural foot angle
  const rotation = isLeftFoot ? -12 : 12;

  footstep.style.left = `${x}px`;
  footstep.style.top = `${y}px`;
  footstep.style.opacity = '0';
  footstep.style.transform = `translateX(-50%) scale(0.35) rotate(${rotation}deg)`;
  footstep.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))';
  footstep.style.zIndex = '10';

      container.appendChild(footstep);
      footsteps.push(footstep);
    }

    footstepsRef.current = footsteps;

    // Realistic walking animation - sequential footsteps
    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out footsteps after a moment
        setTimeout(() => {
          gsap.to(footsteps, {
            opacity: 0,
            scale: 0.2,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.in',
            onComplete: onWalkComplete,
          });
        }, 1000);
      },
    });

    // Animate each footstep appearing in sequence (like real walking)
    footsteps.forEach((footstep, index) => {
      const delay = index * 0.45; // ~450ms between steps

      tl.to(footstep, {
        opacity: 0.8,
        scale: 1,
        duration: 0.22,
        ease: 'power2.out',
      }, delay)
      .to(footstep, {
        opacity: 0.6,
        duration: 0.35,
        ease: 'power1.out',
      }, delay + 0.2);
    });

  }, [isWalking, onWalkComplete]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ perspective: '1000px' }}
    />
  );
};

export default FootstepsAnimation;
