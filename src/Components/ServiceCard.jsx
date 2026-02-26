import { ArrowRight } from 'lucide-react'
import serviceHaircutFallback from '../assets/services/service-haircut.webp'

const ServiceCard = ({ icon, title, description, price, onClick, image }) => {
    const handleCardClick = (e) => {
        if (onClick) onClick(e);
        const element = document.getElementById('appointment');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.hash = 'appointment';
        }
    };

    return (
        <div
            onClick={handleCardClick}
            className="group relative h-112.5 w-full overflow-hidden rounded-2xl bg-obsidian-elevated shadow-lg transition-[transform,box-shadow] duration-500 hover:-translate-y-2 cursor-pointer border border-white/5"
        >
            {/* Background Image with Zoom Effect */}
            <div
                className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.05] will-change-transform"
                style={{
                    backgroundImage: `url(${image || serviceHaircutFallback})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transformOrigin: 'center'
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
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-black/40 border border-white/20 text-champagne transition-[transform,background-color,color,border-color] duration-500 group-hover:scale-110 group-hover:bg-champagne group-hover:text-white group-hover:border-champagne shadow-lg will-change-transform">
                        <span className="text-3xl transition-transform duration-300">
                            {icon}
                        </span>
                    </div>
                </div>

                {/* Text Content */}
                <div className="transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0 will-change-transform">
                    <h3 className="mb-3 text-2xl md:text-3xl font-black uppercase leading-none text-white tracking-wide shadow-black shadow-sm">
                        {title}
                    </h3>

                    <div className="mb-4 h-0.5 w-12 bg-champagne transition-[width] duration-500 group-hover:w-full" />

                    <p className="mb-6 text-xs md:text-sm text-champagne-muted line-clamp-3 group-hover:text-white transition-colors duration-300 leading-relaxed font-medium">
                        {description}
                    </p>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <span className="text-xl md:text-2xl font-black text-champagne tracking-wider shadow-black shadow-sm">
                            {price}
                        </span>
                        <button className="group/btn flex items-center gap-2 rounded-full bg-black/40 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-champagne border border-champagne hover:border-champagne">
                            <span>Book Now</span>
                            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/btn:translate-x-1 will-change-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServiceCard