import React, { useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NavBar from '@/Components/HomePage/Navbar';
import '../../css/frontend.css';

gsap.registerPlugin(ScrollTrigger);

export default function Events() {
  const heroRef = useRef(null);
  const eventsRef = useRef([]);

  useEffect(() => {
    // Hero animation
    gsap.fromTo(heroRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }
    );

    // Events cards animation
    eventsRef.current.forEach((event, index) => {
      if (event) {
        gsap.fromTo(event,
          { y: 80, opacity: 0, rotationX: -30 },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 1,
            delay: index * 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: event,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const events = [
    {
      title: "Annual Hackathon 2024",
      date: "March 15-17, 2024",
      type: "Competition",
      description: "48-hour coding marathon with amazing prizes and industry mentors",
      image: "🏆",
      status: "upcoming"
    },
    {
      title: "AI/ML Workshop Series",
      date: "February 20, 2024",
      type: "Workshop",
      description: "Hands-on workshop covering machine learning fundamentals",
      image: "🤖",
      status: "upcoming"
    },
    {
      title: "Tech Talk: Future of Web Development",
      date: "January 25, 2024",
      type: "Seminar",
      description: "Industry experts discuss emerging web technologies",
      image: "💻",
      status: "completed"
    },
    {
      title: "Coding Bootcamp",
      date: "December 10-15, 2023",
      type: "Training",
      description: "Intensive programming bootcamp for beginners",
      image: "📚",
      status: "completed"
    }
  ];

  return (
    <>
      <Head title="Events - University IT Society" />
      <NavBar />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div ref={heroRef} className="max-w-6xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-6">
              EVENTS
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join our exciting events, workshops, and competitions designed to enhance your skills and connect with the tech community.
            </p>
          </div>
        </section>

        {/* Events Grid */}
        <section className="pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <div
                  key={index}
                  ref={el => eventsRef.current[index] = el}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500 transform hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        event.status === 'upcoming' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                      </span>
                      <span className="text-3xl">{event.image}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                    <p className="text-blue-400 text-sm mb-2">{event.date}</p>
                    <p className="text-purple-400 text-sm mb-4">{event.type}</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{event.description}</p>
                    
                    <button className="mt-6 w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                      {event.status === 'upcoming' ? 'Register Now' : 'View Details'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
