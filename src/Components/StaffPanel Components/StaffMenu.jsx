import { createPortal } from "react-dom";
import { useState, useEffect, useRef } from "react";
import { MoreVertical, Calendar, User, Trash2, Edit } from "lucide-react";

const StaffMenu = ({ staff, onCheckAppts, onViewDetails, onDelete, onEdit }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleScroll = () => {
            if (isOpen) setIsOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll, true);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll, true);
        };
    }, [isOpen]);

    const toggleMenu = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            // Calculate position to ensure it fits
            setPosition({
                top: rect.bottom,
                left: rect.right - 192,
            });
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={toggleMenu}
                className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
                <MoreVertical size={16} />
            </button>

            {isOpen && createPortal(
                <div
                    ref={menuRef}
                    style={{
                        position: 'fixed',
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                        zIndex: 9999
                    }}
                    className="w-48 bg-[#121212] border border-[#333] rounded-lg shadow-xl py-1 animate-scale-in origin-top-right"
                >
                    <button
                        onClick={() => {
                            onCheckAppts(staff);
                            setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                    >
                        <Calendar size={14} className="text-[#FF8A00]" />
                        Check Appointments
                    </button>
                    <button
                        onClick={() => {
                            onViewDetails(staff);
                            setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                    >
                        <User size={14} className="text-blue-400" />
                        View Details
                    </button>
                    <button
                        onClick={() => {
                            onEdit(staff);
                            setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                    >
                        <Edit size={14} className="text-green-400" />
                        Edit Stylist
                    </button>
                    <div className="h-px bg-[#333] my-1"></div>
                    <button
                        onClick={() => {
                            onDelete(staff);
                            setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>,
                document.body
            )}
        </div>
    );
};

export default StaffMenu;
