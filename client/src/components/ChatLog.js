import { useState, useEffect } from 'react';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3002');
export default function ChatLog(props) {
  const lobbyId = props.lobbyId;

  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const renderChatLog = chatLog.map((e) => {
    return <li key={chatLog.indexOf(e)}>{e}</li>;
  });
  const sendMessage = () => {
    console.log('sendMessage');
    console.log(chatMessage);
    socket.emit('send-message', { chatMessage, lobbyId });
    setChatLog([chatMessage, ...chatLog]);
  };
  useEffect(() => {
    socket.on('receive-message', (data) => {
      console.log(data);
      setChatLog([data.message, ...chatLog]);
      console.log(chatLog);
    });
  }, [socket, chatLog]);

  return (
    <div>
      <div className='chat-log-container'>
        <header className='chat-log-header'>Chat Log</header>
        <ul className='chat-log'>{renderChatLog}</ul>
      </div>
      <input
        type='text'
        placeholder='Type here...'
        id='chatInput'
        onChange={(e) => {
          setChatMessage(e.target.value);
        }}
      />
      <button
        onClick={() => {
          sendMessage(chatMessage);
        }}
      >
        Submit
      </button>
    </div>
  );
}
