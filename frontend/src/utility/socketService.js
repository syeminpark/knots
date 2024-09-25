import { io } from 'socket.io-client';

const socketURL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'http://192.168.0.19:3000';

const socket = io(socketURL); //backendURL

socket.on('connect', () => {
    console.log('Connected to server with ID:', socket.id);
});

export default socket;