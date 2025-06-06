import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../App";
import Cookies from "js-cookie";
import  "../../styles/LogIn.css";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUserData } = useContext(userContext);

  async function checkIFUserExists() {
    if (!email || !password) {
      setError("אנא מלא את כל השדות");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { accessToken, user } = await response.json();
        Cookies.set("accessToken", accessToken, { expires: 0.0104, sameSite: "Lax" });
        setUserData(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        navigate("/home");
      } else {
        try {
          const err = await response.json();
          setError(err.error || "שגיאה בהתחברות");
        } catch {
          setError("שגיאה בהתחברות");
        }
      }
    } catch (error) {
      setError("שגיאת רשת - נסה שוב");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    checkIFUserExists();
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-header">
          <h1 className="login-title">התחברות</h1>
          <p className="login-subtitle">ברוכים השבים לבית הספר לשחייה</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="login-container">
            <input
              name="email"
              type="email"
              placeholder="כתובת אימייל"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <input
              name="password"
              type="password"
              placeholder="סיסמה"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? "מתחבר..." : "התחבר"}
            </button>
          </div>
        </form>

        <button
          className="switch-signup"
          onClick={() => navigate("/signup")}
          disabled={isLoading}
        >
          עדיין אין לך חשבון? הירשם כאן
        </button>
      </div>
    </div>
  );
}

export default Login;
