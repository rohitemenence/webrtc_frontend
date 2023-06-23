import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const Chat = () => {
  const socketRef = useRef();
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState("");
  const textRef = useRef();

  useEffect(() => {
    // Initialize socket.io
    socketRef.current = io("/");

    // Prompt for user name
    const user = prompt("Enter your name");
    setUserName(user);

    // Receive new messages
    socketRef.current.on("createMessage", (message, name) => {
      setMessages((prevMessages) => [...prevMessages, { message, name }]);
    });

    // Cleanup function
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    const message = textRef.current.value;
    if (message.length !== 0) {
      socketRef.current.emit("message", message);
      textRef.current.value = "";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <b>
              <i className="far fa-user-circle"></i>{" "}
              <span>{msg.name === userName ? "me" : msg.name}</span>
            </b>
            <span>{msg.message}</span>
          </div>
        ))}
      </div>
      <input
        type="text"
        id="chat_message"
        ref={textRef}
        onKeyDown={handleKeyDown}
      />
      <button id="send" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};

export default Chat;