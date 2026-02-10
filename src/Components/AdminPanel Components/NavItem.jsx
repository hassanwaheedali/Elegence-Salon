import { Link } from 'react-router-dom'

const NavItem = ({ icon, label, active, collapsed }) => (
    <Link
        to="#"
        className={`flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 rounded-xl transition-all duration-200 group ${active
            ? 'bg-[#FF8A00]/10 text-[#FF8A00]'
            : `text-[#a1a1aa] hover:bg-white/5 hover:text-white ${!collapsed && 'hover:pl-5'}`
            }`}
        title={collapsed ? label : ''}
    >
        <span className={`${active ? 'text-[#FF8A00]' : 'text-[#71717a] group-hover:text-white'} transition-colors`}>{icon}</span>
        {!collapsed && <span className="font-medium text-sm tracking-wide">{label}</span>}
    </Link>
)

export default NavItem