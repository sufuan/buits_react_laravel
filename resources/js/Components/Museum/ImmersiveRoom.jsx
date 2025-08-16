import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

const ImmersiveRoom = ({ data, isEntering, onEnterComplete, onExit }) => {
  const roomRef = useRef(null);
  const cameraRef = useRef(null);
  const portraitsRef = useRef([]);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    if (!isEntering) return;

    const room = roomRef.current;
    const camera = cameraRef.current;
    
    if (!room || !camera) return;

    // Camera walking into room animation
    const tl = gsap.timeline({
      onComplete: onEnterComplete
    });

    // Start from outside perspective
    tl.set(camera, {
      z: -500,
      rotationX: 0,
      scale: 0.8
    })
    // Walk into the room
    .to(camera, {
      z: 0,
      scale: 1,
      duration: 2,
      ease: "power2.out"
    })
    // Look around the room
    .to(camera, {
      rotationY: 5,
      duration: 1,
      ease: "power1.inOut",
      yoyo: true,
      repeat: 1
    })
    // Reveal portraits one by one
    .to(portraitsRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      stagger: 0.2,
      ease: "back.out(1.7)"
    }, "-=1");

  }, [isEntering, onEnterComplete]);

  const handlePortraitClick = (member) => {
    setSelectedMember(selectedMember?.id === member.id ? null : member);
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-screen overflow-hidden bg-black">
      {/* Solid background to completely hide the door/corridor */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-red-900/30 to-black"></div>
      
      {/* Room Container */}
      <div 
        ref={roomRef}
        className="absolute inset-0"
        style={{ perspective: '1200px' }}
      >
        {/* Camera/Viewport */}
        <div 
          ref={cameraRef}
          className="w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Room Walls */}
          <div className="absolute inset-0">
            {/* Back Wall */}
            <div 
              className="absolute inset-0 bg-gradient-to-b from-amber-900/40 via-amber-800/60 to-black/80"
              style={{ transform: 'translateZ(-300px)' }}
            >
              {/* Wall Texture */}
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(45deg, rgba(139, 90, 43, 0.1) 0px, rgba(139, 90, 43, 0.1) 2px, transparent 2px, transparent 20px),
                    repeating-linear-gradient(-45deg, rgba(101, 67, 33, 0.1) 0px, rgba(101, 67, 33, 0.1) 2px, transparent 2px, transparent 20px)
                  `
                }}
              />
            </div>

            {/* Floor */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-amber-900/60 to-transparent"
              style={{ 
                transform: 'rotateX(90deg) translateZ(-50px)',
                transformOrigin: 'bottom'
              }}
            />

            {/* Ceiling */}
            <div 
              className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-amber-900/40 to-transparent"
              style={{ 
                transform: 'rotateX(-90deg) translateZ(50px)',
                transformOrigin: 'top'
              }}
            />
          </div>

          {/* Wall Sconces */}
          <div className="absolute top-1/4 left-8 w-6 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-lg"
               style={{ transform: 'translateZ(-250px)' }}>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full animate-pulse blur-sm opacity-80"></div>
          </div>
          <div className="absolute top-1/4 right-8 w-6 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-lg"
               style={{ transform: 'translateZ(-250px)' }}>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full animate-pulse blur-sm opacity-80"></div>
          </div>

          {/* Member Portraits on Walls */}
          <div className="absolute inset-0">
            {data.members && data.members.map((member, index) => {
              const isLeftWall = index % 2 === 0;
              const wallPosition = Math.floor(index / 2);
              
              return (
                <div
                  key={member.id}
                  ref={el => portraitsRef.current[index] = el}
                  className="absolute cursor-pointer group"
                  style={{
                    left: isLeftWall ? '10%' : '70%',
                    top: `${20 + (wallPosition * 25)}%`,
                    transform: `translateZ(-${isLeftWall ? '280' : '280'}px) ${isLeftWall ? 'rotateY(15deg)' : 'rotateY(-15deg)'}`,
                    opacity: 0,
                    scale: 0.8
                  }}
                  onClick={() => handlePortraitClick(member)}
                >
                  {/* Portrait Frame */}
                  <div className="relative">
                    {/* Ornate Frame */}
                    <div className="w-32 h-40 bg-gradient-to-br from-yellow-600 via-amber-600 to-amber-800 p-2 rounded-lg shadow-2xl border-4 border-amber-500">
                      {/* Inner Frame */}
                      <div className="w-full h-full bg-gradient-to-br from-amber-700 to-amber-900 p-1 rounded">
                        {/* Portrait Image */}
                        <div className="w-full h-3/4 bg-gradient-to-br from-amber-600 to-amber-800 rounded flex items-center justify-center">
                          <div className="text-3xl text-amber-200">👤</div>
                        </div>
                        {/* Name Plate */}
                        <div className="h-1/4 bg-gradient-to-r from-amber-800 to-amber-900 rounded-b flex items-center justify-center">
                          <div className="text-xs text-amber-200 font-serif text-center">
                            <div className="font-bold">{member.name}</div>
                            <div className="text-amber-300/80">{member.role}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Portrait Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-300/20 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg blur-sm"></div>
                    
                    {/* Spotlight Effect */}
                    <div className="absolute -inset-4 bg-gradient-radial from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Room Title */}
          <div
            className="absolute top-16 left-1/2 transform -translate-x-1/2 text-center"
            style={{ transform: 'translateX(-50%) translateZ(-250px)' }}
          >
            <h2 className="text-3xl md:text-4xl font-serif text-amber-200 mb-2">
              {data.year} Committee
            </h2>
            <p className="text-amber-400/80 text-lg italic">
              {data.theme || data.name}
            </p>
          </div>

          {/* Exit Button */}
          <div className="absolute top-6 right-6 z-50">
            <button
              onClick={onExit}
              className="bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-amber-500/50 hover:border-amber-400 rounded-lg p-3 transition-all duration-300 group"
              title="Exit Room"
            >
              <div className="flex items-center gap-2 text-amber-200 group-hover:text-amber-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-sm font-serif">Exit Hall</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-amber-800 to-amber-900 p-6 rounded-lg border-2 border-amber-600 max-w-md mx-4">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-4xl text-amber-200">👤</div>
              </div>
              <h3 className="text-2xl font-serif text-amber-200 mb-2">{selectedMember.name}</h3>
              <p className="text-amber-300 mb-4">{selectedMember.role}</p>
              {selectedMember.years && (
                <p className="text-amber-400/80 text-sm mb-4">
                  Service Years: {selectedMember.years.join(', ')}
                </p>
              )}
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-amber-100 rounded-lg transition-colors font-serif"
              >
                Close Portrait
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImmersiveRoom;
