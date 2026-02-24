import { TrendingUp, TrendingDown } from 'lucide-react'

const StatsCard = ({ title, value, change, positive, icon, color, bg }) => {
    return (
        <div
            className="group relative overflow-hidden bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] p-3 sm:p-4 md:p-6 rounded-2xl border border-white/5 transition-all duration-500 shadow-lg hover:shadow-2xl"
        >
            <div
                className="pointer-events-none absolute -inset-y-8 -left-3/4 w-[140%] skew-x-12 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-[shine-sweep_1500ms_ease-out]"
                style={{
                    backgroundImage: 'linear-gradient(125deg, rgba(0,0,0,0) 0%, rgba(15,15,15,0.6) 45%, rgba(55,55,55,0.25) 55%, rgba(0,0,0,0) 70%)'
                }}
            />
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
                    <div className="min-w-0 flex-1">
                        <h3 className="text-[#777] text-[9px] sm:text-[10px] md:text-xs font-extrabold uppercase tracking-widest mb-1 sm:mb-1.5">{title}</h3>
                        <h3 className="text-lg sm:text-xl md:text-3xl font-black text-white truncate">{value}</h3>
                    </div>
                    <div className={`p-2 sm:p-2.5 md:p-3 rounded-xl ${bg} ${color} ring-1 ring-white/5 shadow-lg group-hover:scale-110 transition-transform duration-500 shrink-0 ml-2`}>
                        {icon}
                    </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className={`text-[10px] sm:text-xs font-bold flex items-center px-1.5 sm:px-2 py-0.5 rounded-md border ${positive ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20'}`}>
                        {positive ? <TrendingUp size={10} className="mr-0.5 sm:mr-1" /> : <TrendingDown size={10} className="mr-0.5 sm:mr-1" />}
                        {change}
                    </span>
                    <span className="text-[#555] text-[9px] sm:text-[10px] font-bold uppercase tracking-wide">Realtime</span>
                </div>
            </div>
        </div>
    )
}

export default StatsCard
