const InventoryItem = ({ name, stock, max, image, low, critical }) => {
    const percentage = (stock / max) * 100
    let color = 'bg-emerald-500'
    if (low) color = 'bg-yellow-500'
    if (critical) color = 'bg-red-500'

    return (
        <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 p-1 shrink-0 overflow-hidden">
                <img src={image} alt={name} className="w-full h-full object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex-1">
                <div className="flex justify-between mb-1.5">
                    <span className="text-white font-semibold text-sm tracking-wide">{name}</span>
                    <span className={`text-[10px] font-bold ${critical ? 'text-rose-500' : low ? 'text-yellow-500' : 'text-[#777]'}`}>
                        {stock}/{max} Units
                    </span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full ${color} transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.3)]`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
        </div>
    )
}

export default InventoryItem