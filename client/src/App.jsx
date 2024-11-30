import { useState } from 'react';
import io from 'socket.io-client';
import Chat from './components/Chat';

const socket = io.connect('http://localhost:3000');

function App() {
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('');
    const [showChat, setShowChat] = useState(false);

    const joinRoom = () => {
        if (username !== '' && room !== '') {
            socket.emit('join_room', room);
            setShowChat(true);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            {!showChat ? (
                <div className="w-full max-w-md backdrop-blur-lg bg-white/5 rounded-lg shadow-lg p-8 space-y-6">
                    <h3 className="text-2xl font-bold text-center backdrop-filter text-gray-200 mb-4">Join Chat</h3>
                    <input
                        type="text"
                        placeholder='Name...'
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="text"
                        placeholder='Room ID...'
                        onChange={(e) => setRoom(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={joinRoom}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-200"
                    >
                        Join Room
                    </button>
                </div>
            ) : (
                <Chat socket={socket} username={username} room={room} />
            )}
        </div>
    );
}

export default App;