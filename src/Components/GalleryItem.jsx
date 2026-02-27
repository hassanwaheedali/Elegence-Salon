import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import galleryFallback from '../assets/gallery/gallery-fallback.webp';

function GalleryItem({ img, title, barber, category }) {
    const itemRef = useRef(null);
    const imageRef = useRef(null);
    const filterRef = useRef(null);
    const labelRef = useRef(null);

    useGSAP(() => {
        // We only want the complex liquid distortion effect on hover-capable desktop devices
        // This preserves battery and performance on touch devices
        const mm = gsap.matchMedia();

        mm.add("(hover: hover) and (pointer: fine)", () => {
            const tl = gsap.timeline({ paused: true });

            // 1. Subtle image scale
            tl.to(imageRef.current, {
                scale: 1.1,
                duration: 0.8,
                ease: "power3.out"
            }, 0);

            // 2. Liquid Refraction Ripple (SVG Filter)
            // We ping-pong the scale of the displacement map to create a ripple wave
            tl.to(filterRef.current, {
                attr: { scale: 50 }, // Base distortion intensity
                duration: 0.3,
                ease: "power2.in"
            }, 0)
                .to(filterRef.current, {
                    attr: { scale: 0 }, // Settle back to clear
                    duration: 0.5,
                    ease: "power2.out"
                }, 0.3);

            // 3. Editorial Metadata Label Reveal
            tl.fromTo(labelRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
                0.2 // Slightly delayed
            );

            // Bind Hover Events
            const handleMouseEnter = () => tl.play();
            const handleMouseLeave = () => tl.reverse();

            const el = itemRef.current;
            if (el) {
                el.addEventListener('mouseenter', handleMouseEnter);
                el.addEventListener('mouseleave', handleMouseLeave);
            }

            return () => {
                if (el) {
                    el.removeEventListener('mouseenter', handleMouseEnter);
                    el.removeEventListener('mouseleave', handleMouseLeave);
                }
            };
        });
    }, { scope: itemRef }); // Scope GSAP to this specific component instance for safe cleanup

    // Create a unique ID for the SVG filter so multiple instances don't clash
    const filterId = `liquid-filter-${title.replace(/\s+/g, '-').toLowerCase()}`;

    return (
        <div
            ref={itemRef}
            className="gallery-reveal-item relative overflow-hidden group w-full h-full aspect-square cursor-pointer"
            style={{ willChange: "clip-path, transform" }} // GPU Hint for upcoming ScrollTrigger
        >
            {/* SVG Filter Definition for Liquid Refraction */}
            <svg width="0" height="0" className="absolute pointer-events-none">
                <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
                    {/* Fractal noise generates organic chaotic maps */}
                    <feTurbulence type="fractalNoise" baseFrequency="0.02 0.04" numOctaves="3" result="noise" />
                    {/* Displacement uses the noise map to warp the image pixels */}
                    <feDisplacementMap ref={filterRef} in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </svg>

            {/* Base Image */}
            <img
                ref={imageRef}
                src={img}
                alt={`${title} by ${barber}`}
                className="w-full h-full object-cover origin-center"
                style={{ filter: `url(#${filterId})` }}
                onError={(e) => {
                    e.target.src = galleryFallback;
                }}
            />

            {/* Touch Device Fallback Hover State (CSS purely) */}
            <div className="absolute inset-0 bg-obsidian/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-luxury md:hidden"></div>

            {/* Editorial Metadata Label */}
            <div
                ref={labelRef}
                className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 backdrop-blur-md bg-obsidian/80 border border-white/10 p-4 md:p-5 opacity-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 md:transition-none"
            >
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-serif italic text-white text-lg md:text-xl leading-tight">{title}</h4>
                    <span className="font-sans text-champagne text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold shrink-0 ml-2">{category}</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                    <div className="w-4 h-px bg-champagne/40"></div>
                    <p className="font-sans font-light text-white/60 text-xs tracking-wider uppercase">{barber}</p>
                </div>
            </div>
        </div>
    );
}

export default GalleryItem;
