import { NavLink } from 'react-router-dom'

const NavItem = ({ icon, label, to = "#", collapsed }) => (
    <NavLink
        to={to}
        end
        className={({ isActive }) => `flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 rounded-xl transition-all duration-200 group ${isActive
                ? 'bg-[#FF8A00]/10 text-[#FF8A00]'
                : `text-[#a1a1aa] hover:bg-white/5 hover:text-white ${!collapsed && 'hover:pl-5'}`
            }`}
        title={collapsed ? label : ''}
    >
        {({ isActive }) => (
            <>
                <span className={`${isActive ? 'text-[#FF8A00]' : 'text-[#71717a] group-hover:text-white'} transition-colors`}>{icon}</span>
                {!collapsed && <span className="font-medium text-sm tracking-wide">{label}</span>}
            </>
        )}
    </NavLink>
)

export default NavItem