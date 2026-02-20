import React, { useEffect, useRef, useCallback } from "react";
import { Head } from '@inertiajs/react';
import NavBar from '../Components/HomePage/Navbar';
import '../../css/about.css';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// SVG Components for Mission Cards
const WhyIcon = () => (
  <svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="80" cy="90" rx="50" ry="45" fill="#F5A623" />
    <ellipse cx="140" cy="70" rx="40" ry="35" fill="#F5A623" />
    <circle cx="45" cy="145" r="12" fill="#F5A623" />
    <circle cx="70" cy="155" r="8" fill="#F5A623" />
    <circle cx="160" cy="115" r="10" fill="#F5A623" />
    <circle cx="175" cy="95" r="6" fill="#F5A623" />
    <text x="65" y="105" fontSize="50" fontWeight="bold" fill="#1A0B2E" fontFamily="Arial">?</text>
    <text x="125" y="85" fontSize="40" fontWeight="bold" fill="#1A0B2E" fontFamily="Arial">?</text>
  </svg>
);

const WhatIcon = () => (
  <svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
    <polygon points="75,20 130,120 20,120" fill="#4A90D9" />
    <polygon points="75,20 100,70 50,70" fill="#6BB3F0" />
    <circle cx="75" cy="30" r="18" fill="#F5A623" />
    <circle cx="75" cy="30" r="12" fill="#fff" />
    <circle cx="75" cy="30" r="6" fill="#F5A623" />
    <circle cx="55" cy="85" r="8" fill="#FFD1A9" />
    <path d="M55,95 L55,115 M55,100 L45,108 M55,100 L65,108" stroke="#FFD1A9" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const HowIcon = () => (
  <svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="75" cy="60" rx="45" ry="40" fill="#F5A623" />
    <path d="M50,40 Q45,50 50,60 Q55,70 50,80" stroke="#1A0B2E" strokeWidth="3" fill="none" />
    <path d="M100,40 Q105,50 100,60 Q95,70 100,80" stroke="#1A0B2E" strokeWidth="3" fill="none" />
    <line x1="60" y1="55" x2="90" y2="55" stroke="#1A0B2E" strokeWidth="3" />
    <line x1="75" y1="45" x2="75" y2="75" stroke="#1A0B2E" strokeWidth="3" />
    <circle cx="85" cy="110" r="8" fill="#FFD1A9" />
    <path d="M85,120 L85,135 M85,125 L75,130 M85,125 L95,130" stroke="#FFD1A9" strokeWidth="3" strokeLinecap="round" />
    <rect x="90" y="118" width="15" height="10" rx="2" fill="#4A90D9" />
  </svg>
);

// SVG Components for Value Cards
const HumbleIcon = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <polygon points="100,20 160,100 130,100 130,180 70,180 70,100 40,100" fill="rgba(255,255,255,0.3)" />
    <circle cx="80" cy="90" r="12" fill="#FFD1A9" />
    <path d="M80,105 L80,140 M80,115 L65,130 M80,115 L95,130 M80,140 L68,165 M80,140 L92,165" stroke="#FFD1A9" strokeWidth="4" strokeLinecap="round" />
    <circle cx="120" cy="120" r="12" fill="#E8C4A0" />
    <path d="M120,135 L120,165 M120,145 L105,160 M120,145 L135,160" stroke="#E8C4A0" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const ExperimentIcon = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="80" r="15" fill="#FFD1A9" />
    <path d="M100,100 L100,150 M100,115 L75,135 M100,115 L125,135 M100,150 L85,180 M100,150 L115,180" stroke="#FFD1A9" strokeWidth="4" strokeLinecap="round" />
    <rect x="40" y="50" width="35" height="25" rx="3" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
    <line x1="45" y1="58" x2="55" y2="58" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
    <line x1="45" y1="65" x2="68" y2="65" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
    <rect x="130" y="40" width="40" height="30" rx="3" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
    <circle cx="145" cy="55" r="8" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
    <rect x="135" y="100" width="35" height="25" rx="3" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
    <rect x="140" y="108" width="10" height="12" fill="rgba(255,255,255,0.4)" />
    <rect x="153" y="112" width="10" height="8" fill="rgba(255,255,255,0.3)" />
  </svg>
);

const CareerIcon = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="80" cy="70" r="15" fill="#FFD1A9" />
    <path d="M80,90 L80,140 M80,105 L60,120 M80,105 L100,90 M80,140 L65,170 M80,140 L95,170" stroke="#FFD1A9" strokeWidth="4" strokeLinecap="round" />
    <circle cx="115" cy="75" r="20" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="4" />
    <line x1="130" y1="90" x2="145" y2="105" stroke="rgba(255,255,255,0.6)" strokeWidth="4" strokeLinecap="round" />
    <rect x="50" y="150" width="30" height="22" rx="3" fill="rgba(255,255,255,0.3)" />
    <line x1="58" y1="150" x2="58" y2="145" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
    <line x1="72" y1="150" x2="72" y2="145" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
    <line x1="58" y1="145" x2="72" y2="145" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
    <rect x="120" y="145" width="35" height="25" rx="3" fill="rgba(255,255,255,0.25)" />
    <line x1="130" y1="145" x2="130" y2="138" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
    <line x1="145" y1="145" x2="145" y2="138" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
    <line x1="130" y1="138" x2="145" y2="138" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
  </svg>
);

const StudentsIcon = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <rect x="70" y="90" width="60" height="80" fill="rgba(255,255,255,0.25)" />
    <polygon points="100,60 140,90 60,90" fill="rgba(255,255,255,0.3)" />
    <rect x="90" y="130" width="20" height="40" fill="rgba(255,255,255,0.15)" />
    <rect x="75" y="100" width="15" height="15" fill="rgba(255,255,255,0.15)" />
    <rect x="110" y="100" width="15" height="15" fill="rgba(255,255,255,0.15)" />
    <circle cx="45" cy="110" r="12" fill="#FFD1A9" />
    <path d="M45,125 L45,155 M45,135 L30,145 M45,135 L55,145 M45,155 L35,175 M45,155 L55,175" stroke="#FFD1A9" strokeWidth="3" strokeLinecap="round" />
    <rect x="50" y="130" width="12" height="18" rx="3" fill="rgba(255,255,255,0.4)" />
  </svg>
);

// Flip Card Component
const FlipCard = ({ cardType, title, description, icon: Icon, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Check if device is touch-enabled
    const isTouchDevice = () => {
      return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0) ||
        window.matchMedia('(hover: none)').matches);
    };

    // Add initial hidden state for reveal animation
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;

    // Reveal observer
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealObserver.observe(card);

    // Mobile flip observer
    if (isTouchDevice()) {
      const flipObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('flipped');
          } else {
            entry.target.classList.remove('flipped');
          }
        });
      }, {
        root: null,
        rootMargin: '-30% 0px -30% 0px',
        threshold: 0.5
      });

      flipObserver.observe(card);

      // Touch tap handler
      const handleClick = () => {
        document.querySelectorAll('.flip-card').forEach(c => {
          if (c !== card) {
            c.classList.remove('flipped');
          }
        });
        card.classList.toggle('flipped');
      };

      card.addEventListener('click', handleClick);

      return () => {
        revealObserver.disconnect();
        flipObserver.disconnect();
        card.removeEventListener('click', handleClick);
      };
    }

    return () => {
      revealObserver.disconnect();
    };
  }, [index]);

  // Keyboard accessibility
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cardRef.current?.classList.toggle('flipped');
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className={`flip-card ${cardType}`}
      data-card={cardType}
      tabIndex={0}
      role="button"
      aria-label={`Flip card to see more about ${cardType}`}
      onKeyDown={handleKeyDown}
    >
      <div className="flip-card-inner">
        <div className={`flip-card-front ${cardType}`}>
          <h3 className="card-title">{title}</h3>
          <div className="card-illustration">
            <Icon />
          </div>
        </div>
        <div className={`flip-card-back ${cardType}`}>
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{description}</p>
        </div>
      </div>
    </div>
  );
};

// Mission Card Component
const MissionCard = ({ type, title, text, icon: Icon }) => (
  <div className={`mission-card ${type}-card`}>
    <div className="mission-card-content">
      <h3 className="mission-card-title">{title}</h3>
      <p className="mission-card-text">{text}</p>
    </div>
    <div className="mission-card-image">
      <Icon />
    </div>
  </div>
);

// Values data
const valuesData = [
  {
    cardType: 'humble',
    title: 'HUMBLE',
    description: 'We know that true expertise requires constant learning and growth. We approach every challenge with humility, recognizing that there\'s always more to discover and room to improve.',
    icon: HumbleIcon
  },
  {
    cardType: 'experiment',
    title: 'Experiment',
    description: 'We believe that the best way to learn is by doing. We encourage experimentation, embrace failure as a learning opportunity, and constantly iterate to find better solutions.',
    icon: ExperimentIcon
  },
  {
    cardType: 'career',
    title: 'Committed to build career',
    description: 'We are deeply committed to helping our students achieve their career goals. Every course, every lesson, and every interaction is designed with their professional success in mind.',
    icon: CareerIcon
  },
  {
    cardType: 'students',
    title: 'Be part of the student\'s life',
    description: 'We recognize that learning is not just a transaction - it\'s a transformation. We strive to be meaningful partners in our students\' educational journey and personal growth.',
    icon: StudentsIcon
  }
];

// Mission data
const missionData = {
  why: {
    title: 'WHY',
    text: 'We are passionate about empowering individuals to transform their lives through the power of coding. We believe that everyone should have access to high-quality, affordable coding education, regardless of their background or experience.',
    icon: WhyIcon
  },
  what: {
    title: 'WHAT',
    text: 'We provide a comprehensive range of online programming courses, from beginner-level Web Development to advanced CSE Fundamentals and Advanced Programming Courses. Our courses are designed to be engaging, effective, and tailored to the needs of today\'s learners.',
    icon: WhatIcon
  },
  how: {
    title: 'HOW',
    text: 'We nurture our students in a personalized and supportive environment that fosters confidence and success. Our friendly and dedicated instructors are always available to guide and mentor our students, ensuring they receive the support they need to achieve their coding goals.',
    icon: HowIcon
  }
};

// HeroCover Component with scroll-driven card expansion (User Revised Plan)
const HeroCover = () => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%", // Extended scroll range
        scrub: 1,
        pin: true,
      }
    });

    // Phase 1: Move Title Up/Fade Out
    tl.to(titleRef.current, {
      y: -200,
      opacity: 0,
      ease: "power1.in",
      duration: 0.5
    }, 0);

    // Phase 2: Tilt and Scale Card to Full Screen
    tl.to(cardRef.current, {
      scale: 4, // Adjust to ensure full viewport coverage
      rotation: 0,
      ease: "power2.inOut",
      duration: 1
    }, 0) // Start at same time as title move

      // Phase 3: Transition to Black (Starts AFTER scale finishes)
      .to(overlayRef.current, {
        opacity: 1,
        ease: "none",
        duration: 0.5
      }, ">")

      // Phase 4: Reveal Content (Starts AFTER black transition finishes)
      .fromTo(contentRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, ease: "power2.out", duration: 0.5 },
        ">"
      );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="hero-container">
      {/* Title (Kept separate or integrated? User snippet didn't include it but need it) */}
      <h1 ref={titleRef} className="hero-cover-title" style={{ position: 'absolute', top: '15vh', zIndex: 1, width: '100%', textAlign: 'center' }}>
        ABOUT BUITS
      </h1>

      <div ref={cardRef} className="hero-card">
        {/* The Purple Gradient sits on the hero-card CSS */}
        <div className="hero-cover-card-inner">
          {/* BUITS Logo */}
          <img
            src="/img/logo.png"
            alt="BUITS Logo"
            className="hero-cover-card-logo"
          />
        </div>

        {/* The Black Overlay */}
        <div ref={overlayRef} className="black-overlay"></div>

        {/* The Content */}
        <div ref={contentRef} className="content-inner">
          <p className="hero-cover-label">Our Project</p>
          <h2 className="hero-cover-heading">
            <span className="highlight">human-centric</span>
            <span className="highlight">learning</span>
            <span className="highlight">platform</span>
            <span className="sub">operating system for education</span>
          </h2>
          <p className="hero-cover-description" style={{ marginTop: '30px' }}>
            BUITS transforms education into experience, experience into expertise,
            forging a self-reinforcing infrastructure for accelerating human potential,
            building careers, and unlocking collective growth through innovative
            technology and human-centered design.
          </p>
        </div>
      </div>
    </div>
  );
};

export default function About() {
  return (
    <div className="about-page">
      <Head title="About Us" />
      <NavBar />

      {/* Hero Cover Section */}
      <HeroCover />

      {/* Mission Section */}
      <section className="mission-section" id="mission">
        <div className="about-container">
          <h2 className="section-title">Our Mission<span className="accent">_</span></h2>

          <div className="mission-cards">
            {/* WHY Card - Full Width */}
            <MissionCard
              type="why"
              title={missionData.why.title}
              text={missionData.why.text}
              icon={missionData.why.icon}
            />

            {/* WHAT and HOW Cards - Side by Side */}
            <div className="mission-cards-row">
              <MissionCard
                type="what"
                title={missionData.what.title}
                text={missionData.what.text}
                icon={missionData.what.icon}
              />
              <MissionCard
                type="how"
                title={missionData.how.title}
                text={missionData.how.text}
                icon={missionData.how.icon}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section" id="values">
        <div className="about-container">
          <h2 className="section-title">Our Values<span className="accent">_</span></h2>

          <div className="cards-grid">
            {valuesData.map((value, index) => (
              <FlipCard
                key={value.cardType}
                cardType={value.cardType}
                title={value.title}
                description={value.description}
                icon={value.icon}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
