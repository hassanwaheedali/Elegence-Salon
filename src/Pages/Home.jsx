import { useEffect } from 'react'
import {
    Scissors,
    Feather, // For Shaves (Smooth)
    Droplets, // For Facials (Water/Products)
    Sparkles, // For Beard Trim (Clean/Sharp)
    Crown, // For Hair Styling (Premium)
    Palette // For Hair Color
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
    const servicesData = [
        {
            icon: <Scissors size={24} strokeWidth={1.5} />,
            title: "Classic Haircut",
            description: "Our stylist can recommend what will work excellent for your hair type and face shape.",
            price: "$30.00",
            image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop"
        },
        {
            icon: <Feather size={24} strokeWidth={1.5} />,
            title: "Shaves",
            description: "Special stylists for men who just want their shave done with precision and comfort.",
            price: "$20.00",
            image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop"
        },
        {
            icon: <Droplets size={24} strokeWidth={1.5} />,
            title: "Facials & Wash",
            description: "The right hair and skincare treatment with high quality products.",
            price: "$30.00",
            image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop"
        },
        {
            icon: <Sparkles size={24} strokeWidth={1.5} />,
            title: "Beard Trim",
            description: "Expert beard sculpting and conditioning to keep your facial hair looking sharp.",
            price: "$15.00",
            image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2070&auto=format&fit=crop"
        },
        {
            icon: <Crown size={24} strokeWidth={1.5} />,
            title: "Hair Styling",
            description: "Top-rated salon with talented stylists for the best in customer service.",
            price: "$60.00",
            image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=2074&auto=format&fit=crop"
        },
        {
            icon: <Palette size={24} strokeWidth={1.5} />,
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
            <main className="relative min-h-screen overflow-hidden" id="main-hero">
                {/* Background Image Layer */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url(${Landing})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                ></div>

                {/* Gradient Overlay for depth */}
                <div className="absolute inset-0 bg-linear-to-br from-black/40 via-gray-900/30 to-black/40 z-2"></div>

                {/* Main Hero Section */}
                <div className="relative container mx-auto md:pl-4 pt-32 pb-16 md:pb-22 z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 min-h-[calc(100vh-200px)]">

                        {/* Left Content Section */}
                        <div className="w-full lg:w-1/2 flex flex-col items-center md:items-start space-y-6 md:space-y-8 z-10">

                            {/* Premium Badge */}
                            <div className="inline-flex items-center gap-2 bg-linear-to-r from-yellow-600/20 to-yellow-500/20 border border-yellow-500/30 rounded-full px-6 py-2 backdrop-blur-sm">
                                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                                <span className="text-yellow-500 text-sm font-semibold uppercase tracking-wider">Premium Grooming</span>
                            </div>

                            {/* Main Heading */}
                            <div className="heading-text text-center md:text-start space-y-2">
                                {/* MEN'S */}
                                <h1 className="text-white text-7xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight leading-none">
                                    MEN'S
                                </h1>

                                {/* Favorite */}
                                <h2 className="text-transparent bg-clip-text bg-linear-to-r from-yellow-600 via-[#fb9d33] to-yellow-600 text-8xl md:text-7xl lg:text-8xl xl:text-[110px] font-black uppercase tracking-tight leading-none filter-[drop-shadow(0px_-1px_0px_#FFFFFF)]">
                                    Favorite
                                </h2>

                                {/* Salon with cursive font */}
                                <h3 className="text-white text-7xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase leading-none tracking-tight">
                                    Salon
                                </h3>
                            </div>

                            {/* Description */}
                            <p className="text-gray-300 text-sm text-center md:text-start md:text-lg max-w-xl leading-relaxed tracking-wide px-12 md:px-0 md:mx-0 w-lg">
                                Experience the art of traditional grooming with modern techniques. Where style meets sophistication.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 sm:pt-4">
                                <button className="group relative bg-transparent text-white px-8 py-4 border-3 border-[#fb9d33] uppercase font-bold tracking-wider text-sm md:text-base hover:bg-yellow-500 hover:text-white transition-all ease-in-out duration-300 overflow-hidden">
                                    <span className="relative z-10">Book Your Appointment</span>
                                </button>

                                <button className="group bg-transparent text-yellow-500 px-8 py-4 border-2 border-yellow-500/30 uppercase font-semibold tracking-wider text-sm md:text-base hover:border-yellow-500 hover:bg-yellow-500/10 transition-all duration-300">
                                    View Services
                                    <span className="inline-block ml-2 group-hover:translate-x-2 transition-transform duration-300">→</span>
                                </button>
                            </div>

                            {/* Stats/Features */}
                            <div className="flex flex-wrap gap-8 pt-6 border-t justify-center md:justify-start border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                                        <i className="fas fa-award text-black text-xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-lg">15+ Years</p>
                                        <p className="text-gray-400 text-sm">Experience</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                                        <i className="fas fa-users text-black text-xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-lg">5000+</p>
                                        <p className="text-gray-400 text-sm">Happy Clients</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                                        <i className="fas fa-star text-black text-xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-lg">4.9/5</p>
                                        <p className="text-gray-400 text-sm">Rating</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Image Section */}
                        <div className="w-full lg:w-1/2 relative hidden md:block">
                            {/* Image container with decorative elements */}
                            <div className="relative z-10 w-full">
                                {/* Golden frame corner decorations */}
                                <div className="absolute -top-6 -left-6 w-20 h-20 border-t-4 border-l-4 border-yellow-600"></div>
                                <div className="absolute -bottom-6 -right-6 w-20 h-20 border-b-4 border-r-4 border-yellow-600"></div>

                                {/* Main image */}
                                <div className="relative">
                                    <img
                                        src={barberImg}
                                        alt="Professional Barber"
                                        className="w-full h-auto max-w-lg md:max-w-xl lg:max-w-7xl object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                                    />

                                    {/* Floating badge */}
                                    <div className="absolute -bottom-6 -left-6 bg-linear-to-r from-[#fb9d33] to-yellow-600 text-white px-8 py-4 rounded-lg shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                        <p className="font-bold text-xl">Professional</p>
                                        <p className="text-base">Styling</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Animated scissors icon */}
                <div className="hidden lg:block absolute top-1/4 right-10 text-yellow-500/20 animate-bounce">
                    <i className="fas fa-cut text-4xl lg:text-5xl xl:text-6xl"></i>
                </div>

                {/* Animated comb icon */}
                <div className="hidden lg:block absolute bottom-1/4 left-10 text-yellow-500/20 animate-pulse">
                    <i className="fas fa-scissors text-3xl lg:text-4xl xl:text-5xl transform rotate-45"></i>
                </div>
            </main>
            <section className='about bg-[#0d0d0d] text-white' id='about'>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-20 pb-8 px-4 md:px-6 lg:px-0 gap-8 md:gap-12">
                    {/* left image - responsive sizing */}
                    <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end">
                        <img src={About} alt="About Us" className="w-full max-w-sm md:max-w-xl h-auto object-contain" />
                    </div>
                    {/* right content - responsive sizing */}
                    <div className="w-full md:w-1/2 flex flex-col justify-start md:items-start text-center md:text-left px-4 md:px-0">
                        <div className="f1-head">
                            <h2 className="text-4xl lg:text-6xl">WE ARE <span className="text-white font-bold uppercase">Elegance</span></h2>
                        </div>
                        <div className="f2-head mt-2">
                            <h2 className='text-4xl lg:text-6xl font-bold text-[#fb9d33]'>THE BARBER SHOP</h2>
                        </div>
                        <div className="description space-y-4 mt-8 md:mt-6">
                            <div className="f-para1">
                                <p className="text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed tracking-wide">
                                    Elegance have been at the forefront of mens grooming, and have set the agenda for style-conscious gentleman in Karachi. Our focus on empowering gentleman to look and feel fantastic every day.
                                </p>
                            </div>
                            <hr className='border-gray-700' />
                            <div className="f-para1">
                                <p className="text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed tracking-wide">
                                    Elegance combines the comfort behind traditional with the modern conveniences of a full service salon.
                                </p>
                            </div>
                        </div>
                        <div className="icons mt-14 md:mt-12 flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 md:gap-8 lg:gap-28">
                            <div className="f1-icon flex flex-col justify-center items-center">
                                <i className="fas fa-cut text-[#fb9d33] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mr-2"></i>
                                <span className="text-gray-300 text-xs sm:text-xs md:text-sm tracking-widest mt-2 sm:mt-3">HAIRCUT</span>
                            </div>
                            <div className="f2-icon flex flex-col justify-center items-center">
                                <i className="fas fa-cut text-[#fb9d33] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mr-2"></i>
                                <span className="text-gray-300 text-xs sm:text-xs md:text-sm tracking-widest mt-2 sm:mt-3">SHAVING</span>
                            </div>
                            <div className="f3-icon flex flex-col justify-center items-center">
                                <i className="fas fa-spa text-[#fb9d33] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mr-2"></i>
                                <span className="text-gray-300 text-xs sm:text-xs md:text-sm tracking-widest mt-2 sm:mt-3">FACIALS</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
            <section className="service-section bg-[#0d0d0d] text-white py-24 relative" id='services'>
                <div className='mx-auto px-6 lg:px-16'>
                    <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-end mb-16 gap-6">
                        <div>
                            <span className="text-[#FF8A00] font-bold tracking-[0.2em] text-sm uppercase mb-2 block text-center md:text-start">Our Menu</span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none">
                                Discover <span className='text-transparent bg-clip-text bg-linear-to-r from-[#FF8A00] to-yellow-500'>Services</span>
                            </h2>
                        </div>
                        <p className="text-gray-400 max-w-md text-right hidden md:block pb-2">
                            Precision cuts, classic shaves, and premium grooming services tailored for the modern gentleman.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {servicesData.map((service, index) => (
                            <ServiceCard
                                key={index}
                                {...service}
                            />
                        ))}
                    </div>
                </div>
            </section>
            <section className="price-section bg-[#0d0d0d] text-white">
                <div className='pb-8 mx-auto flex flex-col gap-8 lg:gap-12'>
                    <div className="heading w-full mt-8 mb-2 md:mb-8 text-center text-5xl font-black text-[#fb9d33]">
                        <h1>PRICE LIST</h1>
                    </div>
                    <PriceCard />
                </div>
            </section>
            <section className="appoinment-section bg-[#0d0d0d] text-white" id='appointment'>
                <div className='pb-8  mx-auto flex flex-col gap-2'>
                    <div className="heading w-full text-center text-4xl lg:text-5xl font-black text-[#fb9d33] uppercase">
                        <h1 className='text-white'>Make</h1>
                        <h1>An Appointment</h1>
                        <hr className='max-w-115 mx-auto border-[#1b1b1b] border mt-5' />
                    </div>
                    <div className='mx-auto max-w-7xl w-full px-4 md:px-6 lg:px-8 py-4 md:py-12 mb-8'>
                        <AppointmentForm />
                    </div>
                </div>
            </section>
            <section className="brand-images bg-[#0d0d0d] overflow-hidden pt-4 pb-16">
                {/* Section Title */}
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-wider mb-2">
                        Trusted <span className="text-[#fb9d33]">Brands</span>
                    </h2>
                    <p className="text-gray-400 text-sm">Premium products for exceptional results</p>
                </div>

                <BrandCarousel />

                {/* Bottom decoration line */}
                <div className="mt-8 flex justify-center">
                    <div className="w-32 h-1 bg-linear-to-r from-transparent via-yellow-500 to-transparent rounded-full"></div>
                </div>
            </section>
            <section className="customer-reviews-section bg-[#0d0d0d] text-white pt-12">
                <div className='mx-auto flex flex-col gap-4 md:gap-6'>
                    <div className="heading w-full text-center">
                        <h1 className='text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase'>Customer <span className='text-[#fb9d33]'>Reviews</span></h1>
                        <hr className='max-w-xs sm:max-w-md md:max-w-lg mx-auto border-[#1b1b1b] border mt-3 md:mt-5' />
                    </div>
                    <div className='mx-auto max-w-7xl w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 md:py-8 mb-4 md:mb-8'>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                            {customerReviews.map((review) => (
                                <div className="review-card bg-[#121212] p-4 md:p-6 rounded-lg hover:bg-[#171616] transition-all duration-300" key={review.id}>
                                    <CustomerReview name={review.name} image={review.img} review={review.review} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <section className="sample-images bg-[#0d0d0d] overflow-hidden">
                <div className="mx-auto px-4 sm:px-6 md:px-16 py-12 mb-6">
                    <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
                        {sampleImages.map((sample) => (
                            <div key={sample.id} className="sample-image-card overflow-hidden hover:scale-105 transition-transform duration-300">
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
