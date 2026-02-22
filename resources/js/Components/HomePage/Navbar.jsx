import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { Link, usePage } from "@inertiajs/react";
import { useAudio } from "../../Contexts/AudioContext";

import Button from "./Button";

const navItems = [
  { name: "Find Member ID", href: "/find-member" },
  { name: "Events", href: "/events" },
  { name: "Previous Committee", href: "/previous-committee" },
  { name: "About", href: "/about" },
  { name: "Login", href: "/login" },
  { name: "Register", href: "/register" }
];

const NavBar = () => {
  const { settings, auth } = usePage().props;
  const isVolunteerEnabled = settings?.volunteer_applications_enabled;

  // Dynamically insert Volunteer link if enabled
  const dynamicNavItems = [...navItems];
  if (isVolunteerEnabled) {
    // Insert before Login (index 4)
    dynamicNavItems.splice(4, 0, { name: "Become a Volunteer", href: "/volunteer-application/create" });
  }
  // Get audio controls from context
  const { isIndicatorActive, toggleAudio } = useAudio();

  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs for navigation container and menu items
  const navContainerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const menuItemsRef = useRef([]);
  const blocksRef = useRef([]);

  const rows = 10;
  const cols = 7;

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  // Toggle mobile menu with animations
  const toggleMobileMenu = (e) => {
    if (e) e.stopPropagation();
    if (!isMobileMenuOpen) {
      // Open menu
      setIsMobileMenuOpen(true);
      document.body.classList.add("menu-open");

      // Animate blocks first
      gsap.fromTo(
        blocksRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          stagger: {
            amount: 0.4,
            grid: [rows, cols],
            from: "random",
          },
          ease: "power2.out",
        }
      );

      // Staggered animation for menu items
      gsap.fromTo(
        menuItemsRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          delay: 0.3,
          ease: "power2.out",
        }
      );
    } else {
      // Close menu
      document.body.classList.remove("menu-open");

      // Animate blocks out
      gsap.to(blocksRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        stagger: {
          amount: 0.3,
          grid: [rows, cols],
          from: "random",
        },
        ease: "power2.in",
        onComplete: () => setIsMobileMenuOpen(false),
      });

      // Animate menu items out
      gsap.to(menuItemsRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  };

  // Manage audio playback
  // Remove the useEffect for audio since it's now handled by context

  // Handle navbar visibility on scroll
  useEffect(() => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      setIsAtTop(true);
      navContainerRef.current?.classList.remove("floating-nav");
    } else {
      setIsAtTop(false);
      if (currentScrollY > lastScrollY) {
        setIsNavVisible(false);
        navContainerRef.current?.classList.add("floating-nav");
      } else if (currentScrollY < lastScrollY) {
        setIsNavVisible(true);
        navContainerRef.current?.classList.add("floating-nav");
      }
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
              <img src={isAtTop ? "/img/logo.png" : "/img/logo_white.svg"} alt="logo" className="w-14" />
              <Button
                id="product-button"
                title="BUITS"
                rightIcon={<TiLocationArrow />}
                containerClass={clsx("md:flex hidden items-center justify-center gap-1", {
                  "bg-black text-white": isAtTop,
                  "bg-blue-50": !isAtTop,
                })}
              />
            </div>

            {/* Navigation Links and Audio Button */}
            <div className="flex h-full items-center">
              {/* Desktop Navigation */}
              <div className="hidden md:block">
                {dynamicNavItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={clsx("nav-hover-btn", {
                      "hero-style": isAtTop,
                    })}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Audio Button - Desktop only */}
              <button
                onClick={toggleAudio}
                className="ml-10 hidden md:flex items-center space-x-0.5"
              >
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={clsx("indicator-line", {
                      active: isIndicatorActive,
                      "hero-style": isAtTop,
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

      {/* Mobile Audio Button - positioned outside navbar container */}
      <button
        onClick={toggleAudio}
        className={clsx(
          "md:hidden flex items-center space-x-0.5 fixed top-8 right-16 z-[99999]",
          { hidden: isMobileMenuOpen }
        )}
      >
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={clsx("indicator-line", {
              active: isIndicatorActive,
              "hero-style": isAtTop,
            })}
            style={{
              animationDelay: `${bar * 0.1}s`,
            }}
          />
        ))}
      </button>

      {/* Hamburger / Close Toggle Button */}
      <button
        key={`hamburger-${isMobileMenuOpen}`}
        onClick={toggleMobileMenu}
        className={clsx(
          "md:hidden flex flex-col justify-center items-center w-8 h-8 pointer-events-auto fixed top-6 right-6 z-[100001]",
          { "hamburger-open": isMobileMenuOpen, "space-y-0": isMobileMenuOpen, "space-y-1.5": !isMobileMenuOpen, "rounded-full p-1": isMobileMenuOpen }
        )}
        style={{
          backgroundColor: isMobileMenuOpen ? "#CCFF00" : "transparent",
        }}
      >
        {/* Render only the hamburger (3 lines) when closed, and only the X (2 rotated lines) when open */}
        {isMobileMenuOpen ? (
          <>
            <div
              className="w-6 h-0.5 bg-black transition-all duration-300"
              style={{ transform: "rotate(45deg)" }}
            />
            <div
              className="w-6 h-0.5 bg-black transition-all duration-300"
              style={{ transform: "rotate(-45deg)" }}
            />
          </>
        ) : (
          <>
            <div className={clsx("w-6 h-0.5 transition-all duration-300", isAtTop ? "bg-black" : "bg-white")} />
            <div className={clsx("w-6 h-0.5 transition-all duration-300", isAtTop ? "bg-black" : "bg-white")} />
            <div className={clsx("w-6 h-0.5 transition-all duration-300", isAtTop ? "bg-black" : "bg-white")} />
          </>
        )}
      </button>

      {/* Mobile Menu Overlay */}
      <div
        ref={mobileMenuRef}
        className={clsx(
          "fixed z-[100000] md:hidden mobile-menu-overlay overflow-hidden",
          { hidden: !isMobileMenuOpen }
        )}
        style={{
          height: "100vh",
          width: "100%",
          top: 0,
          left: 0,
          zIndex: 9998,
        }}
        onClick={toggleMobileMenu}
      >
        {/* Pixel Grid Background */}
        <div className="absolute inset-0 grid overflow-hidden pointer-events-none" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
          {Array.from({ length: rows * cols }).map((_, i) => (
            <div
              key={i}
              ref={(el) => (blocksRef.current[i] = el)}
              className="bg-[#CCFF00]"
              style={{
                opacity: 0,
                transform: 'scale(1.05)' // Slight overlap to prevent sub-pixel gaps
              }}
            />
          ))}
        </div>

        {/* Mobile Navigation Items */}
        <div className="relative z-10 flex flex-col items-start justify-center h-full space-y-6 px-8 w-full max-w-md">
          {dynamicNavItems.map((item, index) => (
            <div
              key={index}
              ref={(el) => (menuItemsRef.current[index] = el)}
              className="flex items-center w-full"
            >
              <span className="text-black text-xl mr-6 font-mono font-bold">
                0{index + 1}
              </span>
              <Link
                href={item.href}
                onClick={toggleMobileMenu}
                className="text-black text-4xl font-black uppercase tracking-tight mobile-menu-item hover:text-gray-800 transition-colors duration-300"
                style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  lineHeight: "1.1",
                  fontWeight: "900",
                }}
              >
                {item.name}
              </Link>
            </div>
          ))}
        </div>

        {/* Mobile Audio Button removed from overlay to avoid duplicate controls under the close icon */}
      </div>
    </>
  );
};

export default NavBar;