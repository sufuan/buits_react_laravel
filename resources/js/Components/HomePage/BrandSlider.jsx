import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const BrandSlider = () => {
  const racesRef = useRef(null);
  const racesWrapperRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 10; // Total number of brand images

  const slideLeft = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      const races = racesRef.current;
      if (races) {
        const slideWidth = 290; // image width (250) + gap (40)
        gsap.to(races, {
          x: `+=${slideWidth}`,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    }
  };

  const slideRight = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
      const races = racesRef.current;
      if (races) {
        const slideWidth = 290; // image width (250) + gap (40)
        gsap.to(races, {
          x: `-=${slideWidth}`,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    }
  };

  useEffect(() => {
    const races = racesRef.current;
    const racesWrapper = racesWrapperRef.current;

    if (!races || !racesWrapper) return;

    console.log(races.offsetWidth);

    function getScrollAmount() {
      let racesWidth = races.scrollWidth;
      return -(racesWidth - window.innerWidth);
    }

    const tween = gsap.to(races, {
      x: getScrollAmount,
      duration: 3,
      ease: "none",
    });

    const scrollTrigger = ScrollTrigger.create({
      trigger: racesWrapper,
      start: "top 20%",
      end: () => `+=${getScrollAmount() * -1}`,
      pin: true,
      animation: tween,
      scrub: 1,
      invalidateOnRefresh: true,

    });

    // Cleanup function
    return () => {
      scrollTrigger.kill();
      tween.kill();
    };
  }, []);

  return (
    <>
      {/* Brand Section Header */}
      <div className="brand-section">
        <div className="brand-header">
          <h2>Our Trusted Partners</h2>
          <p>Collaborating with industry leaders to deliver excellence</p>
        </div>
      </div>

      {/* Races Wrapper */}
      <div className="racesWrapper" ref={racesWrapperRef}>
        {/* Left Arrow */}
        <button 
          className={`slide-arrow slide-arrow-left ${currentSlide === 0 ? 'disabled' : ''}`}
          onClick={slideLeft}
          aria-label="Slide left"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="races" ref={racesRef}>
          <img src="/img/brands/gp.png" alt="GP" />
          <img src="/img/brands/ucb.png" alt="UCB" />
          <img src="/img/brands/ultragear.png" alt="UltraGear" />
          <img src="/img/brands/undp.jpg" alt="UNDP" />
          <img src="/img/brands/gp.png" alt="GP" />
          <img src="/img/brands/ucb.png" alt="UCB" />
          <img src="/img/brands/ultragear.png" alt="UltraGear" />
          <img src="/img/brands/undp.jpg" alt="UNDP" />
          <img src="/img/brands/gp.png" alt="GP" />
          <img src="/img/brands/ucb.png" alt="UCB" />
        </div>

        {/* Right Arrow */}
        <button 
          className={`slide-arrow slide-arrow-right ${currentSlide >= totalSlides - 4 ? 'disabled' : ''}`}
          onClick={slideRight}
          aria-label="Slide right"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>



      {/* Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Staatliches&display=swap');

        .brand-section {
          background: #15151e;
          padding: 60px 20px 40px;
          text-align: center;
        }

        .brand-header h2 {
          font-family: 'Staatliches', cursive;
          font-size: 3rem;
          color: #ffffff;
          margin: 0 0 15px 0;
          letter-spacing: 2px;
        }

        .brand-header p {
          font-size: 1.2rem;
          color: #888;
          margin: 0;
          font-weight: 300;
        }

        .racesWrapper {
          overflow: hidden;
          background: #15151e;
          position: relative;
        }

        .slide-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          background: rgba(49, 49, 67, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .slide-arrow:hover {
          background: rgba(60, 60, 80, 1);
          transform: translateY(-50%) scale(1.1);
          color: #fff;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .slide-arrow.disabled {
          background: rgba(30, 30, 40, 0.5);
          cursor: not-allowed;
          box-shadow: none;
          color: rgba(255, 255, 255, 0.3);
        }

        .slide-arrow.disabled:hover {
          transform: translateY(-50%);
          background: rgba(30, 30, 40, 0.5);
          color: rgba(255, 255, 255, 0.3);
        }

        .slide-arrow-left {
          left: 20px;
        }

        .slide-arrow-right {
          right: 20px;
        }

        .races {
          width: fit-content;
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          gap: 40px;
          padding: 40px;
        }

        .races img {
          width: 250px;
          height: 250px;
          object-fit: contain;
          flex-shrink: 0;
          filter: grayscale(100%) brightness(0.8);
          transition: all 0.3s ease;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.05);
          padding: 20px;
        }

        .races img:hover {
          filter: grayscale(0%) brightness(1.1);
          transform: scale(1.05);
        }

        .lightBG {
          background: #313143;
        }

        .space-20vh {
          height: 20vh;
        }

        .space-30vh {
          height: 30vh;
        }

        .space-50vh {
          height: 50vh;
        }

        .space-100vh {
          height: 100vh;
        }

        @media (max-width: 768px) {
          .brand-header h2 {
            font-size: 2.5rem;
          }

          .brand-header p {
            font-size: 1rem;
          }

          .races {
            gap: 30px;
            padding: 30px 20px;
          }

          .races img {
            width: 200px;
            height: 200px;
          }

          .slide-arrow {
            width: 40px;
            height: 40px;
          }

          .slide-arrow-left {
            left: 10px;
          }

          .slide-arrow-right {
            right: 10px;
          }
        }
      `}</style>
    </>
  );
};

export default BrandSlider;