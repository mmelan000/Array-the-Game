import { useState, useEffect } from 'react';
const { v4: uuidv4 } = require('uuid');

export default function ChatLog({ socket, user, room }) {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);

  const renderChatLog = chatLog.map((e) => {
    return <li key={uuidv4()}>{e}</li>;
  });
  const sendMessage = () => {
    console.log(`Sending Message: ${message} tp Room: ${room}`);
    socket.emit('message', { message, room, user });
  };

  useEffect(() => {
    socket.on('messageResponse', (data) => {
      console.log(data);
      setChatLog([data, ...chatLog]);
      console.log(chatLog);
    });
  }, [socket, chatLog, room]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      console.log(e.key);
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className='chat-log-main'>
      <div className='chat-log-container'>
        <header className='chat-log-header'>Chat Log</header>
        <ul className='chat-log'>{renderChatLog}</ul>
      </div>
      <input
        type='text'
        placeholder='Type here...'
        id='chatInput'
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        onKeyPress={(e) => {
          handleKeyPress(e);
        }}
      />
      <button
        onClick={() => {
          sendMessage(message);
          setMessage('');
        }}
      >
        Submit
      </button>
    </div>
  );
}
