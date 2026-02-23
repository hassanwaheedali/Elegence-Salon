import { ArrowRight } from 'lucide-react'

/* ═══════════════════════════════════════════════════════════
   ServiceCard — Editorial Spread Component
   ─────────────────────────────────────────────────────────
   Props:
     icon        — Lucide React icon element (strokeWidth={1})
     title       — Service name
     description — Service description
     price       — Formatted price string
     onClick     — Optional click handler (preserved from original API)
     image       — Image URL (swap-ready: replace with .webp assets)
     index       — Position index for stagger offsets (0-based)
     variant     — "featured" for full-width editorial layout, default for standard

   GSAP integration point:
     Each card has [data-service-reveal] for ScrollTrigger targeting.
     Image has [data-service-image] for parallax scrub.
   ═══════════════════════════════════════════════════════════ */

const ServiceCard = ({ icon, title, description, price, onClick, image, index = 0, variant }) => {
    const isFeatured = variant === 'featured'
    const isReversed = index % 2 !== 0

    return (
        <div
            onClick={onClick}
            data-service-reveal
            className={`group relative w-full overflow-hidden rounded-2xl bg-obsidian-elevated shadow-lg cursor-pointer border border-white/5 transition-all duration-700 ease-luxury ${
                isFeatured ? 'min-h-[28rem] lg:min-h-[32rem]' : 'min-h-[24rem] lg:min-h-[28rem]'
            }`}
        >
            {/* ── Layout: Horizontal split on desktop, stacked on mobile ── */}
            <div className={`flex flex-col ${isFeatured ? 'lg:flex-row' : 'lg:flex-row'} h-full ${isReversed && !isFeatured ? 'lg:flex-row-reverse' : ''}`}>

                {/* ── Image Area (60% on desktop, full on mobile) ── */}
                <div className={`relative overflow-hidden ${isFeatured ? 'lg:w-[60%]' : 'lg:w-[55%]'} w-full h-56 sm:h-64 lg:h-auto`}>
                    <div
                        data-service-image
                        className="absolute inset-0 transition-transform duration-[1200ms] ease-luxury scale-[1.05] group-hover:scale-100"
                        style={{
                            backgroundImage: `url(${image || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    {/* Subtle vignette on image */}
                    <div className="absolute inset-0 bg-linear-to-r from-obsidian-elevated/60 via-transparent to-transparent opacity-0 lg:opacity-100" />
                    <div className="absolute inset-0 bg-linear-to-t from-obsidian-elevated via-transparent to-transparent lg:hidden" />
                </div>

                {/* ── Content Area ── */}
                <div className={`relative z-10 flex flex-col justify-between ${isFeatured ? 'lg:w-[40%]' : 'lg:w-[45%]'} w-full p-6 sm:p-8 lg:p-10`}>
                    {/* Icon — minimalist, no circle background */}
                    <div className="mb-6 lg:mb-8">
                        <span className="text-champagne opacity-70 group-hover:opacity-100 transition-opacity duration-500 ease-luxury">
                            {icon}
                        </span>
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 flex flex-col justify-end">
                        <h3 className={`font-serif font-semibold leading-[1.1] text-white mb-4 transition-colors duration-500 ${
                            isFeatured ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl lg:text-4xl'
                        }`}>
                            {title}
                        </h3>

                        {/* Champagne separator — expands on hover */}
                        <div className="h-px w-12 bg-champagne/30 transition-all duration-700 ease-luxury group-hover:w-full mb-4 lg:mb-6" />

                        <p className="font-sans font-light text-gray-500 text-sm leading-relaxed tracking-wide mb-6 lg:mb-8 group-hover:text-gray-400 transition-colors duration-500 ease-luxury line-clamp-3">
                            {description}
                        </p>

                        {/* Price and Action */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <span className="font-sans text-champagne text-xl sm:text-2xl font-semibold tracking-wider">
                                {price}
                            </span>
                            <a href="#appointment" onClick={(e) => e.stopPropagation()}>
                                <span className="group/btn inline-flex items-center gap-2 text-gray-500 hover:text-champagne font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all duration-500 ease-luxury">
                                    Book Now
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-500 ease-luxury group-hover/btn:translate-x-1" strokeWidth={1} />
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServiceCard