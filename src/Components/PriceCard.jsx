import cardImg from '../assets/Card.png'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function PriceCard() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(1) // 1 for next, -1 for previous

    const slideVariants = {
        enter: (direction) => ({
            opacity: 0,
            x: direction * 100
        }),
        center: {
            opacity: 1,
            x: 0
        },
        exit: (direction) => ({
            opacity: 0,
            x: direction * -100
        })
    }

    const priceCards = [
        {
            title: "Hair Services",
            items: [
                { name: "Haircut", price: "$30" },
                { name: "Beard Trim", price: "$15" },
                { name: "Shave", price: "$20" },
                { name: "Hair Color", price: "$60" },
                { name: "Mustache Trim", price: "$10" },
                { name: "Wash & Blowout", price: "$40" }
            ]
        },
        {
            title: "Skin",
            items: [
                { name: "Bodyshop Facial", price: "$30" },
                { name: "Janseen Facial", price: "$15" },
                { name: "Herbal Facial", price: "$20" },
                { name: "Gold Facial", price: "$60" },
                { name: "Face Steam", price: "$10" },
                { name: "Full Body Massage", price: "$40" }
            ]
        },
        {
            title: "Wax & Threading",
            items: [
                { name: "Eyebrow Threading", price: "$12" },
                { name: "Full Face Threading", price: "$25" },
                { name: "Chest Wax", price: "$35" },
                { name: "Back Wax", price: "$40" },
                { name: "Arm Wax", price: "$30" },
                { name: "Leg Wax", price: "$45" }
            ]
        },
        {
            title: "Hair Styling",
            items: [
                { name: "Keratin Treatment", price: "$120" },
                { name: "Hair Spa", price: "$50" },
                { name: "Deep Conditioning", price: "$35" },
                { name: "Scalp Treatment", price: "$40" },
                { name: "Hair Straightening", price: "$80" },
                { name: "Special Event Styling", price: "$60" }
            ]
        }
    ]

    const nextSlide = () => {
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % priceCards.length)
    }

    const prevSlide = () => {
        setDirection(-1)
        setCurrentIndex((prev) => (prev - 1 + priceCards.length) % priceCards.length)
    }

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowLeft') {
                prevSlide()
            } else if (event.key === 'ArrowRight') {
                nextSlide()
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [currentIndex])

    return (
        <div className="price-list w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 mb-4">
            <div className="relative">
                {/* Navigation Arrows */}
                <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-18 z-20 text-yellow-600 rounded-full p-3 md:p-4 shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
                    aria-label="Previous slide"
                >
                    <i className="fas fa-chevron-left text-lg md:text-xl"></i>
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-18 z-20 text-yellow-600 rounded-full p-3 md:p-4 shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
                    aria-label="Next slide"
                >
                    <i className="fas fa-chevron-right text-lg md:text-xl"></i>
                </button>

                {/* Cards Container */}
                <div className="overflow-hidden">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="flex flex-col lg:flex-row justify-center items-stretch gap-6 md:gap-8"
                        >
                            {/* Show 1 card on mobile, 2 cards on desktop */}
                            {[currentIndex, (currentIndex + 1) % priceCards.length].slice(0, window.innerWidth >= 1024 ? 2 : 1).map((index) => {
                                const card = priceCards[index]
                                return (
                                    <div key={index} className="flex-1 flex flex-col gap-4">
                                        <div className="text-center">
                                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-white mb-4">
                                                {card.title}
                                            </h2>
                                            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
                                        </div>

                                        <div
                                            className="group relative flex-1 min-h-125 overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 hover:scale-[1.02] px-4 md:px-0"
                                            style={{ backgroundImage: `url(${cardImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                        >
                                            <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/70 to-black/30"></div>

                                            <div className="relative z-10 h-full flex flex-col p-6 md:p-8 lg:p-10">
                                                <div className="flex-1 flex flex-col gap-4 md:gap-5 justify-center">
                                                    {card.items.map((item, idx) => (
                                                        <div key={idx} className="price-item flex justify-between items-center py-3 border-b border-gray-700 hover:border-yellow-500 transition-colors duration-300">
                                                            <span className="text-base md:text-lg font-bold text-[#f9fffc]">{item.name}</span>
                                                            <span className="text-xl md:text-2xl font-bold text-yellow-500">{item.price}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Dot Indicators */}
                <div className="flex justify-center gap-3 mt-14">
                    {priceCards.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'bg-yellow-500 w-8'
                                : 'bg-gray-600 hover:bg-gray-400'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PriceCard
