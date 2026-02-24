import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useAppointment } from '../../Context/AppointmentContext'
import { useMessage } from '../../Context/MessageContext'
import { useStaff } from '../../Context/StaffContext'
import { services as serviceCatalog } from '../../data/services'

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
    const { getAvailableStaff } = useStaff()
    const dropdownRef = useRef(null)
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        ...appointment,
        // normalize appointment.date for input (accept MM/DD/YYYY or YYYY-MM-DD)
        date: convertToInputFormat(appointment.date),
        services: appointment.services || [],
        stylists: appointment.stylists || []
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const { showMessage } = useMessage()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const totalPrice = formData.services.reduce((sum, s) => sum + parseFloat(s.price?.replace('$', '') || 0), 0)

    const toggleService = (service) => {
        setFormData(prev => {
            const currentServices = prev.services || []
            const currentStylists = prev.stylists || []
            const existsIndex = currentServices.findIndex(s => s.name === service.name)

            if (existsIndex >= 0) {
                const nextServices = currentServices.filter((_, i) => i !== existsIndex)
                const nextStylists = currentStylists.filter((_, i) => i !== existsIndex)
                return { ...prev, services: nextServices, stylists: nextStylists }
            }

            const alreadyAssignedIds = currentStylists.map(s => s.id)
            const available = getAvailableStaff(prev.date, prev.time, service.name)
            const chosen = available.find(s => !alreadyAssignedIds.includes(s.id))

            if (!chosen) {
                showMessage('error', `No stylist available for "${service.name}" at the selected time.`)
                return prev
            }

            return {
                ...prev,
                services: [...currentServices, { name: service.name, price: service.price }],
                stylists: [...currentStylists, {
                    id: chosen.id,
                    name: chosen.name,
                    email: chosen.email,
                    phone: chosen.phone,
                    commission: chosen.commission
                }]
            }
        })
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
            const assignedIds = []
            const newStylists = []

            for (let i = 0; i < formData.services.length; i++) {
                const svc = formData.services[i]
                const currentStylist = formData.stylists[i]
                const available = getAvailableStaff(formData.date, formData.time, svc.name)

                if (!available.length) {
                    showMessage('error', `No stylists available for "${svc.name}" at the selected time.`)
                    setLoading(false)
                    return
                }

                const keepCurrent = currentStylist && available.some(s => s.id === currentStylist.id) && !assignedIds.includes(currentStylist.id)
                const chosen = keepCurrent
                    ? available.find(s => s.id === currentStylist.id)
                    : available.find(s => !assignedIds.includes(s.id))

                if (!chosen) {
                    showMessage('error', `No stylist available for "${svc.name}" at the selected time.`)
                    setLoading(false)
                    return
                }

                assignedIds.push(chosen.id)
                newStylists.push({
                    id: chosen.id,
                    name: chosen.name,
                    email: chosen.email,
                    phone: chosen.phone,
                    commission: chosen.commission
                })
            }

            const dataToSave = {
                ...formData,
                date: convertToStorageFormat(formData.date),
                totalPrice,
                stylists: newStylists
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
            <div className="bg-obsidian-surface border border-[#333] w-full max-w-lg rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-[#333]">
                    <h2 className="text-xl font-bold text-white">Edit Appointment</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-champagne-muted mb-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full bg-obsidian-elevated border border-[#333] rounded-lg p-2.5 text-white text-sm focus:border-champagne outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-champagne-muted mb-1">Time</label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="w-full bg-obsidian-elevated border border-[#333] rounded-lg p-2.5 text-white text-sm focus:border-champagne outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-champagne-muted mb-1">Client Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-obsidian-elevated border border-[#333] rounded-lg p-2.5 text-white text-sm focus:border-champagne outline-none transition-colors"
                        />
                    </div>

                    <div ref={dropdownRef} className="relative">
                        <label className="block text-xs font-bold uppercase text-champagne-muted mb-1">Services</label>
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className={`w-full bg-obsidian-elevated border rounded-lg p-2.5 text-sm text-left flex items-center justify-between transition-colors ${isOpen ? 'border-champagne text-champagne' : 'border-[#333] text-white hover:border-champagne'
                                }`}
                        >
                            <span>
                                {formData.services.length === 0
                                    ? 'Select services'
                                    : `${formData.services.length} service${formData.services.length > 1 ? 's' : ''} selected`}
                            </span>
                            <span className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                        </button>

                        {isOpen && (
                            <div className="absolute top-full left-0 w-full mt-1 bg-obsidian-surface border border-[#333] rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                                {serviceCatalog.map(category => (
                                    <div key={category.title}>
                                        <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-champagne bg-obsidian-elevated">
                                            {category.title}
                                        </div>
                                        {category.items.map((service) => {
                                            const isSelected = formData.services.some(s => s.name === service.name)
                                            return (
                                                <button
                                                    key={service.name}
                                                    type="button"
                                                    onClick={() => toggleService(service)}
                                                    className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between transition-colors ${isSelected
                                                            ? 'bg-champagne/10 text-champagne'
                                                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                                        }`}
                                                >
                                                    <span>{service.name} — {service.price}</span>
                                                    <span className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center text-[10px] ${isSelected ? 'border-champagne bg-champagne text-black' : 'border-[#555]'
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

                        {formData.services.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {formData.services.map((s, i) => (
                                    <span key={`${s.name}-${i}`} className="inline-flex items-center gap-1.5 bg-champagne/10 border border-champagne/30 text-champagne text-xs font-bold px-2 py-1 rounded-md">
                                        {s.name} — {s.price}
                                        <button type="button" onClick={() => toggleService(s)} className="hover:text-white">✕</button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {formData.stylists.length > 0 && (
                            <div className="mt-2 text-xs text-gray-400">
                                Stylists: <span className="text-white font-semibold">{formData.stylists.map(s => s.name).join(', ')}</span>
                            </div>
                        )}

                        {formData.services.length > 0 && (
                            <div className="mt-2 text-xs text-gray-400">
                                Total: <span className="text-champagne font-bold">${totalPrice}</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-champagne-muted mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-obsidian-elevated border border-[#333] rounded-lg p-2.5 text-white text-sm focus:border-champagne outline-none transition-colors"
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
                            className="px-4 py-2 bg-champagne hover:bg-champagne-dark text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50 cursor-pointer"
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
