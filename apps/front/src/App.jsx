import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import Swal from 'sweetalert2';
import './App.css';

// const socket = io("http://localhost:9000"); // - cuando corre local.
const socket = io();

const App = () => {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const spaceValidate = message.trim();

      if(spaceValidate !== '') {
      const date = new Date().toLocaleTimeString().slice(0,5);

      const newMsg = {
        data: message,
        from: name,
        time: date
      };

      socket.emit('message', newMsg);
      setMessage('');
    }
  };

  const handleEnter = (e) => {
    const spaceValidate = e.target.value.trim();
    if(spaceValidate !== '') {

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const date = new Date().toLocaleTimeString().slice(0,5);

        const newMsg = {
          data: message,
          from: name,
          time: date
        };

        socket.emit('message', newMsg);
        setMessage('');
      }
    }
  }

  useEffect(() => {
    Swal.fire({
      title: 'Enter your username',
      input: 'text',
      allowOutsideClick: false,
      customClass: {
        validationMessage: 'my-validation-message'
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Your username is required'
          )
        }
        setName(value)
      }
    })

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };


    socket.on('messages', (user) => {
      setMessages((prevMessages) => [...prevMessages, user]);
      scrollToBottom();
    });

    return () => {
      socket.off('messages');
    };
  }, []);


  return (
    <>
      <h1 className="title">Chat React-Socket</h1>
      <div className="containerChat">
        <div className="containerEachMsg" >
          <div className="backgroundMsg" >
            {messages.map((msg, i) => {
              return (
                <div key={i} className="containMsg" ref={messagesEndRef}>
                  {msg.from !== name ? (
                      <p className="yourMsg">
                        ~ {msg.from}
                        <br />
                        <span className="content">{msg.data}</span>
                        <span className="timeMsg">
                          {msg.time < 12 ? `${msg.time} a.m` : `${msg.time} p.m`}
                        </span>
                      </p>
                  ) : (
                      <p className="MyMsg">
                        <span className="content">{msg.data}</span>
                        <span className="timeMsg">
                          {msg.time < 12 ? `${msg.time} a.m` : `${msg.time} p.m`}
                        </span>
                      </p>
                  )}
                </div>
              )
            })}
            <div className="rome">.</div>
          </div>
        </div>
        <div className="containerAdvice" >
          <p>⚠️ This chat is always in ephemeral mode, when you finish or update the browser, messages and users will be deleted.</p>
        </div>
        <form className="containerSendMsg" onSubmit={handleSubmit}>
          <textarea
            type="text"
            placeholder="Write a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleEnter}
            className="fieldMsg"
          />
          <button className="buttonMsg">⮞</button>
        </form>
      </div>
    </>
  );
};

export default App;
