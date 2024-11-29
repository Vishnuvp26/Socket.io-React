import { useState } from 'react';
import io from 'socket.io-client';
import Chat from './components/Chat';

// Connect to the server
const socket = io.connect('http://localhost:3000');

function App() {
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('');
    const [showChat, setShowChat] = useState(false);

    const joinRoom = () => {
        if (username !== '' && room !== '') {
            socket.emit('join_room', room);
            setShowChat(true);  // Only show chat if both fields are filled
        }
    };

    return (
        <div className="App">
            {!showChat ? (
                <div>
                    <h3>Join Chat</h3>
                    <input
                        type="text"
                        placeholder='Name...'
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder='Room ID...'
                        onChange={(e) => setRoom(e.target.value)}
                    />
                    <button onClick={joinRoom}>Join Room</button>
                </div>
            ) : (
                <Chat socket={socket} username={username} room={room} />
            )}
        </div>
    );
}

export default App;
