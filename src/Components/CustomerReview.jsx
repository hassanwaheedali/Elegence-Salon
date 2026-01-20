function CustomerReview({name, review, image}) {
    return (
        <div className="customer-review py-4 shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-4 text-white">
            <div className="customer-image rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 shrink-0 overflow-hidden flex items-center justify-center">
                <img 
                    src={image} 
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=fb9d33&color=fff&size=100'
                    }}
                />
            </div>
            <div className="customer-detail text-center sm:text-left flex-1">
                <p className="customer-review text-xs sm:text-sm leading-relaxed">"<wbr/>{review}"</p>
                <p className="customer-name mt-2 text-sm md:text-base">{name} -- <span className="text-[#7d7e7c] pt-2">Customer</span></p>
            </div>
        </div>
    )
}

export default CustomerReview
