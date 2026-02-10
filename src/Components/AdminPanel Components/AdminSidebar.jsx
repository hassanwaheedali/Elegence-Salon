import {
    LayoutDashboard,
    Calendar,
    Package,
    Users,
    Settings,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react'
import NavItem from '../AdminPanel Components/NavItem'

const AdminSidebar = ({ sidebarOpen, setSidebarOpen, handleLogout, currentUser, collapsed, setCollapsed }) => {
    return (
        <>
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 ${collapsed ? 'w-20' : 'w-64'} bg-[#0d0d0d]/80 backdrop-blur-2xl border-r border-white/5 transform transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="h-full flex flex-col">
                    {/* Logo Area */}
                    <div className={`h-20 flex items-center ${collapsed ? 'justify-center' : 'justify-between px-6'} border-b border-white/5 relative`}>
                        {!collapsed && (
                            <h1 className="text-xl font-black uppercase tracking-[0.2em] text-white">
                                <span className="text-[#FF8A00]">Elegance</span>
                            </h1>
                        )}
                        {collapsed && (
                            <span className="text-xl font-black text-[#FF8A00]">E</span>
                        )}

                        {/* Desktop Collapse Toggle */}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className={`hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#1a1a1a] border border-white/10 rounded-full items-center justify-center text-[#777] hover:text-white hover:border-[#FF8A00] transition-colors z-50 shadow-md ${collapsed ? '-right-3' : '-right-3'}`}
                        >
                            {collapsed ? <PanelLeftOpen size={12} /> : <PanelLeftClose size={12} />}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className={`flex-1 overflow-y-auto py-6 ${collapsed ? 'px-2' : 'px-4'} space-y-2 scrollbar-hide`}>
                        <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active collapsed={collapsed} />
                        <NavItem icon={<Calendar size={20} />} label="Appointments" collapsed={collapsed} />
                        <NavItem icon={<Package size={20} />} label="Inventory" collapsed={collapsed} />
                        <NavItem icon={<Users size={20} />} label="Staff Management" collapsed={collapsed} />

                        <div className={`pt-6 pb-2 ${collapsed ? 'text-center' : ''}`}>
                            <p className={`px-4 text-[10px] font-bold text-[#555] uppercase tracking-widest ${collapsed ? 'hidden' : 'block'}`}>Settings</p>
                            {collapsed && <div className="h-px w-8 mx-auto bg-white/5"></div>}
                        </div>

                        <NavItem icon={<Settings size={20} />} label="Configuration" collapsed={collapsed} />

                        <button
                            onClick={handleLogout}
                            className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 text-[#a1a1aa] hover:bg-rose-500/10 hover:text-rose-400 rounded-xl transition-all duration-200 group cursor-pointer border border-transparent hover:border-rose-500/10 mt-2`}
                            title={collapsed ? "Logout" : ""}
                        >
                            <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                            {!collapsed && <span className="font-medium text-sm">Logout</span>}
                        </button>
                    </nav>

                    {/* User Profile Snippet */}
                    <div className={`p-4 border-t border-white/5 bg-white/5 backdrop-blur-sm ${collapsed ? 'flex justify-center' : ''}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#FF8A00] to-[#fdba74] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/20 shrink-0">
                                {currentUser?.name?.charAt(0) || 'A'}
                            </div>
                            {!collapsed && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">{currentUser?.name || 'Admin User'}</p>
                                    <p className="text-[11px] text-[#777] truncate">{currentUser?.email || 'admin@elegance.com'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default AdminSidebar