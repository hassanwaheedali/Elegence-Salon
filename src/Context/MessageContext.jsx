/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const MessageContext = createContext()

export function MessageProvider({ children }) {
    const [message, setMessage] = useState({ type: '', text: '', visible: false, isClosing: false })

    const showMessage = (type, text) => {
        setMessage({ type, text, visible: true, isClosing: false })
        setTimeout(() => {
            setMessage(prev => ({ ...prev, isClosing: true }))
            setTimeout(() => setMessage({ type: '', text: '', visible: false, isClosing: false }), 300)
        }, 5000)
    }

    const hideMessage = () => {
        setMessage(prev => ({ ...prev, isClosing: true }))
        setTimeout(() => setMessage({ type: '', text: '', visible: false, isClosing: false }), 300)
    }

    return (
        <MessageContext.Provider value={{ message, showMessage, hideMessage }}>
            {children}
        </MessageContext.Provider>
    )
}

export function useMessage() {
    return useContext(MessageContext)
}