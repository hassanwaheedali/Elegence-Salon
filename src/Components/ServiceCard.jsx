import { ArrowRight } from 'lucide-react'

const ServiceCard = ({ icon, title, description, price, onClick }) => {
    return (
        <div className="group relative overflow-hidden bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#454545]/30 hover:border-[#FF8A00]/50">
            {/* Animated gradient background on hover */}
            <div className="absolute inset-0 bg-linear-to-brrom-[#FF8A00]/5 via-transparent to-[#1a1a1a] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Subtle shine effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#FF8A00] to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-500"></div>

            <div className="relative z-10 flex flex-col h-full">
                {/* Enhanced Icon Container with better contrast */}
                <div className="w-16 h-16 rounded-full bg-linear-to-r from-[#FF8A00] to-yellow-500 border border-[#454545] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-[#FF8A00] transition-all duration-500">
                    <span className="text-white text-2xl font-black group-hover:scale-110 transition-transform duration-300">
                        {icon}
                    </span>
                </div>

                {/* Title with proper white text */}
                <h3 className="text-2xl font-black uppercase tracking-wide mb-2 bg-clip-text text-transparent bg-linear-to-r from-[#f29020] to-yellow-500 group-hover:text-[#FF8A00] transition-colors duration-300">
                    {title}
                </h3>

                <p className="text-[#E0E0E0] text-sm leading-relaxed mb-6 grow">
                    {description}
                </p>

                {/* Footer / Price with better color balance */}
                <div className="flex items-center justify-between border-t border-[#454545]/40 pt-4 mt-auto">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-[#f29020] to-yellow-500 transition-colors duration-300">
                        {price}
                    </span>
                    <button
                        onClick={onClick}
                        className="text-xs font-bold text-[#FF8A00] uppercase tracking-wider flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 cursor-pointer hover:text-white"
                    >
                        Book Now <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ServiceCard