import React, { useEffect, useRef } from 'react';
import Swiper from 'swiper';
import { EffectCoverflow, Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const galleryImages = [
  { src: '/img/gallery/booth.jpg', title: 'BUITS Booth' },
  { src: '/img/gallery/commitee.jpg', title: 'Committee Members' },
  { src: '/img/gallery/fest.jpg', title: 'IT Fest' },
  { src: '/img/gallery/fest 2.jpg', title: 'IT Fest Highlights' },
  { src: '/img/gallery/fest 3.jpg', title: 'Tech Showcase' },
  { src: '/img/gallery/fest 4.jpg', title: 'Event Moments' },
  { src: '/img/gallery/fest 6.jpg', title: 'Festival Vibes' },
  { src: '/img/gallery/it 6.jpg', title: 'IT Event' },
  { src: '/img/gallery/it fest 5.jpg', title: 'IT Fest 5' },
  { src: '/img/gallery/itfest 33.jpg', title: 'IT Fest Memories' },
  { src: '/img/gallery/itfest 343.jpg', title: 'IT Fest Gallery' },
  { src: '/img/gallery/ucb.jpg', title: 'UCB Partnership' },
];

const Gallary = () => {
  const swiperRef = useRef(null);
  const swiperContainerRef = useRef(null);

  useEffect(() => {
    if (swiperContainerRef.current && !swiperRef.current) {
      swiperRef.current = new Swiper(swiperContainerRef.current, {
        modules: [EffectCoverflow, Autoplay, Pagination],
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        loop: true,
        slidesPerView: 'auto',
        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          depth: 150,
          modifier: 2.5,
          slideShadows: true,
        },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    }

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }
    };
  }, []);

  return (
    <section className="gallery-section">
      <div className="gallery-header">
        <h2>Our Gallery</h2>
        <p>Capturing moments of innovation and community</p>
      </div>

      <div className="gallery-swiper-container">
        <div className="swiper gallery-swiper" ref={swiperContainerRef}>
          <div className="swiper-wrapper">
            {galleryImages.map((image, index) => (
              <div key={index} className="swiper-slide gallery-slide">
                <div className="gallery-card">
                  <img src={image.src} alt={image.title} />
                  <div className="gallery-overlay">
                    <h3>{image.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

        .gallery-section {
          min-height: 100vh;
          background-color: #111117;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px 20px;
          font-family: 'Poppins', sans-serif;
        }

        .gallery-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .gallery-header h2 {
          font-size: 3rem;
          font-weight: 600;
          color: #fff;
          margin: 0 0 15px 0;
          letter-spacing: 2px;
        }

        .gallery-header p {
          font-size: 1.2rem;
          color: #888;
          margin: 0;
          font-weight: 300;
        }

        .gallery-swiper-container {
          width: 100%;
          max-width: 1400px;
          padding: 20px 0;
        }

        .gallery-swiper {
          width: 100%;
          padding: 50px 0;
        }

        .gallery-swiper .swiper-slide {
          width: 350px;
          height: 450px;
        }

        .gallery-card {
          height: 100%;
          width: 100%;
          background-color: #1b1f2a;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          border-bottom: 4px solid #00C066;
          border-top: 4px solid #00C066;
          overflow: hidden;
          position: relative;
          transition: all 0.3s ease;
        }

        .gallery-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 192, 102, 0.2);
        }

        .gallery-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .gallery-card:hover img {
          transform: scale(1.05);
        }

        .gallery-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
          padding: 40px 20px 20px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .gallery-card:hover .gallery-overlay {
          opacity: 1;
        }

        .gallery-overlay h3 {
          color: #fff;
          font-size: 1.4rem;
          font-weight: 500;
          margin: 0;
          text-align: center;
        }

        .gallery-swiper .swiper-pagination {
          position: relative;
          margin-top: 30px;
        }

        .gallery-swiper .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.3);
          opacity: 1;
          transition: all 0.3s ease;
        }

        .gallery-swiper .swiper-pagination-bullet-active {
          background: #00C066;
          transform: scale(1.2);
        }

        .gallery-swiper .swiper-slide-shadow-left,
        .gallery-swiper .swiper-slide-shadow-right {
          background-image: linear-gradient(to left, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0));
          border-radius: 12px;
        }

        @media (max-width: 768px) {
          .gallery-header h2 {
            font-size: 2rem;
          }

          .gallery-header p {
            font-size: 1rem;
          }

          .gallery-swiper .swiper-slide {
            width: 280px;
            height: 380px;
          }

          .gallery-overlay h3 {
            font-size: 1.1rem;
          }
        }

        @media (max-width: 480px) {
          .gallery-swiper .swiper-slide {
            width: 250px;
            height: 340px;
          }
        }
      `}</style>
    </section>
  );
};

export default Gallary;
