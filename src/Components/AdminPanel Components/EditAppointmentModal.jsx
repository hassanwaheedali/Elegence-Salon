import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useAppointment } from '../../Context/AppointmentContext'
import { useMessage } from '../../Context/MessageContext'
import { services } from '../../data/services'

// Convert MM/DD/YYYY to YYYY-MM-DD for date input
const convertToInputFormat = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

// Keep storage format consistent (use ISO YYYY-MM-DD).
// Booking form already provides YYYY-MM-DD; persist same format so views stay consistent.
const convertToStorageFormat = (dateStr) => {
    if (!dateStr) return ''
    // dateStr from <input type="date"> is already YYYY-MM-DD — keep it as-is
    return dateStr
}

const EditAppointmentModal = ({ appointment, onClose }) => {
    const { updateAppointment } = useAppointment()
    const [formData, setFormData] = useState({
        ...appointment,
        // normalize appointment.date for input (accept MM/DD/YYYY or YYYY-MM-DD)
        date: convertToInputFormat(appointment.date)
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const { showMessage } = useMessage()

    const handleChange = (e) => {
        const { name, value } = e.target

        // When service changes, also update the stored price if available
        if (name === 'service') {
            let foundPrice = ''
            for (const cat of services) {
                const found = cat.items.find(i => i.name === value)
                if (found) {
                    foundPrice = found.price
                    break
                }
            }
            setFormData(prev => ({ ...prev, service: value, price: foundPrice }))
            return
        }

        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            // Basic validations (same rules as booking form)
            const todayStr = new Date().toISOString().split('T')[0] // YYYY-MM-DD
            const selectedDate = formData.date // already YYYY-MM-DD

            if (!selectedDate) {
                showMessage('error', 'Please choose a valid date')
                setLoading(false)
                return
            }

            if (selectedDate < todayStr) {
                showMessage('error', 'Please select a valid future date')
                setLoading(false)
                return
            }

            const dayOfWeek = new Date(selectedDate).getDay()
            if (dayOfWeek === 0) {
                showMessage('error', 'Appointments cannot be booked on Sundays. Please select another day.')
                setLoading(false)
                return
            }

            if (!formData.time || formData.time < '11:00' || formData.time > '20:00') {
                showMessage('error', 'Please select a time between 11:00 and 20:00.')
                setLoading(false)
                return
            }

            // stylist availability is validated inside AppointmentContext.updateAppointment
            // so we don't duplicate that check here — the context will return an error if unavailable.

            // Prepare data (store date as YYYY-MM-DD for consistency)
            const dataToSave = {
                ...formData,
                date: convertToStorageFormat(formData.date)
            }

            const response = await updateAppointment(appointment.id, dataToSave)
            if (response.success) {
                showMessage('success', 'Appointment updated successfully')
                onClose()
            } else {
                showMessage('error', response.error || 'Failed to update appointment')
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#121212] border border-[#333] w-full max-w-lg rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-[#333]">
                    <h2 className="text-xl font-bold text-white">Edit Appointment</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-2.5 text-white text-sm focus:border-[#FF8A00] outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Time</label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-2.5 text-white text-sm focus:border-[#FF8A00] outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Client Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-2.5 text-white text-sm focus:border-[#FF8A00] outline-none transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Service</label>
                        <select
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-2.5 text-white text-sm focus:border-[#FF8A00] outline-none transition-colors"
                        >
                            {services.map((cat) => (
                                <optgroup key={cat.title} label={cat.title} className="text-sm">
                                    {cat.items.map((it) => (
                                        <option key={it.name} value={it.name}>{it.name} - {it.price}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-2.5 text-white text-sm focus:border-[#FF8A00] outline-none transition-colors"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Awaiting Confirmation">Awaiting Confirmation</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-transparent border border-[#333] text-gray-400 hover:text-white rounded-lg text-sm font-bold transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-[#FF8A00] hover:bg-[#e67a00] text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditAppointmentModal
