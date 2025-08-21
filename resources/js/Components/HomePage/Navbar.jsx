import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { Link } from "@inertiajs/react";
import { useAudio } from "../../Contexts/AudioContext";

import Button from "./Button";

const navItems = [
  { name: "Find Member ID", href: "/find-member" },
  { name: "Events", href: "/events" },
  { name: "About", href: "/about" },
  { name: "Login", href: "/login" },
  { name: "Register", href: "/register" }
];

const NavBar = () => {
  // Get audio controls from context
  const { isIndicatorActive, toggleAudio } = useAudio();

  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs for navigation container and menu items
  const navContainerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const menuItemsRef = useRef([]);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Toggle mobile menu with animations
  const toggleMobileMenu = (e) => {
    e.stopPropagation();
    if (!isMobileMenuOpen) {
      // Open menu
      setIsMobileMenuOpen(true);
      document.body.classList.add("menu-open");

      // Animate overlay
      gsap.fromTo(
        mobileMenuRef.current,
        { y: "-100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.5, ease: "power2.out" }
      );

      // Staggered animation for menu items
      gsap.fromTo(
        menuItemsRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.2,
          ease: "power2.out",
        }
      );
    } else {
      // Close menu
      document.body.classList.remove("menu-open");

      // Animate overlay out
      gsap.to(mobileMenuRef.current, {
        y: "-100%",
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => setIsMobileMenuOpen(false),
      });
    }
  };

  // Manage audio playback
  // Remove the useEffect for audio since it's now handled by context

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
                title="BUITS"
                rightIcon={<TiLocationArrow />}
                containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
              />
            </div>

            {/* Navigation Links and Audio Button */}
            <div className="flex h-full items-center">
              {/* Desktop Navigation */}
              <div className="hidden md:block">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="nav-hover-btn"
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
            })}
            style={{
              animationDelay: `${bar * 0.1}s`,
            }}
          />
        ))}
      </button>

      {/* Hamburger Menu Button */}
      <button
        key={`hamburger-${isMobileMenuOpen}`}
        onClick={toggleMobileMenu}
        className={clsx(
          "md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 pointer-events-auto fixed top-6 right-6 z-[99998]",
          { "hamburger-open": isMobileMenuOpen }
        )}
        style={{
          backgroundColor: "transparent",
        }}
      >
        <div
          className={clsx("w-6 h-0.5 transition-all duration-300", {
            "bg-black": isMobileMenuOpen,
            "bg-white": !isMobileMenuOpen,
          })}
          style={{
            transform: isMobileMenuOpen
              ? "rotate(45deg) translateY(8px)"
              : "rotate(0deg) translateY(0px)",
          }}
        ></div>
        <div
          className={clsx("w-6 h-0.5 transition-all duration-300", {
            "bg-black": isMobileMenuOpen,
            "bg-white": !isMobileMenuOpen,
          })}
          style={{
            opacity: isMobileMenuOpen ? 0 : 1,
          }}
        ></div>
        <div
          className={clsx("w-6 h-0.5 transition-all duration-300", {
            "bg-black": isMobileMenuOpen,
            "bg-white": !isMobileMenuOpen,
          })}
          style={{
            transform: isMobileMenuOpen
              ? "rotate(-45deg) translateY(-8px)"
              : "rotate(0deg) translateY(0px)",
          }}
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
          width: "100%",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: 0,
          padding: 0,
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
              <Link
                href={item.href}
                onClick={toggleMobileMenu}
                className="text-black text-7xl font-black uppercase tracking-tight mobile-menu-item hover:text-gray-800 transition-colors duration-300"
                style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  lineHeight: "0.9",
                  fontWeight: "900",
                }}
              >
                {item.name}
              </Link>
            </div>
          ))}
        </div>

        {/* Mobile Audio Button in Overlay */}
        <div className="absolute bottom-20">
          <button
            onClick={toggleAudio}
            className={clsx("flex items-center space-x-4 overlay-audio")}
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