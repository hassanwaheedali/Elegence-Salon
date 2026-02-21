import { useState, useRef, useEffect } from 'react'
import { services } from '../data/services'
import { useMessage } from '../Context/MessageContext.jsx'
import { useAppointment } from '../Context/AppointmentContext.jsx'
import { useAuth } from '../Context/AuthContext.jsx'

function AppoinmentFormContact() {
    const { currentUser } = useAuth()

    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState('SERVICE')
    const dropdownRef = useRef(null)

    const [service, setService] = useState('SERVICE')
    const [name, setName] = useState(currentUser ? currentUser.name : '')
    const [email, setEmail] = useState(currentUser ? currentUser.email : '')
    const [phoneNumber, setPhoneNumber] = useState(currentUser ? currentUser.phone : '')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [message, setMessage] = useState('')

    const { showMessage } = useMessage()
    const { bookAppointment } = useAppointment()

    const handleSubmit = async (e) => {
        e.preventDefault()

        // validations (same as main appointment form)
        if (service === 'SERVICE') {
            showMessage('error', 'Please select a service before submitting the form.')
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

        const formData = {
            name,
            email,
            phoneNumber,
            service,
            date,
            time,
            message
        }

        // attempt to persist booking (supports guest bookings)
        const result = await bookAppointment(formData)
        if (result && result.success) {
            showMessage('success', `Thanks! for Booking Appointment. Your Appointment has been confirmed with stylist ${result.stylist}.`)
            console.log('Appointment booked successfully!: ')
            setName('')
            setEmail('')
            setPhoneNumber('')
            setSelected('SERVICE')
            setService('SERVICE')
            setDate('')
            setTime('')
            setMessage('')
        } else {
            showMessage('error', result?.error || 'An error occurred while booking your appointment. Please try again later.')
            console.error('Error booking appointment:', result?.error)
        }

        // Reset form fields

    }

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
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
                <label className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-[#777777] ml-0.5" htmlFor="name">Full Name *</label>
                <input type="text" placeholder="Hassan Waheed Ali" id='name' value={name} onChange={(e) => setName(e.target.value)} className="w-full font-bold border-4  rounded-md border-[#454545] px-2 md:px-3 py-2 md:py-3 text-sm text-[#777777] tracking-tight bg-[#0d0d0d] hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33] mt-1.5" required />
            </div>
            <div>
                <label className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-[#777777] ml-0.5" htmlFor="email">Email Address *</label>
                <input type="email" placeholder="hassanwaheedalis@gmail.com" id='email' value={email} onChange={(e) => setEmail(e.target.value)} className="w-full font-bold border-4 rounded-md border-[#454545] px-2 md:px-3 py-2 md:py-3 text-sm text-[#777777] tracking-tight bg-[#0d0d0d] hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33] mt-1.5" required />
            </div>
            <div>
                <label className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-[#777777] ml-0.5" htmlFor="phone">Phone Number *</label>
                <input type="tel" placeholder="0336-3090793" id='phone' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full font-bold border-4 rounded-md border-[#454545] px-2 md:px-3 py-2 md:py-3 text-sm text-[#777777] tracking-tight bg-[#0d0d0d] hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33] mt-1.5" required />
            </div>
            <div className="date-time-section flex flex-col sm:flex-row gap-3 md:gap-5">
                <div className="flex-1">
                    <label className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-[#777777] ml-0.5" htmlFor="date">Date *</label>
                    <input type="date" placeholder="DATE" id='date' value={date} onChange={(e) => setDate(e.target.value)} className="w-full font-bold border-4 rounded-md border-[#454545] px-2 md:px-3 py-2 md:py-3 text-sm text-[#77777786] tracking-tight bg-[#0d0d0d] hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33] mt-1.5" required />
                </div>
                <div className="flex-1">
                    <label className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-[#777777] ml-0.5" htmlFor="time">Time *</label>
                    <input type="time" placeholder="TIME" id='time' value={time} onChange={(e) => setTime(e.target.value)} className="w-full font-bold border-4 rounded-md border-[#454545] px-2 md:px-3 py-2 md:py-3 text-sm text-[#77777786] tracking-tight bg-[#0d0d0d] hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33] mt-1.5" required />
                </div>
            </div>
            <div className="service-select w-full relative" ref={dropdownRef}>
                <label className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-[#777777] ml-0.5" htmlFor="service">Select Service *</label>
                {/* Custom Dropdown */}
                <div className="relative mt-1.5">
                    {/* Dropdown Button */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full font-bold border-4 border-[#454545] rounded-md p-2 px-3 md:px-4 py-2 md:py-3 text-sm text-[#77777786] tracking-tight bg-[#0d0d0d] text-left flex justify-between items-center hover:border-[#fb9d33] transition-colors"
                    >
                        <span>{selected}</span>
                        <span>▼</span>
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute top-full left-0 w-full bg-[#1b1b1b] rounded-md border-2 border-[#454545] z-50 max-h-60 md:max-h-70 overflow-y-auto">
                            {services.map((serviceCategory) => (
                                <div key={serviceCategory.title}>
                                    {/* Category Header */}
                                    <div className="font-bold text-[#fb9d33] bg-[#191919] px-3 md:px-4 py-2 text-xs md:text-sm tracking-wide uppercase">
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
                                            className="w-full text-left px-3 md:px-4 py-2 md:py-3 text-[#bfbdbd] hover:bg-yellow-500 hover:text-white transition-colors font-bold tracking-tight text-xs md:text-sm block"
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
            <div className="message-area">
                <label className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-[#777777] ml-0.5" htmlFor="message">Message</label>
                <textarea placeholder="Please Write Your Message" id='message' value={message} onChange={(e) => setMessage(e.target.value)} className="w-full font-semibold border-4 rounded-md border-[#454545] px-2 md:px-3 py-2 md:py-3 text-sm text-[#b5b3b3] tracking-tight bg-[#0d0d0d] hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33] mt-1.5 h-24" rows={1} />
            </div>
            <div>
                <button type="submit" className="w-full bg-[#0d0d0d] hover:bg-yellow-600 text-white border-5 border-[#454545] hover:border-white font-extrabold py-4 rounded-md text-sm md:text-base transition-colors cursor-pointer focus:outline-none mt-2 resize-none ">Book An Appoinment</button>
            </div>
        </form>
    )
}

export default AppoinmentFormContact
