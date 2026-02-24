import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Gallary = ({ photos = [] }) => {
    const containerRef = useRef(null);
    const spiralRef = useRef(null);
    const itemsRef = useRef([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Loading images from local public assets
    const localImages = [
        '/img/gallery/booth.jpg', '/img/gallery/commitee.jpg', '/img/gallery/fest 2.jpg', '/img/gallery/fest 3.jpg',
        '/img/gallery/fest 4.jpg', '/img/gallery/fest 6.jpg', '/img/gallery/fest.jpg', '/img/gallery/it 6.jpg',
        '/img/gallery/it fest 5.jpg', '/img/gallery/itfest 33.jpg', '/img/gallery/itfest 343.jpg', '/img/gallery/photo_1563171920366323.jpg',
        '/img/gallery/photo_1563172457032936.jpg', '/img/gallery/photo_1619957404687774.jpg', '/img/gallery/photo_1656855310997983.jpg',
        '/img/gallery/photo_1668235656526615.jpg', '/img/gallery/photo_1688388211178026.jpg', '/img/gallery/ucb.jpg'
    ];

    const displayPhotos = photos.length > 0 ? photos : localImages.map((url, i) => ({
        id: i,
        url: url
    }));

    useGSAP(() => {
        if (!spiralRef.current) return;

        // GSAP ScrollTrigger for 3D Rotation and subtle drifting
        const mainRotation = gsap.to(spiralRef.current, {
            rotateY: 720, // Reduced from 1080 to slow it down
            y: isMobile ? -600 : -800,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1, // Weighted catch-up for smooth motion during fast scrolls
                invalidateOnRefresh: true,
                overwrite: 'auto'
            }
        });

        // Use matchMedia to handle responsive hover logic
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            // Deskstop-only hover effects
            itemsRef.current.forEach((item) => {
                if (!item) return;

                const tl = gsap.timeline({ paused: true });
                tl.to(item, {
                    scale: 1.15,
                    z: 150,
                    duration: 0.4,
                    ease: "power3.out",
                    transformOrigin: "center center"
                });

                const onMouseEnter = () => {
                    // Disable hover zoom if we're actively scrolling to keep it smooth
                    if (ScrollTrigger.isScrolling()) return;

                    tl.play();
                    gsap.to(itemsRef.current.filter(i => i && i !== item), {
                        opacity: 0.2,
                        filter: "blur(8px)",
                        duration: 0.4
                    });
                };

                const onMouseLeave = () => {
                    tl.reverse();
                    gsap.to(itemsRef.current, {
                        opacity: 1,
                        filter: "blur(0px)",
                        duration: 0.4
                    });
                };

                item.addEventListener('mouseenter', onMouseEnter);
                item.addEventListener('mouseleave', onMouseLeave);

                return () => {
                    item.removeEventListener('mouseenter', onMouseEnter);
                    item.removeEventListener('mouseleave', onMouseLeave);
                };
            });
        });

    }, { scope: containerRef, dependencies: [isMobile] });

    return (
        <section
            ref={containerRef}
            className="relative w-full h-[300vh] overflow-hidden" style={{ backgroundColor: '#111117' }}
            id="gallery-section"
        >
            {/* Sticky Background Text - Signature Studio Dialect look */}
            <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden">
                <h2 className="text-white/[0.03] text-[25vw] font-black leading-[0.8] tracking-tighter uppercase whitespace-nowrap">
                    EXPERT DIGITAL
                </h2>
                <h2 className="text-white/[0.03] text-[25vw] font-black leading-[0.8] tracking-tighter uppercase whitespace-nowrap">
                    PRODUCTION
                </h2>
            </div>

            <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-visible z-10">
                {/* 3D Scene Root */}
                <div
                    className="relative w-0 h-0"
                    style={{ perspective: '1800px' }}
                >
                    {/* Ribbon Spiral Container */}
                    <div
                        ref={spiralRef}
                        className="relative w-0 h-0"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {displayPhotos.map((photo, index) => {
                            // Responsive constants
                            const rotationStep = isMobile ? 45 : 32;
                            const verticalStep = isMobile ? 50 : 60;
                            const depth = isMobile ? 250 : 400;
                            const imgWidth = isMobile ? 160 : 220;
                            const imgHeight = isMobile ? 220 : 300;

                            const rotation = index * rotationStep;
                            const verticalTranslation = index * verticalStep - (displayPhotos.length * verticalStep / 2);

                            return (
                                <div
                                    key={photo.id}
                                    ref={el => itemsRef.current[index] = el}
                                    className="absolute overflow-hidden rounded-sm shadow-2xl transition-all duration-300 group cursor-pointer"
                                    style={{
                                        width: `${imgWidth}px`,
                                        height: `${imgHeight}px`,
                                        left: `-${imgWidth / 2}px`,
                                        top: `-${imgHeight / 2}px`,
                                        transform: `rotateY(${rotation}deg) translateY(${verticalTranslation}px) translateZ(${depth}px)`,
                                        backfaceVisibility: 'visible',
                                        transformStyle: 'preserve-3d',
                                        transformOrigin: 'center center'
                                    }}
                                >
                                    <img
                                        src={photo.url}
                                        alt={`Gallery Image ${index + 1}`}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Subtle Gradient Overlays for Depth */}
            <div
                className="sticky top-0 inset-0 pointer-events-none z-20 h-screen w-full"
                style={{ background: 'linear-gradient(to bottom, #111117 0%, transparent 15%, transparent 85%, #111117 100%)', opacity: 0.4 }}
            />

            {/* Scroll Hint */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/10 font-mono text-[8px] uppercase tracking-[0.4em] z-30">

            </div>
        </section>
    );
};

export default Gallary;
