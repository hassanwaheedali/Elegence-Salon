import { ArrowRight } from 'lucide-react'

const ServiceCard = ({ icon, title, description, price, onClick, image }) => {
    return (
        <div
            onClick={onClick}
            className="group relative h-112.5 w-full overflow-hidden rounded-2xl bg-obsidian-elevated shadow-lg transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-white/5"
        >
            {/* Background Image with Zoom Effect */}
            <div
                className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110"
                style={{
                    backgroundImage: `url(${image || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Gradient Overlay - Darker for better text readability */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-black/40 transition-opacity duration-500 group-hover:opacity-90" />

            {/* Decorative Top Line */}
            <div className="absolute left-0 top-0 h-1 w-full bg-linear-to-r from-transparent via-champagne to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Content Container */}
            <div className="relative z-10 flex h-full flex-col p-8 justify-between">

                {/* Icon Circle - Floating effect */}
                <div className="flex">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-champagne transition-all duration-500 group-hover:scale-110 group-hover:bg-champagne group-hover:text-white group-hover:border-champagne shadow-lg">
                        <span className="text-3xl transition-transform duration-300">
                            {icon}
                        </span>
                    </div>
                </div>

                {/* Text Content */}
                <div className="transform transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <h3 className="mb-3 text-2xl md:text-3xl font-black uppercase leading-none text-white tracking-wide shadow-black drop-shadow-md">
                        {title}
                    </h3>

                    <div className="mb-4 h-0.5 w-12 bg-champagne transition-all duration-500 group-hover:w-full" />

                    <p className="mb-6 text-xs md:text-sm text-gray-300 line-clamp-3 group-hover:text-white transition-colors duration-300 leading-relaxed font-medium">
                        {description}
                    </p>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <span className="text-xl md:text-2xl font-black text-champagne tracking-wider drop-shadow-sm">
                            {price}
                        </span>
                        <a href="#appointment">
                            <button className="group/btn flex items-center gap-2 rounded-full bg-white/5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all duration-300 hover:bg-champagne border border-champagne hover:border-champagne">
                                <span>Book Now</span>
                                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/btn:translate-x-1" />
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServiceCard