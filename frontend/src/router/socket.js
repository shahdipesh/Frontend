// src/socket.js
import { io } from 'socket.io-client'

const url = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
let socket = io(url)
export default socket