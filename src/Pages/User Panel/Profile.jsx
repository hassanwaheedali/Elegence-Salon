import { useState } from 'react'
import { useAuth } from '../../Context/AuthContext.jsx'

function Profile() {
    const { currentUser } = useAuth()
    const [profileData, setProfileData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || ''
    })

    // Handle profile input changes
    const handleProfileChange = (e) => {
        const { name, value } = e.target
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Handle profile submit
    const handleProfileSubmit = (e) => {
        e.preventDefault()
        console.log('Profile updated:', profileData)
        // Data will be handled later with localStorage
    }

    return (
        <div className="bg-[#161515] px-6 sm:px-8 pb-12 sm:pb-14 shadow-lg rounded-lg transition-all duration-500">
            <div className="head-background bg-[#1a1a1a] w-[calc(100%+3rem)] sm:w-[calc(100%+4rem)] -mx-6 sm:-mx-8 -mt-8 px-6 sm:px-8 py-6 sm:py-8 mb-6 rounded-t-lg">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#fb9d33] mt-1"><span className="text-white">Profile</span> Settings</h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-8">
                {/* Name Field */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-white font-semibold mb-1" htmlFor='name'>Full Name</label>
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
                        <label className="block text-white font-semibold mb-1" htmlFor='email'>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            className="w-full font-bold border-4 rounded-md border-[#454545] px-2 md:px-3 py-2 md:py-3 text-sm text-white tracking-tight bg-[#0d0d0d] hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33] mt-1.5"
                            placeholder="Enter your email"
                            id='email'
                        />
                    </div>
                </div>

                {/* Phone Field */}
                <div>
                    <label className="block text-white font-semibold mb-1" htmlFor='phone'>Phone Number</label>
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
        </div>
    )
}

export default Profile