/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HolographicTimeline = () => {
  const timelineRef = useRef(null);
  const containerRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isHovered, setIsHovered] = useState(null);

  // University IT Society Events Data
  const events = [
    {
      id: 1,
      date: '2024-01-15',
      title: 'AI Revolution Workshop',
      subtitle: 'Machine Learning Mastery',
      description: 'Students built their first neural networks and deployed AI models',
      participants: 250,
      category: 'AI/ML',
      achievement: 'AI Pioneer Badge',
      color: '#00ffff',
      glowColor: 'rgba(0, 255, 255, 0.8)'
    },
    {
      id: 2,
      date: '2024-03-20',
      title: 'Cybersecurity Summit',
      subtitle: 'Digital Fortress Defense',
      description: 'Ethical hacking competition and security awareness program',
      participants: 180,
      category: 'Security',
      achievement: 'Cyber Guardian',
      color: '#ff0080',
      glowColor: 'rgba(255, 0, 128, 0.8)'
    },
    {
      id: 3,
      date: '2024-05-10',
      title: 'Quantum Computing Lab',
      subtitle: 'Future Tech Exploration',
      description: 'Hands-on quantum programming with IBM Qiskit',
      participants: 120,
      category: 'Quantum',
      achievement: 'Quantum Explorer',
      color: '#8000ff',
      glowColor: 'rgba(128, 0, 255, 0.8)'
    },
    {
      id: 4,
      date: '2024-07-15',
      title: 'Blockchain Revolution',
      subtitle: 'Decentralized Future',
      description: 'Smart contract development and DeFi applications',
      participants: 200,
      category: 'Blockchain',
      achievement: 'Crypto Architect',
      color: '#ff8000',
      glowColor: 'rgba(255, 128, 0, 0.8)'
    },
    {
      id: 5,
      date: '2024-09-25',
      title: 'VR/AR Innovation Lab',
      subtitle: 'Reality Redefined',
      description: 'Immersive technology development and metaverse creation',
      participants: 160,
      category: 'XR',
      achievement: 'Reality Hacker',
      color: '#00ff80',
      glowColor: 'rgba(0, 255, 128, 0.8)'
    },
    {
      id: 6,
      date: '2024-11-30',
      title: 'Tech Innovation Expo',
      subtitle: 'Future Unveiled',
      description: 'Showcase of student projects and industry partnerships',
      participants: 350,
      category: 'Innovation',
      achievement: 'Innovation Master',
      color: '#ff4040',
      glowColor: 'rgba(255, 64, 64, 0.8)'
    }
  ];

  // Particle System
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = window.innerWidth < 768 ? 50 : 100;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.life = Math.random() * 100;
        this.decay = Math.random() * 0.01 + 0.005;
        this.size = Math.random() * 2 + 1;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        if (this.life <= 0) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.life = Math.random() * 100;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.life / 100;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GSAP Animations
  useEffect(() => {
    const timeline = gsap.timeline();
    const ctx = gsap.context(() => {
      // Initial setup - hide all elements
      gsap.set('.timeline-event', { 
        opacity: 0, 
        y: 100, 
        rotationX: -90,
        transformOrigin: 'center bottom'
      });

      gsap.set('.timeline-spine', { 
        scaleY: 0,
        transformOrigin: 'top center'
      });

      gsap.set('.hologram-glow', { 
        opacity: 0,
        scale: 0.5
      });

      // Animate timeline spine
      timeline.to('.timeline-spine', {
        scaleY: 1,
        duration: 2,
        ease: 'power2.out'
      });

      // Animate events sequentially
      timeline.to('.timeline-event', {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.7)'
      }, '-=1');

      // Animate holographic glows
      timeline.to('.hologram-glow', {
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.1,
        ease: 'elastic.out(1, 0.5)'
      }, '-=0.5');

      // Scroll-triggered animations
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => {
          gsap.to('.energy-pulse', {
            y: '100vh',
            duration: 3,
            repeat: -1,
            ease: 'none'
          });
        }
      });

      // Individual event hover animations
      events.forEach((_, index) => {
        ScrollTrigger.create({
          trigger: `.timeline-event-${index}`,
          start: 'top 90%',
          onEnter: () => {
            gsap.to(`.timeline-event-${index}`, {
              scale: 1.05,
              duration: 0.3,
              ease: 'power2.out'
            });
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleEventHover = (index, isEntering) => {
    setIsHovered(isEntering ? index : null);
    
    const event = `.timeline-event-${index}`;
    const glow = `.hologram-glow-${index}`;
    
    if (isEntering) {
      gsap.to(event, {
        scale: 1.1,
        z: 50,
        rotationY: 5,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      gsap.to(glow, {
        scale: 1.5,
        opacity: 0.8,
        duration: 0.3,
        ease: 'power2.out'
      });
    } else {
      gsap.to(event, {
        scale: 1,
        z: 0,
        rotationY: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      gsap.to(glow, {
        scale: 1,
        opacity: 0.4,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate(),
      year: date.getFullYear()
    };
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black overflow-hidden py-20">
      {/* Background Particle Canvas */}
      <canvas
        ref={particleCanvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Matrix Rain Background */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        <div className="matrix-rain">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="matrix-column"
              style={{
                left: `${(i * 2)}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Title Section */}
        <div className="text-center mb-20">
          <h2 className="text-6xl md:text-8xl font-bold mb-4 holographic-text">
            <span className="glitch-text" data-text="EVENT">EVENT</span>
            <span className="text-cyan-400 mx-4">●</span>
            <span className="glitch-text" data-text="TIMELINE">TIMELINE</span>
          </h2>
          <p className="text-xl text-cyan-300 font-mono">
            Journey through our technological evolution
          </p>
          <div className="mt-8 w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full"/>
        </div>

        {/* Timeline Container */}
        <div ref={timelineRef} className="relative">
          {/* Central Timeline Spine */}
          <div className="timeline-spine absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500 shadow-glow">
            {/* Energy Pulse */}
            <div className="energy-pulse absolute w-4 h-4 bg-cyan-400 rounded-full left-1/2 transform -translate-x-1/2 shadow-lg shadow-cyan-400/50" 
                 style={{ top: '-8px' }} />
          </div>

          {/* Timeline Events */}
          <div className="space-y-32">
            {events.map((event, index) => {
              const isLeft = index % 2 === 0;
              const date = formatDate(event.date);
              
              return (
                <div
                  key={event.id}
                  className={`timeline-event timeline-event-${index} relative flex items-center ${
                    isLeft ? 'justify-start' : 'justify-end'
                  }`}
                  onMouseEnter={() => handleEventHover(index, true)}
                  onMouseLeave={() => handleEventHover(index, false)}
                >
                  {/* Holographic Glow Background */}
                  <div 
                    className={`hologram-glow hologram-glow-${index} absolute inset-0 rounded-2xl blur-lg opacity-40`}
                    style={{ 
                      background: `radial-gradient(circle, ${event.glowColor} 0%, transparent 70%)`,
                      zIndex: -1
                    }}
                  />

                  {/* Event Card */}
                  <div 
                    className={`relative max-w-md p-8 rounded-2xl backdrop-blur-lg border-2 cursor-pointer transform transition-all duration-300 ${
                      isLeft ? 'mr-12' : 'ml-12'
                    }`}
                    style={{ 
                      background: 'rgba(0, 0, 0, 0.7)',
                      borderColor: event.color,
                      boxShadow: `0 0 30px ${event.glowColor}`
                    }}
                    onClick={() => setSelectedEvent(event)}
                  >
                    {/* Scanning Lines Effect */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                      <div className="scanning-lines" style={{ borderColor: event.color }} />
                    </div>

                    {/* Date Badge */}
                    <div 
                      className="absolute -top-4 left-8 px-4 py-2 rounded-full text-sm font-mono font-bold"
                      style={{ 
                        background: event.color,
                        color: '#000',
                        boxShadow: `0 0 20px ${event.glowColor}`
                      }}
                    >
                      {date.month} {date.day}, {date.year}
                    </div>

                    {/* Category Badge */}
                    <div 
                      className="absolute -top-4 right-8 px-3 py-1 rounded-full text-xs font-mono"
                      style={{ 
                        background: `rgba(${event.color.slice(1).match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.2)`,
                        border: `1px solid ${event.color}`,
                        color: event.color
                      }}
                    >
                      {event.category}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 pt-6">
                      <h3 className="text-2xl font-bold mb-2 text-white glitch-hover">
                        {event.title}
                      </h3>
                      
                      <h4 className="text-lg font-semibold mb-4" style={{ color: event.color }}>
                        {event.subtitle}
                      </h4>
                      
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        {event.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold" style={{ color: event.color }}>
                              {event.participants}
                            </div>
                            <div className="text-xs text-gray-400 font-mono">PARTICIPANTS</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-gray-400 mb-1">Achievement Unlocked</div>
                          <div 
                            className="text-sm font-bold px-2 py-1 rounded"
                            style={{ 
                              background: `rgba(${event.color.slice(1).match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.2)`,
                              color: event.color
                            }}
                          >
                            {event.achievement}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Holographic Corner Effects */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: event.color }} />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: event.color }} />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: event.color }} />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: event.color }} />
                  </div>

                  {/* Timeline Node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border-4 bg-black z-20"
                       style={{ borderColor: event.color, boxShadow: `0 0 20px ${event.glowColor}` }}>
                    <div className="absolute inset-1 rounded-full animate-pulse" style={{ background: event.color }} />
                  </div>

                  {/* Connection Line */}
                  <div 
                    className={`absolute top-1/2 w-12 h-0.5 ${isLeft ? 'right-0 mr-8' : 'left-0 ml-8'}`}
                    style={{ background: `linear-gradient(${isLeft ? '90deg' : '-90deg'}, ${event.color}, transparent)` }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .matrix-rain {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .matrix-column {
          position: absolute;
          top: -100%;
          width: 2px;
          height: 100px;
          background: linear-gradient(transparent, #00ffff, transparent);
          animation: matrix-fall linear infinite;
        }

        @keyframes matrix-fall {
          to {
            transform: translateY(100vh);
          }
        }

        .holographic-text {
          background: linear-gradient(45deg, #00ffff, #ff00ff, #ffff00, #00ffff);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: rainbow 3s ease-in-out infinite;
        }

        @keyframes rainbow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .glitch-text {
          position: relative;
          display: inline-block;
        }

        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .glitch-text::before {
          animation: glitch-1 2s infinite;
          color: #ff00ff;
          z-index: -1;
        }

        .glitch-text::after {
          animation: glitch-2 2s infinite;
          color: #00ffff;
          z-index: -2;
        }

        @keyframes glitch-1 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }

        @keyframes glitch-2 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(2px, 2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(-2px, 2px); }
        }

        .scanning-lines {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: currentColor;
          animation: scan 2s ease-in-out infinite;
        }

        @keyframes scan {
          0%, 100% { top: 0; opacity: 1; }
          50% { top: calc(100% - 2px); opacity: 0.5; }
        }

        .glitch-hover:hover {
          animation: text-glitch 0.3s;
        }

        @keyframes text-glitch {
          0%, 100% { transform: translate(0); }
          25% { transform: translate(-1px, 1px); }
          50% { transform: translate(1px, -1px); }
          75% { transform: translate(-1px, -1px); }
        }

        .shadow-glow {
          box-shadow: 0 0 20px currentColor;
        }

        @media (max-width: 768px) {
          .timeline-event {
            justify-content: center !important;
          }
          
          .timeline-event > div:first-child {
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HolographicTimeline;
