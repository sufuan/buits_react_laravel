import {
  FaFacebookF,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe
} from "react-icons/fa";

const Footer = () => {
  const socialLinks = [
    { href: "https://facebook.com/buits", icon: <FaFacebookF />, name: "Facebook" },
    { href: "https://youtube.com/buits", icon: <FaYoutube />, name: "YouTube" },
  ];

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Committee", href: "/committee" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
    { name: "Join Us", href: "/register" },
  ];

  const resources = [
    { name: "Certificates", href: "/certificates" },
   
    { name: "Blog", href: "/blog" },


  ];

  return (
    <>
      <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>

        {/* Main Footer Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* Organization Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6">
                <img
                  src="/img/logo.png"
                  alt="BUITS Logo"
                  className="w-12 h-12 mr-3 rounded-lg shadow-lg"
                />
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Barishal University IT Society
                  </h3>
                 
                </div>
              </div>
            

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-300">
                  <FaMapMarkerAlt className="mr-3 text-blue-400" />
                  <span>Barishal University, Barishal, Bangladesh</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <FaPhone className="mr-3 text-green-400" />
                  <span>+880 1XXX-XXXXXX</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <FaEnvelope className="mr-3 text-red-400" />
                  <span>info@buits.org</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <FaGlobe className="mr-3 text-purple-400" />
                  <span>www.buits.org</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-semibold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-xl font-semibold mb-6 text-white">Resources</h4>
              <ul className="space-y-3">
                {resources.map((resource, index) => (
                  <li key={index}>
                    <a
                      href={resource.href}
                      className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {resource.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Media & Newsletter */}
            <div>
              <h4 className="text-xl font-semibold mb-6 text-white">Connect With Us</h4>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3 mb-8">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center text-white hover:from-blue-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg group"
                    title={social.name}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/30">
                <h5 className="text-lg font-semibold mb-3 text-white">Stay Updated</h5>
                <p className="text-sm text-gray-300 mb-4">Get the latest news and updates from BUITS</p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors duration-300"
                  />
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-r-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative z-10 border-t border-gray-700/50 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-300">
                <p>&copy; 2025 Barishal University IT Society. All rights reserved.</p>
                <div className="flex gap-4">
                  <a href="/privacy" className="hover:text-blue-400 transition-colors duration-300">Privacy Policy</a>
                  <a href="/terms" className="hover:text-blue-400 transition-colors duration-300">Terms of Service</a>
                  <a href="/cookies" className="hover:text-blue-400 transition-colors duration-300">Cookie Policy</a>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                Made with ❤️ by BUITS Development Team
              </div>
            </div>
          </div>
        </div>

      </footer>
    </>
  );
};

export default Footer;