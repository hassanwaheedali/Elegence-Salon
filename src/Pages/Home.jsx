import { useEffect, useRef } from 'react'
import {
    Scissors,
    Feather, // For Shaves (Smooth)
    Droplets, // For Facials (Water/Products)
    Sparkles, // For Beard Trim (Clean/Sharp)
    Crown, // For Hair Styling (Premium)
    Palette, // For Hair Color
    ArrowRight
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════
   ASSET_ROADMAP
   ─────────────────────────────────────────────────────────
   The following images are temporary placeholders.
   Replace with high-resolution .webp assets when available:

   Hero:
     Landing.webp  → hero-visual.webp   (cinematic wide hero bg, 2560×1440)
     barber.webp   → hero-portrait.webp (editorial barber portrait, 1200×1600)

   Services (editorial macro photography):
     Unsplash URL #1 → service-macro-1.webp  (Classic Haircut close-up)
     Unsplash URL #2 → service-macro-2.webp  (Straight razor shave detail)
     Unsplash URL #3 → service-macro-3.webp  (Facial treatment close-up)
     Unsplash URL #4 → service-macro-4.webp  (Beard sculpting detail)
     Unsplash URL #5 → service-macro-5.webp  (Styling product application)
     Unsplash URL #6 → service-macro-6.webp  (Hair coloring process)

   About:
     About.webp    → about-editorial.webp (workspace editorial shot)

   To swap: update the import path below. No component changes needed.
   ═══════════════════════════════════════════════════════════ */

import barberImg from '../assets/barber.webp'
import Landing from '../assets/Landing.webp'
import About from '../assets/About.webp'
import ServiceCard from '../Components/ServiceCard.jsx'
import PriceCard from '../Components/PriceCard.jsx'
import AppointmentForm from '../Components/AppointmentForm.jsx'
import CustomerReview from '../Components/CustomerReview.jsx'
import { customerReviews } from '../data/reviews.js'
import { sampleImages } from '../data/sample-images.js'
import BrandCarousel from '../Components/BrandCarousel.jsx'
import Header from '../Components/Header.jsx'

function Home() {
    const heroRef = useRef(null)
    /* GSAP: useGSAP(() => {
       const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
       tl.from('[data-hero-tagline]', { y: 20, opacity: 0, duration: 0.8 })
         .from('[data-hero-heading] > *', { y: 60, opacity: 0, duration: 1.2, stagger: 0.15 }, '-=0.4')
         .from('[data-hero-description]', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6')
         .from('[data-hero-cta]', { y: 20, opacity: 0, duration: 0.8 }, '-=0.4')
         .from('[data-hero-image]', { scale: 1.1, opacity: 0, duration: 1.4 }, 0)
         .from('[data-hero-badge]', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
         .from('[data-stats-item]', { y: 30, opacity: 0, stagger: 0.1, duration: 0.6 }, '-=0.4')
    }, { scope: heroRef }) */

    const servicesData = [
        {
            icon: <Scissors size={24} strokeWidth={1} />,
            title: "Classic Haircut",
            description: "Our stylist can recommend what will work excellent for your hair type and face shape.",
            price: "$30.00",
            image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop"
        },
        {
            icon: <Feather size={24} strokeWidth={1} />,
            title: "Shaves",
            description: "Special stylists for men who just want their shave done with precision and comfort.",
            price: "$20.00",
            image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop"
        },
        {
            icon: <Droplets size={24} strokeWidth={1} />,
            title: "Facials & Wash",
            description: "The right hair and skincare treatment with high quality products.",
            price: "$30.00",
            image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop"
        },
        {
            icon: <Sparkles size={24} strokeWidth={1} />,
            title: "Beard Trim",
            description: "Expert beard sculpting and conditioning to keep your facial hair looking sharp.",
            price: "$15.00",
            image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2070&auto=format&fit=crop"
        },
        {
            icon: <Crown size={24} strokeWidth={1} />,
            title: "Hair Styling",
            description: "Top-rated salon with talented stylists for the best in customer service.",
            price: "$60.00",
            image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=2074&auto=format&fit=crop"
        },
        {
            icon: <Palette size={24} strokeWidth={1} />,
            title: "Hair Color",
            description: "Want to spice up your look with a new color? Allow us to customize!",
            price: "$60.00",
            image: "https://images.unsplash.com/photo-1662125502527-bb106378d560?q=80&w=687&auto=format&fit=crop"
        }
    ]

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <>
            <Header bgImage="bg-transparent" />

            {/* ═══════════════════════════════════════════════════════
                HERO — Cinematic Editorial Layout
                data-scroll-section: Lenis integration point
                ref={heroRef}: GSAP scope container
                ═══════════════════════════════════════════════════════ */}
            <section
                ref={heroRef}
                data-scroll-section
                className="relative min-h-screen overflow-hidden bg-obsidian"
                id="main-hero"
            >
                {/* Background Image Layer */}
                {/* SWAP: Replace Landing with hero-visual.webp when available */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url(${Landing})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                ></div>

                {/* Cinematic Gradient Overlay — heavier on left for text contrast */}
                <div className="absolute inset-0 z-[1]" style={{
                    background: 'linear-gradient(105deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.75) 40%, rgba(5,5,5,0.3) 70%, rgba(5,5,5,0.15) 100%)'
                }}></div>

                {/* Canvas integration point for future scrub engine */}
                {/* <canvas data-hero-canvas className="absolute inset-0 z-[2] pointer-events-none" /> */}

                {/* ── Hero Content Grid: Asymmetrical 55/45 split ── */}
                <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-28 md:pt-36 pb-12 md:pb-0">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-4 min-h-[calc(100vh-180px)]">

                        {/* ── Left Content — Editorial Typography ── */}
                        <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start pt-4 lg:pt-16 xl:pt-24 z-10">

                            {/* Tagline */}
                            <p
                                data-hero-tagline
                                className="font-sans text-champagne/70 text-[10px] sm:text-xs tracking-[0.5em] uppercase mb-8 lg:mb-10"
                            >
                                Est. 2011 — Gentlemen's Grooming
                            </p>

                            {/* Main Heading — High-contrast editorial type pairing */}
                            <div data-hero-heading className="heading-text text-center lg:text-left space-y-1 md:space-y-2 mb-8 lg:mb-10">
                                {/* Line 1: Thin italic serif */}
                                <h1 className="font-serif italic font-light text-champagne text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl leading-none tracking-wide">
                                    The Art of
                                </h1>

                                {/* Line 2: Heavy uppercase sans — widest element */}
                                <h2 className="font-sans font-black text-white text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-[5.5rem] 2xl:text-[6.5rem] uppercase leading-[0.9] tracking-tight">
                                    Masculine
                                </h2>

                                {/* Line 3: Thin italic serif (mirrors line 1) */}
                                <h3 className="font-serif italic font-light text-champagne text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl leading-none tracking-wide">
                                    Grooming
                                </h3>
                            </div>

                            {/* Description */}
                            <p
                                data-hero-description
                                className="font-sans font-light text-gray-400 text-sm sm:text-base md:text-lg max-w-md leading-relaxed tracking-wider text-center lg:text-left mb-10 lg:mb-12 px-4 lg:px-0"
                            >
                                Experience the art of traditional grooming with modern techniques. Where style meets sophistication.
                            </p>

                            {/* CTA — "Book Ritual" Magnetic Button */}
                            {/* GSAP MAGNETIC: Wrap data-magnetic container with magnetic physics
                                gsap.to('[data-magnetic-text]', {
                                  x: pointer.x * 0.3, y: pointer.y * 0.3,
                                  ease: 'power3.out', duration: 0.6
                                }) */}
                            <div data-hero-cta className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                                <a href="#appointment">
                                    <div data-magnetic className="group relative">
                                        <button className="relative px-10 py-4 sm:px-12 sm:py-5 border border-champagne/60 bg-transparent text-champagne font-sans font-semibold text-xs sm:text-sm uppercase tracking-[0.3em] transition-all duration-700 ease-luxury hover:bg-champagne hover:text-obsidian hover:border-champagne overflow-hidden">
                                            <span data-magnetic-text className="relative z-10 inline-flex items-center gap-3">
                                                Book Ritual
                                                <ArrowRight className="w-4 h-4 transition-transform duration-500 ease-luxury group-hover:translate-x-1" strokeWidth={1} />
                                            </span>
                                        </button>
                                    </div>
                                </a>

                                <a href="#services" className="group inline-flex items-center gap-2 text-gray-500 hover:text-champagne font-sans text-xs uppercase tracking-[0.25em] transition-colors duration-500 ease-luxury">
                                    Explore Services
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-500 ease-luxury group-hover:translate-x-1.5" strokeWidth={1} />
                                </a>
                            </div>
                        </div>

                        {/* ── Right Visual — Asymmetric Editorial Image ── */}
                        <div className="w-full lg:w-[45%] relative hidden md:flex justify-center lg:justify-end items-end self-end">
                            {/* SWAP: Replace barberImg with hero-portrait.webp when available */}
                            <div
                                data-hero-image
                                data-scroll
                                data-scroll-speed="0.5"
                                data-parallax
                                className="relative w-full max-w-sm lg:max-w-md xl:max-w-lg"
                            >
                                {/* Editorial image with soft clip */}
                                <div className="overflow-hidden rounded-t-[2rem] rounded-b-none">
                                    <img
                                        src={barberImg}
                                        alt="Professional Barber"
                                        className="w-full h-auto object-contain transition-transform duration-[1200ms] ease-luxury hover:scale-[1.03]"
                                    />
                                </div>

                                {/* Glassmorphism floating badge */}
                                <div
                                    data-hero-badge
                                    className="absolute -bottom-4 -left-4 lg:-left-8 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl px-6 py-4 shadow-2xl"
                                >
                                    <p className="font-serif text-champagne text-2xl font-semibold leading-tight">15+</p>
                                    <p className="font-sans text-gray-400 text-[10px] uppercase tracking-[0.3em]">Years of Craft</p>
                                </div>

                                {/* Subtle champagne accent line */}
                                <div className="absolute top-8 -right-3 w-px h-24 bg-linear-to-b from-champagne/40 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Stats Strip — Full-width below hero content ── */}
                <div className="relative z-10 border-t border-champagne/10 bg-obsidian/60 backdrop-blur-sm">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="flex flex-wrap justify-center lg:justify-start divide-x divide-champagne/10">
                            {[
                                { value: '15+', label: 'Years Experience' },
                                { value: '5,000+', label: 'Gentlemen Served' },
                                { value: '4.9', label: 'Client Rating' }
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    data-stats-item
                                    className="flex items-center gap-4 px-6 lg:px-10 py-6 lg:py-8"
                                >
                                    <span className="font-serif text-champagne text-3xl lg:text-4xl font-semibold leading-none">{stat.value}</span>
                                    <span className="font-sans text-gray-500 text-[10px] lg:text-xs uppercase tracking-[0.25em]">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ ABOUT ═══════════════════════ */}
            <section className='about bg-obsidian-card text-white' id='about'>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-20 pb-8 px-4 md:px-6 lg:px-0 gap-8 md:gap-12">
                    {/* left image - responsive sizing */}
                    <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end">
                        <img src={About} alt="About Us" className="w-full max-w-sm md:max-w-xl h-auto object-contain" />
                    </div>
                    {/* right content - responsive sizing */}
                    <div className="w-full md:w-1/2 flex flex-col justify-start md:items-start text-center md:text-left px-4 md:px-0">
                        <div className="f1-head">
                            <h2 className="font-serif text-4xl lg:text-6xl text-gray-300">WE ARE <span className="text-white font-bold uppercase">Elegance</span></h2>
                        </div>
                        <div className="f2-head mt-2">
                            <h2 className='font-serif text-4xl lg:text-6xl font-bold text-champagne'>THE BARBER SHOP</h2>
                        </div>
                        <div className="description space-y-4 mt-8 md:mt-6">
                            <div className="f-para1">
                                <p className="font-sans font-light text-gray-400 text-sm md:text-base lg:text-lg leading-relaxed tracking-wide">
                                    Elegance have been at the forefront of mens grooming, and have set the agenda for style-conscious gentleman in Karachi. Our focus on empowering gentleman to look and feel fantastic every day.
                                </p>
                            </div>
                            <hr className='border-gray-800' />
                            <div className="f-para1">
                                <p className="font-sans font-light text-gray-400 text-sm md:text-base lg:text-lg leading-relaxed tracking-wide">
                                    Elegance combines the comfort behind traditional with the modern conveniences of a full service salon.
                                </p>
                            </div>
                        </div>
                        <div className="icons mt-14 md:mt-12 flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 md:gap-8 lg:gap-28">
                            <div className="f1-icon flex flex-col justify-center items-center">
                                <i className="fas fa-cut text-champagne text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mr-2"></i>
                                <span className="font-sans text-gray-400 text-xs sm:text-xs md:text-sm tracking-[0.2em] mt-2 sm:mt-3 uppercase">Haircut</span>
                            </div>
                            <div className="f2-icon flex flex-col justify-center items-center">
                                <i className="fas fa-cut text-champagne text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mr-2"></i>
                                <span className="font-sans text-gray-400 text-xs sm:text-xs md:text-sm tracking-[0.2em] mt-2 sm:mt-3 uppercase">Shaving</span>
                            </div>
                            <div className="f3-icon flex flex-col justify-center items-center">
                                <i className="fas fa-spa text-champagne text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mr-2"></i>
                                <span className="font-sans text-gray-400 text-xs sm:text-xs md:text-sm tracking-[0.2em] mt-2 sm:mt-3 uppercase">Facials</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ═══════════════════════ SERVICES — Editorial Stagger ═══════════════════════ */}
            {/* GSAP ScrollTrigger: gsap.utils.toArray('[data-service-card]').forEach((card, i) => {
                 ScrollTrigger.create({ trigger: card, start: 'top 85%',
                   onEnter: () => gsap.from(card, { y: 80, opacity: 0, duration: 1, delay: i * 0.1, ease: 'power4.out' })
                 })
               }) */}
            <section
                data-scroll-section
                className="service-section bg-obsidian-card text-white py-24 lg:py-32 relative"
                id='services'
            >
                <div className='mx-auto px-6 lg:px-16 max-w-7xl'>
                    {/* Section Header — Editorial type pairing */}
                    <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-end mb-16 lg:mb-24 gap-6">
                        <div className="text-center md:text-left">
                            <span className="font-sans text-champagne/70 tracking-[0.5em] text-[10px] sm:text-xs uppercase mb-3 block">Our Menu</span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none font-sans">
                                Curated{' '}
                                <span className='font-serif italic font-light text-champagne normal-case'>Services</span>
                            </h2>
                        </div>
                        <p className="font-sans font-light text-gray-500 max-w-sm text-right hidden md:block text-sm tracking-wide leading-relaxed">
                            Precision cuts, classic shaves, and premium grooming services tailored for the modern gentleman.
                        </p>
                    </div>

                    {/* Editorial Staggered Layout */}
                    <div className="flex flex-col gap-8 lg:gap-6">
                        {/* Row 1: Full-width feature card */}
                        <div data-service-card data-scroll data-scroll-speed="0.1" className="w-full">
                            <ServiceCard {...servicesData[0]} index={0} variant="featured" />
                        </div>

                        {/* Row 2: Two cards, offset */}
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-6">
                            <div data-service-card data-scroll data-scroll-speed="0.15" className="w-full lg:w-[55%]">
                                <ServiceCard {...servicesData[1]} index={1} />
                            </div>
                            <div data-service-card data-scroll data-scroll-speed="0.05" className="w-full lg:w-[45%] lg:mt-12">
                                <ServiceCard {...servicesData[2]} index={2} />
                            </div>
                        </div>

                        {/* Row 3: Two cards, reverse offset */}
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-6">
                            <div data-service-card data-scroll data-scroll-speed="0.05" className="w-full lg:w-[45%] lg:mt-8">
                                <ServiceCard {...servicesData[3]} index={3} />
                            </div>
                            <div data-service-card data-scroll data-scroll-speed="0.15" className="w-full lg:w-[55%]">
                                <ServiceCard {...servicesData[4]} index={4} />
                            </div>
                        </div>

                        {/* Row 4: Full-width feature card */}
                        <div data-service-card data-scroll data-scroll-speed="0.1" className="w-full">
                            <ServiceCard {...servicesData[5]} index={5} variant="featured" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ PRICE LIST ═══════════════════════ */}
            <section className="price-section bg-obsidian-card text-white">
                <div className='pb-8 mx-auto flex flex-col gap-8 lg:gap-12'>
                    <div className="heading w-full mt-8 mb-2 md:mb-8 text-center">
                        <h1 className="text-5xl font-serif font-bold text-champagne">PRICE LIST</h1>
                    </div>
                    <PriceCard />
                </div>
            </section>

            {/* ═══════════════════════ APPOINTMENT ═══════════════════════ */}
            <section className="appoinment-section bg-obsidian-card text-white" id='appointment'>
                <div className='pb-8 mx-auto flex flex-col gap-2'>
                    <div className="heading w-full text-center text-4xl lg:text-5xl font-black uppercase">
                        <h1 className='text-white font-sans'>Make</h1>
                        <h1 className='text-champagne font-serif italic font-semibold normal-case text-5xl lg:text-6xl'>An Appointment</h1>
                        <hr className='max-w-115 mx-auto border-obsidian-elevated border mt-5' />
                    </div>
                    <div className='mx-auto max-w-7xl w-full px-4 md:px-6 lg:px-8 py-4 md:py-12 mb-8'>
                        <AppointmentForm />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ BRANDS ═══════════════════════ */}
            <section className="brand-images bg-obsidian-card overflow-hidden pt-4 pb-16">
                {/* Section Title */}
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-wider mb-2 font-sans">
                        Trusted <span className="font-serif italic font-light text-champagne normal-case">Brands</span>
                    </h2>
                    <p className="font-sans font-light text-gray-500 text-sm tracking-wide">Premium products for exceptional results</p>
                </div>

                <BrandCarousel />

                {/* Bottom decoration line */}
                <div className="mt-8 flex justify-center">
                    <div className="w-32 h-px bg-linear-to-r from-transparent via-champagne/40 to-transparent"></div>
                </div>
            </section>

            {/* ═══════════════════════ CUSTOMER REVIEWS ═══════════════════════ */}
            <section className="customer-reviews-section bg-obsidian-card text-white pt-12">
                <div className='mx-auto flex flex-col gap-4 md:gap-6'>
                    <div className="heading w-full text-center">
                        <h1 className='text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase font-sans'>Customer <span className='font-serif italic font-light text-champagne normal-case'>Reviews</span></h1>
                        <hr className='max-w-xs sm:max-w-md md:max-w-lg mx-auto border-obsidian-elevated border mt-3 md:mt-5' />
                    </div>
                    <div className='mx-auto max-w-7xl w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 md:py-8 mb-4 md:mb-8'>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                            {customerReviews.map((review) => (
                                <div className="review-card bg-obsidian-surface p-4 md:p-6 rounded-lg hover:bg-obsidian-elevated transition-all duration-500 ease-luxury" key={review.id}>
                                    <CustomerReview name={review.name} image={review.img} review={review.review} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ SAMPLE GALLERY ═══════════════════════ */}
            <section className="sample-images bg-obsidian-card overflow-hidden">
                <div className="mx-auto px-4 sm:px-6 md:px-16 py-12 mb-6">
                    <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
                        {sampleImages.map((sample) => (
                            <div key={sample.id} className="sample-image-card overflow-hidden hover:scale-105 transition-transform duration-500 ease-luxury">
                                <img src={sample.img} alt={`Sample ${sample.id}`} className="w-full h-auto object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
export default Home
