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

  // Debug state to toggle overlay opacity and disable animations
  const [debugMode, setDebugMode] = useState(false);

  // Refs for audio, navigation container, and hamburger lines
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const menuItemsRef = useRef([]);
  const hamburgerLineRefs = useRef([]);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Toggle audio and visual indicator
  const toggleAudioIndicator = () => {
    console.log("Audio toggled. isAudioPlaying:", !isAudioPlaying);
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  // Toggle mobile menu state
  const toggleMobileMenu = (e) => {
    e.stopPropagation();
    console.log("Hamburger clicked. isMobileMenuOpen:", !isMobileMenuOpen);
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Animate mobile menu and ensure overlay visibility
  useEffect(() => {
    if (isMobileMenuOpen && mobileMenuRef.current && !debugMode) {
      console.log("Animating mobile menu open. mobileMenuRef:", mobileMenuRef.current);
      document.body.classList.add("menu-open");
      document.body.style.backgroundColor = "transparent";
      document.documentElement.style.backgroundColor = "transparent";

      // Set overlay to visible immediately
      gsap.set(mobileMenuRef.current, {
        y: "0%",
        opacity: 1,
        zIndex: 9998,
        backgroundColor: "#CCFF00",
        force3D: true,
      });

      // Animate menu items
      if (menuItemsRef.current.length > 0 && menuItemsRef.current.every((item) => item !== null)) {
        console.log("Animating menu items. Count:", menuItemsRef.current.length);
        gsap.fromTo(
          menuItemsRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          }
        );
      } else {
        console.warn("Menu items not ready for animation:", menuItemsRef.current);
      }

      // Log overlay styles
      const styles = window.getComputedStyle(mobileMenuRef.current);
      console.log("Overlay styles:", {
        opacity: styles.opacity,
        transform: styles.transform,
        backgroundColor: styles.backgroundColor,
        zIndex: styles.zIndex,
      });
    } else if (!isMobileMenuOpen && mobileMenuRef.current && !debugMode) {
      console.log("Animating mobile menu close");
      document.body.classList.remove("menu-open");
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";

      gsap.to(mobileMenuRef.current, {
        y: "-100%",
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          console.log("Mobile menu closed");
        },
      });
    }
  }, [isMobileMenuOpen, debugMode]);

  // Force hamburger line styles with GSAP
  useEffect(() => {
    if (hamburgerLineRefs.current.every((line) => line !== null)) {
      console.log("Applying GSAP styles for hamburger", isMobileMenuOpen ? "open" : "closed");
      if (isMobileMenuOpen) {
        gsap.set(hamburgerLineRefs.current[0], {
          transform: "rotate(45deg) translate(5.5px, 5.5px)",
          backgroundColor: "black",
          opacity: 1,
          transformOrigin: "center",
          zIndex: 100002,
          force3D: true,
        });
        gsap.set(hamburgerLineRefs.current[1], {
          opacity: 0,
          backgroundColor: "black",
          transformOrigin: "center",
          zIndex: 100002,
          force3D: true,
        });
        gsap.set(hamburgerLineRefs.current[2], {
          transform: "rotate(-45deg) translate(5.5px, -5.5px)",
          backgroundColor: "black",
          opacity: 1,
          transformOrigin: "center",
          zIndex: 100002,
          force3D: true,
        });
      } else {
        gsap.set(hamburgerLineRefs.current, {
          transform: "rotate(0deg) translate(0px, 0px)",
          backgroundColor: "white",
          opacity: 1,
          transformOrigin: "center",
          zIndex: 100002,
          force3D: true,
        });
      }
      // Log hamburger line styles immediately
      hamburgerLineRefs.current.forEach((line, index) => {
        if (line) {
          const styles = window.getComputedStyle(line);
          console.log(`Hamburger line ${index + 1} styles:`, {
            transform: styles.transform,
            opacity: styles.opacity,
            backgroundColor: styles.backgroundColor,
            zIndex: styles.zIndex,
            display: styles.display,
            visibility: styles.visibility,
          });
        }
      });
    } else {
      console.warn("Hamburger line refs not ready:", hamburgerLineRefs.current);
    }
  }, [isMobileMenuOpen]);

  // Manage audio playback
  useEffect(() => {
    if (isAudioPlaying && audioElementRef.current) {
      audioElementRef.current.play();
    } else if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  // Handle navbar visibility on scroll
  useEffect(() => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current?.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current?.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current?.classList.add("floating-nav");
    }
    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  // Animate navbar visibility
  useEffect(() => {
    if (navContainerRef.current) {
      gsap.to(navContainerRef.current, {
        y: isNavVisible ? 0 : -100,
        opacity: isNavVisible ? 1 : 0,
        duration: 0.2,
      });
    }
  }, [isNavVisible]);

  // Cleanup effect for body scroll and background
  useEffect(() => {
    return () => {
      document.body.classList.remove("menu-open");
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
    };
  }, []);

  // Handle window resize to close mobile menu
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        document.body.classList.remove("menu-open");
        document.body.style.backgroundColor = "";
        document.documentElement.style.backgroundColor = "";
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  // Debug: Log hamburger button position, refs, and styles
  useEffect(() => {
    if (isMobileMenuOpen && hamburgerRef.current) {
      const rect = hamburgerRef.current.getBoundingClientRect();
      const buttonStyles = window.getComputedStyle(hamburgerRef.current);
      console.log("Hamburger button position and styles:", {
        top: rect.top,
        right: rect.right,
        left: rect.left,
        bottom: rect.bottom,
        zIndex: buttonStyles.zIndex,
        backgroundColor: buttonStyles.backgroundColor,
        display: buttonStyles.display,
        visibility: buttonStyles.visibility,
      });
      console.log("Refs status:", {
        mobileMenuRef: mobileMenuRef.current,
        menuItemsRef: menuItemsRef.current,
        hamburgerLineRefs: hamburgerLineRefs.current,
      });
      if (navContainerRef.current) {
        const styles = window.getComputedStyle(navContainerRef.current);
        console.log("Nav container styles:", {
          backgroundColor: styles.backgroundColor,
          zIndex: styles.zIndex,
          position: styles.position,
        });
      }
      const bodyStyles = window.getComputedStyle(document.body);
      const htmlStyles = window.getComputedStyle(document.documentElement);
      console.log("Body styles:", {
        backgroundColor: bodyStyles.backgroundColor,
        zIndex: bodyStyles.zIndex,
      });
      console.log("HTML styles:", {
        backgroundColor: htmlStyles.backgroundColor,
        zIndex: htmlStyles.zIndex,
      });
      // Check for overlapping elements
      const elementsAtPoint = document.elementsFromPoint(rect.left + 10, rect.top + 10);
      console.log("Elements at hamburger position:", elementsAtPoint.map(el => ({
        tag: el.tagName,
        class: el.className,
        zIndex: window.getComputedStyle(el).zIndex,
      })));
    }
  }, [isMobileMenuOpen]);

  // Debug: Toggle debug mode with a key press (e.g., 'd')
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "d") {
        setDebugMode((prev) => !prev);
        console.log("Debug mode toggled:", !debugMode);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [debugMode]);

  // Log state during render
  console.log("Rendering NavBar. isMobileMenuOpen:", isMobileMenuOpen);

  return (
    <>
      <div
        ref={navContainerRef}
        className="fixed inset-x-0 top-4 z-[9997] h-16 border-none transition-all duration-700 sm:inset-x-6 overflow-visible"
        style={{ backgroundColor: "transparent" }}
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

              {/* Mobile Audio Button */}
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
            </div>
          </nav>
        </header>
      </div>

      {/* Hamburger Menu Button - Moved outside nav container */}
      <button
        key={`hamburger-${isMobileMenuOpen}`}
        ref={hamburgerRef}
        onClick={toggleMobileMenu}
        className={clsx(
          "md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 pointer-events-auto fixed top-6 right-6",
          { "hamburger-open": isMobileMenuOpen }
        )}
        style={{
          backgroundColor: isMobileMenuOpen ? "rgb(239, 68, 68)" : "transparent",
          border: isMobileMenuOpen ? "2px solid white" : "none",
          borderRadius: isMobileMenuOpen ? "0.375rem" : "0",
          zIndex: 100001,
        }}
      >
        <div
          key="line1"
          ref={(el) => (hamburgerLineRefs.current[0] = el)}
          className={clsx("w-6 h-0.5 hamburger-line", { open: isMobileMenuOpen })}
          style={{ zIndex: 100002 }}
        ></div>
        <div
          key="line2"
          ref={(el) => (hamburgerLineRefs.current[1] = el)}
          className={clsx("w-6 h-0.5 hamburger-line", { open: isMobileMenuOpen })}
          style={{ zIndex: 100002 }}
        ></div>
        <div
          key="line3"
          ref={(el) => (hamburgerLineRefs.current[2] = el)}
          className={clsx("w-6 h-0.5 hamburger-line", { open: isMobileMenuOpen })}
          style={{ zIndex: 100002 }}
        ></div>
      </button>

      {/* Mobile Menu Overlay */}
      <div
        ref={mobileMenuRef}
        className={clsx(
          "fixed z-[9998] flex flex-col items-center justify-center md:hidden mobile-menu-overlay",
          { hidden: !isMobileMenuOpen }
        )}
        style={{
          backgroundColor: "#CCFF00",
          height: "100vh",
          width: "100vw",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: 0,
          padding: 0,
          opacity: debugMode ? 0.5 : 1,
          zIndex: 9998,
        }}
        onClick={toggleMobileMenu}
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
                  fontFamily: "Bebas Neue, sans-serif",
                  lineHeight: "0.9",
                  fontWeight: "900",
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
    </>
  );
};

export default NavBar;