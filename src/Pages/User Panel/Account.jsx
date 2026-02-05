import Header from '../../Components/Header'
import Profile from '../../Components/UserPanel Components/Profile.jsx'
import Feedback from '../../Components/UserPanel Components/Feedback.jsx'
import Booking from '../../Components/UserPanel Components/Booking.jsx'
import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Landing from '../../Assets/contact-bg.png'

function Account() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [activeTab, setActiveTab] = useState('profile')
    const [scrollY, setScrollY] = useState(0)

    // Set active tab from URL query parameters on mount and when params change
    useEffect(() => {
        const tabParam = searchParams.get('tab')
        if (tabParam === 'appointments' || tabParam === 'feedback' || tabParam === 'profile') {
            setActiveTab(tabParam)
        } else {
            setActiveTab('profile')
        }
    }, [searchParams])

    // Handle tab change and update URL
    const handleTabChange = (tab) => {
        setActiveTab(tab)
        navigate(`?tab=${tab}`, { replace: true })
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <Header bgImage="bg-[#0F0F0F]" />
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
                <div className="relative container mx-auto px-4 pt-24 pb-16 sm:pt-28 sm:pb-18 md:pt-32 md:pb-20 lg:pt-38 lg:pb-22 z-10 flex justify-center items-center h-full text-center">
                    <h1
                        className="font-black text-5xl sm:text-6xl md:text-7xl lg:text-[7vw] shadow-md tracking-widest uppercase leading-tight"
                        style={{
                            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.68) 50%, rgba(0, 0, 0, 0.28) 100%)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            color: 'transparent'
                        }}
                    >My Account</h1>
                </div>
            </main>
            <section className="bg-[#0F0F0F]">
                <div className="container mx-auto pt-16 pb-18 px-4 flex justify-center items-center flex-col">
                    <div className="section-text text-center space-y-2">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight"><span className="text-[#FF8A00]">MANAGE YOUR</span> ACCOUNT</h2>
                        <p className="text-base sm:text-lg text-[#8A8A8A]">Update your profile, view appointments, and share feedback</p>
                    </div>
                </div>
                <div className="container mx-auto px-4 pb-12 md:pb-18">
                    {/* Tab Navigation - Grid layout matching Contact cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
                        <button
                            onClick={() => handleTabChange('profile')}
                            className={`group relative overflow-hidden bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border ${activeTab === 'profile' ? 'border-yellow-500/40' : 'border-yellow-500/10 hover:border-yellow-500/40'} focus:outline-none focus:ring-2 focus:ring-[#fb9d33] focus:ring-offset-2 focus:ring-offset-[#0F0F0F] cursor-pointer`}
                        >
                            {/* Animated background glow */}
                            <div className="absolute inset-0 bg-radial-gradient via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                                backgroundImage: 'radial-gradient(circle at center, rgba(234, 179, 8, 0.05) 0%, transparent 70%)'
                            }}></div>

                            <div className="relative flex items-center gap-6">
                                <div className="shrink-0">
                                    <div className={`w-14 h-14 rounded-full bg-linear-to-br from-[#fb9d33] to-yellow-600 flex items-center justify-center group-hover:shadow-2xl group-hover:shadow-yellow-500/50 transition-all duration-500 group-hover:scale-110`}>
                                        <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="font-bold text-base sm:text-lg text-white uppercase tracking-wider mb-0.5 group-hover:text-yellow-400 transition-colors duration-300">Profile</h3>
                                    <p className="text-sm sm:text-base text-gray-500 group-hover:text-gray-400 transition-colors">Edit your details</p>
                                </div>
                                <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                    <svg className="w-5 h-5 text-[#fb9d33]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={() => handleTabChange('feedback')}
                            className={`group relative overflow-hidden bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border ${activeTab === 'feedback' ? 'border-yellow-500/40' : 'border-yellow-500/10 hover:border-yellow-500/40'} focus:outline-none focus:ring-2 focus:ring-[#fb9d33] focus:ring-offset-2 focus:ring-offset-[#0F0F0F] cursor-pointer`}
                        >
                            {/* Animated background glow */}
                            <div className="absolute inset-0 bg-radial-gradient via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                                backgroundImage: 'radial-gradient(circle at center, rgba(234, 179, 8, 0.05) 0%, transparent 70%)'
                            }}></div>

                            <div className="relative flex items-center gap-6">
                                <div className="shrink-0">
                                    <div className={`w-14 h-14 rounded-full bg-linear-to-br from-[#fb9d33] to-yellow-600 flex items-center justify-center group-hover:shadow-2xl group-hover:shadow-yellow-500/50 transition-all duration-500 group-hover:scale-110`}>
                                        <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="font-bold text-base sm:text-lg text-white uppercase tracking-wider mb-0.5 group-hover:text-yellow-400 transition-colors duration-300">Feedback</h3>
                                    <p className="text-sm sm:text-base text-gray-500 group-hover:text-gray-400 transition-colors">Share your thoughts</p>
                                </div>
                                <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                    <svg className="w-5 h-5 text-[#fb9d33]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('appointments')}
                            className={`group relative overflow-hidden bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border ${activeTab === 'appointments' ? 'border-yellow-500/40' : 'border-yellow-500/10 hover:border-yellow-500/40'} focus:outline-none focus:ring-2 focus:ring-[#fb9d33] focus:ring-offset-2 focus:ring-offset-[#0F0F0F] cursor-pointer`}
                        >
                            {/* Animated background glow */}
                            <div className="absolute inset-0 bg-radial-gradient via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                                backgroundImage: 'radial-gradient(circle at center, rgba(234, 179, 8, 0.05) 0%, transparent 70%)'
                            }}></div>

                            <div className="relative flex items-center gap-6">
                                <div className="shrink-0">
                                    <div className={`w-14 h-14 rounded-full bg-linear-to-br from-[#fb9d33] to-yellow-600 flex items-center justify-center group-hover:shadow-2xl group-hover:shadow-yellow-500/50 transition-all duration-500 group-hover:scale-110`}>
                                        <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="font-bold text-base sm:text-lg text-white uppercase tracking-wider mb-0.5 group-hover:text-yellow-400 transition-colors duration-300">Bookings</h3>
                                    <p className="text-sm sm:text-base text-gray-500 group-hover:text-gray-400 transition-colors">View appointments</p>
                                </div>
                                <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                    <svg className="w-5 h-5 text-[#fb9d33]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </section>
            <section className="bg-[#0F0F0F]">
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-8">
                    {/* Profile Settings Section */}
                    {activeTab === 'profile' && <Profile />}

                    {/* Feedback Section */}
                    {activeTab === 'feedback' && <Feedback />}

                    {/* My Appointments Section */}
                    {activeTab === 'appointments' && <Booking />}
                </div>
            </section>
        </>
    )
}

export default Account
