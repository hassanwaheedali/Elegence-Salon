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
                className="relative min-h-fit overflow-hidden bg-obsidian py-6 md:py-0"
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

                {/* Cinematic Gradient Overlay — full coverage on mobile, left-heavy on desktop */}
                <div className="absolute inset-0 z-1 bg-obsidian/80 sm:bg-transparent" style={{
                    background: 'linear-gradient(105deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.85) 35%, rgba(5,5,5,0.4) 65%, rgba(5,5,5,0.2) 100%)'
                }}></div>

                {/* ── Hero Content Grid ── */}
                <div className="relative z-10 container mx-auto px-4 sm:pl-6 lg:pl-10 pt-24 pb-0">
                    <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-4 sm:gap-6 lg:gap-0 min-h-0">

                        {/* ── Left Content — Bold Masculine Typography ── */}
                        <div className="w-full lg:w-[50%] flex flex-col items-center lg:items-start pt-4 lg:pt-16 xl:pt-20 z-10">

                            {/* Tagline — horizontal line + text */}
                            <div data-hero-tagline className="flex items-center gap-4 mb-6 sm:mb-8 lg:mb-10">
                                <div className="w-8 sm:w-12 hidden md:flex h-px bg-champagne/50"></div>
                                <p className="font-sans text-champagne/80 text-[8px] sm:text-[10px] md:text-xs tracking-[0.4em] sm:tracking-[0.5em] uppercase font-semibold">
                                    Est. 2011 — Gentlemen's Grooming
                                </p>
                            </div>

                            {/* Main Heading — Bold, aggressive spacing */}
                            <div data-hero-heading className="heading-text text-center lg:text-left mb-4">
                                {/* Line 1 */}
                                <h1 className="font-serif font-bold text-champagne text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl leading-[1.1] uppercase">
                                    The Art of
                                </h1>

                                {/* Line 2: Massive, dominant */}
                                <h2 className="font-sans font-black text-white text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[6rem] 2xl:text-[7rem] uppercase leading-[0.9] -tracking-[0.02em] my-2 sm:my-3 md:my-4">
                                    Masculine
                                </h2>

                                {/* Line 3 */}
                                <h3 className="font-serif font-bold text-champagne text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl leading-[1.1]  uppercase">
                                    Grooming
                                </h3>
                            </div>

                            {/* Description */}
                            <p
                                data-hero-description
                                className="font-sans font-light text-white/50 text-xs sm:text-sm md:text-base max-w-sm leading-relaxed tracking-wide text-center lg:text-left mb-6 sm:mb-8 lg:mb-10 px-2 sm:px-0"
                            >
                                Where precision meets sophistication. Traditional craft, modern edge.
                            </p>

                            {/* CTA Row */}
                            <div data-hero-cta className="flex flex-row items-center gap-4 sm:gap-6 mb-12">
                                <a href="#appointment">
                                    <div data-magnetic className="group relative">
                                        <button className="relative px-7 py-3 sm:px-10 sm:py-4 md:px-12 md:py-5 border border-champagne/60 bg-transparent text-champagne font-sans font-black text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-all duration-500 ease-luxury hover:bg-champagne hover:text-white hover:border-champagne overflow-hidden">
                                            <span data-magnetic-text className="relative z-10 inline-flex items-center gap-2 sm:gap-3">
                                                Book Now
                                                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 ease-luxury group-hover:translate-x-1" strokeWidth={2} />
                                            </span>
                                        </button>
                                    </div>
                                </a>

                                <a href="#services" className="group inline-flex items-center gap-2 text-white/40 hover:text-champagne font-sans font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] transition-colors duration-500 ease-luxury">
                                    Services
                                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-500 ease-luxury group-hover:translate-x-1.5" strokeWidth={2} />
                                </a>
                            </div>
                        </div>

                        {/* ── Right Visual — Large Editorial Image ── */}
                        <div className="w-full lg:w-[50%] relative hidden md:flex justify-center lg:justify-end items-end self-end">
                            <div
                                data-hero-image
                                data-scroll
                                data-scroll-speed="0.5"
                                data-parallax
                                className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-xl"
                            >
                                {/* Image with soft top clip */}
                                <div className="overflow-hidden rounded-t-3xl">
                                    <img
                                        src={barberImg}
                                        alt="Professional Barber"
                                        className="w-full h-auto object-contain transition-transform duration-1200 ease-luxury hover:scale-[1.03]"
                                    />
                                </div>

                                {/* Glassmorphism floating badge */}
                                <div
                                    data-hero-badge
                                    className="absolute bottom-6 -left-6 lg:-left-14 backdrop-blur-xl bg-obsidian/40 border border-champagne/15 rounded-lg px-5 py-3 shadow-2xl"
                                >
                                    <p className="font-sans text-champagne text-xl font-black leading-tight">15+</p>
                                    <p className="font-sans text-white/40 text-[8px] uppercase tracking-[0.3em] font-semibold">Years of Craft</p>
                                </div>

                                {/* Accent line */}
                                <div className="absolute top-12 -right-4 w-px h-20 bg-linear-to-b from-champagne/30 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Stats Strip — Aligned with hero container ── */}
                <div className="relative z-10 bg-obsidian-card/70 md:bg-obsidian-card">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                        <div className="grid grid-cols-4">
                            {[
                                { value: '15+', label: 'Years Experience' },
                                { value: '5K+', label: 'Gentlemen Served' },
                                { value: '100+', label: '5-Star Reviews' },
                                { value: '10', label: 'Expert Stylists' }
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    data-stats-item
                                    className="flex flex-col sm:flex-row items-center sm:items-center px-4 sm:px-2 lg:px-8 py-6 sm:py-8 gap-2 sm:gap-4 text-center sm:text-left"
                                >
                                    <span className="font-sans text-champagne text-xl sm:text-2xl lg:text-3xl font-black leading-none">{stat.value}</span>
                                    <span className="font-sans text-white/30 text-[8px] sm:text-[9px] lg:text-[11px] uppercase tracking-widest sm:tracking-[0.2em] mt-1 sm:mt-0 font-semibold">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ ABOUT ═══════════════════════ */}
            <section className='about bg-obsidian-card text-white' id='about'>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-10 md:pt-26 pb-8 px-4 md:px-6 lg:px-0 gap-8 md:gap-12">
                    {/* left image - responsive sizing */}
                    <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end">
                        <img src={About} alt="About Us" className="w-full max-w-sm md:max-w-xl h-auto object-contain" />
                    </div>
                    {/* right content - responsive sizing */}
                    <div className="w-full md:w-1/2 flex flex-col justify-start md:items-start text-center md:text-left px-4 md:px-0">
                        <div className="f1-head">
                            <h2 className="font-serif text-4xl lg:text-6xl text-gray-300 uppercase font-bold">WE ARE <span className="text-white font-bold uppercase font-sans">Elegance</span></h2>
                        </div>
                        <div className="f2-head mt-2">
                            <h2 className='font-serif text-4xl lg:text-6xl font-bold text-champagne tracking-wide'>THE BARBER SHOP</h2>
                        </div>
                        <div className="description space-y-4 mt-8 md:mt-6">
                            <div className="f-para1">
                                <p className="font-serif font-light text-champagne-muted text-sm md:text-base lg:text-xl leading-relaxed tracking-wide">
                                    Elegance have been at the forefront of mens grooming, and have set the agenda for style-conscious gentleman in Karachi. Our focus on empowering gentleman to look and feel fantastic every day.
                                </p>
                            </div>
                            <hr className='border-gray-800' />
                            <div className="f-para1">
                                <p className="font-sans font-light text-champagne-muted text-sm md:text-base lg:text-lg leading-relaxed tracking-wide">
                                    Elegance combines the comfort behind traditional with the modern conveniences of a full service salon.
                                </p>
                            </div>
                        </div>
                        <div className="icons mt-14 md:mt-12 flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 md:gap-8 lg:gap-28">
                            <div className="f1-icon flex flex-col justify-center items-center">
                                <i className="fas fa-cut text-champagne text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mr-2"></i>
                                <span className="font-sans text-champagne-muted text-xs sm:text-xs md:text-sm tracking-[0.2em] mt-2 sm:mt-3 uppercase">Haircut</span>
                            </div>
                            <div className="f2-icon flex flex-col justify-center items-center">
                                <i className="fas fa-cut text-champagne text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mr-2"></i>
                                <span className="font-sans text-champagne-muted text-xs sm:text-xs md:text-sm tracking-[0.2em] mt-2 sm:mt-3 uppercase">Shaving</span>
                            </div>
                            <div className="f3-icon flex flex-col justify-center items-center">
                                <i className="fas fa-spa text-champagne text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mr-2"></i>
                                <span className="font-sans text-champagne-muted text-xs sm:text-xs md:text-sm tracking-[0.2em] mt-2 sm:mt-3 uppercase">Facials</span>
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
                className="service-section bg-obsidian-card text-white py-16 md:py-28 relative"
                id='services'
            >
                <div className='mx-auto px-2 lg:px-16 max-w-11/12'>
                    {/* Section Header — Editorial type pairing */}
                    <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-end mb-12 lg:mb-24 gap-6">
                        <div className="text-center md:text-left">
                            <span className="font-sans text-champagne/70 tracking-[0.5em] text-[10px] sm:text-xs uppercase mb-3 block">Our Menu</span>
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none font-sans">
                                Curated{' '}
                                <span className='font-serif font-black text-champagne normal-case tracking-wide'>Services</span>
                            </h2>
                        </div>
                        <p className="font-sans font-light text-champagne-muted max-w-sm text-right hidden md:block text-sm tracking-wide leading-relaxed">
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
            <section className="price-section bg-obsidian-card text-white py-10 md:pt-4 md:py-24">
                <div className='mx-auto flex flex-col'>
                    {/* Section Header — Editorial type pairing (matches Services section) */}
                    <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-end mb-18 gap-6 px-4 md:px-6 lg:px-16 max-w-11/12 mx-auto w-full">
                        <div className="text-center md:text-left">
                            <span className="font-sans text-champagne/70 tracking-[0.5em] text-[9px] sm:text-xs uppercase mb-3 block">Our Rates</span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none font-sans">
                                Price{' '}
                                <span className='font-serif tracking-wide uppercase font-black text-champagne '>List</span>
                            </h2>
                        </div>
                        <p className="font-sans font-light text-champagne-muted max-w-sm text-right hidden md:block text-sm tracking-wide leading-relaxed">
                            Transparent pricing for every service. Premium quality at fair value.
                        </p>
                    </div>

                    <PriceCard />
                </div>
            </section>

            {/* ═══════════════════════ APPOINTMENT ═══════════════════════ */}
            <section className="appoinment-section bg-obsidian-card text-white my-0 md:my-0" id='appointment'>
                <div className='pb-8 mx-auto flex flex-col gap-2'>
                    <div className="heading w-full text-center text-3xl lg:text-5xl font-black uppercase">
                        <h1 className='text-white font-serif'>Make</h1>
                        <h1 className='text-champagne font-sans font-black normal-case text-3xl lg:text-5xl'>An Appointment</h1>
                        <hr className='max-w-115 mx-auto border-obsidian-elevated border mt-5' />
                    </div>
                    <div className='mx-auto max-w-7xl w-full px-8 md:px-6 lg:px-8 py-4 md:py-12 mb-8'>
                        <AppointmentForm />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ BRANDS ═══════════════════════ */}
            <section className="brand-images bg-obsidian-card overflow-hidden pt-4 pb-16">
                {/* Section Title */}
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-wide mb-2 font-serif">
                        Trusted <span className="font-sans font-black text-champagne normal-case">Brands</span>
                    </h2>
                    <p className="font-sans font-light text-champagne-muted text-sm tracking-wide">Premium products for exceptional results</p>
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
                        <h1 className='text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase font-serif'>Customer <span className='font-sans font-black text-champagne normal-case'>Reviews</span></h1>
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
