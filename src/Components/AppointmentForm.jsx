import { useState, useRef, useEffect } from 'react'
import { services } from '../data/services.js'
import { useAppointment } from '../Context/AppointmentContext.jsx'
import { useAuth } from '../Context/AuthContext.jsx'
import { useMessage } from '../Context/MessageContext.jsx'

function Appointment() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    const { currentUser } = useAuth()

    const [name, setName] = useState(currentUser ? currentUser.name : '')
    const [email, setEmail] = useState(currentUser ? currentUser.email : '')
    const [phoneNumber, setPhoneNumber] = useState(currentUser ? currentUser.phone : '')
    const [selectedService, setSelectedService] = useState([])

    const totalPrice = selectedService.reduce((sum, s) => sum + parseFloat(s.price.replace('$', '')), 0)

    const toggleService = (service) => {
        setSelectedService(prev => {
            const exists = prev.find(s => s.name === service.name)
            if (exists) return prev.filter(s => s.name !== service.name)
            return [...prev, { name: service.name, price: service.price }]
        })
    }
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [message, setMessage] = useState('')

    const { showMessage } = useMessage()
    const { bookAppointment } = useAppointment()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = {
            name,
            email,
            phoneNumber,
            selectedService,
            date,
            time,
            message,
            totalPrice
        }
        if (selectedService.length === 0) {
            showMessage('error', 'Please select at least one service before submitting the form.')
            return
        }
        if (name === '' || email === '' || phoneNumber === '' || date === '' || time === '') {
            showMessage('error', 'Please fill in all required fields.')
            return
        }
        if (date < new Date().toISOString().split('T')[0]) {
            showMessage('error', 'Please select a Correct date.')
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
        const phonePattern = /^(03\d{2}-\d{7}|\+923\d{9})$/
        if (!phonePattern.test(phoneNumber)) {
            showMessage('error', 'Please enter a valid Pakistani phone number (e.g., 0336-3090793 or +9233363090793).')
            return
        }

        const result = await bookAppointment(formData)
        if (result && result.success) {
            const assignmentSummary = result.assignments
                .map(a => `${a.service} → ${a.stylist}`)
                .join(', ')
            showMessage('success', `Booking confirmed! ${assignmentSummary}`)
            console.log('Appointment booked successfully!: ', result)
            setSelectedService([])
            setDate('')
            setTime('')
        } else {
            showMessage('error', result?.error || 'An error occurred while booking your appointment. Please try again later.')
            console.error('Error booking appointment:', result?.error)
        }

    }

    // Close dropdown when clicking outside
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
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <input type="text" placeholder="NAME" id='name' value={name} onChange={(e) => setName(e.target.value)} className="w-full font-black border-2 md:border-5 border-[#454545] p-2 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-champagne-muted tracking-tight bg-obsidian hover:border-[text-champagne] transition-colors focus:outline-none focus:border-[text-champagne]" required />
                <input type="email" placeholder="EMAIL" id='email' value={email} onChange={(e) => setEmail(e.target.value)} className="w-full font-black border-2 md:border-5 border-[#454545] p-2 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-champagne-muted tracking-tight bg-obsidian hover:border-[text-champagne] transition-colors focus:outline-none focus:border-[text-champagne]" required />
                <input type="tel" placeholder="PHONE NUMBER" id='phonenumber' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full font-black border-2 md:border-5 border-[#454545] p-2 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-champagne-muted tracking-tight bg-obsidian hover:border-[text-champagne] transition-colors focus:outline-none focus:border-[text-champagne]" required />
                <div className="date-time-section flex flex-col sm:flex-row gap-3 md:gap-5">
                    <input type="date" placeholder="DATE" id='date' value={date} onChange={(e) => setDate(e.target.value)} className="w-full font-black border-2 md:border-5 border-[#454545] p-2 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-champagne-muted tracking-tight bg-obsidian hover:border-[text-champagne] transition-colors focus:outline-none focus:border-[text-champagne]" required />
                    <input type="time" placeholder="TIME" id='time' value={time} onChange={(e) => setTime(e.target.value)} className="w-full font-black border-2 md:border-5 border-[#454545] p-2 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-champagne-muted tracking-tight bg-obsidian hover:border-[text-champagne] transition-colors focus:outline-none focus:border-[text-champagne]" required />
                </div>
                <div className="service-select w-full relative" ref={dropdownRef}>
                    {/* Custom Multi-Select Dropdown */}
                    <div className="relative">
                        {/* Dropdown Button */}
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className={`w-full font-black border-2 md:border-5 p-2 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base tracking-tight bg-obsidian text-left flex justify-between items-center transition-colors ${isOpen ? 'border-[text-champagne] text-champagne' : 'border-[#454545] text-champagne-muted hover:border-[text-champagne]'
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
                            <div className="absolute top-full left-0 w-full bg-[#1b1b1b] border-2 md:border-5 border-[text-champagne] z-50 mt-1 max-h-60 md:max-h-70 overflow-y-auto">
                                {services.map((serviceCategory) => (
                                    <div key={serviceCategory.title}>
                                        {/* Category Header */}
                                        <div className="font-extrabold text-champagne bg-[#191919] px-3 md:px-4 py-2 text-xs md:text-sm tracking-wide uppercase">
                                            {serviceCategory.title}
                                        </div>

                                        {/* Service Options */}
                                        {serviceCategory.items.map((service) => {
                                            const isSelected = selectedService.some(s => s.name === service.name)
                                            return (
                                                <button
                                                    key={service.name}
                                                    type="button"
                                                    onClick={() => toggleService(service)}
                                                    className={`w-full text-left px-3 md:px-4 py-2 md:py-3 transition-colors font-black tracking-tight text-xs md:text-sm flex items-center justify-between gap-2 ${isSelected
                                                        ? 'bg-[text-champagne]/10 text-champagne'
                                                        : 'text-[#bfbdbd] hover:bg-[text-champagne]/5 hover:text-white'
                                                        }`}
                                                >
                                                    <span>{service.name} — {service.price}</span>
                                                    <span className={`shrink-0 w-4 h-4 border-2 rounded-sm flex items-center justify-center text-[10px] transition-colors ${isSelected ? 'border-[text-champagne] bg-[text-champagne] text-black' : 'border-[#555]'
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
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedService.map(s => (
                                <span
                                    key={s.name}
                                    className="inline-flex items-center gap-1.5 bg-[text-champagne]/15 border border-[text-champagne]/40 text-champagne text-xs font-black px-2 py-1 rounded-sm tracking-tight mt-1.5"
                                >
                                    {s.name} — {s.price}
                                    <button
                                        type="button"
                                        onClick={() => toggleService(s)}
                                        className="text-champagne hover:text-white transition-colors leading-none"
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Total Price */}
                    {selectedService.length > 0 && (
                        <div className="mt-2.5 text-left text-xs font-black text-champagne-muted tracking-wide">
                            TOTAL: <span className="text-champagne">${totalPrice}</span>
                        </div>
                    )}
                </div>
                <div className="message-section">
                    <textarea placeholder="MESSAGE" id='message' value={message} onChange={(e) => setMessage(e.target.value)} className="w-full font-black border-2 md:border-5 border-[#454545] p-2 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-champagne-muted tracking-tight bg-obsidian hover:border-[text-champagne] transition-colors focus:outline-none focus:border-[text-champagne]" rows={1} />
                </div>
            </div>
            <div className="submit-btn w-full mt-4">
                <button type="submit" className="w-full border-5 border-[text-champagne] hover:border-white  text-white font-black p-3 px-6 hover:bg-[#d28127] transition-colors cursor-pointer">
                    BOOK APPOINTMENT
                </button>
            </div>
        </form>
    )
}

export default Appointment
