import React, { useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NavBar from '@/Components/HomePage/Navbar';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardRefs = useRef([]);
  const statsRefs = useRef([]);
  const timelineRef = useRef(null);
  const teamRefs = useRef([]);
  const floating3DRef = useRef(null);

  useEffect(() => {
    // Hero section animations
    const tl = gsap.timeline();
    
    // Animate hero title with 3D effect
    tl.fromTo(titleRef.current, 
      { 
        y: 100, 
        opacity: 0, 
        rotationX: -90,
        transformPerspective: 1000 
      },
      { 
        y: 0, 
        opacity: 1, 
        rotationX: 0,
        duration: 1.5, 
        ease: "power3.out" 
      }
    )
    .fromTo(subtitleRef.current,
      { 
        y: 50, 
        opacity: 0,
        scale: 0.8 
      },
      { 
        y: 0, 
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power2.out" 
      }, "-=0.8"
    );

    // Floating 3D elements animation
    gsap.to(floating3DRef.current?.children || [], {
      y: "random(-20, 20)",
      x: "random(-10, 10)",
      rotation: "random(-15, 15)",
      duration: "random(2, 4)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.2
    });

    // Cards scroll animation
    cardRefs.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(card,
          {
            y: 100,
            opacity: 0,
            rotationY: -45,
            transformPerspective: 1000
          },
          {
            y: 0,
            opacity: 1,
            rotationY: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    // Team members scroll animation
    teamRefs.current.forEach((member, index) => {
      if (member) {
        gsap.fromTo(member,
          {
            y: 100,
            opacity: 0,
            rotationY: -45,
            transformPerspective: 1000
          },
          {
            y: 0,
            opacity: 1,
            rotationY: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: member,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    // Stats counter animation
    statsRefs.current.forEach((stat, index) => {
      if (stat) {
        const countElement = stat.querySelector('.count');
        const finalValue = parseInt(countElement.textContent);
        
        gsap.fromTo(countElement,
          { textContent: 0 },
          {
            textContent: finalValue,
            duration: 2,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: stat,
              start: "top 80%",
              toggleActions: "play none none none"
            }
          }
        );
      }
    });

    // Timeline scroll animation
    if (timelineRef.current) {
      const timelineItems = timelineRef.current.querySelectorAll('.timeline-item');
      
      timelineItems.forEach((item, index) => {
        gsap.fromTo(item,
          {
            x: index % 2 === 0 ? -100 : 100,
            opacity: 0,
            scale: 0.8
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }

    // Parallax effect for background elements
    gsap.to(".parallax-bg", {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: ".parallax-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      <Head title="About - University IT Society" />
      <NavBar />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Floating 3D Background Elements */}
        <div ref={floating3DRef} className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-15 blur-2xl"></div>
          <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-25 blur-xl"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full opacity-20 blur-lg"></div>
        </div>

        {/* Hero Section */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="text-center z-10">
            <h1
              ref={titleRef}
              className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 mb-6 leading-tight"
              style={{
                fontFamily: 'Inter, sans-serif',
                textShadow: '0 0 30px rgba(59, 130, 246, 0.3)'
              }}
            >
              ABOUT US
            </h1>
            <p
              ref={subtitleRef}
              className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            >
              Empowering the next generation of tech innovators at our university through
              cutting-edge technology, collaborative learning, and groundbreaking projects.
            </p>
          </div>
          
          {/* Animated geometric shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-6 relative z-10 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: 500, label: "Active Members", suffix: "+" },
                { value: 50, label: "Projects", suffix: "+" },
                { value: 25, label: "Industry Partners", suffix: "+" },
                { value: 100, label: "Success Rate", suffix: "%" }
              ].map((stat, index) => (
                <div
                  key={index}
                  ref={el => statsRefs.current[index] = el}
                  className="text-center group"
                >
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                      <span className="count text-4xl md:text-5xl font-bold text-white">{stat.value}</span>
                      <span className="text-2xl md:text-3xl font-bold text-blue-400">{stat.suffix}</span>
                    </div>
                  </div>
                  <p className="mt-6 text-xl text-gray-300 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision Cards */}
        <section className="py-20 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Mission Card */}
              <div
                ref={el => cardRefs.current[0] = el}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Our Mission</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    To foster innovation, creativity, and technical excellence among students while building
                    a strong community of future technology leaders who will shape the digital world.
                  </p>
                </div>
              </div>

              {/* Vision Card */}
              <div
                ref={el => cardRefs.current[1] = el}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Our Vision</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    To be the premier technology society that bridges the gap between academic learning
                    and industry demands, creating globally competitive IT professionals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* History Timeline */}
        <section ref={timelineRef} className="py-20 px-6 relative z-10 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Journey</span>
            </h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-500"></div>
              
              {/* Timeline items */}
              {[
                { year: "2020", title: "Foundation", description: "University IT Society was founded with 20 passionate students." },
                { year: "2021", title: "First Hackathon", description: "Organized our first university-wide hackathon with 100+ participants." },
                { year: "2022", title: "Industry Partnerships", description: "Established partnerships with 10+ leading tech companies." },
                { year: "2023", title: "National Recognition", description: "Won the National Student Tech Innovation Award." },
                { year: "2024", title: "Global Expansion", description: "Launched international exchange programs with universities in 5 countries." }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`timeline-item mb-12 flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} items-center`}
                >
                  <div className="md:w-1/2 mb-4 md:mb-0">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mx-4">
                      <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                  </div>
                  <div className="md:w-1/2 flex justify-center md:justify-start">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl border-4 border-slate-900">
                        {item.year}
                      </div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Leadership</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: "Alex Johnson", role: "President", image: "/placeholders/user-placeholder.svg" },
                { name: "Sarah Williams", role: "Vice President", image: "/placeholders/user-placeholder.svg" },
                { name: "Michael Chen", role: "Technical Lead", image: "/placeholders/user-placeholder.svg" },
                { name: "Emma Davis", role: "Community Manager", image: "/placeholders/user-placeholder.svg" }
              ].map((member, index) => (
                <div
                  key={index}
                  ref={el => teamRefs.current[index] = el}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500 transform hover:scale-105">
                    <div className="relative w-full h-64 mb-6 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                    <p className="text-blue-400 font-medium">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 relative z-10 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Community</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Become part of the most innovative technology society at our university and shape the future of tech.
            </p>
            <Link
              href="/register"
              className="relative group bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-500 transform hover:scale-105 hover:shadow-2xl inline-block"
            >
              <span className="relative z-10">Join Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
