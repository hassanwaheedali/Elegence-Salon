import { useState, useRef, useEffect, memo } from 'react'
import { services } from '../data/services.js'
import { useAppointment } from '../Context/AppointmentContext.jsx'
import { useAuth } from '../Context/AuthContext.jsx'
import { useMessage } from '../Context/MessageContext.jsx'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

/** =========================================================================
 *  STEP 1: THE SELECTION (Memoized to prevent WebGL background re-renders)
 *  ========================================================================= */
const Step1Selection = memo(({
    selectedService, toggleService, isOpen, setIsOpen,
    totalPrice, dropdownRef, onNext
}) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="w-full relative" ref={dropdownRef}>
                {/* Custom Multi-Select Dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className={`w-full font-black border-2 md:border-5 p-2 px-3 md:px-4 py-3 md:py-4 text-sm md:text-base tracking-tight bg-obsidian text-left flex justify-between items-center transition-colors ${isOpen ? 'border-champagne text-champagne' : 'border-[#454545] text-champagne-muted hover:border-champagne'
                            }`}
                    >
                        <span>
                            {selectedService.length === 0
                                ? 'SELECT SERVICES'
                                : `${selectedService.length} SERVICE${selectedService.length > 1 ? 'S' : ''} SELECTED`}
                        </span>
                        <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute top-full left-0 w-full bg-[#1b1b1b] border-2 md:border-5 border-champagne z-50 mt-1 max-h-60 md:max-h-70 overflow-y-auto">
                            {services.map((serviceCategory) => (
                                <div key={serviceCategory.title}>
                                    <div className="font-extrabold text-champagne bg-[#191919] px-3 md:px-4 py-2 text-xs md:text-sm tracking-wide uppercase">
                                        {serviceCategory.title}
                                    </div>
                                    {serviceCategory.items.map((service) => {
                                        const isSelected = selectedService.some(s => s.name === service.name)
                                        return (
                                            <button
                                                key={service.name}
                                                type="button"
                                                onClick={() => toggleService(service)}
                                                className={`w-full text-left px-3 md:px-4 py-2 md:py-3 transition-colors font-black tracking-tight text-xs md:text-sm flex items-center justify-between gap-2 ${isSelected
                                                    ? 'bg-champagne/10 text-champagne'
                                                    : 'text-[#bfbdbd] hover:bg-champagne/5 hover:text-white'
                                                    }`}
                                            >
                                                <span>{service.name} — {service.price}</span>
                                                <span className={`shrink-0 w-4 h-4 border-2 rounded-sm flex items-center justify-center text-[10px] transition-colors ${isSelected ? 'border-champagne bg-champagne text-black' : 'border-[#555]'
                                                    }`}>
                                                    {isSelected && '✓'}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Selected Services Chips */}
                {selectedService.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {selectedService.map(s => (
                            <span
                                key={s.name}
                                className="inline-flex items-center gap-1.5 bg-champagne/15 border border-champagne/40 text-champagne text-xs font-black px-2 py-1 rounded-sm tracking-tight"
                            >
                                {s.name} — {s.price}
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); toggleService(s) }}
                                    className="text-champagne hover:text-white transition-colors leading-none"
                                >
                                    ✕
                                </button>
                            </span>
                        ))}
                    </div>
                )}
                {selectedService.length > 0 && (
                    <div className="mt-3 text-left text-sm font-black text-champagne-muted tracking-wide">
                        TOTAL: <span className="text-champagne text-lg">${totalPrice}</span>
                    </div>
                )}
            </div>

            <div className="w-full mt-2">
                <button
                    type="button"
                    onClick={onNext}
                    className="w-full border-2 border-champagne/50 hover:border-champagne text-champagne font-black p-3 px-6 hover:bg-champagne hover:text-white transition-all duration-300 cursor-pointer uppercase tracking-widest"
                >
                    Continue to Schedule
                </button>
            </div>
        </div>
    )
})

/** =========================================================================
 *  STEP 2: THE SCHEDULE (Memoized Date & Time)
 *  ========================================================================= */
const Step2Schedule = memo(({
    date, setDate, time, setTime, onPrev, onNext
}) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full relative group">
                    <label className="absolute -top-3 left-3 bg-obsidian text-champagne px-1 text-[10px] font-bold uppercase tracking-widest z-10 transition-colors group-hover:text-white">Select Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full font-black border-2 md:border-5 border-[#454545] p-2 px-3 md:px-4 py-3 md:py-4 text-sm md:text-base text-champagne-muted tracking-tight bg-obsidian hover:border-champagne transition-colors focus:outline-none focus:border-champagne" required />
                </div>
                <div className="w-full relative group">
                    <label className="absolute -top-3 left-3 bg-obsidian text-champagne px-1 text-[10px] font-bold uppercase tracking-widest z-10 transition-colors group-hover:text-white">Choose Time</label>
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full font-black border-2 md:border-5 border-[#454545] p-2 px-3 md:px-4 py-3 md:py-4 text-sm md:text-base text-champagne-muted tracking-tight bg-obsidian hover:border-champagne transition-colors focus:outline-none focus:border-champagne" required />
                </div>
            </div>

            <div className="flex gap-4 mt-2">
                <button
                    type="button"
                    onClick={onPrev}
                    className="w-1/3 border-2 border-[#454545] hover:border-white text-white/50 hover:text-white font-black p-3 transition-all duration-300 cursor-pointer uppercase tracking-widest text-xs"
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    className="w-2/3 border-2 border-champagne/50 hover:border-champagne text-champagne font-black p-3 hover:bg-champagne hover:text-white transition-all duration-300 cursor-pointer uppercase tracking-widest text-xs"
                >
                    Final Details
                </button>
            </div>
        </div>
    )
})

/** =========================================================================
 *  STEP 3: THE DETAILS (Memoized Personal Details)
 *  ========================================================================= */
const Step3Details = memo(({
    name, setName, email, setEmail, phoneNumber, setPhoneNumber, message, setMessage, onPrev, onSubmit
}) => {
    return (
        <div className="flex flex-col gap-4">
            <input type="text" placeholder="NAME" value={name} onChange={(e) => setName(e.target.value)} className="w-full font-black border-2 md:border-5 border-[#454545] p-2 px-3 md:px-4 py-3 text-sm md:text-base text-champagne-muted tracking-tight bg-obsidian hover:border-champagne transition-colors focus:outline-none focus:border-champagne" required />
            <input type="email" placeholder="EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full font-black border-2 md:border-5 border-[#454545] p-2 px-3 md:px-4 py-3 text-sm md:text-base text-champagne-muted tracking-tight bg-obsidian hover:border-champagne transition-colors focus:outline-none focus:border-champagne" required />
            <input type="tel" placeholder="PHONE NUMBER" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full font-black border-2 md:border-5 border-[#454545] p-2 px-3 md:px-4 py-3 text-sm md:text-base text-champagne-muted tracking-tight bg-obsidian hover:border-champagne transition-colors focus:outline-none focus:border-champagne" required />
            <textarea placeholder="ADDITIONAL REQUESTS (OPTIONAL)" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full font-black border-2 md:border-5 border-[#454545] p-2 px-3 md:px-4 py-3 text-sm md:text-base text-champagne-muted tracking-tight bg-obsidian hover:border-champagne transition-colors focus:outline-none focus:border-champagne" rows={2} />

            <div className="flex gap-4 mt-2">
                <button
                    type="button"
                    onClick={onPrev}
                    className="w-1/3 border-2 border-[#454545] hover:border-white text-white/50 hover:text-white font-black p-3 transition-all duration-300 cursor-pointer uppercase tracking-widest text-xs"
                >
                    Back
                </button>
                <button
                    type="submit"
                    onClick={onSubmit}
                    className="w-2/3 border-5 border-champagne text-white font-black p-3 hover:bg-[#d28127] hover:border-white transition-all duration-300 cursor-pointer uppercase tracking-widest text-sm"
                >
                    Confirm Booking
                </button>
            </div>
        </div>
    )
})

/** =========================================================================
 *  MAIN COMPONENT (State Machine & GSAP Animations)
 *  ========================================================================= */
function Appointment() {
    const { currentUser } = useAuth()
    const { showMessage } = useMessage()
    const { bookAppointment } = useAppointment()

    // Step State Machine
    const [currentStep, setCurrentStep] = useState(1)
    const containerRef = useRef(null)

    // Form Data State
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)
    const [name, setName] = useState(currentUser ? currentUser.name : '')
    const [email, setEmail] = useState(currentUser ? currentUser.email : '')
    const [phoneNumber, setPhoneNumber] = useState(currentUser ? currentUser.phone : '')
    const [selectedService, setSelectedService] = useState([])
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [message, setMessage] = useState('')

    const totalPrice = selectedService.reduce((sum, s) => sum + parseFloat(s.price.replace('$', '')), 0)

    const toggleService = (service) => {
        setSelectedService(prev => {
            const exists = prev.find(s => s.name === service.name)
            if (exists) return prev.filter(s => s.name !== service.name)
            return [...prev, { name: service.name, price: service.price }]
        })
    }

    // Advanced GSAP Step Transition Logic
    useGSAP(() => {
        const steps = gsap.utils.toArray('.form-step')
        const easeLuxury = "cubic-bezier(0.23, 1, 0.32, 1)"

        steps.forEach((step, index) => {
            const stepNum = index + 1
            if (stepNum === currentStep) {
                // Active step slides in from right
                gsap.fromTo(step,
                    { autoAlpha: 0, x: 30 },
                    { autoAlpha: 1, x: 0, duration: 0.8, ease: easeLuxury, force3D: true, display: 'block' }
                )
            } else if (stepNum < currentStep) {
                // Previous step fades out to left
                gsap.to(step, { autoAlpha: 0, x: -30, duration: 0.6, ease: easeLuxury, force3D: true, display: 'none' })
            } else {
                // Future step instantly prepared to right
                gsap.set(step, { autoAlpha: 0, x: 30, display: 'none' })
            }
        })
    }, { dependencies: [currentStep], scope: containerRef })

    // Step Validation Handlers
    const handleNextStep1 = () => {
        if (selectedService.length === 0) {
            showMessage('warning', 'Please select at least one service to continue.')
            return
        }
        setCurrentStep(2)
    }

    const handleNextStep2 = () => {
        if (!date || !time) {
            showMessage('warning', 'Please choose a valid date and time.')
            return
        }
        if (date < new Date().toISOString().split('T')[0]) {
            showMessage('error', 'Please select a correct upcoming date.')
            return
        }
        if (time < '11:00' || time > '20:00') {
            showMessage('error', 'Please select a time between 11:00 AM and 8:00 PM.')
            return
        }
        const selectedDate = new Date(date)
        if (selectedDate.getDay() === 0) {
            showMessage('error', 'Appointments cannot be booked on Sundays. Please select another day.')
            return
        }
        setCurrentStep(3)
    }

    // Final Submission Logic (Strictly maintains existing footprint)
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!name || !email || !phoneNumber) {
            showMessage('error', 'Personal details are required.')
            return
        }
        const phonePattern = /^(03\d{2}-\d{7}|\+923\d{9})$/
        if (!phonePattern.test(phoneNumber)) {
            showMessage('error', 'Please enter a valid Pakistani phone number (e.g., 0336-3090793).')
            return
        }

        const formData = {
            name, email, phoneNumber, selectedService, date, time, message, totalPrice
        }

        const result = await bookAppointment(formData)
        if (result && result.success) {
            const assignmentSummary = result.assignments
                .map(a => `${a.service} → ${a.stylist}`)
                .join(', ')
            showMessage('success', `Booking confirmed! ${assignmentSummary}`)

            // Reset form completely & return to Step 1
            setSelectedService([])
            setDate('')
            setTime('')
            setMessage('')
            setCurrentStep(1)
        } else {
            showMessage('error', result?.error || 'An error occurred while booking.')
        }
    }

    // Dropdown Outside-Click Handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="w-full relative" ref={containerRef}>
            {/* Step Progress Indicators */}
            <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3].map((num) => (
                    <div key={num} className="flex-1 flex flex-col gap-2">
                        <div className={`h-1 w-full transition-colors duration-500 rounded-full ${num <= currentStep ? 'bg-champagne' : 'bg-white/10'}`}></div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${num <= currentStep ? 'text-champagne' : 'text-white/30'}`}>
                            Step {num}
                        </span>
                    </div>
                ))}
            </div>

            {/* GSAP Animated Step Container */}
            <form onSubmit={(e) => e.preventDefault()} className="relative">
                <div className="form-step hidden w-full">
                    <Step1Selection
                        selectedService={selectedService} toggleService={toggleService}
                        isOpen={isOpen} setIsOpen={setIsOpen}
                        totalPrice={totalPrice} dropdownRef={dropdownRef}
                        onNext={handleNextStep1}
                    />
                </div>

                <div className="form-step hidden w-full">
                    <Step2Schedule
                        date={date} setDate={setDate} time={time} setTime={setTime}
                        onPrev={() => setCurrentStep(1)} onNext={handleNextStep2}
                    />
                </div>

                <div className="form-step hidden w-full">
                    <Step3Details
                        name={name} setName={setName} email={email} setEmail={setEmail}
                        phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}
                        message={message} setMessage={setMessage}
                        onPrev={() => setCurrentStep(2)} onSubmit={handleSubmit}
                    />
                </div>
            </form>
        </div>
    )
}

export default Appointment
