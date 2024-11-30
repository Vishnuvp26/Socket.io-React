import React, { useEffect, useState } from 'react';

const Chat = ({ socket, username, room }) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== '') {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: `${new Date().getHours()}:${new Date().getMinutes()}`
            };
            await socket.emit('send_message', messageData); 
            setCurrentMessage('');
        }
    };

    useEffect(() => {
        const messageListener = (data) => {
            setMessageList((list) => [...list, data]); 
        };

        socket.on('receive_message', messageListener);

        return () => socket.off('receive_message', messageListener); 
    }, [socket]);

    return (
        <div className="flex flex-col h-screen w-full max-w-4xl mx-auto my-8 bg-gray-900 shadow-lg rounded-lg">
            <div className="p-4 bg-gray-800 text-white rounded-t-lg text-center">
                <h2 className="text-2xl font-semibold">Live Chat</h2>
            </div>
    
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-800">
                {messageList.map((msg, index) => (
                    <div key={index} className={`flex items-start ${msg.author === username ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-center ${msg.author === username ? 'flex-row-reverse' : 'flex-row'}`}>
                            <img 
                                src="https://cdn-icons-png.flaticon.com/512/5951/5951752.png" 
                                alt="User Avatar" 
                                className="w-10 h-10 rounded-full mx-2"
                            />
                            <div className={`max-w-sm md:max-w-md lg:max-w-lg p-3 rounded-lg ${msg.author === username ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                                <p className="text-sm">
                                    <strong>{msg.author === username ? 'You' : msg.author}</strong>: {msg.message}
                                </p>
                                <span className="text-xs block text-right mt-1 text-gray-400">{msg.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
    
            <div className="p-4 bg-gray-800 rounded-b-lg flex items-center">
                <input
                    type="text"
                    className="flex-1 p-3 bg-gray-700 text-white border border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type a message..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()} 
                />
                <button 
                    onClick={sendMessage} 
                    className="bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700 transition duration-300"
                >
                    &#9658;
                </button>
            </div>
        </div>
    );
};

export default Chat;