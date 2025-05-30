// Signup.jsx
import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { userContext } from "./App";

function Signup() {
  const [isStepTwo, setIsStepTwo] = useState(false);
  const [stepOneData, setStepOneData] = useState(null);
  const { setUserData } = useContext(userContext);
  const navigate = useNavigate();

  const {
    register: reg1,
    handleSubmit: submitStepOne,
    formState: { errors: err1 },
  } = useForm();

  const {
    register: reg2,
    handleSubmit: submitStepTwo,
    formState: { errors: err2, isSubmitting },
  } = useForm();

  const onStepOne = (data) => {
    const { username, password, verifyPassword } = data;
    if (password !== verifyPassword) {
      alert("Passwords do not match");
      return;
    }
    setStepOneData({ username, password });
    setIsStepTwo(true);
  };

  const onStepTwo = async (data) => {
    const payload = {
      username: stepOneData.username,
      password: stepOneData.password,
      name: data.name,
      email: data.email,
      phone: data.phone,
    };

    try {
      const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const e = await res.json();
        alert(e.message || "Signup failed");
        return;
      }
      const user = await res.json();
      setUserData(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate("/home");
    } catch (e) {
      console.error(e);
      alert("An unexpected error occurred");
    }
  };

  return (
    <div>
      {!isStepTwo ? (
        <form className="login-container" onSubmit={submitStepOne(onStepOne)}>
          <input
            {...reg1("username", {
              required: "Username is required",
              minLength: { value: 3, message: "At least 3 chars" },
            })}
            placeholder="Username"
            className="login-input"
          />
          {err1.username && <span className="error-message">{err1.username.message}</span>}

          <input
            type="password"
            {...reg1("password", {
              required: "Password is required",
              minLength: { value: 6, message: "At least 6 chars" },
            })}
            placeholder="Password"
            className="login-input"
          />
          {err1.password && <span className="error-message">{err1.password.message}</span>}

          <input
            type="password"
            {...reg1("verifyPassword", { required: "Please verify your password" })}
            placeholder="Verify Password"
            className="login-input"
          />
          {err1.verifyPassword && <span className="error-message">{err1.verifyPassword.message}</span>}

          <button type="submit" className="login-button">
            Next
          </button>
        </form>
      ) : (
        <form className="login-container" onSubmit={submitStepTwo(onStepTwo)}>
          <input
            {...reg2("name", {
              required: "Name is required",
              minLength: { value: 2, message: "At least 2 chars" },
            })}
            placeholder="Name"
            className="login-input"
          />
          {err2.name && <span className="error-message">{err2.name.message}</span>}

          <input
            {...reg2("email", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
            })}
            placeholder="Email"
            className="login-input"
          />
          {err2.email && <span className="error-message">{err2.email.message}</span>}

          <input
            {...reg2("phone", {
              required: "Phone is required",
              pattern: { value: /^[0-9\-\+]{9,}$/, message: "Invalid phone" },
            })}
            placeholder="Phone"
            className="login-input"
          />
          {err2.phone && <span className="error-message">{err2.phone.message}</span>}

          <button type="submit" disabled={isSubmitting} className="login-button">
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      )}

      <button className="switch-signup" onClick={() => navigate("/login")}>
        Already have an account?
      </button>
    </div>
  );
}

export default Signup;
