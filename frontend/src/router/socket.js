// src/socket.js
import { io } from 'socket.io-client'

const url = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
let socket = io(url, {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000
})
export default socket