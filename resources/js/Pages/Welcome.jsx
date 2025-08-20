/* eslint-disable */
import { useState } from 'react'
import Hero from '../components/HomePage/Hero'
import About from '../components/HomePage/About'
import NavBar from '../components/HomePage/Navbar'
import Features from '../components/HomePage/Features'
import FloatingImage from '../components/HomePage/Story'
import Contact from '../components/HomePage/Contact'
import Footer from '../components/HomePage/Footer'
import HolographicTimeline from '@/Components/HomePage/HolographicTimeline'
import Jason from '@/Components/HomePage/Jason'
import FirstVideo from '@/Components/HomePage/FirstVideo'

function App() {
  return (
    <>
      <main className="relative min-h-screen w-screen overflow-x-hidden">
        <NavBar />
        <Hero />
        <About />
        <Features />
        <FirstVideo/>
        <Jason/>
        <HolographicTimeline />
        <FloatingImage />
        <Contact />
        <Footer />
      </main>
    </>
  )
}

export default App
