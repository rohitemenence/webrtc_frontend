import React, { useState, useEffect } from "react";
import {toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./login.module.css";
import Link from 'next/link';

import { useRouter } from 'next/router';
import jwt from "jsonwebtoken";
import Cookies from 'js-cookie';




const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loginUser, setLoginUser] = useState(null);


     const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);


        if (data.success) {
             // Save user token in local storage
             Cookies.set('userToken', data.token);

        // localStorage.setItem("userToken", data.token);
        checkAuthentication();

        }

        if (typeof window !== "undefined") {
            router.push("/webrtc");
          }


        setFormData({
          email: "",
          password: "",
        });
        toast.success("Login successfully!");

      } else {
        console.error("FLogin failed", response.statusText);
      }
    } catch (error) {
      console.error("Error Login form:", error);
      toast.error("Login failed");
    }
  };

  const checkAuthentication = () => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      try {
        const decodedToken = jwt.decode(userToken);
        if (decodedToken) {
          const { name } = decodedToken;
          setLoginUser({ name });
        } else {
          setLoginUser(null);
        }
      } catch (error) {
        setLoginUser(null);
      }
    } else {
      setLoginUser(null);
    }
  };

  useEffect(() => {
    checkAuthentication();
  
    if (loginUser) {
      router.push("/webrtc");
    }
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles["h1"]}>Login Form</h1>
      <form onSubmit={handleSubmit} className={styles["register-form"]}>
        <label className={styles["register-label"]}>
          Email-Address
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles["register-input"]}
          />
        </label>
        <br />
        <label className={styles["register-label"]}>
          Password:-
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={styles["register-input"]}
          />
        </label>
        <br />
        <button type="submit" className={styles["register-button"]}>
          Login
        </button>
      </form>
      <Link className={styles["link"]} href="/register">Sign up for WebRTC</Link>

    </div>
  );
};

export default LoginPage;
