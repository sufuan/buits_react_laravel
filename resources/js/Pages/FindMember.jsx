import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import gsap from 'gsap';
import NavBar from '@/Components/HomePage/Navbar';
import '../../css/frontend.css';

export default function FindMember() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const heroRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    // Hero animation
    gsap.fromTo(heroRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }
    );

    gsap.fromTo(searchRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: "power2.out" }
    );
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = [
        {
          id: 'CS2021001',
          name: 'John Doe',
          department: 'Computer Science',
          session: '2021-2022',
          email: 'john.doe@university.edu',
          position: 'President'
        },
        {
          id: 'EEE2020045',
          name: 'Jane Smith',
          department: 'Electrical Engineering',
          session: '2020-2021',
          email: 'jane.smith@university.edu',
          position: 'Vice President'
        }
      ].filter(member => 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  return (
    <>
      <Head title="Find Member - University IT Society" />
      <NavBar />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div ref={heroRef} className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 mb-6">
              FIND MEMBER
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Search for IT Society members by name or member ID to connect and collaborate.
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="pb-20 px-6">
          <div ref={searchRef} className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="mb-12">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter member name or ID..."
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none transition-all duration-300"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-2 top-2 px-6 py-2 bg-gradient-to-r from-green-600 to-cyan-600 rounded-xl text-white font-medium hover:from-green-700 hover:to-cyan-700 transition-all duration-300 disabled:opacity-50"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Search Results</h2>
                {searchResults.map((member, index) => (
                  <div
                    key={member.id}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-cyan-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">{member.name}</h3>
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                          {member.position}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Member ID:</span>
                          <span className="text-white ml-2 font-medium">{member.id}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Department:</span>
                          <span className="text-white ml-2">{member.department}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Session:</span>
                          <span className="text-white ml-2">{member.session}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Email:</span>
                          <span className="text-cyan-400 ml-2">{member.email}</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex gap-3">
                        <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-cyan-600 rounded-lg text-white text-sm font-medium hover:from-green-700 hover:to-cyan-700 transition-all duration-300">
                          Contact
                        </button>
                        <button className="px-4 py-2 bg-white/10 rounded-lg text-white text-sm font-medium border border-white/20 hover:border-white/40 transition-all duration-300">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchQuery && searchResults.length === 0 && !isSearching && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-white mb-2">No members found</h3>
                <p className="text-gray-400">Try searching with a different name or member ID.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
