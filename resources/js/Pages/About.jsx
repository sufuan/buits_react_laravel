import React, { useLayoutEffect, useRef } from "react";
import { Head } from '@inertiajs/react';
import NavBar from '../Components/HomePage/Navbar';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../css/about_page_style.css';

gsap.registerPlugin(ScrollTrigger);

export default function GTA() {
  const scope = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(scope); // scoped query

      // First step
      gsap.from(q(".hero-main-container"), {
        scale: 1.45,
        duration: 2.8,
        ease: "power3.out",
      });

      gsap.to(q(".overlay"), {
        opacity: 0,
        duration: 2.8,
        ease: "power3.out",
        onComplete: () => {
          document.body.style.overflow = "visible";
          document.body.style.overflowX = "hidden";
        },
      });

      // Scroll Indicator (scoped)
      const scrollIndicator = q(".scroll-indicator")[0];
      if (scrollIndicator) {
        const bounceTimeline = gsap.timeline({ repeat: -1, yoyo: true });
        bounceTimeline.to(scrollIndicator, {
          y: 20,
          opacity: 0.6,
          duration: 0.8,
          ease: "power1.inOut",
        });
      }

      // Use the actual element for trigger & pin
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          pin: scope.current,
          scrub: 2,
          start: "top top",
          end: "+=2000",
          ease: "none",
        },
      });

      tl.set(q(".hero-main-container"), { scale: 1.25 });
      tl.to(q(".hero-main-container"), { scale: 1, duration: 1 });
      tl.to(q(".hero-main-logo"), { opacity: 0, duration: 0.5 }, "<");
      tl.to(q(".hero-main-image"), { opacity: 0, duration: 0.9 }, "<+=0.5");
      tl.to(q(".hero-main-container"), { backgroundSize: "28vh", duration: 1.5 }, "<+=0.2");

      tl.fromTo(
        q(".hero-text"),
        {
          backgroundImage: `radial-gradient(circle at 50% 200vh, rgba(255, 214, 135, 0) 0, rgba(157, 47, 106, 0.5) 90vh, rgba(157, 47, 106, 0.8) 120vh, rgba(32, 31, 66, 0) 150vh)`,
        },
        {
          backgroundImage: `radial-gradient(circle at 50% 3.9575vh, rgb(255, 213, 133) 0vh, rgb(247, 77, 82) 50.011vh, rgb(145, 42, 105) 90.0183vh, rgba(32, 31, 66, 0) 140.599vh)`,
          duration: 3,
        },
        "<1.2"
      );

      tl.fromTo(
        q(".hero-text-logo"),
        {
          opacity: 0,
          maskImage: `radial-gradient(circle at 50% 145.835%, rgb(0,0,0) 36.11%, rgba(0,0,0,0) 68.055%)`,
        },
        {
          opacity: 1,
          maskImage: `radial-gradient(circle at 50% 105.594%, rgb(0,0,0) 62.9372%, rgba(0,0,0,0) 81.4686%)`,
          duration: 3,
        },
        "<0.2"
      );

      tl.set(q(".hero-main-container"), { opacity: 0 });
      tl.to(q(".hero-1-container"), { scale: 0.85, duration: 3 }, "<-=3");

      tl.set(q(".hero-1-container"), {
        maskImage: `radial-gradient(circle at 50% 16.1137vh, rgb(0,0,0) 96.1949vh, rgba(0,0,0,0) 112.065vh)`,
      }, "<+=2.1");

      tl.to(q(".hero-1-container"), {
        maskImage: `radial-gradient(circle at 50% -40vh, rgb(0,0,0) 0vh, rgba(0,0,0,0) 80vh)`,
        duration: 2,
      }, "<+=0.2");

      tl.to(q(".hero-text-logo"), { opacity: 0, duration: 2 }, "<1.5");

      tl.set(q(".hero-1-container"), { opacity: 0 });
      tl.set(q(".hero-2-container"), { visibility: "visible" });
      tl.to(q(".hero-2-container"), { opacity: 1, duration: 3 }, "<+=0.2");

      tl.fromTo(
        q(".hero-2-container"),
        {
          backgroundImage: `radial-gradient(circle at 50% 200vh, rgba(255,214,135,0) 0, rgba(157,47,106,0.5) 90vh, rgba(157,47,106,0.8) 120vh, rgba(32,31,66,0) 150vh)`,
        },
        {
          backgroundImage: `radial-gradient(circle at 50% 3.9575vh, rgb(255,213,133) 0vh, rgb(247,77,82) 50.011vh, rgb(145,42,105) 90.0183vh, rgba(32,31,66,0) 140.599vh)`,
          duration: 3,
        },
        "<1.2"
      );

      // Make sure ScrollTrigger recalculates after everything
      ScrollTrigger.refresh();
    }, scope);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      <Head title="GTA VI Website" />
      <NavBar />
      <div ref={scope} className="container">
        <div className="overlay"></div>

        <div className="hero-1-container">
          <div className="hero-main-container">
            <img className="hero-main-logo" draggable="false" src="/img/gta_logo_cut.webp" alt="gta logo" />
            <img className="hero-main-image" draggable="false" src="/img/gta_hero.webp" alt="gta hero" />
          </div>

          <div className="hero-text-logo-container">
            <div className="hero-text-logo" style={{ backgroundImage: "url('/img/gta_logo_purple.webp')" }} />
            <div>
              <h3 className="hero-text">Coming <br /> May 26 <br /> 2026</h3>
            </div>
          </div>
        </div>

        <div className="hero-2-container">
          <h3>Vice City, USA.</h3>
          <p>Jason and Lucia have always known the deck is stacked against them...</p>
        </div>

        <div className="scroll-indicator" aria-hidden="true">
          {/* svg here */}
        </div>
      </div>
    </>
  );
}
