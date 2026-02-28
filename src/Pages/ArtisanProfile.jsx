import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStaff } from '../Context/StaffContext.jsx';
import { customerReviews } from '../data/reviews.js';
import Header from '../Components/Header.jsx';
import barberImg from '../assets/barber.webp';
import { useMagnetic } from '../hooks/useMagnetic.jsx';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Scissors,
    Feather,
    Droplets,
    Sparkles,
    Palette,
    Crown
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

function ArtisanProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getStaffById, staff } = useStaff();
    const profileRef = useRef(null);
    useMagnetic();

    const artisan = getStaffById(id);

    useEffect(() => {
        // Scroll to top automatically when navigating to the profile
        window.scrollTo(0, 0);
    }, []);

    // Redirect if not found
    useEffect(() => {
        if (staff.length > 0 && !artisan) {
            navigate('/', { replace: true });
        }
    }, [staff, artisan, navigate]);

    useGSAP(() => {
        if (!artisan) return;

        const tl = gsap.timeline();

        // Initial set
        gsap.set('.hero-reveal', { y: 30, opacity: 0 });
        gsap.set('.profile-reveal', { y: 30, opacity: 0 });
        gsap.set('.calendar-day', { y: 20, opacity: 0 });
        gsap.set('.magnetic-badge', { scale: 0.9, opacity: 0 });

        // Hero staggered entry
        tl.to('.hero-reveal', {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'luxury',
            delay: 0.1 // slight delay for layout transition
        });

        // Trigger for standard sections
        const sections = gsap.utils.toArray('.profile-section');
        sections.forEach(sec => {
            const reveals = sec.querySelectorAll('.profile-reveal');
            if (reveals.length > 0) {
                gsap.to(reveals, {
                    scrollTrigger: {
                        trigger: sec,
                        start: 'top 85%'
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'luxury'
                });
            }
        });

        // The Ritual - Calendar stagger
        gsap.to('.calendar-day', {
            scrollTrigger: {
                trigger: '.ritual-section',
                start: 'top 80%'
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'luxury'
        });

        // The Craft - Badge stagger
        gsap.to('.magnetic-badge', {
            scrollTrigger: {
                trigger: '.craft-section',
                start: 'top 85%'
            },
            scale: 1,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'back.out(1.5)' // Gives a slight pop effect
        });

    }, { scope: profileRef, dependencies: [artisan] });

    if (!artisan) return null;

    // Legacy: Filter reviews
    let artisanReviews = customerReviews.filter(review => {
        return artisan.specialties.some(spec => {
            const rNorm = review.service.toLowerCase();
            const sNorm = spec.toLowerCase();
            return rNorm.includes(sNorm) || sNorm.includes(rNorm);
        });
    });

    if (artisanReviews.length === 0) {
        artisanReviews = [
            {
                name: "Demo Client",
                service: artisan.specialties[0] || "Signature Service",
                review: "An absolute masterclass in grooming. I have never felt more confident walking out of a salon.",
                img: customerReviews[0]?.img || barberImg
            },
            {
                name: "Guest User",
                service: artisan.specialties[1] || "Complete Package",
                review: "Exceptional attention to detail and a truly relaxing experience from start to finish. Highly recommended.",
                img: customerReviews[1]?.img || barberImg
            }
        ];
    }

    // Days array
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div ref={profileRef} className="min-h-screen bg-obsidian text-white selection:bg-champagne selection:text-obsidian pb-12">
            <Header bgImage="bg-obsidian-card" />

            {/* 1. Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden px-4 sm:px-6 lg:px-12">
                <div className="container mx-auto max-w-6xl">
                    {/* Decorative Background Text */}
                    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none z-0 overflow-hidden">
                        <h2 className="about-bg-text font-serif text-[15vw] leading-none text-white/1 font-black uppercase whitespace-nowrap select-none">
                            Elegance
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        <div className="hero-reveal group relative aspect-3/4 max-w-md mx-auto lg:mx-0 w-full rounded-md overflow-hidden bg-obsidian-card shadow-lg transition-all duration-700">
                            <img src={artisan.avatar || barberImg} alt={artisan.name} className="w-full h-full object-cover grayscale opacity-90 transition-all duration-700 ease-luxury group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100" />
                            <div className="absolute inset-0 bg-linear-to-t from-[rgba(15,15,15,0.9)] via-[rgba(15,15,15,0.2)] to-transparent pointer-events-none"></div>
                            <div className="absolute bottom-6 left-6 right-6 transition-transform duration-700 ease-luxury group-hover:-translate-y-2">
                                <div className="backdrop-blur-md bg-obsidian/40 border border-champagne/20 p-4 rounded-sm shadow-xl group-hover:border-champagne/40 transition-colors duration-700">
                                    <p className="font-sans text-champagne text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold mb-1">Experience</p>
                                    <p className="font-serif text-2xl lg:text-3xl text-white">{artisan.experience || "7 Years"} of Mastery</p>
                                </div>
                            </div>
                        </div>


                        <div className="flex flex-col text-center lg:text-left">
                            <h2 className="hero-reveal font-sans text-champagne/70 tracking-[0.5em] text-[10px] sm:text-xs uppercase mb-4 block">
                                {artisan.role || "Master Artisan"}
                            </h2>
                            <h1 className="hero-reveal text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight leading-[0.9] font-sans mb-8">
                                {artisan.name.split(' ')[0]} <br />
                                <span className="font-serif text-champagne normal-case tracking-wide">
                                    {artisan.name.split(' ').slice(1).join(' ')}
                                </span>
                            </h1>
                            <p className="hero-reveal font-sans font-light text-champagne-muted text-base lg:text-lg max-w-xl leading-relaxed mx-auto lg:mx-0 border-l border-champagne/30 pl-4">
                                Master of precision and style. Elevating the art of grooming through meticulous attention to detail and a passion for classic techniques blended with modern flair.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. The Services Section */}
            <section className="profile-section craft-section bg-obsidian-card py-20 px-4 sm:px-6 lg:px-12 border-y border-white/5 shadow-2xl relative z-10">
                <div className="container mx-auto max-w-5xl text-center">
                    <h2 className="profile-reveal text-4xl md:text-5xl font-black text-white uppercase tracking-tight font-sans mb-12">
                        Expert <span className="font-serif text-champagne normal-case tracking-wide">Services</span>
                    </h2>

                    <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
                        {artisan.specialties.map((spec, i) => {
                            let Icon = Scissors;
                            const s = spec.toLowerCase();
                            if (s.includes('color') || s.includes('highlight') || s.includes('balayage')) Icon = Palette;
                            else if (s.includes('beard') || s.includes('trim')) Icon = Sparkles;
                            else if (s.includes('shav')) Icon = Feather;
                            else if (s.includes('facial') || s.includes('wash') || s.includes('makeup')) Icon = Droplets;
                            else if (s.includes('style') || s.includes('styling')) Icon = Crown;

                            return (
                                <div key={i} data-magnetic className="magnetic-badge group inline-block">
                                    <div className="backdrop-blur-md bg-obsidian border border-champagne/20 px-8 py-8 sm:px-12 sm:py-10 rounded-xl transition-all duration-500 ease-luxury group-hover:bg-champagne group-hover:border-champagne group-hover:shadow-[0_0_30px_rgba(255,138,0,0.2)] flex flex-col items-center justify-center gap-4 min-w-sm sm:min-w-45">
                                        <Icon className="w-10 h-10 text-champagne group-hover:text-obsidian transition-colors duration-500" strokeWidth={1} />
                                        <span data-magnetic-text className="font-sans font-bold text-xs sm:text-sm text-champagne uppercase tracking-[0.2em] group-hover:text-obsidian transition-colors duration-500 block text-center">
                                            {spec}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 3. The Ritual Section */}
            <section className="profile-section ritual-section bg-obsidian py-18 px-4 sm:px-6 lg:px-12 relative z-0">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="profile-reveal text-4xl md:text-5xl font-black text-white uppercase tracking-tight font-sans">
                            The <span className="font-serif text-champagne normal-case tracking-wide">Ritual</span>
                        </h2>
                        <p className="profile-reveal font-sans font-light text-champagne-muted mt-3 tracking-wide">Weekly Availability</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {days.map(day => {
                            const schedule = artisan.schedule[day.toLowerCase()];
                            const isWorking = schedule != null;

                            return (
                                <div key={day} className="calendar-day bg-obsidian-card border border-white/5 p-6 rounded-md hover:border-champagne/30 hover:bg-[#151515] transition-all duration-500 ease-luxury">
                                    <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/40 font-bold mb-4">{day}</p>
                                    {isWorking ? (
                                        <div className="flex items-end gap-2 text-champagne">
                                            <span className="font-serif text-2xl lg:text-3xl">{schedule.start}</span>
                                            <span className="font-sans text-sm pb-1 text-white/50 px-1">—</span>
                                            <span className="font-serif text-2xl lg:text-3xl">{schedule.end}</span>
                                        </div>
                                    ) : (
                                        <p className="font-serif text-2xl lg:text-3xl text-white/20 italic">Unavailable</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 4. Legacy Section */}
            {artisanReviews.length > 0 && (
                <section className="profile-section legacy-section bg-obsidian-card pt-20 pb-8 px-4 sm:px-6 lg:px-12 border-t border-white/5 shadow-2xl relative z-10">
                    <div className="container mx-auto max-w-7xl">
                        <div className="text-center mb-16">
                            <h2 className="profile-reveal text-3xl md:text-5xl font-black text-white uppercase tracking-tight font-sans">
                                The <span className="font-serif text-champagne normal-case tracking-wide">Legacy</span>
                            </h2>
                            <p className="profile-reveal font-sans font-light text-champagne-muted mt-4 tracking-wide">Client Testimonials</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                            {artisanReviews.map((review, i) => (
                                <div key={i} className="profile-reveal bg-obsidian p-8 rounded-md border border-white/5 hover:border-champagne/20 hover:-translate-y-1 transition-all duration-500 ease-luxury shadow-lg">
                                    <div className="flex items-center gap-5 mb-6">
                                        <img src={review.img} alt={review.name} className="w-16 h-16 rounded-full object-cover border border-champagne/30 grayscale filter" />
                                        <div>
                                            <h4 className="font-sans font-black text-sm text-white uppercase tracking-wider">{review.name}</h4>
                                            <p className="font-serif text-sm text-champagne italic">{review.service}</p>
                                        </div>
                                    </div>
                                    <p className="font-sans font-light text-white/70 leading-relaxed tracking-wide text-sm md:text-base">
                                        "{review.review}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

export default ArtisanProfile;
