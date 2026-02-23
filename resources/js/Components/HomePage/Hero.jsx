import React, { useLayoutEffect, useRef } from "react";
import { Head } from '@inertiajs/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../../css/about_page_style.css';

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
          scrub: 2,
          pin: true,
          start: "top top",
          end: "+=2000",
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

      tl.to(hero2Ref.current, { opacity: 1, duration: 3 }, "<+=0.2")

      tl.fromTo(hero2Ref.current,
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
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <Head title="GTA VI Landing Page" />
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
        </div>
        <div className="hero-2-container" ref={hero2Ref}>
          <h3>Vice City, USA.</h3>
          <p>
            Jason and Lucia have always known the deck is stacked against them.
            But when an easy score goes wrong, they find themselves on the darkest
            side of the sunniest place in America, in the middle of a criminal
            conspiracy stretching across the state of Leonida — forced to rely on
            each other more than ever if they want to make it out alive.
          </p>
        </div>
        {/* Scroll Indicator */}
        <div className="scroll-indicator" ref={scrollIndicatorRef}>
          <svg width="34" height="14" viewBox="0 0 34 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
            className="_1smfa210" focusable="false">
            <path fillRule="evenodd" clip-rule="evenodd"
              d="M33.5609 1.54346C34.0381 2.5875 33.6881 3.87821 32.7791 4.42633L17.0387 13.9181L1.48663 4.42115C0.580153 3.86761 0.235986 2.57483 0.717909 1.53365C1.19983 0.492464 2.32535 0.097152 3.23182 0.650692L17.0497 9.08858L31.051 0.64551C31.96 0.0973872 33.0837 0.499411 33.5609 1.54346Z"
              fill="currentColor"></path>
          </svg>
        </div>
      </div>
    </>
  )
}
