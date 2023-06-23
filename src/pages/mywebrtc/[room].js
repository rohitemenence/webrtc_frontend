import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { io } from 'socket.io-client';

const RoomPage = () => {
  const router = useRouter();
  const { room } = router.query;

  const videoGridRef = useRef(null);
  const myVideoRef = useRef(null);
  const showChatRef = useRef(null);
  const backBtnRef = useRef(null);
  const textRef = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    const socket = io();
    const videoGrid = videoGridRef.current;
    const myVideo = myVideoRef.current;
    const showChat = showChatRef.current;
    const backBtn = backBtnRef.current;
    const text = textRef.current;
    const messages = messagesRef.current;

    // Rest of your existing code...

    return () => {
      // Clean up code
    };
  }, []);

  return (
    <div>
      <Head>
        <title>Video Chat App</title>
        <link rel="stylesheet" href="/style.css" />
        <script src="/socket.io/socket.io.js"></script>
        <script src="https://kit.fontawesome.com/c939d0e917.js"></script>
        <script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `const ROOM_ID = "${room}";`,
          }}
        ></script>
      </Head>

      {/* Rest of your JSX */}
    </div>
  );
};

export default RoomPage;