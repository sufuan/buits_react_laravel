import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const BrandSlider = () => {
  const racesRef = useRef(null);
  const racesWrapperRef = useRef(null);

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
        }
      `}</style>
    </>
  );
};

export default BrandSlider;