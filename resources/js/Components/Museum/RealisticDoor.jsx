// RealisticDoorExternal.jsx
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const SVG_PATH = '/realistic_door_external.svg'; // served from public/

export default function RealisticDoorExternal({ year = '2019', committeeName = 'Executive Committee', onEnter, onOpenComplete, isOpen, leftImage = '/left_panel.png', rightImage = '/right_panel.png' }) {
  const containerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const fallbackDoorRef = useRef(null);
  const wingContainerRef = useRef(null);
  const leftWingRef = useRef(null);
  const rightWingRef = useRef(null);
  const leftImgRef = useRef(null);
  const rightImgRef = useRef(null);
  const [isOpening, setIsOpening] = useState(false);
  const [doorLoaded, setDoorLoaded] = useState(false);
  const useImages = !!leftImage && !!rightImage;

  useEffect(() => {
    // If using direct images for panels, skip SVG fetching entirely
    if (useImages) {
      setDoorLoaded(true);
      return;
    }
    // fetch the SVG text and inline it so GSAP can find #leftDoor and #rightDoor
    let mounted = true;
    fetch(SVG_PATH)
      .then(r => r.text())
      .then(svgText => {
        if (!mounted || !containerRef.current) return;

        // Replace placeholder text with actual data
        const updatedSvg = svgText
          .replace(/{{YEAR}}/g, year)
          .replace(/{{COMMITTEE_NAME}}/g, committeeName);

        containerRef.current.innerHTML = updatedSvg;

        // Try multiple possible selectors for click area
        const clickTargets = [
          containerRef.current.querySelector('#hit'),
          containerRef.current.querySelector('#clickArea'),
          containerRef.current.querySelector('svg'),
          containerRef.current.querySelector('.door-clickable')
        ];

        const clickTarget = clickTargets.find(target => target !== null);
        if (clickTarget) {
          clickTarget.addEventListener('click', handleDoorClick);
          clickTarget.style.cursor = 'pointer';
        }

        // Try multiple possible selectors for door panels
        const leftDoorSelectors = ['#leftDoor', '#left-door', '#leftPanel', '.left-door'];
        const rightDoorSelectors = ['#rightDoor', '#right-door', '#rightPanel', '.right-door'];

        leftRef.current = leftDoorSelectors
          .map(sel => containerRef.current.querySelector(sel))
          .find(el => el !== null);

        rightRef.current = rightDoorSelectors
          .map(sel => containerRef.current.querySelector(sel))
          .find(el => el !== null);

        // Log what we found for debugging
        console.log('Door elements found:', {
          leftDoor: leftRef.current,
          rightDoor: rightRef.current,
          clickTarget: clickTarget
        });

        // ensure 3D transform and hide backface
        [leftRef.current, rightRef.current].forEach(el => {
          if (!el) return;
          el.style.transformStyle = 'preserve-3d';
          el.style.backfaceVisibility = 'hidden';
          el.style.webkitBackfaceVisibility = 'hidden';
          // Important: ensure transform-box so transformOrigin uses element bounds
          el.style.transformBox = 'fill-box';
          el.style.webkitTransformBox = 'fill-box';
          el.style.transition = 'transform 0.1s ease-out';
        });

        // Add hover effects to the whole SVG
        const doorContainer = containerRef.current.querySelector('svg');
        if (doorContainer) {
          doorContainer.addEventListener('mouseenter', handleDoorHover);
          doorContainer.addEventListener('mouseleave', handleDoorLeave);
          doorContainer.style.cursor = 'pointer';
        }

        setDoorLoaded(true);
      })
      .catch(err => console.error('Failed to fetch SVG', err));

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, committeeName, useImages]);

  const handleDoorHover = () => {
    if (isOpening || isOpen) return;
    // Image panels mode: wiggle images themselves
    if (useImages && leftImgRef.current && rightImgRef.current) {
      gsap.to(leftImgRef.current, { rotationY: -6, duration: 0.25, ease: 'power2.out', transformOrigin: 'left center' });
      gsap.to(rightImgRef.current, { rotationY: 6, duration: 0.25, ease: 'power2.out', transformOrigin: 'right center' });
      return;
    }
    // Subtle wiggle on HTML wings for realism
    if (leftWingRef.current && rightWingRef.current) {
      gsap.to(leftWingRef.current, { rotationY: -6, duration: 0.25, ease: 'power2.out', transformOrigin: 'left center' });
      gsap.to(rightWingRef.current, { rotationY: 6, duration: 0.25, ease: 'power2.out', transformOrigin: 'right center' });
      return;
    }
    // Fallback to SVG minimal rotate if wings not ready
    const isSVG = !!leftRef.current?.ownerSVGElement;
    const leftProps = isSVG ? { rotation: -2 } : { rotationY: -3 };
    const rightProps = isSVG ? { rotation: 2 } : { rotationY: 3 };
    gsap.to(leftRef.current, { ...leftProps, duration: 0.3, ease: 'power2.out', transformOrigin: '0% 50%' });
    gsap.to(rightRef.current, { ...rightProps, duration: 0.3, ease: 'power2.out', transformOrigin: '100% 50%' });
  };

  const handleDoorLeave = () => {
  if (isOpening || isOpen) return;
    if (useImages && leftImgRef.current && rightImgRef.current) {
      gsap.to(leftImgRef.current, { rotationY: 0, duration: 0.25, ease: 'power2.out', transformOrigin: 'left center' });
      gsap.to(rightImgRef.current, { rotationY: 0, duration: 0.25, ease: 'power2.out', transformOrigin: 'right center' });
      return;
    }
    if (leftWingRef.current && rightWingRef.current) {
      gsap.to(leftWingRef.current, { rotationY: 0, duration: 0.25, ease: 'power2.out', transformOrigin: 'left center' });
      gsap.to(rightWingRef.current, { rotationY: 0, duration: 0.25, ease: 'power2.out', transformOrigin: 'right center' });
      return;
    }
    const isSVG = !!leftRef.current?.ownerSVGElement;
    const resetProps = isSVG ? { rotation: 0 } : { rotationY: 0 };
    // Return to closed position
    gsap.to(leftRef.current, { ...resetProps, duration: 0.3, ease: 'power2.out', transformOrigin: '0% 50%' });
    gsap.to(rightRef.current, { ...resetProps, duration: 0.3, ease: 'power2.out', transformOrigin: '100% 50%' });
  };

  const handleDoorClick = () => {
    if (isOpening || isOpen) return;

    console.log('Door clicked! Door elements:', {
      leftDoor: leftRef.current,
      rightDoor: rightRef.current
    });

    setIsOpening(true);

    // Simple sound effect simulation without audio context
    console.log('🔊 Door opening sound effect');

  const tl = gsap.timeline({
      onComplete: () => {
        setIsOpening(false);
        onOpenComplete?.();
      }
    });

    // Image panels mode: animate images directly
    if (useImages && leftImgRef.current && rightImgRef.current) {
      gsap.set([leftImgRef.current, rightImgRef.current], { transformPerspective: 1000 });
      tl.to(leftImgRef.current, {
        rotationY: -95,
        transformOrigin: 'left center',
        duration: 1.1,
        ease: 'power2.inOut'
      }, 0)
      .to(rightImgRef.current, {
        rotationY: 95,
        transformOrigin: 'right center',
        duration: 1.1,
        ease: 'power2.inOut'
      }, 0.06)
      .call(() => {
        onEnter?.();
      }, [], 1.0);
      return;
    }

    // Check if door elements exist before animating
    if (!leftRef.current || !rightRef.current) {
      console.warn('Door panels not found in SVG. Using fallback open animation.');
      const svgEl = fallbackDoorRef.current || containerRef.current?.querySelector('svg') || containerRef.current;

      const fallbackTl = gsap.timeline({
        onComplete: () => {
          onOpenComplete?.();
          onEnter?.();
          setIsOpening(false);
        }
      });

      fallbackTl
        .to(svgEl, { filter: 'brightness(1.2)', duration: 0.15, ease: 'power1.out' })
        .to(svgEl, {
          rotationY: -75,
          transformOrigin: 'left center',
          transformPerspective: 1000,
          duration: 0.9,
          ease: 'power2.inOut'
        })
        .to(svgEl, { opacity: 0, duration: 0.35, ease: 'power1.out' }, '-=0.15');
      return;
    }

  const isSVG = !!leftRef.current?.ownerSVGElement;
  const svgRoot = leftRef.current?.ownerSVGElement || containerRef.current?.querySelector('svg');
  const siblings = svgRoot
      ? Array.from(svgRoot.children).filter(el => el !== leftRef.current && el !== rightRef.current)
      : [];
    const leftOpenProps = isSVG
      ? { rotation: -75 }
      : { rotationY: -92 };
    const rightOpenProps = isSVG
      ? { rotation: 75 }
      : { rotationY: 92 };

    // Hide any closed-door base art behind the panels
    if (siblings.length) {
      tl.to(siblings, { opacity: 0, duration: 0.12, ease: 'power1.out' }, 0);
    }

    // Ensure HTML wings visible and reset before opening
    if (leftWingRef.current && rightWingRef.current) {
      gsap.set([leftWingRef.current, rightWingRef.current], { opacity: 1, rotationY: 0, transformPerspective: 1000 });
      // More realistic 3D swing on HTML wings
      tl.to(leftWingRef.current, {
        rotationY: -95,
        transformOrigin: 'left center',
        duration: 1.1,
        ease: 'power2.inOut'
      }, 0)
      .to(rightWingRef.current, {
        rotationY: 95,
        transformOrigin: 'right center',
        duration: 1.1,
        ease: 'power2.inOut'
      }, 0.06);
    } else {
      // Fallback to rotating SVG door groups slightly (2D)
      tl.to(leftRef.current, {
        ...leftOpenProps,
        transformOrigin: '0% 50%',
        duration: 1.2,
        ease: 'power2.inOut'
      }, 0)
      .to(rightRef.current, {
        ...rightOpenProps,
        transformOrigin: '100% 50%',
        duration: 1.2,
        ease: 'power2.inOut'
      }, 0.08);
  }
  tl.call(() => {
      console.log('Door animation complete, calling onEnter');
      onEnter?.();
    }, [], 1.0);
  };

  // Close animation when isOpen becomes false (exit room)
  useEffect(() => {
    if (isOpening) return;
    if (isOpen) return; // we only handle close here

    if (useImages) {
      // Close images back to flat
      if (leftImgRef.current && rightImgRef.current) {
        gsap.to(leftImgRef.current, { rotationY: 0, duration: 0.9, ease: 'power2.inOut', transformOrigin: 'left center' });
        gsap.to(rightImgRef.current, { rotationY: 0, duration: 0.9, ease: 'power2.inOut', transformOrigin: 'right center', delay: 0.04 });
      }
      return;
    }

    const svgRoot = containerRef.current?.querySelector('svg');
    const isSVG = !!leftRef.current?.ownerSVGElement || !!svgRoot;
    const siblings = svgRoot
      ? Array.from(svgRoot.children).filter(el => el !== leftRef.current && el !== rightRef.current)
      : [];

    const closeTl = gsap.timeline();
    if (leftWingRef.current && rightWingRef.current) {
      closeTl
        .to([leftWingRef.current, rightWingRef.current], { zIndex: 2, duration: 0 }, 0)
        .to(leftWingRef.current, {
          rotationY: 0,
          transformOrigin: 'left center',
          duration: 0.9,
          ease: 'power2.inOut'
        }, 0)
        .to(rightWingRef.current, {
          rotationY: 0,
          transformOrigin: 'right center',
          duration: 0.9,
          ease: 'power2.inOut'
        }, 0.04)
        .to([leftWingRef.current, rightWingRef.current], { opacity: 0, duration: 0.15, ease: 'power1.out' }, '>-0.05');
    } else if (isSVG) {
      closeTl
        .to(leftRef.current, { rotation: 0, duration: 0.9, ease: 'power2.inOut', transformOrigin: '0% 50%' }, 0)
        .to(rightRef.current, { rotation: 0, duration: 0.9, ease: 'power2.inOut', transformOrigin: '100% 50%' }, 0.04);
    }

    // Restore any hidden siblings (closed door art) after closing
    if (siblings.length) {
      closeTl.to(siblings, { opacity: 1, duration: 0.2, ease: 'power1.out' }, '>-0.05');
    }
  }, [isOpen, isOpening]);

  return (
    <div className="relative flex flex-col items-center" style={{ width: 350, margin: '0 auto', perspective: 1200 }}>
      {/* Image-based panels mode */}
      {useImages ? (
        <div className="relative" style={{ width: 350, height: 500 }}>
          {/* Click area */}
          <button aria-label="Open door" onClick={handleDoorClick} className="absolute inset-0 z-10 cursor-pointer" style={{ background: 'transparent' }} />

          {/* Left panel image */}
          <img ref={leftImgRef} src={leftImage} alt="Left door panel" className="absolute top-1/2 -translate-y-1/2 left-0" style={{ width: '50%', height: '80%', objectFit: 'cover', borderRadius: 6, transformOrigin: 'left center', willChange: 'transform' }} />

          {/* Right panel image */}
          <img ref={rightImgRef} src={rightImage} alt="Right door panel" className="absolute top-1/2 -translate-y-1/2 right-0" style={{ width: '50%', height: '80%', objectFit: 'cover', borderRadius: 6, transformOrigin: 'right center', willChange: 'transform' }} />

          {/* Subtle center seam shadow */}
          <div className="absolute top-[10%] bottom-[10%] left-1/2 -translate-x-1/2 w-[2px] bg-black/40 rounded-full pointer-events-none" />
        </div>
      ) : (
        <>
          {/* Door Container - Smaller and centered (SVG mode) */}
          <div
            ref={containerRef}
            className="flex justify-center items-center"
            style={{
              width: '100%',
              height: '500px',
              transformStyle: 'preserve-3d',
              filter: isOpening ? 'brightness(1.2)' : 'brightness(1)'
            }}
          />

          {/* 3D HTML Wings Overlay for realistic swing (SVG mode) */}
          <div ref={wingContainerRef} className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2" style={{ width: 350, height: 500 }}>
            <div
              ref={leftWingRef}
              className="absolute top-1/2 -translate-y-1/2 left-0 will-change-transform"
              style={{
                width: '50%',
                height: '80%',
                transformOrigin: 'left center',
                transformStyle: 'preserve-3d',
                opacity: 0,
                backgroundImage: [
                  'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 3px, rgba(0,0,0,0.03) 3px 6px)',
                  'repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 2px, rgba(0,0,0,0.0) 2px 4px)',
                  'radial-gradient(ellipse at 20% 30%, rgba(0,0,0,0.10) 0 6px, rgba(0,0,0,0.0) 7px)',
                  'radial-gradient(ellipse at 70% 60%, rgba(0,0,0,0.10) 0 5px, rgba(0,0,0,0.0) 6px)',
                  'linear-gradient(45deg, #8B5A2B 0%, #A36331 45%, #7A4617 100%)'
                ].join(', '),
                boxShadow: 'inset 0 0 0 2px rgba(99, 51, 9, 0.6), inset 0 0 20px rgba(0,0,0,0.25), 0 10px 30px rgba(0,0,0,0.35)',
                borderRadius: '6px'
              }}
            />
            <div
              ref={rightWingRef}
              className="absolute top-1/2 -translate-y-1/2 right-0 will-change-transform"
              style={{
                width: '50%',
                height: '80%',
                transformOrigin: 'right center',
                transformStyle: 'preserve-3d',
                opacity: 0,
                backgroundImage: [
                  'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 3px, rgba(0,0,0,0.03) 3px 6px)',
                  'repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 2px, rgba(0,0,0,0.0) 2px 4px)',
                  'radial-gradient(ellipse at 30% 40%, rgba(0,0,0,0.10) 0 5px, rgba(0,0,0,0.0) 6px)',
                  'radial-gradient(ellipse at 80% 70%, rgba(0,0,0,0.10) 0 6px, rgba(0,0,0,0.0) 7px)',
                  'linear-gradient(45deg, #8B5A2B 0%, #A36331 45%, #7A4617 100%)'
                ].join(', '),
                boxShadow: 'inset 0 0 0 2px rgba(99, 51, 9, 0.6), inset 0 0 20px rgba(0,0,0,0.25), 0 10px 30px rgba(0,0,0,0.35)',
                borderRadius: '6px'
              }}
            />
          </div>
        </>
      )}

      {/* 3D HTML Wings Overlay for realistic swing */}
      <div ref={wingContainerRef} className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2" style={{ width: 350, height: 500 }}>
        <div
          ref={leftWingRef}
          className="absolute top-1/2 -translate-y-1/2 left-0 will-change-transform"
          style={{
            width: '50%',
            height: '80%',
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
            opacity: 0,
            backgroundImage: `url(${leftImage})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'left center',
            boxShadow: 'inset 0 0 0 1px rgba(30, 15, 5, 0.5), 0 10px 30px rgba(0,0,0,0.35)',
            borderRadius: '6px'
          }}
        >
          {/* Specular highlight (subtle) */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.0) 25%, rgba(255,255,255,0.0) 75%, rgba(255,255,255,0.05))',
            borderRadius: '6px'
          }} />
        </div>
        <div
          ref={rightWingRef}
          className="absolute top-1/2 -translate-y-1/2 right-0 will-change-transform"
          style={{
            width: '50%',
            height: '80%',
            transformOrigin: 'right center',
            transformStyle: 'preserve-3d',
            opacity: 0,
            backgroundImage: `url(${rightImage})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right center',
            boxShadow: 'inset 0 0 0 1px rgba(30, 15, 5, 0.5), 0 10px 30px rgba(0,0,0,0.35)',
            borderRadius: '6px'
          }}
        >
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.0) 25%, rgba(255,255,255,0.0) 75%, rgba(255,255,255,0.05))',
            borderRadius: '6px'
          }} />
        </div>
      </div>

      {/* Loading State or Fallback Door */}
      {!doorLoaded && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer group"
          onClick={handleDoorClick}
        >
          {/* Fallback Door Design */}
          <div className="relative" style={{ perspective: 1200 }}>
            {/* Door Frame */}
            <div ref={fallbackDoorRef} className="w-64 h-80 bg-gradient-to-b from-amber-800 via-amber-900 to-amber-950 rounded-lg border-4 border-amber-600 shadow-2xl will-change-transform">
              {/* Left Door Panel */}
              <div className="absolute left-2 top-2 w-28 h-76 bg-gradient-to-br from-amber-700 to-amber-900 rounded-l border-r border-amber-600/50">
                <div className="absolute inset-3 space-y-3">
                  <div className="h-20 bg-amber-600/20 rounded border border-amber-600/30"></div>
                  <div className="h-20 bg-amber-600/20 rounded border border-amber-600/30"></div>
                  <div className="h-16 bg-amber-600/20 rounded border border-amber-600/30"></div>
                </div>
                {/* Left Handle */}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-6 bg-yellow-600 rounded-full"></div>
              </div>

              {/* Right Door Panel */}
              <div className="absolute right-2 top-2 w-28 h-76 bg-gradient-to-br from-amber-700 to-amber-900 rounded-r border-l border-amber-600/50">
                <div className="absolute inset-3 space-y-3">
                  <div className="h-20 bg-amber-600/20 rounded border border-amber-600/30"></div>
                  <div className="h-20 bg-amber-600/20 rounded border border-amber-600/30"></div>
                  <div className="h-16 bg-amber-600/20 rounded border border-amber-600/30"></div>
                </div>
                {/* Right Handle */}
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-6 bg-yellow-600 rounded-full"></div>
              </div>

              {/* Year Plaque */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-yellow-600 px-3 py-1 rounded border-2 border-yellow-500">
                <div className="text-lg font-serif font-bold text-yellow-100">{year}</div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-300/20 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </div>

            <div className="text-center mt-2 text-amber-200 text-xs font-serif">
              {doorLoaded ? 'Loading Hall...' : 'Click to Enter'}
            </div>
          </div>
        </div>
      )}

      {/* Door Information */}
      <div className="text-center mt-6 px-4">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-amber-500/30 max-w-xs">
          <div className="text-amber-200 text-xl font-serif font-bold">{year}</div>
          <div className="text-amber-300/80 text-sm font-serif italic mt-1">{committeeName}</div>
          {!isOpening && !isOpen && (
            <div className="text-amber-400/60 text-xs mt-3 flex items-center justify-center gap-2">
              <span>🚪</span>
              <span>Click to enter the hall</span>
            </div>
          )}
          {isOpening && (
            <div className="text-amber-400 text-xs mt-3 animate-pulse flex items-center justify-center gap-2">
              <span>✨</span>
              <span>Opening doors...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
