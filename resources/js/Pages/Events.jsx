import React, { useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NavBar from '@/Components/HomePage/Navbar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { format, isPast } from 'date-fns';
import '../../css/frontend.css';

gsap.registerPlugin(ScrollTrigger);

export default function Events({ events = [], upcomingEventsCount = 0, ongoingEventsCount = 0 }) {
  const heroRef = useRef(null);
  const calendarRef = useRef(null);
  const statsRef = useRef([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalAnimating, setIsModalAnimating] = useState(false);

  useEffect(() => {
    // Hero title animation with split text effect
    const title = heroRef.current?.querySelector('h1');
    if (title) {
      gsap.fromTo(title,
        {
          y: 100,
          opacity: 0,
          scale: 0.8,
          rotationX: -30
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          duration: 1.5,
          ease: "power4.out"
        }
      );
    }

    // Subtitle animation
    const subtitle = heroRef.current?.querySelector('p');
    if (subtitle) {
      gsap.fromTo(subtitle,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power3.out" }
      );
    }

    // Stats cards animation with stagger
    statsRef.current.forEach((stat, index) => {
      if (stat) {
        gsap.fromTo(stat,
          {
            y: 80,
            opacity: 0,
            scale: 0.5,
            rotationY: -45
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationY: 0,
            duration: 1,
            delay: 0.5 + (index * 0.2),
            ease: "back.out(1.7)"
          }
        );
      }
    });

    // Calendar animation with 3D effect
    if (calendarRef.current) {
      gsap.fromTo(calendarRef.current,
        {
          y: 100,
          opacity: 0,
          scale: 0.9,
          rotationX: 20
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          duration: 1.2,
          delay: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: calendarRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Floating animation for background elements
    gsap.to('.floating-orb', {
      y: '+=30',
      duration: 3,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: {
        each: 0.5,
        from: 'random'
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleEventClick = (info) => {
    const event = info.event;
    setIsModalAnimating(true);
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      extendedProps: event.extendedProps
    });
  };

  const closeModal = () => {
    setIsModalAnimating(false);
    setTimeout(() => {
      setSelectedEvent(null);
    }, 300);
  };

  const isRegistrationClosed = (event) => {
    if (!event?.extendedProps?.requires_registration) {
      return false;
    }
    if (event?.extendedProps?.registration_deadline) {
      return isPast(new Date(event.extendedProps.registration_deadline));
    }
    return false;
  };

  const getTypeEmoji = (type) => {
    const emojis = {
      workshop: '🛠️',
      seminar: '🎓',
      competition: '🏆',
      training: '📚',
      meeting: '💼',
      other: '📅'
    };
    return emojis[type] || '📅';
  };

  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'bg-blue-500/20 text-blue-400 border-blue-400/30',
      ongoing: 'bg-orange-500/20 text-orange-400 border-orange-400/30',
      completed: 'bg-green-500/20 text-green-400 border-green-400/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-400/30'
    };
    return colors[status] || colors.upcoming;
  };

  return (
    <>
      <Head title="Events - University IT Society" />
      <NavBar />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-orb absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="floating-orb absolute top-40 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="floating-orb absolute bottom-20 left-1/3 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
          <div className="floating-orb absolute bottom-40 right-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-6">
          <div ref={heroRef} className="max-w-6xl mx-auto text-center">
            {/* Main Title with Glow Effect */}
            <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-8 relative">
              EVENTS
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 blur-3xl opacity-30 -z-10"></div>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Join our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 font-bold">exciting events</span>, workshops, and competitions designed to enhance your skills and connect with the tech community.
            </p>

            {/* Enhanced Stats Cards */}
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              <div
                ref={el => statsRef.current[0] = el}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-8 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-cyan-400 mb-2">
                    {upcomingEventsCount}
                  </div>
                  <div className="text-sm font-semibold text-blue-300 uppercase tracking-wider">Upcoming Events</div>
                  <div className="absolute top-4 right-4 text-4xl">📅</div>
                </div>
              </div>

              <div
                ref={el => statsRef.current[1] = el}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-pink-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-orange-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-8 border border-orange-400/30 hover:border-orange-400/60 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-pink-400 mb-2">
                    {ongoingEventsCount}
                  </div>
                  <div className="text-sm font-semibold text-orange-300 uppercase tracking-wider">Ongoing Events</div>
                  <div className="absolute top-4 right-4 text-4xl">🔥</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calendar Section */}
        <section className="relative pb-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div ref={calendarRef} className="relative group perspective-1000">
              {/* Multi-layer Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-20 group-hover:opacity-40 transition-all duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl blur-2xl opacity-10 group-hover:opacity-20 transition-all duration-700"></div>

              {/* Calendar Container with Enhanced Glassmorphism */}
              <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl rounded-3xl p-8 md:p-12 border-2 border-white/20 hover:border-white/40 transition-all duration-500 shadow-2xl hover:shadow-blue-500/20">
                {/* Decorative Corner Elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-tl-3xl"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-br-3xl"></div>

                <div className="public-calendar-wrapper relative z-10">
                  <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth,timeGridWeek,listWeek'
                    }}
                    events={events}
                    eventClick={handleEventClick}
                    height="auto"
                    timeZone="Asia/Dhaka"
                    eventTimeFormat={{
                      hour: 'numeric',
                      minute: '2-digit',
                      meridiem: 'short',
                      hour12: true
                    }}
                    slotLabelFormat={{
                      hour: 'numeric',
                      minute: '2-digit',
                      meridiem: 'short',
                      hour12: true
                    }}
                    eventClassNames="cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Enhanced Event Details Modal */}
      {selectedEvent && (
        <div
          className={`fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isModalAnimating ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeModal}
        >
          <div
            className={`relative bg-gradient-to-br from-slate-900 via-blue-900/50 to-purple-900/50 rounded-3xl p-8 md:p-10 max-w-3xl w-full border-2 border-white/30 shadow-2xl transform transition-all duration-500 ${isModalAnimating ? 'scale-100 rotate-0' : 'scale-90 rotate-3'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-2xl"></div>

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all duration-300 hover:rotate-90 backdrop-blur-sm border border-white/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header with Emoji and Title */}
            <div className="relative flex items-start gap-6 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-50"></div>
                <div className="relative text-7xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  {getTypeEmoji(selectedEvent.extendedProps?.type)}
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-3 leading-tight">
                  {selectedEvent.title}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(selectedEvent.extendedProps?.status)} backdrop-blur-sm`}>
                    {selectedEvent.extendedProps?.status?.toUpperCase()}
                  </span>
                  {selectedEvent.extendedProps?.requires_registration && (
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-500/20 text-green-400 border-2 border-green-400/30 backdrop-blur-sm">
                      🎫 REGISTRATION REQUIRED
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedEvent.extendedProps?.description && (
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl"></div>
                <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-sm font-bold text-blue-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="text-lg">📝</span> Description
                  </h3>
                  <p className="text-gray-200 leading-relaxed text-lg">{selectedEvent.extendedProps.description}</p>
                </div>
              </div>
            )}

            {/* Date & Time Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-5 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300">
                  <h3 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="text-lg">🕐</span> Start Date
                  </h3>
                  <p className="text-white font-bold text-lg">
                    {selectedEvent.start ? format(new Date(selectedEvent.start), 'PPpp') : 'N/A'}
                  </p>
                </div>
              </div>
              {selectedEvent.end && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-5 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300">
                    <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="text-lg">🕐</span> End Date
                    </h3>
                    <p className="text-white font-bold text-lg">
                      {format(new Date(selectedEvent.end), 'PPpp')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Location */}
            {selectedEvent.extendedProps?.location && (
              <div className="mb-6 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-5 border border-red-400/30 hover:border-red-400/60 transition-all duration-300">
                  <h3 className="text-xs font-bold text-red-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="text-lg">📍</span> Location
                  </h3>
                  <p className="text-white font-bold text-lg">{selectedEvent.extendedProps.location}</p>
                </div>
              </div>
            )}

            {/* Registration Deadline */}
            {selectedEvent.extendedProps?.requires_registration && selectedEvent.extendedProps?.registration_deadline && (
              <div className="mb-6 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-sm rounded-xl p-5 border border-orange-400/30 hover:border-orange-400/60 transition-all duration-300">
                  <h3 className="text-xs font-bold text-orange-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="text-lg">⏰</span> Registration Deadline
                  </h3>
                  <p className="text-white font-bold text-lg">
                    {format(new Date(selectedEvent.extendedProps.registration_deadline), 'PPpp')}
                  </p>
                  {isRegistrationClosed(selectedEvent) && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-400/30 rounded-full">
                      <span className="text-red-400 font-bold text-sm">⚠️ Registration Closed</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Registration Button */}
            {selectedEvent.extendedProps?.requires_registration && selectedEvent.extendedProps?.registration_link && (
              <div className="relative">
                {isRegistrationClosed(selectedEvent) ? (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl blur-lg opacity-50"></div>
                    <button
                      disabled
                      className="relative w-full py-5 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl text-white font-black text-lg text-center cursor-not-allowed opacity-60 border-2 border-gray-500/50"
                    >
                      <span className="flex items-center justify-center gap-3">
                        <span className="text-2xl">🔒</span>
                        <span>Registration Closed</span>
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <a
                      href={selectedEvent.extendedProps.registration_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block w-full py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 rounded-xl text-white font-black text-lg text-center transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl border-2 border-white/30"
                    >
                      <span className="flex items-center justify-center gap-3">
                        <span className="text-2xl">🎫</span>
                        <span>Register Now</span>
                        <span className="text-2xl">→</span>
                      </span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Attendee Info */}
            {selectedEvent.extendedProps?.max_attendees && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  <span className="font-bold text-blue-400">{selectedEvent.extendedProps.attendees_count || 0}</span>
                  {' / '}
                  <span className="font-bold text-purple-400">{selectedEvent.extendedProps.max_attendees}</span>
                  {' '}attendees
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
