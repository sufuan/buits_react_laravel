import React, { useEffect, useRef, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import classNames from 'classnames';
import NavBar from '@/Components/HomePage/Navbar';
import RealisticDoor from '@/Components/Museum/RealisticDoor';
import FootstepsAnimation from '@/Components/Museum/FootstepsAnimation';
import ImmersiveRoom from '@/Components/Museum/ImmersiveRoom';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/**
 * 🏛️ LEGENDARY MUSEUM OF PAST COMMITTEES
 * Immersive storytelling experience exactly as specified
 */
export default function PreviousMuseum() {
  const { legendaryYears = [], emblem, totalMembers = 100, totalArtifacts = 50 } = usePage().props;

  // Fallback data if no legendaryYears provided
  const years = legendaryYears.length > 0 ? legendaryYears : [
    {
      year: '2024',
      theme: 'Innovation & Growth',
      name: 'Current Committee',
      members: [
        { id: 1, name: 'John Doe', role: 'President', avatar: null },
        { id: 2, name: 'Jane Smith', role: 'Vice President', avatar: null },
        { id: 3, name: 'Mike Johnson', role: 'Secretary', avatar: null },
      ]
    },
    {
      year: '2023',
      theme: 'Digital Transformation',
      name: 'Tech Committee',
      members: [
        { id: 4, name: 'Sarah Wilson', role: 'President', avatar: null },
        { id: 5, name: 'David Brown', role: 'Vice President', avatar: null },
      ]
    }
  ];

  // State management
  const [currentYearIndex, setCurrentYearIndex] = useState(0);
  const [selectedMember, setSelectedMember] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [deviceTilt, setDeviceTilt] = useState({ x: 0, y: 0 });
  const [openDoors, setOpenDoors] = useState({});
  const [walkingStates, setWalkingStates] = useState({});
  const [enteringRooms, setEnteringRooms] = useState({});

  // Refs for animations
  const heroRef = useRef(null);
  const emblemRef = useRef(null);
  const corridorRef = useRef(null);
  const doorRefs = useRef([]);
  const cameraRefs = useRef([]); // container around each door section for camera push
  const vignetteRefs = useRef([]); // overlay vignette for immersion
  const cameraTls = useRef({});

  // Initialize door refs
  useEffect(() => {
    doorRefs.current = years.map(() => React.createRef());
  cameraRefs.current = years.map(() => React.createRef());
  vignetteRefs.current = years.map(() => React.createRef());
  }, [years]);

  // Device tilt parallax for hero emblem
  useEffect(() => {
    const handleDeviceOrientation = (event) => {
      const x = event.gamma || 0; // left-right tilt
      const y = event.beta || 0;  // front-back tilt
      setDeviceTilt({ x: x / 30, y: y / 30 }); // Normalize

      // Apply tilt to emblem
      if (emblemRef.current) {
        gsap.to(emblemRef.current, {
          x: (x / 30) * 15,
          rotationX: (y / 30) * 10,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
      return () => window.removeEventListener('deviceorientation', handleDeviceOrientation);
    }
  }, []);

  // Reduced motion preference
  const reducedMotion = useReducedMotion();

  // ScrollTrigger setup for corridor doors
  useEffect(() => {
    if (!corridorRef.current) return;
    if (reducedMotion) return;
    if (!years.length) return;

    // Build ScrollTrigger to pin corridor and treat each door as a "scene"
    const triggers = years.map((y, i) => {
      const triggerEl = doorRefs.current[i];
      // Make sure triggerEl is a valid DOM element
      if (!triggerEl || typeof triggerEl.getBoundingClientRect !== 'function') return null;

      return ScrollTrigger.create({
        trigger: triggerEl,
        start: 'top center',
        end: () => `+=${window.innerHeight / 2}`,
        onEnter: () => setCurrentYearIndex(i),
        onEnterBack: () => setCurrentYearIndex(i)
      });
    });

    return () => {
      triggers.forEach(t => t && t.kill());
      ScrollTrigger.getAll().forEach(s => s.kill());
    };
  }, [years, reducedMotion]);

  // Door interaction handlers
  const handleDoorEnter = (yearIndex) => {
    // The door component requests to enter; we only mark door as opening
    setOpenDoors(prev => ({ ...prev, [yearIndex]: true }));
  };

  const handleDoorOpenComplete = (yearIndex) => {
    // After doors fully open, start footsteps walking
    setWalkingStates(prev => ({ ...prev, [yearIndex]: true }));
  // Start camera push-in towards the door
  startCameraPush(yearIndex);
  };

  const handleWalkComplete = (yearIndex) => {
    // Walking finished; fade out the black overlay and reveal the room content
    setWalkingStates(prev => ({ ...prev, [yearIndex]: false }));
    setEnteringRooms(prev => ({ ...prev, [yearIndex]: true }));
    
    const blackOverlay = document.getElementById(`blackout-overlay-${yearIndex}`);
    if (blackOverlay) {
      // Fade out black overlay to reveal the room
      gsap.to(blackOverlay, { 
        opacity: 0, 
        duration: 1.0, 
        ease: 'power2.out' 
      });
    }
  };

  const handleRoomEnterComplete = (yearIndex) => {
    // Room entry complete
  };

  // Museum map navigation with footstep effect
  const jumpToYear = (index) => {
    setMapOpen(false);
    const targetElement = doorRefs.current[index];
    if (!targetElement) return;

    // Footstep animation effect
    const footstepTl = gsap.timeline();
    footstepTl
      .to('body', { backgroundColor: '#000', duration: 0.3 })
      .to('body', { backgroundColor: '', duration: 0.5 })
      .call(() => {
        // Smooth scroll to year
        gsap.to(window, {
          scrollTo: {
            y: targetElement,
            offsetY: window.innerHeight * 0.3
          },
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => setCurrentYearIndex(index)
        });
      });
  };

  // Cinematic transition to simulate entering the room
  const startCameraPush = (index) => {
    const sectionEl = doorRefs.current[index];
    const blackOverlay = document.getElementById(`blackout-overlay-${index}`);
    if (!blackOverlay) return;

    // kill previous
    if (cameraTls.current[index]) {
      try { cameraTls.current[index].kill(); } catch {}
    }

    const tl = gsap.timeline();
    cameraTls.current[index] = tl;

    // Ensure scroll to the door section first
    if (sectionEl) {
      tl.to(window, {
        scrollTo: { y: sectionEl, offsetY: window.innerHeight * 0.2 },
        duration: 0.6,
        ease: 'power2.inOut'
      });
    }

    // Gradually fade to black to simulate entering the room
    tl.to(blackOverlay, {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.inOut'
    }, '-=0.3');
  };

  return (
    <>
      <Head title="Legendary Museum of Past Committees - University IT Society" />
      <NavBar />

      <main className="bg-gradient-to-b from-black via-amber-900/10 to-black text-white min-h-screen antialiased overflow-x-hidden">
        {/* Scene 1: Museum Entrance */}
        <MuseumEntrance
          emblem={emblem}
          emblemRef={emblemRef}
          totalMembers={totalMembers}
          totalArtifacts={totalArtifacts}
        />

        {/* Scene 2: Corridor of Time */}
        <div ref={corridorRef} className="corridor relative min-h-screen">
          {/* Cinematic corridor background */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-red-900/30 to-black/90"></div>
          {/* Stone texture using CSS patterns instead of image */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `
                repeating-linear-gradient(45deg, rgba(139, 90, 43, 0.1) 0px, rgba(139, 90, 43, 0.1) 2px, transparent 2px, transparent 10px),
                repeating-linear-gradient(-45deg, rgba(101, 67, 33, 0.1) 0px, rgba(101, 67, 33, 0.1) 2px, transparent 2px, transparent 10px),
                radial-gradient(circle at 30% 20%, rgba(139, 90, 43, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(101, 67, 33, 0.2) 0%, transparent 50%)
              `,
              backgroundSize: '20px 20px, 20px 20px, 200px 200px, 200px 200px'
            }}
          ></div>

          {/* Stone wall texture and candlelight sconces */}
          <div className="absolute left-4 top-20 w-3 h-3 bg-yellow-400 rounded-full animate-pulse opacity-70 blur-sm"></div>
          <div className="absolute right-4 top-40 w-3 h-3 bg-amber-400 rounded-full animate-pulse opacity-60 blur-sm"></div>
          <div className="absolute left-4 top-60 w-3 h-3 bg-yellow-500 rounded-full animate-pulse opacity-80 blur-sm"></div>
          <div className="absolute right-4 top-80 w-3 h-3 bg-amber-300 rounded-full animate-pulse opacity-50 blur-sm"></div>

          {/* Deep red carpet runner */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-24 h-full bg-gradient-to-b from-red-800/40 via-red-900/60 to-red-950/80 opacity-60"></div>

          <div className="relative z-10 px-4 pt-12 pb-32">
            {/* Corridor title */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-serif text-amber-200 mb-6 tracking-wide">
                The Corridor of Time
              </h2>
              <p className="text-amber-400/80 text-xl max-w-2xl mx-auto leading-relaxed">
                Walk through the legendary halls where each door opens to reveal the heroes who shaped our legacy
              </p>
              <div className="mt-6 flex items-center justify-center gap-4 text-amber-500/60">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
                <div className="text-sm font-serif italic">Step forward, legend awaits</div>
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
              </div>
            </div>

            {/* Vertical corridor with doors */}
            <div className="space-y-48 max-w-4xl mx-auto">
              {years.map((y, idx) => (
                <div
                  key={y.year}
                  ref={(el) => doorRefs.current[idx] = el}
                  className={classNames('door-section relative transition-all duration-700 py-20', {
                    'opacity-100 scale-100 transform-none': idx === currentYearIndex,
                    'opacity-70 scale-95 filter grayscale-[0.3]': idx !== currentYearIndex
                  })}
                  style={{ perspective: '1200px' }}
                >
                  {/* Door Container with proper spacing */}
                  <div
                    ref={(el) => cameraRefs.current[idx] = el}
                    className="relative min-h-[800px] flex flex-col items-center justify-center"
                    style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                  >

                    {/* Atmospheric Background for this door */}
                    <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 via-transparent to-transparent rounded-3xl"></div>

                    {/* Floor area in front of door - base gradient */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-48 bg-gradient-to-t from-amber-900/20 to-transparent rounded-full blur-sm z-0"></div>

                    {/* Realistic Door - Centered and smaller */}
                    <div className="relative z-20 flex justify-center">
                      <RealisticDoor
                        year={y.year}
                        committeeName={y.theme || `Committee ${y.year}`}
                        onEnter={() => handleDoorEnter(idx)}
                        onOpenComplete={() => handleDoorOpenComplete(idx)}
                        isOpen={openDoors[idx]}
                      />
                    </div>

                    {/* Black overlay for cinematic room entry transition */}
                    <div
                      id={`blackout-overlay-${idx}`}
                      className="fixed inset-0 bg-black z-50 pointer-events-none"
                      style={{ opacity: 0 }}
                    />

                    {/* Footsteps Animation - positioned in front of door on the floor */}
                    {walkingStates[idx] && (
                      <div className="absolute bottom-0 left-0 right-0 h-48 z-30 pointer-events-none">
                        <FootstepsAnimation
                          isWalking={walkingStates[idx]}
                          onWalkComplete={() => handleWalkComplete(idx)}
                        />
                      </div>
                    )}

                    {/* Immersive Room */}
                    {enteringRooms[idx] && (
                      <ImmersiveRoom
                        data={y}
                        isEntering={enteringRooms[idx]}
                        onEnterComplete={() => handleRoomEnterComplete(idx)}
                        onExit={() => {
                          // Start exit transition - fade to black, then reset
                          const blackOverlay = document.getElementById(`blackout-overlay-${idx}`);
                          if (blackOverlay) {
                            gsap.to(blackOverlay, {
                              opacity: 1,
                              duration: 0.8,
                              ease: 'power2.inOut',
                              onComplete: () => {
                                // After fade to black, reset states and fade back to corridor
                                setEnteringRooms(prev => ({ ...prev, [idx]: false }));
                                setOpenDoors(prev => ({ ...prev, [idx]: false }));
                                gsap.to(blackOverlay, {
                                  opacity: 0,
                                  duration: 1.0,
                                  ease: 'power2.out'
                                });
                              }
                            });
                          } else {
                            // Fallback if overlay not found
                            setEnteringRooms(prev => ({ ...prev, [idx]: false }));
                            setOpenDoors(prev => ({ ...prev, [idx]: false }));
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Corridor end with archive stairs hint */}
            <div className="text-center mt-20 opacity-60">
              <div className="text-amber-400/60 text-sm mb-2">Continue scrolling to explore the archives</div>
              <div className="w-8 h-8 mx-auto border-2 border-amber-400/40 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-amber-400/60 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Scene 5: Archive Section */}
        <ArchiveSection legendaryYears={years} />

        {/* Floating Museum Map Button */}
        <button
          onClick={() => setMapOpen(true)}
          className="fixed right-6 bottom-6 z-50 w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300"
          style={{
            boxShadow: "0 0 30px rgba(176, 141, 87, 0.6)"
          }}
        >
          <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
            <span className="text-amber-900 text-xs font-bold">🗺️</span>
          </div>
        </button>

        {/* Museum Map Overlay */}
        {mapOpen && (
          <MuseumMap
            years={years}
            currentIndex={currentYearIndex}
            onClose={() => setMapOpen(false)}
            onPick={jumpToYear}
          />
        )}

        {/* Current Year Indicator */}
        <div className="fixed left-6 top-24 z-40 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-amber-500/30">
          <div className="text-amber-200 text-sm font-serif">
            Currently Viewing: <span className="font-bold">{years[currentYearIndex]?.year || '—'}</span>
          </div>
        </div>
      </main>
    </>
  );
}

/**
 * Scene 1: Museum Entrance - Giant rotating emblem with device tilt parallax
 */
function MuseumEntrance({ emblem, emblemRef, totalMembers, totalArtifacts }) {
  const shardsRef = useRef([]);
  const doorsRef = useRef(null);

  useGSAP(() => {
    // Hero emblem entrance animation
    if (emblemRef.current) {
      gsap.fromTo(emblemRef.current, {
        scale: 0,
        rotation: -180,
        opacity: 0,
        y: 100
      }, {
        scale: 1,
        rotation: 0,
        opacity: 1,
        y: 0,
        duration: 2.5,
        ease: "power2.out"
      });

      // Continuous floating rotation
      gsap.to(emblemRef.current, {
        rotationY: 360,
        duration: 8,
        repeat: -1,
        ease: "none"
      });

      // Floating animation
      gsap.to(emblemRef.current, {
        y: -20,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    // Floating shards animation
    shardsRef.current.forEach((shard, index) => {
      if (shard) {
        gsap.to(shard, {
          y: `random(-30, 30)`,
          x: `random(-20, 20)`,
          rotation: `random(-45, 45)`,
          duration: `random(3, 6)`,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.5
        });
      }
    });

    // Scroll-triggered door opening
    ScrollTrigger.create({
      trigger: ".museum-entrance",
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // Emblem shrinks to floor
        if (emblemRef.current) {
          gsap.to(emblemRef.current, {
            scale: 1 - (progress * 0.7),
            y: progress * 200,
            duration: 0.3
          });
        }

        // Doors open
        if (doorsRef.current) {
          gsap.to(doorsRef.current, {
            rotationY: progress * -90,
            transformOrigin: "left center",
            duration: 0.3
          });
        }
      }
    });
  }, []);

  return (
    <section className="museum-entrance relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dark polished marble floor */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black"></div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-amber-900/10 to-black/60"></div>

      {/* Candlelight effects */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-pulse opacity-60 blur-sm"></div>
      <div className="absolute top-20 right-20 w-3 h-3 bg-amber-400 rounded-full animate-ping opacity-40"></div>
      <div className="absolute bottom-40 left-1/4 w-5 h-5 bg-yellow-500 rounded-full animate-pulse opacity-50 blur-sm"></div>
      <div className="absolute bottom-20 right-1/3 w-4 h-4 bg-amber-300 rounded-full animate-bounce opacity-60"></div>

      {/* Giant rotating society emblem */}
      <div className="relative z-10 flex flex-col items-center">
        <div
          ref={emblemRef}
          className="relative w-64 h-64 md:w-80 md:h-80 mb-8"
          style={{
            filter: "drop-shadow(0 0 40px rgba(176, 141, 87, 0.8))",
            transformStyle: "preserve-3d"
          }}
        >
          {/* Main emblem */}
          <div className="w-full h-full bg-gradient-to-br from-yellow-600 via-amber-500 to-yellow-700 rounded-full flex items-center justify-center border-4 border-amber-300 shadow-2xl">
            <div className="text-4xl md:text-6xl font-bold text-amber-900 font-serif">
              BUITS
            </div>
          </div>

          {/* Floating shards showing past events */}
          <div
            ref={el => shardsRef.current[0] = el}
            className="absolute -top-12 -left-12 w-16 h-12 bg-amber-400/60 rounded-lg flex items-center justify-center text-xs text-amber-900 font-bold"
          >
            2024
          </div>
          <div
            ref={el => shardsRef.current[1] = el}
            className="absolute -top-8 -right-16 w-12 h-12 bg-yellow-500/50 rounded-full flex items-center justify-center text-xs text-amber-900"
          >
            🏆
          </div>
          <div
            ref={el => shardsRef.current[2] = el}
            className="absolute -bottom-10 -right-10 w-14 h-10 bg-amber-500/70 rounded-lg flex items-center justify-center text-xs text-amber-900 font-bold"
          >
            500+
          </div>
          <div
            ref={el => shardsRef.current[3] = el}
            className="absolute -bottom-14 -left-14 w-10 h-10 bg-yellow-400/80 rounded-full flex items-center justify-center text-xs text-amber-900"
          >
            💻
          </div>
          <div
            ref={el => shardsRef.current[4] = el}
            className="absolute top-1/2 -left-20 w-12 h-8 bg-amber-300/60 rounded-lg flex items-center justify-center text-xs text-amber-900"
          >
            AI
          </div>
          <div
            ref={el => shardsRef.current[5] = el}
            className="absolute top-1/4 -right-20 w-10 h-10 bg-yellow-600/50 rounded-full flex items-center justify-center text-xs text-amber-900"
          >
            🚀
          </div>
        </div>

        {/* Museum title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-7xl font-serif text-amber-200 mb-4 tracking-wide leading-tight">
            Legendary Museum
          </h1>
          <h2 className="text-2xl md:text-4xl font-serif text-amber-300 mb-6 italic">
            of Past Committees
          </h2>
          <div className="flex items-center justify-center gap-8 text-amber-400/80 text-lg">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              <span>{totalMembers}+ Legends</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏛️</span>
              <span>{totalArtifacts}+ Artifacts</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center animate-bounce">
          <p className="text-amber-400 text-sm mb-2">Scroll down to enter the museum</p>
          <div className="w-6 h-10 border-2 border-amber-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-amber-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Grand double doors (animated on scroll) */}
      <div
        ref={doorsRef}
        className="absolute inset-0 bg-gradient-to-b from-amber-800/20 to-black/60 z-5"
        style={{
          backgroundImage: "linear-gradient(180deg, rgba(139, 69, 19, 0.3) 0%, rgba(0, 0, 0, 0.8) 100%)",
          transformStyle: "preserve-3d"
        }}
      />

      {/* Floor reflection effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent"></div>
    </section>
  );
}

/* -----------------------------
   ARCHIVE SECTION - Scene 5: Underground Archive Chamber
   - Grand spiral staircase descending into archives
   -----------------------------*/
function ArchiveSection() {
  const archiveRef = useRef(null);
  const staircaseRef = useRef(null);
  const yearbookRef = useRef(null);
  const [yearbookOpen, setYearbookOpen] = useState(false);

  useEffect(() => {
    // Archive entrance animation
    ScrollTrigger.create({
      trigger: archiveRef.current,
      start: "top 80%",
      onEnter: () => {
        // Spiral staircase descent animation
        gsap.fromTo(staircaseRef.current, {
          y: -100,
          opacity: 0,
          rotationX: -45
        }, {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 2,
          ease: "power2.out"
        });

        // Flickering torch effects
        gsap.to('.torch-flame', {
          opacity: "random(0.6, 1)",
          scale: "random(0.9, 1.1)",
          duration: "random(0.5, 1.5)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.3
        });
      }
    });
  }, []);

  const handleYearbookClick = () => {
    setYearbookOpen(!yearbookOpen);

    if (!yearbookOpen) {
      // Page flip animation
      gsap.to(yearbookRef.current, {
        rotationY: -15,
        scale: 1.05,
        duration: 0.8,
        ease: "power2.out"
      });
    } else {
      gsap.to(yearbookRef.current, {
        rotationY: 0,
        scale: 1,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };

  return (
    <section
      ref={archiveRef}
      className="min-h-screen relative bg-gradient-to-b from-black via-amber-900/20 to-black overflow-hidden"
    >
      {/* Stone chamber background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-900 to-black opacity-30"></div>

      {/* Flickering torchlight */}
      <div className="torch-flame absolute top-20 left-8 w-4 h-4 bg-yellow-400 rounded-full blur-sm opacity-80"></div>
      <div className="torch-flame absolute top-32 right-12 w-3 h-3 bg-amber-400 rounded-full blur-sm opacity-70"></div>
      <div className="torch-flame absolute top-48 left-16 w-5 h-5 bg-yellow-500 rounded-full blur-sm opacity-90"></div>
      <div className="torch-flame absolute top-64 right-8 w-3 h-3 bg-amber-300 rounded-full blur-sm opacity-60"></div>

      <div className="relative z-10 px-6 py-20">
        {/* Archive title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-serif text-amber-200 mb-4">
            The Archives
          </h2>
          <p className="text-amber-400/80 text-lg italic">
            Where memories are preserved for eternity
          </p>
        </div>

        {/* Spiral staircase visual */}
        <div
          ref={staircaseRef}
          className="max-w-2xl mx-auto mb-16"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="relative">
            {/* Staircase steps */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="relative mb-4"
                style={{
                  transform: `perspective(1000px) rotateX(${i * 5}deg) translateZ(${i * -10}px)`,
                  opacity: 1 - (i * 0.1)
                }}
              >
                <div className="w-full h-8 bg-gradient-to-r from-amber-800/60 via-amber-700/80 to-amber-800/60 rounded-lg border border-amber-600/30 shadow-lg">
                  <div className="w-full h-2 bg-gradient-to-r from-amber-600/40 to-amber-500/40 rounded-t-lg"></div>
                </div>
              </div>
            ))}

            {/* Descent indicator */}
            <div className="text-center mt-8">
              <div className="text-amber-400/60 text-sm mb-2">Descending into the archives...</div>
              <div className="w-1 h-12 bg-gradient-to-b from-amber-400 to-transparent mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Archive chamber */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Archive stacks */}
            <div className="space-y-6">
              <h3 className="text-2xl font-serif text-amber-200 mb-4">Historical Collections</h3>

              {/* Stack of yearbooks */}
              <div className="space-y-2">
                {['2024 Yearbook', '2023 Yearbook', '2022 Yearbook', '2021 Yearbook', '2020 Yearbook'].map((book, i) => (
                  <div
                    key={book}
                    className="h-8 bg-gradient-to-r from-amber-800 to-amber-700 rounded-r-lg border-l-4 border-amber-600 shadow-lg flex items-center px-4"
                    style={{
                      transform: `translateX(${i * 4}px)`,
                      zIndex: 5 - i
                    }}
                  >
                    <div className="text-amber-200 text-sm font-serif">{book}</div>
                  </div>
                ))}
              </div>

              {/* Newspaper archives */}
              <div className="space-y-2">
                <h4 className="text-lg font-serif text-amber-300">Press Coverage</h4>
                {['Tech Tribune 2024', 'University Herald 2023', 'Innovation Weekly 2022'].map((paper, i) => (
                  <div
                    key={paper}
                    className="h-6 bg-gradient-to-r from-gray-700 to-gray-600 rounded-r-lg border-l-2 border-gray-500 shadow-md flex items-center px-3"
                    style={{ transform: `translateX(${i * 6}px)` }}
                  >
                    <div className="text-gray-300 text-xs font-serif">{paper}</div>
                  </div>
                ))}
              </div>

              {/* Artifacts */}
              <div className="space-y-2">
                <h4 className="text-lg font-serif text-amber-300">Artifacts</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg flex items-center justify-center shadow-lg">
                    <div className="text-amber-200 text-xs">🏆</div>
                  </div>
                  <div className="h-12 bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg flex items-center justify-center shadow-lg">
                    <div className="text-amber-200 text-xs">📜</div>
                  </div>
                  <div className="h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center shadow-lg">
                    <div className="text-amber-200 text-xs">🎖️</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive yearbook */}
            <div className="text-center">
              <h3 className="text-2xl font-serif text-amber-200 mb-6">Featured Archive</h3>
              <div
                ref={yearbookRef}
                className="relative cursor-pointer"
                onClick={handleYearbookClick}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="w-64 h-80 bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 rounded-lg shadow-2xl border-4 border-amber-600 mx-auto">
                  <div className="p-6 h-full flex flex-col">
                    <div className="text-center mb-4">
                      <div className="text-2xl font-serif text-amber-200 font-bold">2024</div>
                      <div className="text-lg font-serif text-amber-300 italic">Yearbook</div>
                    </div>

                    {yearbookOpen ? (
                      <div className="flex-1 bg-cream-100 rounded p-4 text-black text-sm">
                        <div className="space-y-2">
                          <div className="font-bold">President's Message</div>
                          <div className="text-xs leading-relaxed">
                            "This year marked a turning point in our society's history.
                            We launched groundbreaking initiatives, forged new partnerships,
                            and welcomed our largest cohort of members yet..."
                          </div>
                          <div className="text-xs text-gray-600 italic mt-4">
                            Click to close
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-amber-200 text-4xl">📖</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Page flip effect */}
                {yearbookOpen && (
                  <div className="absolute top-0 right-0 w-64 h-80 bg-gradient-to-bl from-white via-cream-50 to-cream-100 rounded-lg shadow-xl transform origin-left"
                       style={{ transform: "rotateY(-15deg) translateZ(10px)" }}>
                  </div>
                )}
              </div>

              <p className="text-amber-400/80 text-sm mt-4 italic">
                Click the yearbook to explore its pages
              </p>
            </div>
          </div>
        </div>

        {/* Ambient sound indicators */}
        <div className="text-center mt-16 opacity-60">
          <div className="text-amber-400/60 text-sm italic">
            Listen... can you hear the whispers of history?
          </div>
          <div className="flex justify-center gap-2 mt-2">
            <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -----------------------------
   HERO COMPONENT
   -----------------------------*/
function Hero({ emblem }) {
  const reducedMotion = useReducedMotion();
  const emblemRef = useRef(null);
  const doorRef = useRef(null);

  useEffect(() => {
    if (reducedMotion) return;

    // Cinematic entrance animation
    const tl = gsap.timeline();

    // Floating emblem with warm glow
    tl.fromTo(emblemRef.current, {
      scale: 0,
      rotation: -180,
      opacity: 0,
      y: 100
    }, {
      scale: 1,
      rotation: 0,
      opacity: 1,
      y: 0,
      duration: 2.5,
      ease: "power2.out"
    })
    .to(emblemRef.current, {
      rotationY: 360,
      duration: 8,
      repeat: -1,
      ease: "none"
    }, "-=1");

    // Floating animation
    gsap.to(emblemRef.current, {
      y: -15,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Door opening animation on scroll
    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        if (doorRef.current) {
          gsap.to(doorRef.current, {
            rotationY: progress * -90,
            transformOrigin: "left center",
            duration: 0.3
          });
        }
      }
    });

    // Parallax for floating shards
    gsap.to(".floating-shard", {
      y: "random(-30, 30)",
      x: "random(-20, 20)",
      rotation: "random(-45, 45)",
      duration: "random(3, 6)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.5
    });

  }, [reducedMotion]);

  return (
    <section className="hero relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Cinematic background with warm museum lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900/30 via-red-900/40 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-red-900/30 to-black/60 opacity-40" />

      {/* Candlelight effects */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-pulse opacity-60 blur-sm"></div>
      <div className="absolute top-20 right-20 w-2 h-2 bg-amber-400 rounded-full animate-ping opacity-40"></div>
      <div className="absolute bottom-40 left-1/4 w-6 h-6 bg-yellow-500 rounded-full animate-pulse opacity-50 blur-sm"></div>
      <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-amber-300 rounded-full animate-bounce opacity-60"></div>

      {/* Grand museum entrance doors */}
      <div
        ref={doorRef}
        className="absolute inset-0 bg-gradient-to-b from-amber-800/20 to-black/60 z-5"
        style={{
          backgroundImage: "linear-gradient(180deg, rgba(139, 69, 19, 0.3) 0%, rgba(0, 0, 0, 0.8) 100%)",
          transformStyle: "preserve-3d"
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Floating Society Emblem */}
        <div
          ref={emblemRef}
          className="hero-emblem relative w-64 h-64 md:w-80 md:h-80"
          style={{
            filter: "drop-shadow(0 0 40px rgba(176, 141, 87, 0.8))",
            transformStyle: "preserve-3d"
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-yellow-600 via-amber-500 to-yellow-700 rounded-full flex items-center justify-center border-4 border-amber-300 shadow-2xl">
            <div className="text-4xl md:text-6xl font-bold text-amber-900 font-serif">
              BUITS
            </div>
          </div>

          {/* Floating translucent shards */}
          <div className="floating-shard absolute -top-12 -left-12 w-8 h-8 bg-amber-400/60 rounded transform rotate-45"></div>
          <div className="floating-shard absolute -top-8 -right-16 w-6 h-6 bg-yellow-500/40 rounded-full"></div>
          <div className="floating-shard absolute -bottom-10 -right-10 w-10 h-10 bg-amber-500/50 rounded transform rotate-12"></div>
          <div className="floating-shard absolute -bottom-14 -left-14 w-4 h-4 bg-yellow-400/70 rounded-full"></div>
          <div className="floating-shard absolute top-1/2 -left-20 w-5 h-5 bg-amber-300/60 rounded transform rotate-30"></div>
          <div className="floating-shard absolute top-1/4 -right-20 w-7 h-7 bg-yellow-600/50 rounded-full"></div>
        </div>

        {/* Museum Title with Elegant Typography */}
        <div className="text-center">
          <h1 className="text-4xl md:text-7xl font-serif text-amber-200 mb-4 tracking-wide leading-tight">
            Legendary Museum
          </h1>
          <h2 className="text-2xl md:text-4xl font-serif text-amber-300 mb-6 italic">
            of Past Committees
          </h2>
          <p className="text-amber-400/80 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
            Step through the grand doors and walk among the legends who shaped our society
          </p>
        </div>

        {/* Scroll indicator with animation */}
        <div className="mt-8 flex flex-col items-center animate-bounce">
          <p className="text-amber-400 text-sm mb-2">Scroll down to enter</p>
          <div className="w-6 h-10 border-2 border-amber-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-amber-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Warm lighting overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-amber-900/10 to-black/40 pointer-events-none"></div>
    </section>
  );
}

/* -----------------------------
   DOOR COMPONENT (wrapper)
   - Cinematic door with period-appropriate styling
   -----------------------------*/
function Door({ year, theme, color, style, children, onOpen }) {
  const [open, setOpen] = useState(false);
  const [glowing, setGlowing] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const doorRef = useRef(null);
  const handleRef = useRef(null);
  const roomRef = useRef(null);

  useEffect(() => {
    if (!doorRef.current) return;

    // Slight random tilt for authentic "hanging" effect
    gsap.set(doorRef.current, { rotation: gsap.utils.random(-2, 2) });

    // Hover glow effect
    const door = doorRef.current;

    const handleMouseEnter = () => {
      setGlowing(true);
      gsap.to(door, {
        scale: 1.02,
        boxShadow: "0 0 40px rgba(176, 141, 87, 0.4)",
        duration: 0.4,
        ease: "power2.out"
      });

      // Subtle door handle animation
      if (handleRef.current) {
        gsap.to(handleRef.current, {
          rotation: 5,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    const handleMouseLeave = () => {
      setGlowing(false);
      gsap.to(door, {
        scale: 1,
        boxShadow: "0 0 0px rgba(176, 141, 87, 0)",
        duration: 0.4,
        ease: "power2.out"
      });

      if (handleRef.current) {
        gsap.to(handleRef.current, {
          rotation: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    door.addEventListener('mouseenter', handleMouseEnter);
    door.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      door.removeEventListener('mouseenter', handleMouseEnter);
      door.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const openDoor = () => {
    if (open) return; // Prevent multiple clicks
    
    console.log(`Opening door for year ${year}`); // Debug log
    setIsWalking(true);
    
    // Start walking animation first
    setTimeout(() => {
      setOpen(true);
      
      // Cinematic door opening animation
      if (doorRef.current) {
        const tl = gsap.timeline();

        // Door swings open with realistic physics
        tl.to(doorRef.current.querySelector('.door-panel'), {
          rotationY: -75,
          transformOrigin: "left center",
          duration: 1.5,
          ease: 'power2.inOut',
          transformStyle: "preserve-3d"
        })
        // Light spills out dramatically
        .to(doorRef.current.querySelector('.door-light-spill'), {
          opacity: 0.8,
          scale: 1.5,
          duration: 1.2,
          ease: 'power2.out'
        }, "-=1.2")
        // Room content fades in after walking
        .fromTo(roomRef.current, {
          opacity: 0,
          y: 50,
          scale: 0.9
        }, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.5,
          ease: 'power2.out'
        }, "-=0.5");
      }
      
      // Stop walking after door opens
      setTimeout(() => {
        setIsWalking(false);
        if (onOpen) onOpen();
      }, 2000);
    }, 500); // Small delay before starting door animation
  };

  return (
    <div className="w-full group relative">
      {/* Walking Animation Overlay - FIXED POSITIONING */}
      {isWalking && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-serif text-amber-200 mb-6">
              Entering {year} Chamber...
            </div>
            
            {/* REALISTIC WALKING FIGURE */}
            <div className="relative w-48 h-64 mx-auto">
              {/* Shadow */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black/60 rounded-full blur-sm animate-pulse"></div>
              
              {/* Walking Figure */}
              <div className="relative w-24 h-48 mx-auto">
                {/* Head */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-b from-amber-300 to-amber-400 rounded-full"></div>
                
                {/* Body */}
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-16 h-24 bg-gradient-to-b from-amber-400 to-amber-600 rounded-lg"></div>
                
                {/* Arms */}
                <div className="absolute top-12 left-0 w-6 h-20 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full animate-pulse"></div>
                <div className="absolute top-12 right-0 w-6 h-20 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                
                {/* Legs */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-x-4 w-6 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-lg animate-bounce"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-x-4 w-6 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-lg animate-bounce" style={{animationDelay: '0.3s'}}></div>
              </div>

              {/* FOOTSTEPS - PROPERLY POSITIONED */}
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-6 bg-amber-600/70 rounded-full animate-ping"
                    style={{
                      left: `${(i % 2) * 20 - 10}px`,
                      bottom: `${i * 15}px`,
                      animationDelay: `${i * 0.3}s`,
                      transform: `rotate(${(i % 2) * 20 - 10}deg)`
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div className="text-amber-400 text-sm mt-4 animate-pulse">
              Walking into the legendary chamber...
            </div>
          </div>
        </div>
      )}

      <div
        ref={doorRef}
        className="relative w-full max-w-lg mx-auto rounded-2xl overflow-hidden"
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px"
        }}
      >
        {/* Door frame with period styling */}
        <div className="door-panel relative h-80 rounded-2xl border-4 border-amber-700 bg-gradient-to-b from-amber-800 to-amber-900 overflow-hidden cursor-pointer shadow-2xl"
             onClick={openDoor}
             role="button"
             aria-label={`Open ${year} committee room`}>

          {/* Door background with wood texture */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(45deg, #8B5A2B 0%, #A0522D 50%, #8B4513 100%)`,
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(139, 90, 43, 0.3) 2px, transparent 2px),
                radial-gradient(circle at 75% 75%, rgba(160, 82, 45, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px"
            }}
          />

          {/* Door panels (traditional design) */}
          <div className="absolute inset-6 grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-amber-800/50 to-amber-900/80 rounded-lg border-2 border-amber-700/60 shadow-inner"></div>
            <div className="bg-gradient-to-br from-amber-800/50 to-amber-900/80 rounded-lg border-2 border-amber-700/60 shadow-inner"></div>
            <div className="bg-gradient-to-br from-amber-800/50 to-amber-900/80 rounded-lg border-2 border-amber-700/60 shadow-inner"></div>
            <div className="bg-gradient-to-br from-amber-800/50 to-amber-900/80 rounded-lg border-2 border-amber-700/60 shadow-inner"></div>
          </div>

          {/* Year plaque */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-b from-amber-400 to-amber-600 px-4 py-2 rounded-lg border-2 border-amber-300 shadow-lg">
              <div className="text-2xl font-serif font-bold text-amber-900">{year}</div>
            </div>
          </div>

          {/* Theme inscription */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 max-w-[80%]">
            <div className="bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-amber-500/30">
              <div className="text-sm text-amber-200 text-center font-serif italic">{theme}</div>
            </div>
          </div>

          {/* Door handle */}
          <div
            ref={handleRef}
            className="absolute right-6 top-1/2 transform -translate-y-1/2"
          >
            <div className="w-4 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full border border-amber-300 shadow-lg"></div>
          </div>

          {/* Light spill effect (hidden initially) */}
          <div className="door-light-spill absolute inset-0 bg-gradient-to-r from-amber-300/0 via-yellow-200/60 to-amber-300/0 opacity-0 scale-75 transition-all duration-500"></div>

          {/* Glow effect when hovering */}
          {glowing && (
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-400/30 to-amber-500/20 animate-pulse"></div>
          )}
        </div>

        {/* Door instruction */}
        <div className="text-center mt-4">
          <p className="text-amber-400/80 text-sm font-serif">
            {isWalking ? "Entering chamber..." : open ? "Welcome to the chamber" : "Tap the door to enter"}
          </p>
        </div>

        {/* Committee room content - ONLY SHOW AFTER DOOR OPENS */}
        <div ref={roomRef} className="mt-8 committee-room">
          {open && !isWalking && (
            <div className="transition-all duration-1000 ease-out">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* -----------------------------
   COMMITTEE ROOM
   - displays member portrait carousel (horizontal swipe)
   - portrait tap/tap-hold behavior
   -----------------------------*/
function CommitteeRoom({ data }) {
  // data.members: array
  const [selected, setSelected] = useState(null);
  const [pressTimer, setPressTimer] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pressTimer) clearTimeout(pressTimer);
    };
  }, [pressTimer]);

  const startHold = (member) => {
    // start a timer to emulate tap-hold for extra animation
    const t = setTimeout(() => {
      setSelected(member.id);
    }, 450); // 450ms hold
    setPressTimer(t);
  };
  const cancelHold = () => {
    if (pressTimer) clearTimeout(pressTimer);
    setPressTimer(null);
  };

  return (
    <section className="py-6 px-4">
      <h2 className="text-xl font-serif mb-3">{data.year} — {data.name || 'Committee'}</h2>
      <div className="relative">
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4">
          {data.members && data.members.map((m) => (
            <div key={m.id} className="snap-center min-w-[56%] sm:min-w-[34%]">
              <div
                onMouseDown={() => startHold(m)}
                onTouchStart={() => startHold(m)}
                onMouseUp={() => { cancelHold(); if (!selected) setSelected(m.id); }}
                onTouchEnd={() => { cancelHold(); if (!selected) setSelected(m.id); }}
                onMouseLeave={cancelHold}
                className={classNames('relative rounded-lg overflow-hidden shadow-lg cursor-pointer', { 'ring-4 ring-[rgba(176,141,87,0.18)]': selected === m.id })}
                role="button"
                aria-pressed={selected === m.id}
              >
                {/* frame */}
                <div className="bg-[rgba(0,0,0,0.45)] p-2">
                  <div className="w-full h-48 bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
                    <div className="text-4xl text-amber-200">👤</div>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-t from-black/60">
                  <div className="text-base font-medium">{m.name}</div>
                  <div className="text-xs text-white/60">{m.role}</div>
                  {m.years && m.years.length > 1 && (
                    <div className="mt-2 flex items-center gap-2">
                      <TimelineDots years={m.years} />
                      <button className="text-xs ml-auto px-2 py-1 rounded bg-[rgba(255,255,255,0.04)]">Timeline</button>
                    </div>
                  )}
                </div>
              </div>

              {/* micro-story modal inline (simple) */}
              {selected === m.id && (
                <div className="mt-3 p-3 rounded bg-black/60">
                  <div className="text-sm font-semibold">Service History</div>
                  <div className="text-xs text-white/70">Years: {m.years ? m.years.join(', ') : m.year}</div>
                  <div className="mt-2 text-xs">Tap again to close.</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -----------------------------
   TIMELINE DOTS small component
   -----------------------------*/
function TimelineDots({ years = [] }) {
  return (
    <div className="flex items-center gap-1">
      {years.map((y, idx) => (
        <div key={idx} className="w-2 h-2 rounded-full bg-[rgba(176,141,87,0.9)]" title={y} />
      ))}
    </div>
  );
}

/* -----------------------------
   MUSEUM MAP OVERLAY - Scene 4: Antique Parchment Map
   - Cinematic parchment-style floor plan with brass compass
   -----------------------------*/
function MuseumMap({ years = [], onClose, onPick, currentIndex = 0 }) {
  const mapRef = useRef(null);
  const compassRef = useRef(null);

  useEffect(() => {
    // Animate map entrance
    if (mapRef.current) {
      gsap.fromTo(mapRef.current, {
        y: "100%",
        opacity: 0,
        scale: 0.9
      }, {
        y: "0%",
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
      });
    }

    // Spinning compass animation
    if (compassRef.current) {
      gsap.to(compassRef.current, {
        rotation: 360,
        duration: 8,
        repeat: -1,
        ease: "none"
      });
    }
  }, []);

  const handleYearSelect = (idx) => {
    // Footstep sound effect simulation
    const footstepTl = gsap.timeline();

    // Visual feedback for "walking" to selected year
    footstepTl.to('.museum-floor', {
      opacity: 0.3,
      duration: 0.2
    })
    .to('.museum-floor', {
      opacity: 1,
      duration: 0.3
    })
    .call(() => {
      onPick(idx);
      onClose(); // Close the map after selection
    });
  };

  return (
    <div className="fixed inset-0 z-60 flex items-end">
      {/* Dark overlay with subtle texture */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Antique parchment map */}
      <div
        ref={mapRef}
        className="relative w-full min-h-[50vh] rounded-t-3xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #F4E4BC 0%, #E6D3A3 50%, #D4C19C 100%)",
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(160, 82, 45, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, transparent 49%, rgba(139, 69, 19, 0.05) 50%, transparent 51%)
          `,
          boxShadow: "inset 0 0 50px rgba(139, 69, 19, 0.2)"
        }}
      >
        {/* Parchment aging effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 via-transparent to-amber-900/20 pointer-events-none"></div>
        <div className="absolute top-4 right-8 w-12 h-12 bg-amber-800/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-8 left-12 w-8 h-8 bg-amber-700/30 rounded-full blur-lg"></div>

        <div className="relative z-10 p-6">
          {/* Map header with brass styling */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                ref={compassRef}
                className="w-8 h-8 rounded-full border-2 border-amber-700 bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg"
              >
                <div className="w-1 h-3 bg-amber-900 rounded-full"></div>
              </div>
              <h3 className="text-2xl font-serif text-amber-900 font-bold">Museum Floor Plan</h3>
            </div>
            <button
              className="px-4 py-2 rounded-lg bg-amber-800/20 border border-amber-700/50 text-amber-900 font-serif hover:bg-amber-800/30 transition-colors"
              onClick={onClose}
            >
              Close Map
            </button>
          </div>

          {/* Corridor representation */}
          <div className="museum-floor mb-6">
            <div className="text-center mb-4">
              <div className="text-lg font-serif text-amber-800 italic">The Corridor of Time</div>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto mt-2"></div>
            </div>

            {/* Horizontal timeline of doors */}
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4 items-center min-w-max px-4">
                {years.map((y, idx) => (
                  <button
                    key={y.year}
                    onClick={() => handleYearSelect(idx)}
                    className={classNames(
                      'relative min-w-[80px] h-32 rounded-lg p-3 flex flex-col items-center justify-center transition-all duration-300 border-2',
                      {
                        'bg-amber-200 border-amber-600 shadow-lg scale-110 ring-4 ring-amber-400/30': idx === currentIndex,
                        'bg-amber-100/50 border-amber-500/50 hover:bg-amber-200/70 hover:scale-105': idx !== currentIndex
                      }
                    )}
                  >
                    {/* Door miniature */}
                    <div className="w-8 h-12 bg-gradient-to-b from-amber-600 to-amber-800 rounded-sm mb-2 shadow-inner">
                      <div className="w-1 h-1 bg-amber-300 rounded-full mt-6 ml-6"></div>
                    </div>

                    {/* Year label */}
                    <div className="text-sm font-serif font-bold text-amber-900">{y.year}</div>
                    <div className="text-xs text-amber-700 text-center leading-tight">
                      {y.committees?.[0]?.name || 'Committee'}
                    </div>

                    {/* Current position indicator */}
                    {idx === currentIndex && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-3 h-3 bg-amber-600 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Map legend and instructions */}
          <div className="border-t border-amber-700/30 pt-4">
            <div className="text-sm text-amber-800 font-serif italic text-center">
              "Tap any door to journey through time. Listen for the echo of footsteps as you travel."
            </div>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-amber-700">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                <span>Current Location</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span>Available Chambers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Parchment edge effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-amber-900/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-amber-900/20 to-transparent"></div>
          <div className="absolute left-0 top-0 w-4 h-full bg-gradient-to-r from-amber-900/20 to-transparent"></div>
          <div className="absolute right-0 top-0 w-4 h-full bg-gradient-to-l from-amber-900/20 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}

/* -----------------------------
   Utility Hooks & Helpers
   -----------------------------*/

// very small hook to test prefers-reduced-motion
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(media.matches);
    const listener = () => setReduced(media.matches);
    if (media.addEventListener) media.addEventListener('change', listener);
    else media.addListener(listener);
    return () => {
      if (media.removeEventListener) media.removeEventListener('change', listener);
      else media.removeListener(listener);
    };
  }, []);
  return reduced;
}

// device tilt - attaches simple parallax to selector
function useDeviceTilt(selector) {
  useEffect(() => {
    const el = document.querySelector(selector);
    if (!el) return;
    const handle = (e) => {
      const x = e.gamma ?? 0; // left-right
      const y = e.beta ?? 0; // front-back
      const rx = gsap.utils.clamp(-12, 12, x / 3);
      const ry = gsap.utils.clamp(-12, 12, y / 6);
      gsap.to(el, { rotationY: rx, rotationX: ry, transformPerspective: 400, duration: 0.3, ease: 'power2.out' });
    };
    window.addEventListener('deviceorientation', handle);
    return () => window.removeEventListener('deviceorientation', handle);
  }, [selector]);
}

// Helper functions for cinematic door styling
function getDoorColor(year) {
  const yearNum = parseInt(year);
  if (yearNum >= 2024) return '#8B4513'; // Modern: Rich brown
  if (yearNum >= 2022) return '#A0522D'; // Contemporary: Sienna
  if (yearNum >= 2021) return '#CD853F'; // Transitional: Peru
  if (yearNum >= 2020) return '#D2691E'; // Classic: Chocolate
  return '#B8860B'; // Vintage: Dark goldenrod
}

function getDoorStyle(year) {
  const yearNum = parseInt(year);
  if (yearNum >= 2024) return 'modern';
  if (yearNum >= 2022) return 'contemporary';
  if (yearNum >= 2021) return 'transitional';
  if (yearNum >= 2020) return 'digital';
  return 'classic';
}

function getDoorFrameStyle(year) {
  const yearNum = parseInt(year);
  if (yearNum >= 2024) return 'border-steel-400'; // Modern steel
  if (yearNum >= 2022) return 'border-amber-600'; // Contemporary brass
  if (yearNum >= 2021) return 'border-amber-700'; // Transitional bronze
  if (yearNum >= 2020) return 'border-amber-800'; // Classic brass
  return 'border-yellow-700'; // Vintage gold
}

function getDoorBackground(year, color) {
  const yearNum = parseInt(year);
  const baseColor = color || getDoorColor(year);

  if (yearNum >= 2024) {
    // Modern: Clean gradient with subtle texture
    return `linear-gradient(180deg, ${baseColor} 0%, ${shadeColor(baseColor, -30)} 100%)`;
  } else if (yearNum >= 2022) {
    // Contemporary: Rich wood grain effect
    return `linear-gradient(180deg, ${baseColor} 0%, ${shadeColor(baseColor, -20)} 50%, ${shadeColor(baseColor, -40)} 100%)`;
  } else if (yearNum >= 2021) {
    // Transitional: Mixed materials
    return `linear-gradient(45deg, ${baseColor} 0%, ${shadeColor(baseColor, -15)} 50%, ${baseColor} 100%)`;
  } else if (yearNum >= 2020) {
    // Digital era: Sleek metallic
    return `linear-gradient(135deg, ${baseColor} 0%, ${shadeColor(baseColor, 20)} 30%, ${shadeColor(baseColor, -30)} 100%)`;
  } else {
    // Classic: Traditional wood with grain
    return `linear-gradient(180deg, ${baseColor} 0%, ${shadeColor(baseColor, -10)} 25%, ${shadeColor(baseColor, -30)} 75%, ${baseColor} 100%)`;
  }
}

// helper: shade color (enhanced)
function shadeColor(hex, percent) {
  // Handle both hex and rgb formats
  if (hex.startsWith('rgb')) {
    const matches = hex.match(/\d+/g);
    if (matches && matches.length >= 3) {
      let [r, g, b] = matches.map(Number);
      r = Math.max(Math.min(255, r + percent), 0);
      g = Math.max(Math.min(255, g + percent), 0);
      b = Math.max(Math.min(255, b + percent), 0);
      return `rgb(${r}, ${g}, ${b})`;
    }
  }

  // Handle hex format
  const h = hex.replace('#','');
  const num = parseInt(h, 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00FF) + percent;
  let b = (num & 0x0000FF) + percent;
  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);
  return `rgb(${r}, ${g}, ${b})`;
}
