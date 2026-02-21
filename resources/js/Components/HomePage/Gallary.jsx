import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Gallary = ({ photos = [] }) => {
    const containerRef = useRef(null);
    const spiralRef = useRef(null);
    const itemsRef = useRef([]);

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
        gsap.to(spiralRef.current, {
            rotateY: 360, // One full rotation
            y: -400,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5,
            }
        });

        // Hover Effect using GSAP
        itemsRef.current.forEach((item) => {
            if (!item) return;

            const tl = gsap.timeline({ paused: true });
            tl.to(item, {
                scale: 1.15,
                z: 150, // More focus zoom
                duration: 0.4,
                ease: "power3.out",
                transformOrigin: "center center"
            });

            item.addEventListener('mouseenter', () => {
                tl.play();
                gsap.to(itemsRef.current.filter(i => i && i !== item), {
                    opacity: 0.2,
                    filter: "blur(8px)",
                    duration: 0.4
                });
            });

            item.addEventListener('mouseleave', () => {
                tl.reverse();
                gsap.to(itemsRef.current, {
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 0.4
                });
            });
        });

    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            className="relative w-full h-[300vh] overflow-hidden pt-32" style={{ backgroundColor: '#111117' }}
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
                            // Math for a dense ribbon: adjusted to prevent overlap
                            const rotationStep = 32;
                            const rotation = index * rotationStep;
                            const verticalStep = 60;
                            const verticalTranslation = index * verticalStep - (displayPhotos.length * verticalStep / 2);
                            const depth = 400; // Reduced Radius

                            return (
                                <div
                                    key={photo.id}
                                    ref={el => itemsRef.current[index] = el}
                                    className="absolute w-[220px] h-[300px] -left-[110px] -top-[150px] overflow-hidden rounded-sm shadow-2xl transition-all duration-300 group cursor-pointer"
                                    style={{
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
