import { useState, useEffect, useCallback, useMemo } from 'react'
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { services } from '../data/services'

/* ═══════════════════════════════════════════════════════════
   PRICE CARD — Premium Carousel
   Design system: Obsidian + Champagne (Elegance theme)
   ═══════════════════════════════════════════════════════════ */

/* ── Responsive breakpoint hook (replaces raw window.innerWidth in render) ── */
function useBreakpoint(breakpoint = 1024) {
    const [isAbove, setIsAbove] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth >= breakpoint : false
    )

    useEffect(() => {
        const mql = window.matchMedia(`(min-width: ${breakpoint}px)`)
        const handler = (e) => setIsAbove(e.matches)
        mql.addEventListener('change', handler)
        setIsAbove(mql.matches)
        return () => mql.removeEventListener('change', handler)
    }, [breakpoint])

    return isAbove
}

function PriceCard() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(1)
    const [isHovered, setIsHovered] = useState(false)
    const isDesktop = useBreakpoint(1024)
    const prefersReducedMotion = useReducedMotion()

    const priceCards = services

    /* ── Navigation handlers ── */
    const nextSlide = useCallback(() => {
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % priceCards.length)
    }, [priceCards.length])

    const prevSlide = useCallback(() => {
        setDirection(-1)
        setCurrentIndex((prev) => (prev - 1 + priceCards.length) % priceCards.length)
    }, [priceCards.length])

    /* ── Keyboard a11y ── */
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') prevSlide()
            else if (e.key === 'ArrowRight') nextSlide()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [nextSlide, prevSlide])

    /* ── Auto-play (pauses on hover or reduced-motion) ── */
    useEffect(() => {
        if (prefersReducedMotion || isHovered) return
        const timer = setInterval(nextSlide, 6000)
        return () => clearInterval(timer)
    }, [nextSlide, isHovered, prefersReducedMotion])

    /* ── Spring-physics slide variants ──
       Uses spring for organic, weighty movement; falls back
       to instant transitions when prefers-reduced-motion is on. */
    const slideVariants = useMemo(() => ({
        enter: (dir) => prefersReducedMotion
            ? { opacity: 1, x: 0 }
            : { opacity: 0, x: dir * 250 },
        center: prefersReducedMotion
            ? { opacity: 1, x: 0 }
            : { opacity: 1, x: 0 },
        exit: (dir) => prefersReducedMotion
            ? { opacity: 0, x: 0 }
            : { opacity: 0, x: dir * -250 }
    }), [prefersReducedMotion])

    /* ── Spring transition — organic, weighty feel ── */
    const springTransition = {
        duration: 0.4,
        ease: 'easeInOut'
    }

    /* ── Staggered price-item entrance ── */
    const itemContainerVariants = {
        hidden: {},
        visible: {
            transition: { staggerChildren: prefersReducedMotion ? 0 : 0.03, delayChildren: 0.05 }
        }
    }

    const itemVariants = prefersReducedMotion
        ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
        : {
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }
        }

    /* ── Derive visible cards based on breakpoint ── */
    const visibleCards = isDesktop
        ? [currentIndex, (currentIndex + 1) % priceCards.length]
        : [currentIndex]

    return (
        <div
            className="price-list w-full max-w-10/12 mx-auto px-0 md:px-6 lg:px-8 pb-8"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative">

                {/* ── Navigation Arrows — Glassmorphism style ── */}
                <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 lg:-translate-x-14 z-20
                               w-8 h-8 md:w-12 md:h-12 flex items-center justify-center
                               rounded-full backdrop-blur-md bg-obsidian-surface/60 border border-champagne/15
                               text-champagne/80 hover:text-champagne hover:border-champagne/40 hover:bg-obsidian-elevated/80
                               shadow-lg shadow-black/30 transition-all duration-300 hover:scale-110 cursor-pointer
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/50"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 lg:translate-x-14 z-20
                               w-8 h-8 md:w-12 md:h-12 flex items-center justify-center
                               rounded-full backdrop-blur-md bg-obsidian-surface/60 border border-champagne/15
                               text-champagne/80 hover:text-champagne hover:border-champagne/40 hover:bg-obsidian-elevated/80
                               shadow-lg shadow-black/30 transition-all duration-300 hover:scale-110 cursor-pointer
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/50"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
                </button>

                {/* ── Cards Carousel ── */}
                <div className="overflow-hidden py-6">
                    <AnimatePresence mode="wait" custom={direction}>
                        <Motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={springTransition}
                            className="flex flex-col lg:flex-row justify-center items-stretch gap-6 lg:gap-8"
                            style={{ willChange: 'transform, opacity' }}
                        >
                            {visibleCards.map((cardIndex, i) => {
                                const card = priceCards[cardIndex]
                                return (
                                    /* ── Individual Price Card ── */
                                    <Motion.div
                                        key={cardIndex}
                                        /* Stagger the second card slightly on desktop */
                                        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 25,
                                            delay: i * 0.12
                                        }}
                                        className="flex-1 flex flex-col gap-5 group/card"
                                    >
                                        {/* Card Title — Outside the card for editorial feel */}
                                        <div className="text-center space-y-4">
                                            <span className="font-sans text-champagne/60 tracking-[0.4em] text-[9px] sm:text-[10px] uppercase block">
                                                Menu
                                            </span>
                                            <h2 className="font-sans text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
                                                {card.title}
                                            </h2>
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="w-8 h-px bg-champagne/30"></div>
                                                <div className="w-2 h-2 rounded-full bg-champagne/50"></div>
                                                <div className="w-8 h-px bg-champagne/30"></div>
                                            </div>
                                        </div>

                                        {/* Glassmorphism Card Container */}
                                        <Motion.div
                                            whileHover={prefersReducedMotion ? {} : { y: -4, scale: 1.02 }}
                                            transition={prefersReducedMotion ? {} : { duration: 0.2, ease: 'easeOut' }}
                                            className="relative flex-1 overflow-hidden rounded-2xl min-h-112.5
                                                       shadow-2xl shadow-black/40
                                                       transition-shadow duration-300"
                                        >
                                            {/* Background Image Layer */}
                                            <div
                                                className="absolute inset-0 z-0 transition-transform duration-700 ease-luxury group-hover/card:scale-105"
                                                style={{
                                                    backgroundImage: `url(${card.image})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            />

                                            {/* Cinematic Gradient Overlay — matches hero treatment */}
                                            <div className="absolute inset-0 z-1 bg-linear-to-t from-black via-black/85 to-black/60
                                                            transition-opacity duration-500 group-hover/card:from-black group-hover/card:via-black/80 group-hover/card:to-black/50" />

                                            {/* Subtle champagne glow on hover (top edge) */}
                                            <div className="absolute inset-x-0 top-0 h-px z-2
                                                            bg-linear-to-r from-transparent via-champagne/0 to-transparent
                                                            transition-all duration-500 group-hover/card:via-champagne/40" />

                                            {/* Price Items — Staggered entrance */}
                                            <Motion.div
                                                variants={itemContainerVariants}
                                                initial="hidden"
                                                animate="visible"
                                                className="relative z-10 h-full flex flex-col p-6 md:p-8 lg:p-10"
                                            >
                                                <div className="flex-1 flex flex-col gap-1 justify-center">
                                                    {card.items.map((item, idx) => (
                                                        <Motion.div
                                                            key={idx}
                                                            variants={itemVariants}
                                                            className="group/item flex justify-between items-center
                                                                       py-6 border-b border-white/6
                                                                       hover:border-champagne/30 transition-colors duration-300"
                                                        >
                                                            {/* Service Name */}
                                                            <div className="flex items-center gap-3">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-champagne/30
                                                                               group-hover/item:bg-champagne transition-colors duration-300" />
                                                                <span className="font-sans text-xs md:text-lg font-medium text-white/85
                                                                               group-hover/item:text-white transition-colors duration-300 tracking-wide">
                                                                    {item.name}
                                                                </span>
                                                            </div>

                                                            {/* Dotted Spacer — editorial menu style */}
                                                            <div className="flex-1 mx-4 border-b border-dotted border-white/8
                                                                            group-hover/item:border-champagne/20 transition-colors duration-300" />

                                                            {/* Price */}
                                                            <span className="font-sans text-md md:text-xl font-bold text-champagne-light
                                                                            group-hover/item:text-champagne transition-colors duration-300">
                                                                {item.price}
                                                            </span>
                                                        </Motion.div>
                                                    ))}
                                                </div>
                                            </Motion.div>
                                        </Motion.div>
                                    </Motion.div>
                                )
                            })}
                        </Motion.div>
                    </AnimatePresence>
                </div>

                {/* ── Dot Indicators — Refined pill style ── */}
                <div className="flex justify-center items-center gap-2.5 mt-10">
                    {priceCards.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1)
                                setCurrentIndex(index)
                            }}
                            className={`h-2 rounded-full transition-all duration-500 ease-luxury cursor-pointer
                                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/50
                                        ${index === currentIndex
                                    ? 'w-8 bg-champagne shadow-md shadow-champagne/30'
                                    : 'w-2 bg-white/15 hover:bg-white/30'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                            aria-current={index === currentIndex ? 'true' : 'false'}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PriceCard
