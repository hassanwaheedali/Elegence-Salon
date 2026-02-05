import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../Context/AuthContext.jsx'

function Header({ bgImage = "bg-transparent" }) {
    const navigate = useNavigate()

    const { currentUser, isAuthenticated, logout } = useAuth()

    // Step 1: Create state to track if mobile menu is open or closed
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [scrollY, setScrollY] = useState(0)

    // Step 2: Function to toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    // Step 3: Function to close mobile menu when a link is clicked
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    // Step 4: Handle scroll to change background
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const headerBg = scrollY > 50 ? 'bg-[#0F0F0F]' : bgImage

    // Simple function to navigate to section
    const goToSection = (sectionId) => {
        navigate('/')
        setTimeout(() => {
            const section = document.getElementById(sectionId)
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' })
            }
        }, 200)
    }

    return (
        <header className={`fixed top-0 left-0 w-full z-50 text-white pb-2 transition-colors duration-300 ${headerBg}`}>
            <nav>
                <div className="flex flex-wrap justify-between items-center py-4 px-6 md:px-14 relative">
                    <div className="logo ">
                        <Link to="/">
                            <svg width="99" height="46" viewBox="0 0 99 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.3771 40.9182H0V21.2747H13.2682V22.828H1.55323V29.912H12.5882V31.4653H1.55323V39.367H13.3771V40.9202V40.9182Z" fill="white"></path>
                                <path d="M15.5036 37.8672C15.5221 38.8842 15.9494 39.3937 16.7835 39.3937C16.9459 39.3937 17.1595 39.3855 17.4246 39.367C17.6875 39.3485 18.0101 39.3218 18.3923 39.2848V40.7826C17.9197 40.8195 17.5335 40.8504 17.2335 40.8771C16.9335 40.9038 16.7383 40.9182 16.6479 40.9182C14.8852 40.9182 13.9955 39.9279 13.9771 37.9494V21.6569H15.5036V37.8672Z" fill="white"></path>
                                <path d="M20.1057 34.4341C20.1961 35.9791 20.5516 37.1851 21.1679 38.0583V38.0316C21.9486 39.139 23.1382 39.6937 24.7367 39.6937C25.9899 39.6937 27.0295 39.3115 27.8554 38.5493C28.6814 37.7871 29.195 36.7249 29.3943 35.3627H30.9208C30.6661 37.3248 29.986 38.7959 28.8766 39.7759C27.7876 40.7395 26.4255 41.2202 24.7901 41.2202C22.6472 41.2202 21.0488 40.4765 19.9948 38.9869C19.0497 37.6967 18.5771 35.9811 18.5771 33.8383C18.5771 31.9132 19.0949 30.251 20.1304 28.8519C21.3467 27.272 22.8999 26.481 24.7901 26.481C26.8426 26.481 28.4225 27.2535 29.5299 28.7964C30.0209 29.4683 30.3825 30.2777 30.6188 31.2208C30.8551 32.1659 30.9722 33.2363 30.9722 34.4361H20.1016L20.1057 34.4341ZM29.4785 32.9363C29.4066 31.6111 29.006 30.4935 28.2807 29.5854C27.4445 28.5314 26.3002 28.0054 24.8476 28.0054C23.395 28.0054 22.2876 28.5499 21.4145 29.6408C21.0508 30.0949 20.7652 30.59 20.5557 31.1263C20.3461 31.6625 20.2064 32.2665 20.1324 32.9384H29.4765L29.4785 32.9363Z" fill="white"></path>
                                <path d="M44.3802 39.9916C44.3802 41.8797 43.8707 43.3117 42.8537 44.2835C41.8367 45.2553 40.3738 45.7402 38.4672 45.7402C36.9592 45.7402 35.7059 45.3765 34.7074 44.6513C33.5815 43.8151 33.0083 42.4632 32.9919 40.5915H34.4896C34.5431 41.9722 34.9437 42.9337 35.6874 43.4802C36.3962 43.9877 37.3126 44.2424 38.4385 44.2424C41.3806 44.2424 42.8516 42.8248 42.8516 39.9916L42.8249 38.1117C42.679 38.276 42.5106 38.4425 42.3215 38.615C42.1305 38.7876 41.9353 38.9458 41.736 39.0917C40.6635 39.8375 39.4924 40.2094 38.2207 40.2094C36.2956 40.2094 34.7958 39.5108 33.7253 38.1117C32.7618 36.8769 32.281 35.3052 32.281 33.3986C32.281 31.492 32.7803 29.8381 33.7788 28.6033C34.9416 27.1856 36.4764 26.4789 38.383 26.4789C39.0178 26.4789 39.626 26.5837 40.2074 26.7912C40.7888 27.0007 41.3251 27.2863 41.8141 27.65C42.2496 27.9766 42.5948 28.3136 42.8496 28.6587V26.7788H44.3761V39.9916H44.3802ZM42.8269 33.3986C42.8269 32.7082 42.7263 32.0364 42.527 31.3831C42.3277 30.7297 42.0544 30.1483 41.7093 29.6388C40.8546 28.5499 39.7472 28.0033 38.385 28.0033C36.951 28.0033 35.8148 28.5314 34.9786 29.5833C34.615 30.0743 34.3294 30.6414 34.1198 31.2865C33.9103 31.9316 33.8075 32.6343 33.8075 33.3986C33.8075 34.8881 34.1712 36.1332 34.8964 37.1317C35.6587 38.1672 36.7578 38.6849 38.194 38.6849C39.6301 38.6849 40.7457 38.1774 41.6538 37.1584H41.6271C42.4263 36.1784 42.8249 34.9251 42.8249 33.3986H42.8269Z" fill="white"></path>
                                <path d="M71.6521 40.9182H70.1543V31.7919C70.1543 30.6106 69.8358 29.686 69.201 29.0121C68.5641 28.3403 67.6745 28.0033 66.5301 28.0033C65.2049 28.0033 64.1592 28.4841 63.3969 29.4477C63.0518 29.9202 62.7847 30.4462 62.5936 31.0276C62.4025 31.6091 62.308 32.2542 62.308 32.963V40.9182H60.7815V26.7788H62.308V28.3855C62.7806 27.7856 63.3846 27.3192 64.1201 26.9822C64.8556 26.6474 65.659 26.4789 66.5321 26.4789C68.1306 26.4789 69.3838 26.9514 70.2919 27.8965C71.2001 28.8416 71.6541 30.1134 71.6541 31.7097V40.9182H71.6521Z" fill="white"></path>
                                <path d="M85.3557 35.4428C85.2653 36.4064 85.064 37.2508 84.7558 37.9761C84.4476 38.7034 84.01 39.3115 83.4471 39.8005C82.3931 40.7456 81.0761 41.2182 79.4962 41.2182C77.5341 41.2182 75.9726 40.5011 74.8098 39.065C73.7373 37.7398 73.2031 36.0962 73.2031 34.1341C73.2031 33.0801 73.349 32.1001 73.6387 31.192C73.9284 30.2839 74.3208 29.4929 74.8098 28.8211C75.3912 28.0588 76.1041 27.4774 76.9486 27.0768C77.793 26.6782 78.7422 26.4768 79.7961 26.4768C80.5234 26.4768 81.1994 26.6001 81.826 26.8446C82.4527 27.0891 83.0012 27.4445 83.4738 27.9068C83.9463 28.3691 84.3408 28.9279 84.6592 29.5833C84.9777 30.2366 85.1811 30.9639 85.2715 31.7632H83.745C83.5642 30.5818 83.1183 29.6614 82.4095 28.9978C81.7007 28.3341 80.8296 28.0034 79.7941 28.0034C78.1237 28.0034 76.852 28.6033 75.9809 29.8011C75.1447 30.9455 74.7276 32.3898 74.7276 34.132C74.7276 34.9313 74.8324 35.6545 75.0399 36.2975C75.2494 36.9427 75.5617 37.5282 75.9809 38.0542C76.8335 39.1431 78.0066 39.6896 79.4962 39.6896C80.6775 39.6896 81.6658 39.3444 82.465 38.6541C83.3012 37.9638 83.745 36.8933 83.8004 35.4387H85.3537L85.3557 35.4428Z" fill="white"></path>
                                <path d="M88.1336 34.4341C88.224 35.9791 88.5794 37.1851 89.1958 38.0583V38.0316C89.9765 39.139 91.1661 39.6937 92.7645 39.6937C94.0178 39.6937 95.0573 39.3115 95.8833 38.5493C96.7092 37.7871 97.2228 36.7249 97.4221 35.3627H98.9487C98.6939 37.3248 98.0138 38.7959 96.9044 39.7759C95.8155 40.7395 94.4533 41.2202 92.8179 41.2202C90.675 41.2202 89.0766 40.4765 88.0226 38.9869C87.0775 37.6967 86.605 35.9811 86.605 33.8383C86.605 31.9132 87.1227 30.251 88.1582 28.8519C89.3745 27.272 90.9277 26.481 92.8179 26.481C94.8704 26.481 96.4503 27.2535 97.5577 28.7964C98.0488 29.4683 98.4104 30.2777 98.6466 31.2208C98.8829 32.1659 99 33.2363 99 34.4361H88.1294L88.1336 34.4341ZM97.5064 32.9363C97.4345 31.6111 97.0338 30.4935 96.3086 29.5854C95.4724 28.5314 94.328 28.0054 92.8754 28.0054C91.4229 28.0054 90.3155 28.5499 89.4423 29.6408C89.0786 30.0949 88.7931 30.59 88.5835 31.1263C88.3739 31.6625 88.2342 32.2665 88.1603 32.9384H97.5043L97.5064 32.9363Z" fill="white"></path>
                                <path d="M58.2995 4.15837C56.66 5.82049 54.7123 6.69572 52.6742 7.23607C49.956 7.96337 47.205 8.53043 44.4663 9.17555L45.2676 10.813C46.7304 10.398 48.2795 9.96244 49.7485 9.55564C51.7435 9.00297 53.6953 8.32086 55.5074 7.17443C56.8613 6.3218 58.0591 5.19591 58.9878 3.62008C59.0453 3.52762 59.0802 3.40024 59.1747 3.17014C58.8193 3.56666 58.5687 3.87895 58.2995 4.15426V4.15837Z" fill="white"></path>
                                <path d="M37.4994 14.9961C37.1912 15.2549 37.0556 15.446 36.7577 15.7295C35.9153 16.5246 35.227 17.3978 34.4751 18.3491C32.9116 20.3255 31.6316 22.4746 30.6064 24.7839C30.5098 25.0078 30.3804 25.2153 30.2612 25.4249C31.5063 21.5685 33.341 18.1128 35.8948 15.0063L37.4994 15.0002V14.9961Z" fill="white"></path>
                                <path d="M43.1617 11.5588C41.1873 12.3149 39.3526 13.3298 37.7089 14.6756L36.1865 14.5626C36.6262 14.053 37.0967 13.56 37.6021 13.0833C37.898 12.8018 38.2205 12.5471 38.5492 12.3046L39.0629 11.9184C40.1621 11.0781 41.3373 10.3898 42.5802 9.84946L43.1617 11.5588Z" fill="white"></path>
                                <path d="M49.3088 28.5088L40.1045 0L51.2771 27.6438L49.3088 28.5088Z" fill="white"></path>
                                <path d="M36.1127 15.0022L35.4347 15.8405L28.2705 14.8071L36.1127 15.0022Z" fill="white"></path>
                                <path d="M59.3023 14.9488L58.614 17.8354L36.2524 15.5857L37.1626 14.9961L59.3023 14.9488Z" fill="white"></path>
                                <path d="M63.6064 21.1124C65.9201 21.1124 67.7956 19.2369 67.7956 16.9232C67.7956 14.6096 65.9201 12.734 63.6064 12.734C61.2928 12.734 59.4172 14.6096 59.4172 16.9232C59.4172 19.2369 61.2928 21.1124 63.6064 21.1124Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10"></path>
                                <path d="M56.8285 38.6808C56.81 38.6993 56.7977 38.7157 56.7894 38.7342C56.7812 38.7527 56.7668 38.7692 56.7483 38.7876C55.5916 40.3018 54.0322 41.0579 52.0743 41.0579C50.1163 41.0579 48.5672 40.3018 47.3735 38.7876C46.3585 37.4871 45.8511 35.8312 45.8511 33.8198C45.8511 31.8084 46.3668 30.1689 47.4002 28.8519C48.5939 27.3562 50.1594 26.6083 52.101 26.6083C53.081 26.6083 53.9665 26.8138 54.7596 27.2226C55.5506 27.6315 56.2409 28.2191 56.8285 28.9854V26.9021H58.3242V40.7641H56.8285V38.6808ZM56.8285 33.8198C56.8285 32.2706 56.4278 30.9434 55.6266 29.8401C54.7534 28.6834 53.5782 28.104 52.101 28.104C50.6238 28.104 49.4116 28.6834 48.5754 29.8401C47.7392 30.89 47.3201 32.2172 47.3201 33.8198C47.3201 35.4223 47.7289 36.7393 48.5487 37.8261C49.3849 38.9828 50.5704 39.5622 52.101 39.5622C53.6316 39.5622 54.7534 38.9828 55.6266 37.8261C56.4278 36.7228 56.8285 35.3874 56.8285 33.8198Z" fill="white"></path>
                            </svg>
                        </Link>
                    </div>

                    {/* Enhanced Hamburger Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden text-white focus:outline-none z-50 relative p-2 hover:bg-gray-950 rounded-lg transition-all duration-300"
                        aria-label="Toggle mobile menu"
                    >
                        {/* Animated Hamburger Icon */}
                        <div className="w-7 h-6 flex flex-col justify-between">
                            <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
                            <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
                        </div>
                    </button>

                    {/* Desktop Navigation - Hidden on mobile  */}
                    <div className="pages hidden md:flex items-center gap-10 justify-between mt-4">
                        <ul className='flex gap-10 font-semibold text-sm uppercase w-full tracking-widest'>
                            <li>
                                <Link
                                    to="/"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        goToSection('main-hero')
                                    }}
                                    className='text-white hover:text-[#fb880a] transition-colors'
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="#services"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        goToSection('services')
                                    }}
                                    className='text-white hover:text-[#fb880a] transition-colors'
                                >
                                    Services
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#about"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        goToSection('about')
                                    }}
                                    className='text-white hover:text-[#fb880a] transition-colors'
                                >
                                    About
                                </a>
                            </li>
                            <li>
                                <NavLink
                                    to="/contact"
                                    className={({ isActive }) =>
                                        isActive ? 'text-[#fb880a] font-bold' : 'text-white hover:text-[#fb880a] transition-colors'
                                    }
                                >
                                    Contact
                                </NavLink>
                            </li>
                        </ul>
                        {/* account section */}
                        <div className="account relative">
                            {isAuthenticated ? (
                                <div className="relative">
                                    {/* User Icon Button */}
                                    <button
                                        className={`flex items-center gap-2 text-white ${isDropdownOpen ? 'text-[#fb880a]' : ''} hover:text-[#fb880a] transition-colors group cursor-pointer`}
                                        onMouseEnter={() => setIsDropdownOpen(true)}
                                        onMouseLeave={() => setIsDropdownOpen(true)}
                                    >
                                        <svg className="nav-icon w-5 h-5" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.5 0C2.912 0 0 2.912 0 6.5C0 10.088 2.912 13 6.5 13C10.088 13 13 10.088 13 6.5C13 2.912 10.088 0 6.5 0ZM3.4775 10.725C4.329 10.114 5.369 9.75 6.5 9.75C7.631 9.75 8.671 10.114 9.5225 10.725C8.671 11.336 7.631 11.7 6.5 11.7C5.369 11.7 4.329 11.336 3.4775 10.725ZM10.491 9.828C9.3925 8.97 8.008 8.45 6.5 8.45C4.992 8.45 3.6075 8.97 2.509 9.828C1.755 8.9245 1.3 7.7675 1.3 6.5C1.3 3.627 3.627 1.3 6.5 1.3C9.373 1.3 11.7 3.627 11.7 6.5C11.7 7.7675 11.245 8.9245 10.491 9.828Z" fill="currentColor"></path>
                                            <path d="M6.49961 2.59998C5.24511 2.59998 4.22461 3.62048 4.22461 4.87498C4.22461 6.12948 5.24511 7.14998 6.49961 7.14998C7.75411 7.14998 8.77461 6.12948 8.77461 4.87498C8.77461 3.62048 7.75411 2.59998 6.49961 2.59998ZM6.49961 5.84998C5.96011 5.84998 5.52461 5.41448 5.52461 4.87498C5.52461 4.33548 5.96011 3.89998 6.49961 3.89998C7.03911 3.89998 7.47461 4.33548 7.47461 4.87498C7.47461 5.41448 7.03911 5.84998 6.49961 5.84998Z" fill="currentColor"></path>
                                        </svg>
                                        {/* <span className="text-sm font-medium">{currentUser?.name || 'User'}</span> */}
                                        <i className="fas fa-chevron-down text-xs transition-transform group-hover:rotate-180"></i>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div
                                            className="absolute right-0 top-full mt-5 w-64 bg-[#0d0d0d] border border-gray-800/80 shadow-2xl rounded-lg z-50 py-2"
                                            onMouseEnter={() => setIsDropdownOpen(true)}
                                            onMouseLeave={() => setIsDropdownOpen(false)}
                                        >
                                            {/* User Info Section */}
                                            <div className="px-4 py-3 border-b border-gray-700">
                                                <p className="text-[#fb880a] font-semibold text-sm uppercase tracking-wide">My Account</p>
                                                <p className="text-white text-lg font-medium mt-1">{currentUser?.name || 'User'}</p>
                                                <p className="text-gray-400 text-sm">{currentUser?.email || 'user@example.com'}</p>
                                            </div>

                                            {/* Navigation Section */}
                                            <div className="py-2">
                                                <Link
                                                    to="/account"
                                                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-[#fb880a] hover:bg-gray-900/3 transition-colors"
                                                >
                                                    <i className="fas fa-user w-5"></i>
                                                    <span>My Profile</span>
                                                </Link>
                                                <Link
                                                    to="/account?tab=appointments"
                                                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-[#fb880a] hover:bg-gray-900/3 transition-colors"
                                                >
                                                    <i className="fas fa-calendar-alt w-5"></i>
                                                    <span>My Appointments</span>
                                                </Link>
                                                <a
                                                    href="#services"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        goToSection('appointment')
                                                    }}
                                                    className='flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-[#fb880a] hover:bg-gray-900/30 transition-colors'
                                                >
                                                    <i className="fas fa-plus-circle w-5"></i>
                                                    <span>Book Appointment</span>
                                                </a>
                                                <div className="border-t border-gray-700 mt-2 pt-2">
                                                    <button
                                                        onClick={logout}
                                                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-gray-900/3 transition-colors w-full text-left cursor-pointer"
                                                    >
                                                        <i className="fas fa-sign-out-alt w-5"></i>
                                                        <span>Logout</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link to="/login" className="flex items-center gap-2 text-white hover:text-[#fb880a] transition-colors">
                                    <svg className="nav-icon w-5 h-5" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.5 0C2.912 0 0 2.912 0 6.5C0 10.088 2.912 13 6.5 13C10.088 13 13 10.088 13 6.5C13 2.912 10.088 0 6.5 0ZM3.4775 10.725C4.329 10.114 5.369 9.75 6.5 9.75C7.631 9.75 8.671 10.114 9.5225 10.725C8.671 11.336 7.631 11.7 6.5 11.7C5.369 11.7 4.329 11.336 3.4775 10.725ZM10.491 9.828C9.3925 8.97 8.008 8.45 6.5 8.45C4.992 8.45 3.6075 8.97 2.509 9.828C1.755 8.9245 1.3 7.7675 1.3 6.5C1.3 3.627 3.627 1.3 6.5 1.3C9.373 1.3 11.7 3.627 11.7 6.5C11.7 7.7675 11.245 8.9245 10.491 9.828Z" fill="currentColor"></path>
                                        <path d="M6.49961 2.59998C5.24511 2.59998 4.22461 3.62048 4.22461 4.87498C4.22461 6.12948 5.24511 7.14998 6.49961 7.14998C7.75411 7.14998 8.77461 6.12948 8.77461 4.87498C8.77461 3.62048 7.75411 2.59998 6.49961 2.59998ZM6.49961 5.84998C5.96011 5.84998 5.52461 5.41448 5.52461 4.87498C5.52461 4.33548 5.96011 3.89998 6.49961 3.89998C7.03911 3.89998 7.47461 4.33548 7.47461 4.87498C7.47461 5.41448 7.03911 5.84998 6.49961 5.84998Z" fill="currentColor"></path>
                                    </svg>
                                    <span className="text-sm font-medium">Login</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Enhanced Mobile Navigation Menu - Premium Salon Design */}
                    <div className={`
                        md:hidden fixed top-0 right-0 h-full w-80 bg-[#0d0d0d] z-40
                        transform transition-transform duration-500 ease-in-out shadow-2xl
                        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
                    `}>
                        {/* Decorative gold bar at top */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-yellow-600 via-yellow-400 to-yellow-600"></div>

                        {/* Mobile menu content */}
                        <div className="h-full flex flex-col pt-20 px-8 pb-8 overflow-y-auto">
                            {/* Salon Branding */}
                            <div className="mb-10 text-center border-b border-gray-700 pb-6">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-wider mb-1">
                                    Elegance
                                </h2>
                                <p className="text-[#fb880a] text-sm uppercase tracking-widest">Men's Salon</p>
                            </div>

                            {/* Navigation Links with Premium Styling */}
                            <nav className="flex-1">
                                <ul className='flex flex-col gap-4 font-medium text-lg'>
                                    <li>
                                        <a
                                            href="#home"
                                            onClick={closeMobileMenu}
                                            className='block py-4 px-4 uppercase tracking-wide border-l-4 transition-all duration-300 text-gray-300 border-transparent hover:text-[#fb880a] hover:border-yellow-500 hover:bg-gray-900/30 hover:translate-x-2'
                                        >
                                            <span className="flex items-center gap-3">
                                                <i className="fas fa-home w-5"></i>
                                                Home
                                            </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#services"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                goToSection('services')
                                                closeMobileMenu()
                                            }}
                                            className='block py-4 px-4 uppercase tracking-wide border-l-4 transition-all duration-300 text-gray-300 border-transparent hover:text-[#fb880a] hover:border-yellow-500 hover:bg-gray-900/30 hover:translate-x-2'
                                        >
                                            <span className="flex items-center gap-3">
                                                <i className="fas fa-cut w-5"></i>
                                                Services
                                            </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#about"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                goToSection('about')
                                                closeMobileMenu()
                                            }}
                                            className='block py-4 px-4 uppercase tracking-wide border-l-4 transition-all duration-300 text-gray-300 border-transparent hover:text-[#fb880a] hover:border-yellow-500 hover:bg-gray-900/30 hover:translate-x-2'
                                        >
                                            <span className="flex items-center gap-3">
                                                <i className="fas fa-info-circle w-5"></i>
                                                About
                                            </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#services"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                goToSection('appointment')
                                                closeMobileMenu()
                                            }}
                                            className='block py-4 px-4 uppercase tracking-wide border-l-4 transition-all duration-300 text-gray-300 border-transparent hover:text-[#fb880a] hover:border-yellow-500 hover:bg-gray-900/30 hover:translate-x-2'
                                        >
                                            <span className="flex items-center gap-3">
                                                <i className="fas fa-plus-circle w-5"></i>
                                                Book Appointment
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>

                            {/* Account Section - Premium Card Style */}
                            <div className="mt-8">
                                <div className="bg-black rounded-lg p-4 border border-gray-900 shadow-lg">
                                    {isAuthenticated ? (
                                        <div>
                                            {/* User Info Section */}
                                            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-700">
                                                <div className="flex-1">
                                                    <p className="text-[#fb880a] font-semibold text-sm uppercase tracking-wide">My Account</p>
                                                    <p className="text-white text-lg font-medium">{currentUser?.name || 'User'}</p>
                                                    <p className="text-gray-400 text-sm">{currentUser?.email || 'user@example.com'}</p>
                                                </div>
                                            </div>

                                            {/* Navigation Links */}
                                            <div className="space-y-2">
                                                <Link
                                                    to="/account"
                                                    onClick={closeMobileMenu}
                                                    className="flex items-center gap-3 px-3 py-3 text-gray-300 hover:text-[#fb880a] hover:bg-gray-900/30 transition-colors rounded-lg"
                                                >
                                                    <i className="fas fa-user w-5"></i>
                                                    <span>My Profile</span>
                                                </Link>
                                                <Link
                                                    to="/appointments"
                                                    onClick={closeMobileMenu}
                                                    className="flex items-center gap-3 px-3 py-3 text-gray-300 hover:text-[#fb880a] hover:bg-gray-900/30 transition-colors rounded-lg"
                                                >
                                                    <i className="fas fa-calendar-alt w-5"></i>
                                                    <span>My Appointments</span>
                                                </Link>
                                                <div className="border-t border-gray-700 pt-2 mt-2">
                                                    <button
                                                        onClick={() => {
                                                            logout()
                                                            closeMobileMenu()
                                                        }}
                                                        className="flex items-center gap-3 px-3 py-3 text-gray-300 hover:text-red-400 hover:bg-gray-900/30 transition-colors rounded-lg w-full text-left"
                                                    >
                                                        <i className="fas fa-sign-out-alt w-5"></i>
                                                        <span>Logout</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            to="/login"
                                            onClick={closeMobileMenu}
                                            className="group block"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-linear-to-br from-yellow-500 to-yellow-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                    <svg className="nav-icon" width="20" height="20" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M6.5 0C2.912 0 0 2.912 0 6.5C0 10.088 2.912 13 6.5 13C10.088 13 13 10.088 13 6.5C13 2.912 10.088 0 6.5 0ZM3.4775 10.725C4.329 10.114 5.369 9.75 6.5 9.75C7.631 9.75 8.671 10.114 9.5225 10.725C8.671 11.336 7.631 11.7 6.5 11.7C5.369 11.7 4.329 11.336 3.4775 10.725ZM10.491 9.828C9.3925 8.97 8.008 8.45 6.5 8.45C4.992 8.45 3.6075 8.97 2.509 9.828C1.755 8.9245 1.3 7.7675 1.3 6.5C1.3 3.627 3.627 1.3 6.5 1.3C9.373 1.3 11.7 3.627 11.7 6.5C11.7 7.7675 11.245 8.9245 10.491 9.828Z" fill="black"></path>
                                                        <path d="M6.49961 2.59998C5.24511 2.59998 4.22461 3.62048 4.22461 4.87498C4.22461 6.12948 5.24511 7.14998 6.49961 7.14998C7.75411 7.14998 8.77461 6.12948 8.77461 4.87498C8.77461 3.62048 7.75411 2.59998 6.49961 2.59998ZM6.49961 5.84998C5.96011 5.84998 5.52461 5.41448 5.52461 4.87498C5.52461 4.33548 5.96011 3.89998 6.49961 3.89998C7.03911 3.89998 7.47461 4.33548 7.47461 4.87498C7.47461 5.41448 7.03911 5.84998 6.49961 5.84998Z" fill="black"></path>
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-white font-semibold text-sm uppercase tracking-wide group-hover:text-[#fb880a] transition-colors">My Account</p>
                                                    <p className="text-gray-400 text-xs">Login / Register</p>
                                                </div>
                                                <i className="fas fa-chevron-right text-gray-500 group-hover:text-[#fb880a] group-hover:translate-x-1 transition-all"></i>
                                            </div>
                                        </Link>
                                    )}
                                </div>

                                {/* Contact Info */}
                                <div className="mt-4 pt-4 border-t border-gray-800 text-center">
                                    <p className="text-gray-400 text-xs mb-2">BOOK APPOINTMENT</p>
                                    <a href="tel:+1234567890" className="text-[#fb880a] font-semibold hover:text-yellow-400 transition-colors">
                                        +1 (234) 567-890
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Overlay with Blur Effect */}
                    {isMobileMenuOpen && (
                        <div
                            className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-30 animate-fadeIn"
                            onClick={closeMobileMenu}
                        ></div>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Header
