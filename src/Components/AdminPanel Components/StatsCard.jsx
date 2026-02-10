import { TrendingUp, TrendingDown } from 'lucide-react'

const StatsCard = ({ title, value, change, positive, icon, color, bg }) => {
    return (
        <div className="group relative overflow-hidden bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] p-6 rounded-2xl border border-white/5 hover:border-[#fb9d33]/40 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-[#fb9d33]/10">
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-[#777] text-xs font-extrabold uppercase tracking-widest mb-1.5">{title}</h3>
                        <h3 className="text-2xl sm:text-3xl font-black text-white">{value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl ${bg} ${color} ring-1 ring-white/5 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        {icon}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold flex items-center px-2 py-0.5 rounded-md border ${positive ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20'}`}>
                        {positive ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                        {change}
                    </span>
                    <span className="text-[#555] text-[10px] font-bold uppercase tracking-wide">Realtime</span>
                </div>
            </div>
        </div>
    )
}

export default StatsCard
