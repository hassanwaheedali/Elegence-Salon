import { useState } from 'react'

function Feedback() {
    // Feedback form state
    const [feedbackData, setFeedbackData] = useState({
        rating: 5,
        experience: '',
        suggestions: ''
    })

    // Handle feedback input changes
    const handleFeedbackChange = (e) => {
        const { name, value } = e.target
        setFeedbackData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Handle feedback submit
    const handleFeedbackSubmit = (e) => {
        e.preventDefault()
        console.log('Feedback submitted:', feedbackData)
        // Data will be handled later with localStorage
    }

    return (
        <div className="bg-[#161515] px-6 sm:px-8 pb-12 sm:pb-14 shadow-lg rounded-lg transition-all duration-500">
            <div className="head-background bg-[#1a1a1a] w-[calc(100%+3rem)] sm:w-[calc(100%+4rem)] -mx-6 sm:-mx-8 -mt-8 px-6 sm:px-8 py-6 sm:py-8 mb-6 rounded-t-lg">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#fb9d33] mt-1"><span className="text-white">Submit</span> Feedback</h2>
            </div>
            <p className="text-[#8A8A8A] mb-8 px-1">We'd love to hear about your experience</p>

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
                                className={`text-4xl transition-all duration-300 ${feedbackData.rating >= star ? 'text-[#FF8A00] scale-110' : 'text-[#333333]'
                                    }`}
                            >
                                ★
                            </button>
                        ))}
                        <span className="text-[#8A8A8A] ml-4 text-lg">{feedbackData.rating} out of 5</span>
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
                        className="w-full font-bold border-4 rounded-md border-[#454545] px-2 md:px-3 py-2 md:py-3 text-sm text-[#777777] tracking-tight bg-[#0d0d0d] hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33] mt-1.5 resize-none"
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
                        className="w-full font-bold border-4 rounded-md border-[#454545] px-2 md:px-3 py-2 md:py-3 text-sm text-[#777777] tracking-tight bg-[#0d0d0d] hover:border-[#fb9d33] transition-colors focus:outline-none focus:border-[#fb9d33] mt-1.5 resize-none"
                        placeholder="What can we improve?"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        className="px-8 py-4 bg-[#0d0d0d] hover:bg-yellow-600 text-white border-5 border-[#454545] hover:border-white font-extrabold rounded-md text-sm md:text-base transition-colors cursor-pointer focus:outline-none"
                    >
                        Submit Feedback
                    </button>
                    <button
                        type="button"
                        className="px-8 py-4 bg-[#0d0d0d] text-white border-5 border-[#454545] hover:border-red-600 font-extrabold rounded-md text-sm md:text-base transition-colors cursor-pointer focus:outline-none"
                    >
                        Clear
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Feedback