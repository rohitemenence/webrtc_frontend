import React, { useState } from "react";
import styles from "./register.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import Link from 'next/link';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        toast.success("Form submitted successfully!");

        setFormData({
          name: "",
          email: "",
          password: "",
        });

        if (typeof window !== "undefined") {
          router.push("/login");
        }
      } else {
        console.error("Form submission failed", response.statusText);
      }
    } catch (error) {
      console.error("Error submission form:", error);
      toast.error("Form submission failed");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles["h1"]}>Register Form</h1>
      <form onSubmit={handleSubmit} className={styles["register-form"]}>
        <label className={styles["register-label"]}>
          Full-Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles["register-input"]}
          />
        </label>
        <br />

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
          Register
        </button>
      </form>
      <Link className={styles["link"]} href="/login">Already have an account?</Link>

    </div>
  );
};

export default RegisterPage;
