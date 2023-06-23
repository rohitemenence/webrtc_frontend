import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import styles from "./webrtc.module.css";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SimplePeer from "simple-peer";
import io from "socket.io-client";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { FaUser } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";

import Cookies from "js-cookie";


import jwt from "jsonwebtoken";

const socket = io("http://localhost:9000");


const Webrtc = () => {
  const [users, setUsers] = useState([]);
  const [loginUser, setLoginUser] = useState(null);
  const [peer, setPeer] = useState(null);
  const router = useRouter();

  const videoRef = useRef(null);
  let mediaStream = null;

  const startWebcam = async () => {
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = mediaStream;
    } catch (error) {
      console.error("Error accessing webcam:", error);
      // Handle error: Display a notification or perform any other action as needed
    }
  };

 const stopWebcam = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      mediaStream = null;
      videoRef.current.srcObject = null;
    }
  };

  const handleWebcamClick = () => {
    if (mediaStream) {
      stopWebcam();
    } else {
      startWebcam();
    }
  };


  


  const handleInvite = (user) => {
    const peer = new SimplePeer({ initiator: true, trickle: false });

    peer.on("signal", (data) => {
      const invitationData = JSON.stringify({ user, signalData: data });
      socket.emit("sendInvitation", invitationData);
      console.log(invitationData, "sendInvitation")

      toast.info(`Invitation sent to ${user.name}`);
    });

    socket.on("receiveInvitation", (data) => {
      toast.info(`${data.user.name} sent you an invitation.`, {
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        onClose: () => {
          socket.emit("rejectInvitation", { user });
        },
        buttons: [
          {
            text: "Accept",
            onClick: () => {
              socket.emit("acceptInvitation", { user });
            },
          },
          {
            text: "Reject",
            onClick: () => {
              socket.emit("rejectInvitation", { user });
            },
          },
        ],
      });
    });

    socket.on("invitationAccepted", (data) => {
      toast.success(`${data.user.name} accepted your invitation.`);
      console.log("Invitation accepted:", data);
    });

    socket.on("invitationRejected", (data) => {
      toast.error(`${data.user.name} declined your invitation.`);
      // Invitation rejected logic
      console.log("Invitation rejected:", data);
      // Display a notification or perform any other action as needed
    });

    setPeer(peer);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout request failed");
      }

      Cookies.remove("userToken");

      console.log("User logged out successfully");
      toast.success("Logout successfully!");

      if (typeof window !== "undefined") {
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const checkAuthentication = () => {
    // const userToken = localStorage.getItem("userToken");
    const userToken = Cookies.get("userToken");

    console.log(userToken, "usertoken");

    if (userToken) {
      try {
        const decodedToken = jwt.decode(userToken);
        if (decodedToken && decodedToken.user.name) {
          setLoginUser(decodedToken.user.name);
        } else {
          setLoginUser(null);
        }
      } catch (error) {
        console.error("Error decoding user token:", error);
        setLoginUser(null);
      }
    } else {
      setLoginUser(null);
    }
  };

  const fetchRegisteredUsers = async () => {
    try {
      const response = await fetch("/api/getAllRegisteredUsers");
      const data = await response.json();

      if (response.ok) {
        const userArray = data.users || [];


        setUsers(userArray);
      } else {
        throw new Error("Failed to fetch the data");
      }
    } catch (error) {
      console.error("Fetch registered users error:", error);
    }
  };

  useEffect(() => {
    const checkAuthAndFetchUsers = async () => {
      checkAuthentication();
      await fetchRegisteredUsers();
    };

    checkAuthAndFetchUsers();

    socket.on("receiveInvitation", (invitationData) => {
      console.log("inside");
      console.log("Received invitation:", invitationData);
      // Handle received invitation data here
      // ...
    });

    return () => {
      // Cleanup code
      if (peer) {
        peer.destroy();
      }
    };
  }, []);

 

  return (
    <div className={styles.container}>
      <Head>
        <title>User Dashboard</title>
      </Head>
     
      <div className={styles.logoutButton}>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className={styles.profileButton}>
        {loginUser && <p>Welcome, {loginUser}</p>}
        {!loginUser && <p>Welcome, Guest</p>}
      </div>
      <h1>Welcome to Your Website</h1>
      {/* <div className={styles.videoContainer}>
        <video ref={videoRef} autoPlay muted />
        </div> */}
   {users.map((user, index) => (
  <div className={styles.card} key={index}>
    <Link className={styles["link"]} href="/login">
      <h2>Profile</h2>
    </Link>
    <div className={styles.profileInfo}>
      <div className={styles.profileIcon}>
        <FaUser />
      </div>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      {/* Add more profile details as needed */}
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <button onClick={() => handleInvite(user)}>Invite</button>
    
    </div>
    <br></br>
    <div>
        <video ref={videoRef} autoPlay muted></video>
      </div>
      <button onClick={handleWebcamClick}>{mediaStream ? "Stop Webcam" : "Start Webcam"}</button>
    {/* Add profile actions */}
  </div>
))}
      Add more sections or cards as needed                                      
    </div>
  );
};

export default Webrtc;
