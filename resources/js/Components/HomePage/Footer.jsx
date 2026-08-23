import { useEffect, useRef } from "react";
import {
  FaFacebookF,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaArrowRight,
} from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  const socialLinks = [
    { href: "https://www.facebook.com/buitsorg", icon: <FaFacebookF />, name: "Facebook", color: "from-blue-600 to-blue-700" },
    { href: "https://www.youtube.com/@buitsorg", icon: <FaYoutube />, name: "YouTube", color: "from-red-600 to-red-700" },
  ];

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Find Member ID", href: "/find-member" },
    { name: "Committee Portal", href: "/previous-committee" },
    { name: "Join Us", href: "/register" },
    { name: "Login", href: "/login" },
  ];

  const resources = [
    { name: "Certificates", href: "/certificates" },
    { name: "Blog", href: "/blog" },
    { name: "Gallery", href: "/gallery" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  useEffect(() => {
    if (!footerRef.current) return;

    const cols = footerRef.current.querySelectorAll(".footer-col");
    gsap.fromTo(
      cols,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <footer ref={footerRef} className="relative bg-black overflow-hidden">
      {/* Layered gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent blur-sm" />

      {/* Ambient glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute -top-20 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-[80px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand Column */}
          <div className="footer-col lg:col-span-1">
            <div className="flex items-center gap-4 mb-7">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 blur-lg rounded-xl" />
                <img
                  src="/img/logo.png"
                  alt="BUITS Logo"
                  className="relative w-14 h-14 rounded-xl shadow-2xl object-contain"
                />
              </div>
              <div>
                <h3 className="text-white font-black text-lg leading-tight tracking-tight">
                  BUITS
                </h3>
                <p className="text-xs text-blue-400/80 font-medium tracking-widest uppercase">
                  IT Society
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Empowering the next generation of tech innovators at Barishal University through collaboration, learning, and innovation.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              {[
                { icon: <FaMapMarkerAlt />, text: "Barishal University, Bangladesh", color: "text-blue-400" },
                { icon: <FaPhone />, text: "+8801828-653727", color: "text-emerald-400" },
                { icon: <FaEnvelope />, text: "info@buits.org", color: "text-violet-400" },
                { icon: <FaGlobe />, text: "www.buits.org", color: "text-sky-400" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <span className={`${item.color} text-sm flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </span>
                  <span className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="text-white font-bold text-base mb-6 uppercase tracking-widest relative">
              <span className="relative">
                Quick Links
                <span className="absolute -bottom-2 left-0 w-8 h-[2px] bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" />
              </span>
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm flex items-center gap-2 group transition-all duration-300"
                  >
                    <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 text-blue-400">
                      <FaArrowRight className="text-xs" />
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-col">
            <h4 className="text-white font-bold text-base mb-6 uppercase tracking-widest relative">
              <span className="relative">
                Resources
                <span className="absolute -bottom-2 left-0 w-8 h-[2px] bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" />
              </span>
            </h4>
            <ul className="space-y-3">
              {resources.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white text-sm flex items-center gap-2 group transition-all duration-300"
                  >
                    <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 text-violet-400">
                      <FaArrowRight className="text-xs" />
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect & Newsletter */}
          <div className="footer-col">
            <h4 className="text-white font-bold text-base mb-6 uppercase tracking-widest relative">
              <span className="relative">
                Connect
                <span className="absolute -bottom-2 left-0 w-8 h-[2px] bg-gradient-to-r from-sky-500 to-blue-500 rounded-full" />
              </span>
            </h4>

            {/* Social Icons */}
            <div className="flex gap-3 mb-8">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.name}
                  className={`relative group w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/30 hover:bg-gradient-to-br ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                >
                  <span className="text-base">{social.icon}</span>
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-violet-600/10 rounded-2xl blur-sm" />
              <div className="relative bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <h5 className="text-white font-bold text-sm">Stay Updated</h5>
                </div>
                <p className="text-slate-400 text-xs mb-4 leading-relaxed">
                  Get the latest news, events, and updates from BUITS delivered to your inbox.
                </p>
                <div className="flex flex-col gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
                  />
                  <button className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-sm font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0">
                    Subscribe →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
          <div className="relative flex justify-center">
            <div className="bg-black px-4">
              <div className="w-6 h-6 border border-white/10 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-gradient-to-br from-blue-400 to-violet-400 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs text-center md:text-left">
            © {new Date().getFullYear()}{" "}
            <span className="text-slate-300 font-semibold">Barishal University IT Society</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms", "Cookies"].map((item, i) => (
              <a
                key={i}
                href={`/${item.toLowerCase().replace(" ", "-")}`}
                className="text-slate-500 hover:text-slate-300 text-xs transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="text-slate-600 text-xs">
            <span className="text-slate-500 font-medium tracking-wide">BUITS Dev Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;