import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useAppointment } from '../../Context/AppointmentContext'

const EditAppointmentModal = ({ appointment, onClose }) => {
    const { updateAppointment } = useAppointment()
    const [formData, setFormData] = useState({ ...appointment })
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await updateAppointment(appointment.id, formData)
            if (response.success) {
                onClose()
            } else {
                alert(response.error)
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
                            <option value="Classic Haircut">Classic Haircut</option>
                            <option value="Shave">Shave</option>
                            <option value="Beard Trim">Beard Trim</option>
                            <option value="Hair Coloring">Hair Coloring</option>
                            <option value="Facial">Facial</option>
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
