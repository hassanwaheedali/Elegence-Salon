import { useState } from 'react'
import { useAuth } from '../../Context/AuthContext.jsx'
import { useMessage } from '../../Context/MessageContext.jsx'

function Feedback() {
    const { currentUser } = useAuth()
    const { showMessage } = useMessage()

    const [feedbackData, setFeedbackData] = useState({
        userId: currentUser?.id,
        rating: 5,
        experience: '',
        suggestions: ''
    })
    const handleFeedbackChange = (e) => {
        const { name, value } = e.target
        setFeedbackData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Handle feedback submit
    const handleFeedbackSubmit = async (e) => {
        e.preventDefault()
        await localStorage.setItem("FeedbackData", JSON.stringify(feedbackData))
        console.log('Feedback submitted:', feedbackData)
        showMessage('success', 'Thank you for your feedback! We appreciate you taking the time to share your thoughts with us.')
        
        // Reset form after submission
        setFeedbackData({
            userId: currentUser?.id,
            rating: 5,
            experience: '',
            suggestions: ''
        })
    }

    return (
        <div className="bg-[#161515] px-6 sm:px-8 pb-12 sm:pb-14 shadow-lg rounded-lg transition-all duration-500">
            <div className="head-background bg-obsidian-elevated w-[calc(100%+3rem)] sm:w-[calc(100%+4rem)] -mx-6 sm:-mx-8 -mt-8 px-6 sm:px-8 py-6 sm:py-8 mb-6 rounded-t-lg">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-champagne mt-1"><span className="text-white">Submit</span> Feedback</h2>
            </div>
            <p className="text-champagne-muted mb-8 px-1">We'd love to hear about your experience</p>

            <form onSubmit={handleFeedbackSubmit} className="space-y-8">
                {/* Rating Field */}
                <div>
                    <label className="block text-white font-semibold mb-4">Rate Your Experience</label>
                    <div className="flex items-center gap-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setFeedbackData(prev => ({ ...prev, rating: star }))}
                                className={`text-4xl transition-all duration-300 ${feedbackData.rating >= star ? 'text-champagne scale-110' : 'text-[#333333]'
                                    }`}
                            >
                                ★
                            </button>
                        ))}
                        <span className="text-champagne-muted ml-4 text-lg">{feedbackData.rating} out of 5</span>
                    </div>
                </div>

                {/* Experience Feedback */}
                <div>
                    <label className="block text-white font-semibold mb-3">Your Experience</label>
                    <textarea
                        name="experience"
                        value={feedbackData.experience}
                        onChange={handleFeedbackChange}
                        rows="5"
                        className="w-full font-bold border-4 rounded-md border-[#454545] px-2 md:px-3 py-2 md:py-3 text-sm text-champagne-muted tracking-tight bg-obsidian hover:border-[text-champagne] transition-colors focus:outline-none focus:border-[text-champagne] mt-1.5 resize-none"
                        placeholder="Tell us about your experience at Elegance Barber Shop..."
                    />
                </div>

                {/* Suggestions */}
                <div>
                    <label className="block text-white font-semibold mb-3">Suggestions for Improvement</label>
                    <textarea
                        name="suggestions"
                        value={feedbackData.suggestions}
                        onChange={handleFeedbackChange}
                        rows="4"
                        className="w-full font-bold border-4 rounded-md border-[#454545] px-2 md:px-3 py-2 md:py-3 text-sm text-champagne-muted tracking-tight bg-obsidian hover:border-[text-champagne] transition-colors focus:outline-none focus:border-[text-champagne] mt-1.5 resize-none"
                        placeholder="What can we improve?"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        className="px-8 py-4 bg-obsidian hover:bg-yellow-600 text-white border-5 border-[#454545] hover:border-white font-extrabold rounded-md text-sm md:text-base transition-colors cursor-pointer focus:outline-none"
                    >
                        Submit Feedback
                    </button>
                    <button
                        type="button"
                        className="px-8 py-4 bg-obsidian text-white border-5 border-[#454545] hover:border-red-600 font-extrabold rounded-md text-sm md:text-base transition-colors cursor-pointer focus:outline-none"
                    >
                        Clear
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Feedback