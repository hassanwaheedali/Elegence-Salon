import { createPortal } from 'react-dom'

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-obsidian-elevated border border-[#333] rounded-xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-200">
                <h3 className="text-white font-bold text-lg mb-2">Confirm Action</h3>
                <p className="text-gray-400 text-sm mb-6">{message}</p>
                <div className="flex justify-end gap-3 pointer-events-auto">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-bold text-gray-300 hover:text-white bg-transparent border border-[#333] hover:border-gray-500 rounded-lg transition-all"
                    >
                        No, Keep it
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-bold text-black bg-champagne hover:bg-champagne-dark rounded-lg shadow-lg hover:shadow-champagne/20 transition-all cursor-pointer"
                    >
                        Yes, Proceed
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default ConfirmModal
