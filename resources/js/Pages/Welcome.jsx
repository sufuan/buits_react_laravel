/* eslint-disable */
import '../../css/frontend.css';
import { useState } from 'react'
import Hero from '../Components/HomePage/Hero'
import About from '../Components/HomePage/About'
import NavBar from '../Components/HomePage/Navbar'
import Features from '../Components/HomePage/Features'
import FloatingImage from '../Components/HomePage/Story'
import Contact from '../Components/HomePage/Contact'
import Footer from '../Components/HomePage/Footer'
import HolographicTimeline from '@/Components/HomePage/HolographicTimeline'
import Jason from '@/Components/HomePage/Jason'
import FirstVideo from '@/Components/HomePage/FirstVideo'
import BrandSlider from '@/Components/HomePage/BrandSlider'


function App() {
  return (
    <>
      <main className="relative min-h-screen w-screen overflow-x-hidden">
        <NavBar />
        <Hero />
        {/* <About /> */}
        <Features />
        <FirstVideo />
        <Jason />
        <BrandSlider />
        <HolographicTimeline />
        <FloatingImage />
        <Contact />
        <Footer />
      </main>
    </>
  )
}

export default App
