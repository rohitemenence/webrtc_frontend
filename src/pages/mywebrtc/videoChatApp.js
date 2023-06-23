import React, { useState } from "react";
import Peer from "peerjs";
import socketio from "socket.io-client";
import Video from "next/video";

export default function VideoChatApp() {
  const [myVideoStream, setMyVideoStream] = useState();
  const [user, setUser] = useState("");
  const [messages, setMessages] = useState([]);

  const socket = socketio("http://localhost:3000");

  const addVideoStream = (video, stream) => {
    setMyVideoStream(stream);
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
      videoGrid.append(video);
    });
  };

  const onMessage = (message, userName) => {
    setMessages((messages) => [...messages, { message, userName }]);
  };

  const onUserConnected = (userId) => {
    socket.emit("join-room", ROOM_ID, userId, user);
  };

  const onCall = (call) => {
    call.answer(myVideoStream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
  };

  const onClose = () => {
    socket.disconnect();
  };


  return (
    <NextPage>
    <Video srcObject={myVideoStream} muted />
    <div>
      {messages.map((message) => (
        <div key={message.message}>
          <b>{message.userName}:</b> {message.message}
        </div>
      ))}
    </div>
    <button onClick={() => socket.emit("message", "Hello, world!")}>
      Send message
    </button>
  </NextPage>
);
};

