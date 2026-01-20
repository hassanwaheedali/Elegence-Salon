import { brands } from '../data/brands.js'

function BrandCarousel() {
    return (
        <div className="relative overflow-hidden">
            {/* Gradient Overlays for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-linear-to-r from-[#0d0d0d] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-linear-to-l from-[#0d0d0d] to-transparent z-10 pointer-events-none"></div>

            {/* Sliding Track */}
            <div className="brand-scroll-wrapper">
                <div className="flex brand-scroll-track">
                {/* First set of brands */}
                {brands.map((brand) => (
                    <div
                        className="shrink-0 mx-8 md:mx-12 lg:mx-16 flex items-center justify-center group cursor-pointer"
                        key={`first-${brand.id}`}
                    >
                        <div className="relative px-4 py-6 rounded-lg transition-all duration-300 group-hover:scale-110">
                            <img
                                src={brand.img}
                                alt={`Brand ${brand.id}`}
                                className="max-h-16 md:max-h-20 lg:max-h-24 max-w-50 w-auto object-contain grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300 filter drop-shadow-lg"
                            />
                        </div>
                    </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {brands.map((brand) => (
                    <div
                        className="shrink-0 mx-8 md:mx-12 lg:mx-16 flex items-center justify-center group cursor-pointer"
                        key={`second-${brand.id}`}
                    >
                        <div className="relative px-4 py-6 rounded-lg transition-all duration-300 group-hover:scale-110">
                            <img
                                src={brand.img}
                                alt={`Brand ${brand.id}`}
                                className="max-h-16 md:max-h-20 lg:max-h-24 max-w-50 w-auto object-contain grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300 filter drop-shadow-lg"
                            />
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    )
}

export default BrandCarousel
