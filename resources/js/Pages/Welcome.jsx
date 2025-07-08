/* eslint-disable */
import { useState } from 'react'
import Hero from '../components/HomePage/Hero'
import About from '../components/HomePage/About'
import NavBar from '../components/HomePage/Navbar'
import Features from '../components/HomePage/Features'
import FloatingImage from '../components/HomePage/Story'
import Contact from '../components/HomePage/Contact'
import Footer from '../components/HomePage/Footer'

function App() {
  return (
    <>
      <main className="relative min-h-screen w-screen overflow-x-hidden">
        <NavBar />
        <Hero />
        <About />
        <Features />
        <FloatingImage />
        <Contact />
        <Footer />
      </main>
    </>
  )
}

export default App
