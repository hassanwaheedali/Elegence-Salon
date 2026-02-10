import { Clock } from 'lucide-react'

const StaffRow = ({ name, role, time, commission, online }) => (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5 group">
        <div className="flex items-center gap-3">
            <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#777] font-bold text-sm">
                    {name.charAt(0)}
                </div>
                {online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#121212] rounded-full shadow-sm"></span>}
            </div>
            <div>
                <h4 className="text-white font-semibold text-sm tracking-wide">{name}</h4>
                <p className="text-[#666] text-[11px] font-medium">{role}</p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-white font-bold text-xs bg-[#FF8A00]/10 px-2 py-1 rounded-md inline-block mb-1 group-hover:bg-[#FF8A00]/20 transition-colors">{commission}</p>
            <p className="text-[#555] text-[10px] font-medium flex items-center gap-1.5 justify-end">
                <Clock size={10} />
                {time}
            </p>
        </div>
    </div>
)

export default StaffRow