function CustomerReview({ name, review, image, service }) {
    // Utility to split text into words wrapped in spans for staggering
    const splitTextToSpans = (text) => {
        return text.split(' ').map((word, index) => (
            <span key={index} className="inline-block overflow-hidden mr-[0.25em] pb-1">
                <span className="quote-word inline-block translate-y-[110%] opacity-0">
                    {word}
                </span>
            </span>
        ));
    };

    return (
        <div className="customer-review-card w-full h-dvh shrink-0 flex flex-col md:flex-row bg-obsidian text-white relative snap-start overflow-hidden group"
            style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >

            {/* Top / Left: Client Portrait — 40% on mobile (flex-col), ~50% on desktop (flex-row) */}
            <div className="w-full h-[40%] md:h-full md:w-5/12 lg:w-1/2 relative overflow-hidden bg-obsidian flex justify-center items-center shrink-0">
                <div className="absolute inset-0 bg-obsidian/20 z-10 transition-colors duration-700 ease-luxury group-hover:bg-transparent pointer-events-none"></div>
                <img
                    src={image}
                    alt={`Portrait of ${name}`}
                    className="portrait-image w-full h-full object-contain filter grayscale transition-all duration-700 ease-luxury group-hover:grayscale-0 relative z-0"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1287&auto=format&fit=crop';
                    }}
                />
            </div>

            {/* Bottom / Right: Editorial Quote — 60% on mobile, ~50% on desktop */}
            <div className="flex-1 w-full md:w-7/12 lg:w-1/2 flex flex-col justify-start md:justify-center px-6 py-6 overflow-y-auto md:px-12 lg:px-12 md:py-0 md:mb-12 relative"
                style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom, 0px))' }}
            >

                {/* Large decorative quotation mark */}
                <span className="absolute top-8 md:top-24 left-4 md:left-8 text-[120px] md:text-[200px] font-serif text-white opacity-[0.02] z-0 leading-none pointer-events-none select-none">
                    "
                </span>

                <div className="relative z-10 max-w-2xl max-h-[80%] flex flex-col justify-center">
                    {/* The Quote */}
                    <p className="font-serif italic text-white/90 text-[clamp(1.5rem,3vw,3rem)] leading-[1.4] md:leading-[1.4] mb-8 md:mb-12 tracking-wide font-light">
                        {splitTextToSpans(review)}
                    </p>

                    {/* Metadata Array */}
                    <div className="review-meta flex flex-col items-start opacity-0 translate-y-4">
                        {/* Service Badge */}
                        <div className="inline-block px-3 py-1 border border-champagne/30 rounded-full mb-4 backdrop-blur-sm">
                            <span className="font-sans text-champagne text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-bold">
                                {service || "Signature Service"}
                            </span>
                        </div>

                        {/* Client Name */}
                        <div className="flex items-center gap-4">
                            <div className="w-8 md:w-12 h-px bg-champagne/50"></div>
                            <h4 className="font-sans font-black text-white text-base md:text-lg lg:text-xl uppercase tracking-widest">
                                {name}
                            </h4>
                        </div>
                        <p className="font-sans text-white/30 text-[10px] uppercase tracking-[0.3em] font-semibold mt-1 ml-12 md:ml-16">
                            Client
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerReview
