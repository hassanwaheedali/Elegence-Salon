import Header from "../Components/Header"
import Landing from '../assets/contact-bg.webp'
import AppointmentFormContact from "../Components/AppointmentFormContact"
import { useState, useEffect } from "react"

function Contact() {
    const [scrollY, setScrollY] = useState(0)

    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <Header bgImage="bg-obsidian-surface" />
            <main className="relative overflow-hidden h-75">
                {/* Background Image Layer with Parallax */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url(${Landing})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        transform: `translateY(${scrollY * 0.5}px)`
                    }}
                ></div>

                {/* Main Content */}
                <div className="relative container mx-auto px-4 pt-24 pb-16 sm:pt-38 sm:pb-18 md:pt-32 md:pb-12 lg:pt-38 lg:pb-22 z-10 flex justify-center items-center h-full text-center">
                    <h1
                        className="font-black text-5xl sm:text-[10vw] lg:text-[7vw] shadow-md tracking-widest uppercase leading-tight"
                        style={{
                            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.68) 50%, rgba(0, 0, 0, 0.28) 100%)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            color: 'transparent'
                        }}
                    >Contact Us</h1>
                </div>
            </main>
            <section className="bg-obsidian">
                <div className="container mx-auto pt-16 pb-18 px-4 flex justify-center items-center flex-col">
                    <div className="section-text text-center space-y-2">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight"><span className="text-champagne">READY FOR</span> NEW LOOK</h2>
                        <p className="text-base sm:text-lg text-champagne-muted">Schedule your appointment or send us a message</p>
                    </div>
                </div>
                <div className="container mx-auto px-4 pb-12 md:pb-18">
                    {/* Grid columns: 1 (mobile), 2 (md tablet), 3 (lg desktop) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
                        <a href="tel:+923001234567" className="group relative overflow-hidden bg-linear-to-br from-obsidian-elevated to-obsidian p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-champagne/10 hover:border-champagne/40 focus:outline-none focus:ring-2 focus:ring-champagne focus:ring-offset-2 focus:ring-offset-obsidian">
                            {/* Animated background glow */}
                            <div className="absolute inset-0 bg-radial-gradient via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                                backgroundImage: 'radial-gradient(circle at center, rgba(217, 130, 43, 0.05) 0%, transparent 70%)'
                            }}></div>

                            <div className="relative flex items-center gap-6">
                                {/* Icon Container */}
                                <div className="shrink-0">
                                    <div className="w-14 h-14 rounded-full bg-linear-to-br from-champagne-light to-champagne flex items-center justify-center group-hover:shadow-2xl group-hover:shadow-champagne/50 transition-all duration-500 group-hover:scale-110">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-black">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                        </svg>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 text-left">
                                    <h3 className="font-bold text-base sm:text-lg text-white uppercase tracking-wider mb-0.5 group-hover:text-champagne-light transition-colors duration-300">Phone</h3>
                                    <p className="text-sm mb-2 text-champagne-muted group-hover:text-champagne-muted transition-colors">Mon-Fri 10am-8pm</p>
                                    <p className="font-semibold text-champagne text-base group-hover:text-champagne-light transition-colors duration-300">+92 300 1234567</p>
                                </div>

                                {/* Arrow indicator */}
                                <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                    <svg className="w-5 h-5 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </a>
                        <a href="mailto:info@elegance.com" className="group relative overflow-hidden bg-linear-to-br from-obsidian-elevated to-obsidian p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-champagne/10 hover:border-champagne/40 focus:outline-none focus:ring-2 focus:ring-champagne focus:ring-offset-2 focus:ring-offset-obsidian">
                            {/* Animated background glow */}
                            <div className="absolute inset-0 bg-radial-gradient via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                                backgroundImage: 'radial-gradient(circle at center, rgba(217, 130, 43, 0.05) 0%, transparent 70%)'
                            }}></div>

                            <div className="relative flex items-center gap-6">
                                {/* Icon Container */}
                                <div className="shrink-0">
                                    <div className="w-14 h-14 rounded-full bg-linear-to-br from-champagne-light to-champagne flex items-center justify-center group-hover:shadow-2xl group-hover:shadow-champagne/50 transition-all duration-500 group-hover:scale-110">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-mail h-7 w-7 text-black"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 text-left">
                                    <h3 className="font-bold text-base sm:text-lg text-white uppercase tracking-wider mb-0.5 group-hover:text-champagne-light transition-colors duration-300">Email</h3>
                                    <p className="text-sm  text-champagne-muted mb-1 group-hover:text-champagne-muted transition-colors">24/7 Support</p>
                                    <p className="font-semibold text-champagne text-base group-hover:text-champagne-light transition-colors duration-300">info@elegance.com</p>
                                </div>

                                {/* Arrow indicator */}
                                <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                    <svg className="w-5 h-5 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </a>
                        <a href="https://wa.me/923001234567" target="_blank" className="group relative overflow-hidden bg-linear-to-br from-obsidian-elevated to-obsidian p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-champagne/10 hover:border-champagne/40 focus:outline-none focus:ring-2 focus:ring-champagne focus:ring-offset-2 focus:ring-offset-obsidian">
                            {/* Animated background glow */}
                            <div className="absolute inset-0 bg-radial-gradient via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                                backgroundImage: 'radial-gradient(circle at center, rgba(217, 130, 43, 0.05) 0%, transparent 70%)'
                            }}></div>

                            <div className="relative flex items-center gap-6">
                                {/* Icon Container */}
                                <div className="shrink-0">
                                    <div className="w-14 h-14 rounded-full bg-linear-to-br from-champagne-light to-champagne flex items-center justify-center group-hover:shadow-2xl group-hover:shadow-champagne/50 transition-all duration-500 group-hover:scale-110">
                                        <svg className="h-6 w-6 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path></svg>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 text-left">
                                    <h3 className="font-bold text-base sm:text-lg text-white uppercase tracking-wider mb-0.5 group-hover:text-champagne-light transition-colors duration-300">Whatsapp</h3>
                                    <p className="text-sm text-champagne-muted mb-1 group-hover:text-champagne-muted transition-colors">Quick Response</p>
                                    <p className="font-semibold text-champagne text-base group-hover:text-champagne-light transition-colors duration-300">Chat Now</p>
                                </div>

                                {/* Arrow indicator */}
                                <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                    <svg className="w-5 h-5 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </section>
            <section className="bg-obsidian">
                <div className="container max-w-7xl mx-auto pb-14 px-4 gap-10 md:gap-12 lg:gap-14 grid grid-cols-1 lg:grid-cols-2 pt-8">
                    <div className="section-form bg-obsidian-surface px-6 sm:px-8 pb-12 sm:pb-14 shadow-lg w-full flex flex-col items-start rounded-lg transition-all duration-500">
                        <div className="head-background bg-obsidian-elevated w-[calc(100%+3rem)] sm:w-[calc(100%+4rem)] -mx-6 sm:-mx-8 -mt-8 px-6 sm:px-8 py-6 sm:py-8 mb-6 transition-all duration-500 rounded-t-lg ">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-champagne mt-1"><span className="text-white">Make An</span> Appointment</h2>
                        </div>
                        <AppointmentFormContact />
                    </div>
                    <div className="store-section mt-8 lg:mt-0 px-6 md:px-8 pb-12 md:pb-0">
                        <div className="visit-store-section">
                            <div className="head-background bg-obsidian-elevated w-[calc(100%+3rem)] sm:w-[calc(100%+4rem)] -mx-6 sm:-mx-8 -mt-8 px-6 sm:px-8 py-8 sm:py-10 mb-5 transition-all duration-500 rounded-t-lg">
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-champagne"><span className="text-white">Visit Our</span> Store</h2>
                            </div>
                            <div className="store-info bg-obsidian-surface -mx-6 sm:-mx-8 -mt-8 px-6 sm:px-8 py-8 mb-10 md:mb-8 rounded-b-lg shadow-lg transition-all duration-500">
                                <div className="space-y-6">
                                    <div className="space-y-6">
                                        <div className="flex gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin h-5 w-5 text-champagne mt-1 shrink-0"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                            <div>
                                                <h3 class="font-semibold mb-1 text-white text-base sm:text-lg">Address</h3>
                                                <p class="text-champagne-muted text-sm sm:text-base font-semibold leading-relaxed">123 Main Street, Gulberg III <br /> Lahore, Punjab 54000<br></br> Pakistan</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock h-5 w-5 text-champagne mt-1 shrink-0"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                            <div>
                                                <h3 class="font-semibold mb-1 text-white text-base sm:text-lg">Business Hours</h3>
                                                <div class="space-y-1 text-sm sm:text-base text-champagne-muted">
                                                    <p class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                                        <span>Monday - Friday:</span>
                                                        <span class="font-medium text-white/60">10:00 AM - 8:00 PM</span>
                                                    </p>
                                                    <p class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                                        <span>Saturday - Sunday:</span>
                                                        <span class="font-medium text-white/60">11:00 AM - 7:00 PM</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="google-maps">
                            <div className="bg-card rounded-md shadow-md overflow-hidden -mx-6 sm:-mx-8">
                                <iframe
                                    title="Elegance Store Location"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3313.456789012345!2d74.35874131520567!3d31.52036998141267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391904c8b0f5e6b5%3A0x7d5a5e6b5e6b5e6b!2sGulberg%20III%2C%20Lahore%2C%20Punjab%2054000%2C%20Pakistan!5e0!3m2!1sen!2sus!4v1616161616161!5m2!1sen!2sus"
                                    className="w-full h-80 sm:h-95 md:h-105 lg:h-119.5"
                                    style={{
                                        border: 0,
                                        filter: 'invert(1) hue-rotate(180deg) brightness(0.8) contrast(0.95)'  // Dark mode effect
                                    }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Contact
