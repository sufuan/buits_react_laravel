import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import gsap from 'gsap';
import axios from 'axios';
import debounce from 'lodash/debounce';
import NavBar from '@/Components/HomePage/Navbar';
import { UserIcon, IdentificationIcon, BuildingOfficeIcon, AcademicCapIcon, EnvelopeIcon, PhoneIcon, DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline';
import '../../css/frontend.css';

export default function FindMember() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const heroRef = useRef(null);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    // Hero animation
    gsap.fromTo(heroRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
    );

    gsap.fromTo(searchRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power2.out" }
    );
  }, []);

  // Animate results when they appear
  useEffect(() => {
    if (searchResults.length > 0 && resultsRef.current) {
        gsap.fromTo(resultsRef.current.children,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
        );
    }
  }, [searchResults]);

  // Debounced Search API Call
  const performSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        setHasSearched(false);
        return;
      }

      setIsSearching(true);
      setHasSearched(true);
      
      try {
        const response = await axios.post('/api/find-member', { query });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
        setIsSearching(true);
    }
    
    performSearch(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const copyToClipboard = (id) => {
      if (id === 'Pending') return;
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      <Head title="Find Member - University IT Society" />
      <NavBar />
      
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-50 relative overflow-hidden">
        {/* Soft Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/40 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/40 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Hero Section */}
        <section className="pt-32 pb-12 px-6 relative z-10">
          <div ref={heroRef} className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-6 border border-blue-200/60 shadow-sm">
                <IdentificationIcon className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-slate-800 mb-6 tracking-tight">
              Member Directory
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light">
              Securely verify and look up active members of the University IT Society using their registered email or phone number.
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="pb-24 px-6 relative z-10">
          <div ref={searchRef} className="max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="mb-12 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-3xl blur opacity-15 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative flex items-center bg-white border border-slate-200 rounded-3xl shadow-lg p-2">
                <div className="pl-6 pr-4">
                    {isSearching ? (
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    )}
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Enter email address or phone number..."
                  className="w-full bg-transparent border-none text-slate-700 placeholder-slate-400 focus:ring-0 text-lg md:text-xl py-4 pr-6"
                />
              </div>
            </form>

            {/* Search Results */}
            <div ref={resultsRef} className="space-y-6">
                {searchResults.length > 0 && searchResults.map((member) => (
                    <div
                        key={member.id + member.email}
                        className="group relative bg-white/90 backdrop-blur-xl border border-slate-200/80 hover:border-blue-400/50 rounded-3xl p-6 md:p-8 transition-all duration-300 shadow-md hover:shadow-2xl hover:shadow-blue-200/40 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl group-hover:bg-blue-200/40 transition-colors"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                {member.image ? (
                                    <img src={member.image} alt={member.name} className="w-24 h-24 rounded-2xl object-cover ring-2 ring-slate-700 group-hover:ring-blue-500/50 transition-all shadow-lg" />
                                ) : (
                                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center ring-2 ring-slate-700 group-hover:ring-blue-500/50 transition-all shadow-lg">
                                        <UserIcon className="w-10 h-10 text-slate-400" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-grow">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight">{member.name}</h3>
                                        <span className="inline-block px-3 py-1 bg-blue-100 border border-blue-200 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                                            {member.position}
                                        </span>
                                    </div>
                                    
                                    {/* Member ID Copy Badge */}
                                    <button 
                                        onClick={() => copyToClipboard(member.id)}
                                        disabled={member.id === 'Pending'}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                                            copiedId === member.id 
                                                ? 'bg-green-100 border-green-300 text-green-700' 
                                                : member.id === 'Pending'
                                                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                                                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 cursor-pointer'
                                        }`}
                                    >
                                        <IdentificationIcon className="w-5 h-5 opacity-70" />
                                        <span className="font-mono font-medium">{member.id}</span>
                                        {copiedId === member.id ? (
                                            <CheckIcon className="w-4 h-4 ml-1" />
                                        ) : member.id !== 'Pending' ? (
                                            <DocumentDuplicateIcon className="w-4 h-4 ml-1 opacity-50 hover:opacity-100" />
                                        ) : null}
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <BuildingOfficeIcon className="w-5 h-5 text-slate-400" />
                                        <span className="text-sm font-medium">{member.department}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <AcademicCapIcon className="w-5 h-5 text-slate-400" />
                                        <span className="text-sm font-medium">Session: {member.session}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <EnvelopeIcon className="w-5 h-5 text-slate-400" />
                                        <span className="text-sm">{member.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <PhoneIcon className="w-5 h-5 text-slate-400" />
                                        <span className="text-sm">{member.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {searchQuery && !isSearching && searchResults.length === 0 && hasSearched && (
                <div className="text-center py-20 bg-white/80 border border-slate-200 rounded-3xl shadow-sm">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl mb-4">
                        <UserIcon className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No matching members found</h3>
                    <p className="text-slate-400">We couldn't find any member matching that email or phone number.</p>
                </div>
            )}
            
            {/* Initial State Hint */}
            {!searchQuery && !hasSearched && (
                <div className="text-center mt-12 opacity-60">
                    <p className="text-slate-500 text-sm">Start typing an email or phone number to see live results</p>
                </div>
            )}
            
          </div>
        </section>
      </div>
    </>
  );
}
