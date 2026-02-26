import React, { useLayoutEffect, useRef } from "react";
import { Head, Link } from '@inertiajs/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../../css/about_page_style.css';
import '../../../css/hero.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null)
  const hero1Ref = useRef(null)
  const heroMainContainerRef = useRef(null)
  const heroMainLogoRef = useRef(null)
  const heroMainImageRef = useRef(null)
  const heroTextLogoRef = useRef(null)
  const heroTextRef = useRef(null)
  const hero2Ref = useRef(null)
  const hero2ContentRef = useRef(null)
  const hero2StatsRef = useRef(null)
  const scrollIndicatorRef = useRef(null)
  const overlayRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // First step - Entrance
      gsap.from(heroMainContainerRef.current, {
        scale: 1.45,
        duration: 2.8,
        ease: "power3.out",
      })

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 2.8,
        ease: "power3.out",
        onComplete: () => {
          // Careful with scroll settings in Inertia/Lenis environment
          // document.body.style.overflow = "visible"
          // document.body.style.overflowX = "hidden"
        },
      })

      // Scroll Indicator Bounce
      gsap.fromTo(scrollIndicatorRef.current,
        { y: 0, opacity: 1 },
        {
          y: 20,
          opacity: 0.6,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        }
      )

      // Scroll Animation Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          scrub: 1,
          pin: true,
          start: "top top",
          end: "+=1600",
          ease: "none",
        },
      })

      tl.set(heroMainContainerRef.current, { scale: 1.25 })
      tl.to(heroMainContainerRef.current, { scale: 1, duration: 1 })

      tl.to(heroMainLogoRef.current, {
        opacity: 0,
        duration: 0.5,
      }, "<")

      tl.to(heroMainImageRef.current, {
        opacity: 0,
        duration: 0.9,
      }, "<+=0.5")

      tl.to(heroMainContainerRef.current, {
        backgroundSize: "28vh",
        duration: 1.5,
      }, "<+=0.2")

      tl.fromTo(heroTextRef.current,
        {
          backgroundImage: `radial-gradient(
            circle at 50% 200vh,
            rgba(255, 214, 135, 0) 0,
            rgba(157, 47, 106, 0.5) 90vh,
            rgba(157, 47, 106, 0.8) 120vh,
            rgba(32, 31, 66, 0) 150vh
          )`,
        },
        {
          backgroundImage: `radial-gradient(circle at 50% 3.9575vh, rgb(255, 213, 133) 0vh,
            rgb(247, 77, 82) 50.011vh,
            rgb(145, 42, 105) 90.0183vh,
            rgba(32, 31, 66, 0) 140.599vh)`,
          duration: 3,
        },
        "<1.2"
      )

      tl.fromTo(heroTextLogoRef.current,
        {
          opacity: 0,
          WebkitMaskImage: `radial-gradient(circle at 50% 145.835%, rgb(0, 0, 0) 36.11%, rgba(0, 0, 0, 0) 68.055%)`,
          maskImage: `radial-gradient(circle at 50% 145.835%, rgb(0, 0, 0) 36.11%, rgba(0, 0, 0, 0) 68.055%)`,
        },
        {
          opacity: 1,
          WebkitMaskImage: `radial-gradient(circle at 50% 105.594%, rgb(0, 0, 0) 62.9372%, rgba(0, 0, 0, 0) 81.4686%)`,
          maskImage: `radial-gradient(circle at 50% 105.594%, rgb(0, 0, 0) 62.9372%, rgba(0, 0, 0, 0) 81.4686%)`,
          duration: 3,
        },
        "<0.2"
      )

      tl.set(heroMainContainerRef.current, { opacity: 0 })
      tl.to(hero1Ref.current, { scale: 0.85, duration: 3 }, "<-=3")

      tl.set(hero1Ref.current, {
        WebkitMaskImage: `radial-gradient(circle at 50% 16.1137vh, rgb(0, 0, 0) 96.1949vh, rgba(0, 0, 0, 0) 112.065vh)`,
        maskImage: `radial-gradient(circle at 50% 16.1137vh, rgb(0, 0, 0) 96.1949vh, rgba(0, 0, 0, 0) 112.065vh)`,
      }, "<+=2.1")

      tl.to(hero1Ref.current, {
        WebkitMaskImage: `radial-gradient(circle at 50% -40vh, rgb(0, 0, 0) 0vh, rgba(0, 0, 0, 0) 80vh)`,
        maskImage: `radial-gradient(circle at 50% -40vh, rgb(0, 0, 0) 0vh, rgba(0, 0, 0, 0) 80vh)`,
        duration: 2,
      }, "<+=0.2")

      tl.to(heroTextLogoRef.current, {
        opacity: 0,
        duration: 2,
      }, "<1.5")

      tl.set(hero1Ref.current, { opacity: 0 })
      tl.set(hero2Ref.current, { visibility: "visible" })

      tl.to(hero2Ref.current, { opacity: 1, visibility: "visible", duration: 1 }, "<+=0.1")

      // Color transition: Black -> Mesh Gradient (2s duration)
      tl.to(gsap.utils.selector(hero2Ref.current)(".mesh-gradient-bg"), {
        opacity: 1,
        duration: 2,
        ease: "power2.inOut"
      }, "<")

      // Entrance animation for content items (Starts at 40% of 2s = 0.8s)
      tl.from(gsap.utils.selector(hero2Ref.current)(".buits-container-fixed > *"), {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: "power4.out"
      }, "<0.8")

      // Exit animation to blend with next section (Features - Black)
      tl.to(gsap.utils.selector(hero2Ref.current)(".mesh-gradient-bg"), {
        opacity: 0,
        duration: 0.7,
        ease: "power2.inOut"
      })

      tl.to(gsap.utils.selector(hero2Ref.current)(".buits-container-fixed"), {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
      }, "<")
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <Head title="Barishal University IT Society BUITS" />
      <div className="hero-main-wrapper" ref={containerRef}>
        <div className="overlay" ref={overlayRef}></div>
        <div className="hero-1-container" ref={hero1Ref}>
          <div className="hero-main-container" ref={heroMainContainerRef}>

            <img className="hero-main-image" draggable="false" src="/img/ultra_hero.svg" alt="gta logo" ref={heroMainImageRef} />
          </div>
          <div className="hero-text-logo-container">
            <div className="hero-text-logo" ref={heroTextLogoRef}></div>
            <div>
              <h3 className="hero-text" ref={heroTextRef}>
                Tech<br />
                Reck<br />
                Make
              </h3>
            </div>
          </div>
          <div className="buits-mouse-fixed"></div>
        </div>
        <div className="hero-2-container buits-theme" ref={hero2Ref}>
          <div className="mesh-gradient-bg"></div>

          <div className="buits-container-fixed">
            <div className="buits-badges">
              <div className="buits-badge-fixed"> TECH</div>
              <div className="buits-badge-fixed">RECK</div>
              <div className="buits-badge-fixed">MAKE</div>
            </div>

            <h1>
              <span className="buits-highlight">Barishal University</span><br />
              IT Society
            </h1>

            <p className="buits-subtext-fixed">
              Where technology meets creativity. Build, innovate, and lead with the brightest minds in Barishal.
            </p>

            <div className="buits-buttons-fixed">
              <Link href="/register" className="buits-btn-fixed buits-btn-primary">
                Join the Community →
              </Link>
              <Link href="/events" className="buits-btn-fixed buits-btn-outline">
                Explore Events
              </Link>
            </div>

            <div className="buits-stats-fixed">
              <div className="buits-stat-fixed">
                <h2>500+</h2>
                <p>MEMBERS</p>
              </div>
              <div className="buits-stat-fixed">
                <h2>60+</h2>
                <p>EVENTS HELD</p>
              </div>
              <div className="buits-stat-fixed">
                <h2>5+</h2>
                <p>YEARS ACTIVE</p>
              </div>
              <div className="buits-stat-fixed">
                <h2>30+</h2>
                <p>PROJECTS</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
