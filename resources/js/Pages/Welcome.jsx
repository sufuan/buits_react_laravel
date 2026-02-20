/* eslint-disable */
import '../../css/frontend.css';
import { useState, useLayoutEffect } from 'react'
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Hero from '../Components/HomePage/Hero'
import About from '../Components/HomePage/About'
import NavBar from '../Components/HomePage/Navbar'
import Features from '../Components/HomePage/Features'
import FloatingImage from '../Components/HomePage/Story'
import Contact from '../Components/HomePage/Contact'
import Footer from '../Components/HomePage/Footer'
import Jason from '@/Components/HomePage/Jason'
import FirstVideo from '@/Components/HomePage/FirstVideo'
import BrandSlider from '@/Components/HomePage/BrandSlider'
import Gallary from '@/Components/HomePage/Gallary'
import People from '@/Components/HomePage/People'


function App() {
  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

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
        <Gallary />
        <People />
        <FloatingImage />
        <Contact />
        <Footer />
      </main>
    </>
  )
}

export default App
