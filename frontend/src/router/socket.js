// src/socket.js
import { io } from 'socket.io-client'

const url = 'http://localhost:3000'
let socket = io(url)
export default socket