import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

import Button from "./Button";

const navItems = ["Nexus", "Vault", "Prologue", "About", "Contact"];

const NavBar = () => {
  // State for toggling audio and visual indicator
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);

  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs for audio and navigation container
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const menuItemsRef = useRef([]);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Toggle audio and visual indicator
  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  // Toggle mobile menu with animations
  const toggleMobileMenu = () => {
    if (!isMobileMenuOpen) {
      // Open menu
      setIsMobileMenuOpen(true);
      document.body.classList.add('menu-open'); // Lock body scroll

      // Animate overlay
      gsap.fromTo(mobileMenuRef.current,
        { y: "-100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.5, ease: "power2.out" }
      );

      // Staggered animation for menu items
      gsap.fromTo(menuItemsRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.2,
          ease: "power2.out"
        }
      );
    } else {
      // Close menu
      document.body.classList.remove('menu-open'); // Unlock body scroll

      // Animate overlay out
      gsap.to(mobileMenuRef.current, {
        y: "-100%",
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => setIsMobileMenuOpen(false)
      });
    }
  };

  // Manage audio playback
  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    if (currentScrollY === 0) {
      // Topmost position: show navbar without floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      // Scrolling down: hide navbar and apply floating-nav
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up: show navbar with floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  // Cleanup effect for body scroll
  useEffect(() => {
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, []);

  // Handle window resize to close mobile menu
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        document.body.classList.remove('menu-open');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          {/* Logo and Product button */}
          <div className="flex items-center gap-7">
            <img src="/img/logo.png" alt="logo" className="w-10" />

            <Button
              id="product-button"
              title="Products"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
            />
          </div>

          {/* Navigation Links and Audio Button */}
          <div className="flex h-full items-center">
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className="nav-hover-btn"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Audio Button - Desktop only */}
            <button
              onClick={toggleAudioIndicator}
              className="ml-10 hidden md:flex items-center space-x-0.5"
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/loop.mp3"
                loop
              />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isIndicatorActive,
                  })}
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                  }}
                />
              ))}
            </button>

            {/* Mobile Audio Button - Separate for mobile */}
            <button
              onClick={toggleAudioIndicator}
              className="ml-4 md:hidden flex items-center space-x-0.5"
            >
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isIndicatorActive,
                  })}
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                  }}
                />
              ))}
            </button>

            {/* Hamburger Menu Button - Mobile Only */}
            <button
              ref={hamburgerRef}
              onClick={toggleMobileMenu}
              className={`ml-4 md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 z-[99999] ${isMobileMenuOpen ? 'fixed top-6 right-6' : 'relative'}`}
            >
              <div
                className={`w-6 h-0.5 transition-all duration-300 ${isMobileMenuOpen ? 'bg-black' : 'bg-white'}`}
                style={{
                  transform: isMobileMenuOpen ? 'rotate(45deg) translateY(8px)' : 'rotate(0deg) translateY(0px)',
                }}
              ></div>
              <div
                className={`w-6 h-0.5 transition-all duration-300 ${isMobileMenuOpen ? 'bg-black' : 'bg-white'}`}
                style={{
                  opacity: isMobileMenuOpen ? 0 : 1,
                }}
              ></div>
              <div
                className={`w-6 h-0.5 transition-all duration-300 ${isMobileMenuOpen ? 'bg-black' : 'bg-white'}`}
                style={{
                  transform: isMobileMenuOpen ? 'rotate(-45deg) translateY(-8px)' : 'rotate(0deg) translateY(0px)',
                }}
              ></div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed z-[9999] flex flex-col items-center justify-center md:hidden mobile-menu-overlay"
          style={{
            backgroundColor: '#CCFF00',
            height: '100vh',
            width: '100vw',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: 'fixed',
            margin: 0,
            padding: 0
          }}
        >
          {/* Mobile Navigation Items */}
          <div className="flex flex-col items-start justify-center space-y-6 px-8 w-full max-w-md">
            {navItems.map((item, index) => (
              <div
                key={index}
                ref={(el) => (menuItemsRef.current[index] = el)}
                className="flex items-center w-full"
              >
                <span className="text-black text-xl mr-6 font-mono font-bold">
                  0{index + 1}
                </span>
                <a
                  href={`#${item.toLowerCase()}`}
                  onClick={toggleMobileMenu}
                  className="text-black text-7xl font-black uppercase tracking-tight mobile-menu-item hover:text-gray-800 transition-colors duration-300"
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    lineHeight: '0.9',
                    fontWeight: '900'
                  }}
                >
                  {item}
                </a>
              </div>
            ))}
          </div>

          {/* Mobile Audio Button */}
          <div className="absolute bottom-20">
            <button
              onClick={toggleAudioIndicator}
              className="flex items-center space-x-0.5"
            >
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isIndicatorActive,
                  })}
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;