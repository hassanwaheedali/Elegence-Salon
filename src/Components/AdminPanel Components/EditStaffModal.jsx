import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, User, Mail, Phone, Briefcase, Scissors, Clock, BriefcaseBusiness, Star, ImagePlus } from 'lucide-react';
import { useStaff } from '../../Context/StaffContext';

const EditStaffModal = ({ onClose, onStaffUpdated, staffToEdit }) => {
    const { updateStaff } = useStaff();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        specialties: '',
        experience: '',
        rating: 5.0,
        commission: 0.3,
        weekdayStart: '',
        weekdayEnd: '',
        saturdayStart: '',
        saturdayEnd: '',
        sundayStart: '',
        sundayEnd: '',
        sundayEnabled: false,
        schedule: {}
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);

    // Populate form with passed prop data on mount/change
    useEffect(() => {
        if (!staffToEdit) {
            onClose();
            return;
        }

        // Flatten schedule for form inputs
        const schedule = staffToEdit.schedule || {};
        const monday = schedule.monday || { start: "09:00", end: "17:00" };
        const saturday = schedule.saturday || { start: "10:00", end: "16:00" };
        const sunday = schedule.sunday || null;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
            name: staffToEdit.name || '',
            email: staffToEdit.email || '',
            phone: staffToEdit.phone || '',
            role: staffToEdit.role || '',
            specialties: Array.isArray(staffToEdit.specialties)
                ? staffToEdit.specialties.join(', ')
                : (staffToEdit.specialties || ''),
            experience: staffToEdit.experience || '',
            rating: staffToEdit.rating || 5.0,
            commission: staffToEdit.commission || 0.3,

            // Set timing defaults from existing record
            weekdayStart: monday.start,
            weekdayEnd: monday.end,
            saturdayStart: saturday.start,
            saturdayEnd: saturday.end,

            sundayEnabled: !!sunday,
            sundayStart: sunday ? sunday.start : '',
            sundayEnd: sunday ? sunday.end : '',

            schedule: schedule
        });

        // Pre-populate avatar preview from existing staff data
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAvatarPreview(staffToEdit.avatar || null);

    }, [staffToEdit, onClose]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate WebP format
        if (file.type !== 'image/webp') {
            setError('Only WebP format images are supported. Please select a .webp file.');
            e.target.value = '';
            return;
        }

        setError('');
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveAvatar = () => {
        setAvatarPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!formData.name || !formData.email || !formData.phone || !formData.role || !formData.specialties) {
            setError('Please fill in all required fields');
            setIsLoading(false);
            return;
        }

        // Reconstruct schedule object
        const updatedSchedule = { ...formData.schedule };

        if (formData.weekdayStart && formData.weekdayEnd) {
            const weekdayTime = { start: formData.weekdayStart, end: formData.weekdayEnd };
            updatedSchedule.monday = weekdayTime;
            updatedSchedule.tuesday = weekdayTime;
            updatedSchedule.wednesday = weekdayTime;
            updatedSchedule.thursday = weekdayTime;
            updatedSchedule.friday = weekdayTime;
        }

        if (formData.saturdayStart && formData.saturdayEnd) {
            updatedSchedule.saturday = { start: formData.saturdayStart, end: formData.saturdayEnd };
        }

        if (formData.sundayEnabled && formData.sundayStart && formData.sundayEnd) {
            updatedSchedule.sunday = { start: formData.sundayStart, end: formData.sundayEnd };
        } else if (!formData.sundayEnabled) {
            updatedSchedule.sunday = null;
        }

        const updatedStaffData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s),
            experience: formData.experience,
            rating: parseFloat(formData.rating),
            commission: parseFloat(formData.commission),
            schedule: updatedSchedule,
            avatar: avatarPreview || null
        };

        // Call update staff function
        const result = await updateStaff(staffToEdit.id, updatedStaffData);
        setIsLoading(false);

        if (result?.error) {
            setError(result.error);
        } else {
            // Success
            onStaffUpdated?.({ ...updatedStaffData, id: staffToEdit.id });
            onClose();
        }
    };

    return createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
            <div className="bg-obsidian-surface border border-white/10 w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl animate-scale-in flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5 bg-obsidian-surface">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="bg-champagne/10 p-1.5 sm:p-2 rounded-lg">
                            <EditIcon size={18} className="text-champagne" />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-xl font-bold text-white">Edit Stylist</h2>
                            <p className="text-[10px] sm:text-xs text-champagne-muted">Update staff member information</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-4 sm:p-6 overflow-y-auto">
                    {error && (
                        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Profile Picture Upload */}
                        <div className="space-y-1.5">
                            <label className="text-gray-400 text-xs font-bold uppercase ml-1">Profile Picture (Optional)</label>
                            <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-obsidian-elevated border-2 border-dashed border-[#333] flex items-center justify-center shrink-0 group">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImagePlus size={20} className="text-[#555]" />
                                    )}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-xs font-bold text-champagne hover:text-champagne-dark transition-colors cursor-pointer"
                                    >
                                        {avatarPreview ? 'Change Photo' : 'Upload Photo'}
                                    </button>
                                    {avatarPreview && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveAvatar}
                                            className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                                        >
                                            Remove
                                        </button>
                                    )}
                                    <p className="text-[#555] text-[10px]">WebP format only (.webp)</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".webp,image/webp"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-champagne uppercase tracking-wider mb-2">Personal Details</h3>

                            <div className="space-y-1.5">
                                <label className="text-gray-400 text-xs font-bold uppercase ml-1">Full Name *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-champagne-muted">
                                        <User size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. John Doe"
                                        className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full pl-10 p-2.5 outline-none transition-all placeholder-gray-700"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-gray-400 text-xs font-bold uppercase ml-1">Email *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-champagne-muted">
                                            <Mail size={16} />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full pl-10 p-2.5 outline-none transition-all placeholder-gray-700"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-gray-400 text-xs font-bold uppercase ml-1">Phone *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-champagne-muted">
                                            <Phone size={16} />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+1 (555) 000-0000"
                                            className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full pl-10 p-2.5 outline-none transition-all placeholder-gray-700"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-white/5 my-2"></div>

                        {/* Professional Info */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-champagne uppercase tracking-wider mb-2">Professional Info</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-gray-400 text-xs font-bold uppercase ml-1">Role *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-champagne-muted">
                                            <Briefcase size={16} />
                                        </div>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full pl-10 p-2.5 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Select Role</option>
                                            <option value="Senior Stylist">Senior Stylist</option>
                                            <option value="Junior Barber">Junior Barber</option>
                                            <option value="Color Specialist">Color Specialist</option>
                                            <option value="Makeup Artist">Makeup Artist</option>
                                            <option value="Nail Technician">Nail Technician</option>
                                            <option value="Esthetician">Esthetician</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-gray-400 text-xs font-bold uppercase ml-1">Commission (0.0 - 1.0)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-champagne-muted">
                                            <BriefcaseBusiness size={16} />
                                        </div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="1"
                                            name="commission"
                                            value={formData.commission}
                                            onChange={handleChange}
                                            className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full pl-10 p-2.5 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Experience */}
                                <div className="space-y-1.5">
                                    <label className="text-gray-400 text-xs font-bold uppercase ml-1">Experience</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-champagne-muted">
                                            <Briefcase size={16} />
                                        </div>
                                        <select
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full pl-10 p-2.5 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Use default (New)</option>
                                            <option value="1 year">1 year</option>
                                            <option value="2 years">2 years</option>
                                            <option value="3 years">3 years</option>
                                            <option value="4 years">4 years</option>
                                            <option value="5 years">5 years</option>
                                            <option value="7 years">7 years</option>
                                            <option value="10+ years">10+ years</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-gray-400 text-xs font-bold uppercase ml-1">Rating</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-champagne-muted">
                                            <Star size={16} />
                                        </div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="5"
                                            name="rating"
                                            value={formData.rating}
                                            onChange={handleChange}
                                            className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full pl-10 p-2.5 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-gray-400 text-xs font-bold uppercase ml-1">Specialties * (comma separated)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-champagne-muted">
                                        <Scissors size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        name="specialties"
                                        value={formData.specialties}
                                        onChange={handleChange}
                                        placeholder="Haircut, Color, Styling..."
                                        className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full pl-10 p-2.5 outline-none transition-all placeholder-gray-700"
                                    />
                                </div>
                                <p className="text-[#555] text-xs ml-1">Example: Haircut, Color, Styling</p>
                            </div>
                        </div>

                        <div className="h-px bg-white/5 my-2"></div>

                        {/* Schedule Section */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-champagne uppercase tracking-wider mb-2">Schedule Configuration</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-champagne-muted text-[11px] font-semibold uppercase ml-1">Weekdays Start</label>
                                    <input
                                        type="time"
                                        name="weekdayStart"
                                        value={formData.weekdayStart}
                                        onChange={handleChange}
                                        className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full p-2.5 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-champagne-muted text-[11px] font-semibold uppercase ml-1">Weekdays End</label>
                                    <input
                                        type="time"
                                        name="weekdayEnd"
                                        value={formData.weekdayEnd}
                                        onChange={handleChange}
                                        className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full p-2.5 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-champagne-muted text-[11px] font-semibold uppercase ml-1">Saturday Start</label>
                                    <input
                                        type="time"
                                        name="saturdayStart"
                                        value={formData.saturdayStart}
                                        onChange={handleChange}
                                        className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full p-2.5 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-champagne-muted text-[11px] font-semibold uppercase ml-1">Saturday End</label>
                                    <input
                                        type="time"
                                        name="saturdayEnd"
                                        value={formData.saturdayEnd}
                                        onChange={handleChange}
                                        className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full p-2.5 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="bg-obsidian-surface p-3 rounded-lg border border-white/5 space-y-3">
                                <label className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="sundayEnabled"
                                        checked={formData.sundayEnabled}
                                        onChange={handleChange}
                                        className="accent-champagne"
                                    />
                                    Enable Sunday Working Hours
                                </label>

                                {formData.sundayEnabled && (
                                    <div className="grid grid-cols-2 gap-4 animate-fade-in">
                                        <div className="space-y-1.5">
                                            <label className="text-champagne-muted text-[11px] font-semibold uppercase ml-1">Start</label>
                                            <input
                                                type="time"
                                                name="sundayStart"
                                                value={formData.sundayStart}
                                                onChange={handleChange}
                                                className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full p-2.5 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-champagne-muted text-[11px] font-semibold uppercase ml-1">End</label>
                                            <input
                                                type="time"
                                                name="sundayEnd"
                                                value={formData.sundayEnd}
                                                onChange={handleChange}
                                                className="bg-obsidian-elevated border border-[#333] text-white text-sm rounded-lg focus:ring-1 focus:ring-champagne focus:border-champagne block w-full p-2.5 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-white/5 bg-obsidian-surface flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !formData.name || !formData.email || !formData.phone || !formData.role || !formData.specialties}
                        className="px-6 py-2 bg-champagne hover:bg-champagne-dark text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-champagne/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={16} />
                        Update Stylist
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
};

// Internal icon component if not imported
const EditIcon = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

export default EditStaffModal;
