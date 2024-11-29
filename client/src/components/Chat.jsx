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
        <div className='chat-window'>
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                {messageList.map((msg, index) => (
                    <div key={index} className="message">
                        <p><strong>{msg.author}:</strong> {msg.message} <small>({msg.time})</small></p>
                    </div>
                ))}
            </div>
            <div className="chat-footer">
                <input
                    type="text"
                    placeholder='Type a message...'
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    );
};

export default Chat;