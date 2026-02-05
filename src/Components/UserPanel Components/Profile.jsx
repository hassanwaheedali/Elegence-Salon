import { useState } from 'react'
import { useAuth } from '../../Context/AuthContext.jsx'

function Profile() {
    const { currentUser, updatedUser } = useAuth()

    // Profile form state
    const [profileData, setProfileData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || ''
    })
    
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isFadingOut, setIsFadingOut] = useState(false)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('success') // 'success' or 'error'

    // Helper function to show message with fade-out
    const showMessage = (msg, type) => {
        setMessage(msg)
        setMessageType(type)
        setIsSubmitted(true)
        setIsFadingOut(false)
        
        // Start fade-out animation 2.5 seconds in, then hide completely at 3 seconds
        setTimeout(() => setIsFadingOut(true), 2500)
        setTimeout(() => {
            setIsSubmitted(false)
            setIsFadingOut(false)
        }, 3000)
    }

    // Handle profile input changes
    const handleProfileChange = (e) => {
        const { name, value } = e.target
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Handle profile submit
    const handleProfileSubmit = async (e) => {
        e.preventDefault()

        if (!currentUser) return
        if (profileData.name === currentUser.name && profileData.phone === currentUser.phone) {
            showMessage('No changes made to profile', 'error')
            return
        }

        const phonePattern = /^(03\d{2}-\d{7}|\+923\d{9})$/
        if (!phonePattern.test(profileData.phone)) {
            showMessage('Please enter a valid Pakistani phone number (e.g., 0336-3090793 or +9233363090793).', 'error')
            return
        }
        if (profileData.phone.length < 11) {
            showMessage('Phone number must be at least 11 digits', 'error')
            return
        }

        try {
            const updatedUserData = {
                ...currentUser,
                name: profileData.name,
                phone: profileData.phone
            }
            const result = await updatedUser(updatedUserData)

            if (result.success) {
                showMessage('Profile updated successfully!', 'success')
            } else {
                showMessage('Error updating profile: ' + result.error, 'error')
            }
        } catch (error) {
            showMessage('Error updating profile: ' + error.message, 'error')
        }
    }

    return (
        <div className="bg-[#161515] px-6 sm:px-8 pb-12 sm:pb-14 shadow-lg rounded-lg transition-all duration-500" id='profile'>
            <div className="head-background bg-[#1a1a1a] w-[calc(100%+3rem)] sm:w-[calc(100%+4rem)] -mx-6 sm:-mx-8 -mt-8 px-6 sm:px-8 py-6 sm:py-8 mb-6 rounded-t-lg">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#fb9d33] mt-1"><span className="text-white">Profile</span> Settings</h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-8">
                {/* Name Field */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-[#777777] font-semibold mb-1" htmlFor='name'>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={profileData.name}
                            onChange={handleProfileChange}
                            className="w-full font-bold border-4 rounded-md border-[#454545] px-2 md:px-3 py-2 md:py-3 text-sm text-white tracking-tight bg-[#0d0d0d] hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33] mt-1.5"
                            placeholder="Enter your full name"
                            id='name'
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-[#777777] font-semibold mb-1" htmlFor='email'>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            className="w-full font-bold border-4 rounded-md border-[#454545] px-2 md:px-3 py-2 md:py-3 text-sm text-[#777777] tracking-tight bg-[#0d0d0d] hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33] mt-1.5 cursor-not-allowed"
                            placeholder="Enter your email"
                            id='email'
                            readOnly
                        />
                    </div>
                </div>

                {/* Phone Field */}
                <div>
                    <label className="block text-[#777777] font-semibold mb-1" htmlFor='phone'>Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="w-full font-bold border-4 rounded-md border-[#454545] px-2 md:px-3 py-2 md:py-3 text-sm text-white tracking-tight bg-[#0d0d0d] hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33] mt-1.5"
                        placeholder="Enter your phone number"
                        id='phone'
                    />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        className="px-8 py-4 bg-[#0d0d0d] hover:bg-yellow-600 text-white border-5 border-[#454545] hover:border-white font-extrabold rounded-md text-sm md:text-base transition-colors cursor-pointer focus:outline-none"
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        className="px-8 py-4 bg-[#0d0d0d] text-white border-5 border-[#454545] hover:border-red-600 font-extrabold rounded-md text-sm md:text-base transition-colors cursor-pointer focus:outline-none"
                    >
                        Cancel
                    </button>
                </div>
            </form>
            
            {/* Success/Error Message */}
            {isSubmitted && (
                <div className={`mt-6 p-4 rounded-lg border transition-all duration-500 ease-out transform ${
                    isFadingOut 
                        ? 'opacity-0 -translate-y-2.5' 
                        : 'animate-fade-in opacity-100 translate-y-0'
                } ${
                    messageType === 'success' 
                        ? 'bg-green-900/20 border-green-500/30' 
                        : 'bg-red-900/20 border-red-500/30'
                }`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                            messageType === 'success' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                            {messageType === 'success' ? (
                                <svg className="w-4 h-4 text-white transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-white transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>
                        <div className="transition-all duration-300">
                            <h3 className={`font-semibold transition-colors duration-300 ${
                                messageType === 'success' ? 'text-green-400' : 'text-red-400'
                            }`}>
                                {messageType === 'success' ? 'Success!' : 'Error'}
                            </h3>
                            <p className={`text-sm transition-colors duration-300 ${
                                messageType === 'success' ? 'text-green-300' : 'text-red-300'
                            }`}>
                                {message}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile