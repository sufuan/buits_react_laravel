import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef, useEffect } from "react";
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FirstVideo = () => {
  const videoRef = useRef(null);
  const hasPlayedRef = useRef(false);

  useGSAP(() => {
    gsap.set('.first-vd-wrapper', { marginTop: '-150vh', opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.first-vd-wrapper',
        start: 'top top',
        end: '+=200% top',
        scrub: true,
        pin: true,
        onEnter: () => {
          // Play video only once when section enters
          if (videoRef.current && !hasPlayedRef.current) {
            videoRef.current.currentTime = 0; // Reset to beginning
            videoRef.current.play().catch(console.error);
            hasPlayedRef.current = true;
            console.log('Video playing on scroll trigger');
          }
        },
        onLeave: () => {
          // Pause video when leaving section
          if (videoRef.current) {
            videoRef.current.pause();
            console.log('Video paused on leave');
          }
        },
        onEnterBack: () => {
          // Resume video when coming back to section
          if (videoRef.current) {
            videoRef.current.play().catch(console.error);
            console.log('Video resumed on enter back');
          }
        }
      }
    });

    // Only animate hero-section if it exists
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      tl.to('.hero-section', { delay: 0.5, opacity: 0, ease: 'power1.inOut' });
    }
    
    tl.to('.first-vd-wrapper', { opacity: 1, duration: 2, ease: 'power1.inOut' });

  }, []);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Clean up any remaining ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger?.classList?.contains('first-vd-wrapper')) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section className="first-vd-wrapper">
      <div className="h-dvh">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          src="/videos/output1.mp4" // ✅ put file inside Laravel public/videos
          className="first-vd"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </section>
  );
};

export default FirstVideo;
