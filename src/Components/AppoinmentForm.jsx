import { useState, useRef, useEffect } from 'react'
import { services } from '../data/services'
import { useAppointment } from '../Context/AppointmentContext.jsx'
import { useAuth } from '../Context/AuthContext.jsx'

function Appoinment() {
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState('SERVICE')
    const dropdownRef = useRef(null)

    const { currentUser } = useAuth()

    const [name, setName] = useState(currentUser ? currentUser.name : '')
    const [email, setEmail] = useState(currentUser ? currentUser.email : '')
    const [phoneNumber, setPhoneNumber] = useState(currentUser ? currentUser.phone : '')
    const [service, setService] = useState('SERVICE')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [message, setMessage] = useState('')

    const { bookAppointment } = useAppointment()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = {
            name,
            email,
            phoneNumber,
            service,
            date,
            time,
            message
        }
        if (service === 'SERVICE') {
            alert('Please select a service before submitting the form.')
            return
        }
        if (name === '' || email === '' || phoneNumber === '' || date === '' || time === '') {
            alert('Please fill in all required fields.')
            return
        }
        if (date < new Date().toISOString().split('T')[0]) {
            alert('Please select a Correct date.')
            return
        }
        if (time < '11:00' || time > '20:00') {
            alert('Please select a time between 11:00 AM and 8:00 PM.')
            return
        }
        const selectedDate = new Date(date)
        if (selectedDate.getDay() === 0) {
            alert('Appointments cannot be booked on Sundays. Please select another day.')
            return
        }
        const phonePattern = /^(03\d{2}-\d{7}|\+923\d{9})$/
        if (!phonePattern.test(phoneNumber)) {
            alert('Please enter a valid Pakistani phone number (e.g., 0336-3090793 or +9233363090793).')
            return
        }

        const result = await bookAppointment(formData)
        if (result && result.success) {
            alert('Thanks! for Booking Appointment With US We will confirm Your Slot.')
            console.log('Appointment booked successfully!: ')
        } else {
            alert('Failed to book appointment. Please try again.')
            console.error('Error booking appointment:', result.error)
        }
        
        // Reset form fields
        setService('SERVICE')
        setDate('')
        setTime('')
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
                <input type="text" placeholder="NAME" id='name' value={name} onChange={(e) => setName(e.target.value)} className="w-full font-black border-2 md:border-5 border-[#454545] p-2 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-[#777777] tracking-tight bg-[#0d0d0d] hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33]" required />
                <input type="email" placeholder="EMAIL" id='email' value={email} onChange={(e) => setEmail(e.target.value)} className="w-full font-black border-2 md:border-5 border-[#454545] p-2 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-[#777777] tracking-tight bg-[#0d0d0d] hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33]" required />
                <input type="tel" placeholder="PHONE NUMBER" id='phonenumber' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full font-black border-2 md:border-5 border-[#454545] p-2 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-[#777777] tracking-tight bg-[#0d0d0d] hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33]" required />
                <div className="date-time-section flex flex-col sm:flex-row gap-3 md:gap-5">
                    <input type="date" placeholder="DATE" id='date' value={date} onChange={(e) => setDate(e.target.value)} className="w-full font-black border-2 md:border-5 border-[#454545] p-2 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-[#777777] tracking-tight bg-[#0d0d0d] hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33]" required />
                    <input type="time" placeholder="TIME" id='time' value={time} onChange={(e) => setTime(e.target.value)} className="w-full font-black border-2 md:border-5 border-[#454545] p-2 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-[#777777] tracking-tight bg-[#0d0d0d] hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33]" required />
                </div>
                <div className="service-select w-full relative" ref={dropdownRef}>
                    {/* Custom Dropdown */}
                    <div className="relative">
                        {/* Dropdown Button */}
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full font-black border-2 md:border-5 border-[#454545] p-2 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-[#777777] tracking-tight bg-[#0d0d0d] text-left flex justify-between items-center hover:border-[#fb9d33] transition-colors"
                        >
                            <span>{selected}</span>
                            <span>▼</span>
                        </button>

                        {/* Dropdown Menu */}
                        {isOpen && (
                            <div className="absolute top-full left-0 w-full bg-[#1b1b1b] border-2 md:border-5 border-[#454545] z-50 mt-1 max-h-60 md:max-h-70 overflow-y-auto">
                                {services.map((serviceCategory) => (
                                    <div key={serviceCategory.title}>
                                        {/* Category Header */}
                                        <div className="font-extrabold text-[#fb9d33] bg-[#191919] px-3 md:px-4 py-2 text-xs md:text-sm tracking-wide uppercase">
                                            {serviceCategory.title}
                                        </div>

                                        {/* Service Options */}
                                        {serviceCategory.items.map((service) => (
                                            <button
                                                key={service.name}
                                                onClick={() => {
                                                    setSelected(`${service.name} - ${service.price}`)
                                                    setService(`${service.name}`)
                                                    setIsOpen(false)
                                                }}
                                                className="w-full text-left px-3 md:px-4 py-2 md:py-3 text-[#bfbdbd] hover:bg-yellow-500 hover:text-white transition-colors font-black tracking-tight text-xs md:text-sm block"
                                            >
                                                {service.name} - {service.price}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Hidden input for form submission */}
                    <input type="hidden" id="service" value={selected === 'SERVICE' ? '' : selected} required />
                </div>
                <div className="message-section">
                    <textarea placeholder="MESSAGE" id='message' value={message} onChange={(e) => setMessage(e.target.value)} className="w-full font-black border-2 md:border-5 border-[#454545] p-2 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-[#777777] tracking-tight bg-[#0d0d0d] hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33]" rows={1} />
                </div>
            </div>
            <div className="submit-btn w-full mt-6">
                <button type="submit" className="w-full border-5 border-[#fb9d33] hover:border-white  text-white font-black p-3 px-6 hover:bg-[#d28127] transition-colors cursor-pointer">
                    BOOK APPOINTMENT
                </button>
            </div>
        </form>
    )
}

export default Appoinment
