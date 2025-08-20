import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef, useEffect } from "react";
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FirstVideo = () => {
  const videoRef = useRef(null);
  const hasPlayedRef = useRef(false);
  const playedDownRef = useRef(false); // played when entering by scrolling down
  const playedUpRef = useRef(false); // played when entering by scrolling up
  const prevProgRef = useRef(0);
  const pendingDownRef = useRef(false);
  const pendingUpRef = useRef(false);

  useGSAP(() => {
    gsap.set('.first-vd-wrapper', { marginTop: '-150vh', opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.first-vd-wrapper',
        start: 'top top',
        end: '+=200% top',
        scrub: true,
        pin: true,
        // We'll control playback and stacking via onUpdate so the video
        // starts a bit later (after previous section mostly faded).
        onUpdate: function(self) {
          const PLAY_THRESHOLD = 0.4; // play when timeline progress >= 40%
          const prog = self.progress;
          const prev = prevProgRef.current;
          const wrapper = document.querySelector('.first-vd-wrapper');

          // Toggle wrapper stacking while progress is past threshold
          if (prog >= PLAY_THRESHOLD) {
            if (wrapper) {
              wrapper.classList.add('vd-active');
              wrapper.style.zIndex = 9999;
            }

            // If there is a pending entry flag set (onEnter or onEnterBack fired
            // after the threshold was already reached), honor it immediately.
            if (pendingDownRef.current && !playedDownRef.current && videoRef.current) {
              try { videoRef.current.currentTime = 0; } catch (e) { /* noop */ }
              videoRef.current.play().catch(console.error);
              playedDownRef.current = true;
              pendingDownRef.current = false;
              console.log('Video played once on scroll down (pending immediate)');
            }
            if (pendingUpRef.current && !playedUpRef.current && videoRef.current) {
              try { videoRef.current.currentTime = 0; } catch (e) { /* noop */ }
              videoRef.current.play().catch(console.error);
              playedUpRef.current = true;
              pendingUpRef.current = false;
              console.log('Video played once on scroll up (pending immediate)');
            }
          } else {
            if (wrapper) {
              wrapper.classList.remove('vd-active');
              wrapper.style.zIndex = '';
            }
          }

          // Detect crossing from below->above the threshold and handle pending plays
          if (prev < PLAY_THRESHOLD && prog >= PLAY_THRESHOLD) {
            // If an onEnter handler set a pending flag, honor that direction
            if (pendingDownRef.current && !playedDownRef.current && videoRef.current) {
              try { videoRef.current.currentTime = 0; } catch (e) { /* noop */ }
              videoRef.current.play().catch(console.error);
              playedDownRef.current = true;
              pendingDownRef.current = false;
              console.log('Video played once on scroll down (pending entry)');
            } else if (pendingUpRef.current && !playedUpRef.current && videoRef.current) {
              try { videoRef.current.currentTime = 0; } catch (e) { /* noop */ }
              videoRef.current.play().catch(console.error);
              playedUpRef.current = true;
              pendingUpRef.current = false;
              console.log('Video played once on scroll up (pending entry)');
            } else {
              // Fallback: if no pending flags, use progress delta to infer direction
              const delta = prog - prev;
              if (delta > 0) {
                if (!playedDownRef.current && videoRef.current) {
                  try { videoRef.current.currentTime = 0; } catch (e) { /* noop */ }
                  videoRef.current.play().catch(console.error);
                  playedDownRef.current = true;
                  console.log('Video played once on scroll down (inferred)');
                }
              } else {
                if (!playedUpRef.current && videoRef.current) {
                  try { videoRef.current.currentTime = 0; } catch (e) { /* noop */ }
                  videoRef.current.play().catch(console.error);
                  playedUpRef.current = true;
                  console.log('Video played once on scroll up (inferred)');
                }
              }
            }
          }

          // Update previous progress for next tick
          prevProgRef.current = prog;
        },
        onEnter: function() {
          // User entered by scrolling down (from top to this section)
          pendingDownRef.current = true;
        },

        onLeave: function() {
          // Clean up when fully leaving the pinned section
          const wrapper = document.querySelector('.first-vd-wrapper');
          if (wrapper) {
            wrapper.classList.remove('vd-active');
            wrapper.style.zIndex = '';
          }
          if (videoRef.current) {
            videoRef.current.pause();
            console.log('Video paused on leave');
          }

          // Reset flags so next time entering again will play once
          playedDownRef.current = false;
          playedUpRef.current = false;
          pendingDownRef.current = false;
          pendingUpRef.current = false;
        },
        onLeaveBack: function() {
          // When scrolling back above this section: clean up and pause
          const wrapper = document.querySelector('.first-vd-wrapper');
          if (wrapper) {
            wrapper.classList.remove('vd-active');
            wrapper.style.zIndex = '';
          }
          if (videoRef.current) {
            try { videoRef.current.pause(); } catch (e) { /* noop */ }
            console.log('Video paused on leave back');
          }

          // Reset per-entry flags so the next time user enters from either
          // direction the video can play once again.
          playedDownRef.current = false;
          playedUpRef.current = false;
          pendingDownRef.current = false;
          pendingUpRef.current = false;
          prevProgRef.current = 0;
        },

        onEnterBack: function() {
          // User entered by scrolling up (from below to this section)
          pendingUpRef.current = true;

          // Try to play immediately when entering from below so users
          // see the video without relying on threshold crossing.
          if (!playedUpRef.current && videoRef.current) {
            try { videoRef.current.currentTime = 0; } catch (e) { /* noop */ }
            videoRef.current.play().catch(console.error);
            playedUpRef.current = true;
            pendingUpRef.current = false;
            console.log('Video played immediately on onEnterBack');
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
