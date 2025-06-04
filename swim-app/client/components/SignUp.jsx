import React, { useState, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { userContext } from "./App";
import Cookies from "js-cookie";
import '../styles/SignUp.css';

function Signup() {
  const [isStepTwo, setIsStepTwo] = useState(false);
  const stepOneRef = useRef(null); 
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
    const { email, password, verifyPassword } = data;
    if (password !== verifyPassword) {
      alert("הסיסמאות אינן תואמות");
      return;
    }
    stepOneRef.current = { email, password }; 
    setIsStepTwo(true);
  };

  const onStepTwo = async (data) => {
    console.log("🚀 Signup attempt with:", data);

    const payload = {
      name: data.name,
      email: stepOneRef.current.email, 
      password: stepOneRef.current.password, 
      type_id: parseInt(data.type_id),
    };

    console.log("📤 Sending payload:", payload);

    try {
      const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      console.log("📡 Response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "ההרשמה נכשלה");
        return;
      }
      const responseData = await res.json();

      const { user, accessToken } = responseData;

    Cookies.set("accessToken", accessToken, {
    expires: 0.0104,
    sameSite: "Lax",
    secure: false, // true בפרודקשן
    httpOnly: false // כדי שהקליינט יוכל לגשת
});

      setUserData(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      stepOneRef.current = null;
      navigate("/home");

    } catch (error) {
      alert("שגיאת רשת: " + error.message);
    }
  };

  const goBackToStepOne = () => {
    setIsStepTwo(false);
  };

  return (
    <div className="signup-page">
      <div className="signup-wrapper">
        <div className="signup-header">
          <h1 className="signup-title">הרשמה</h1>
          <p className="signup-subtitle">הצטרפו לבית הספר לשחייה שלנו</p>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          <div className={`step-circle ${!isStepTwo ? 'active' : 'completed'}`}>
            1
          </div>
          <div className={`step-line ${isStepTwo ? 'completed' : ''}`}></div>
          <div className={`step-circle ${isStepTwo ? 'active' : 'inactive'}`}>
            2
          </div>
        </div>

        <div className="login-container">
          {/* שלב 1: אימייל וסיסמה */}
          <input
            type="email"
            {...reg1("email", {
              required: "אימייל נדרש",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "אימייל לא תקין"
              },
            })}
            placeholder="כתובת אימייל"
            className="login-input"
            disabled={isStepTwo}
            defaultValue={stepOneRef.current?.email || ""} // תיקון כאן
          />
          {err1.email && <span className="error-message">{err1.email.message}</span>}

          <input
            type="password"
            {...reg1("password", {
              required: "סיסמה נדרשת",
              minLength: { value: 6, message: "לפחות 6 תווים" },
            })}
            placeholder="סיסמה"
            className="login-input"
            disabled={isStepTwo}
            defaultValue={stepOneRef.current?.password || ""} // תיקון כאן
          />
          {err1.password && <span className="error-message">{err1.password.message}</span>}

          {!isStepTwo && (
            <>
              <input
                type="password"
                {...reg1("verifyPassword", {
                  required: "אנא אמת את הסיסמה"
                })}
                placeholder="אימות סיסמה"
                className="login-input"
              />
              {err1.verifyPassword && (
                <span className="error-message">{err1.verifyPassword.message}</span>
              )}

              <button
                type="button"
                onClick={submitStepOne(onStepOne)}
                className="login-button"
              >
                המשך
              </button>
            </>
          )}

          {/* שלב 2: פרטים נוספים */}
          {isStepTwo && (
            <form onSubmit={submitStepTwo(onStepTwo)}>
              <input
                {...reg2("name", {
                  required: "שם מלא נדרש",
                  minLength: { value: 2, message: "לפחות 2 תווים" },
                })}
                placeholder="שם מלא"
                className="login-input"
              />
              {err2.name && <span className="error-message">{err2.name.message}</span>}

              <select
                {...reg2("type_id", { required: "אנא בחר סוג משתמש" })}
                className="login-input"
              >
                <option value="">בחר סוג משתמש</option>
                <option value="1">תלמיד</option>
                <option value="2">מורה</option>
              </select>
              {err2.type_id && <span className="error-message">{err2.type_id.message}</span>}

              <div className="form-row">
                <button
                  type="button"
                  onClick={goBackToStepOne}
                  className="back-button"
                  disabled={isSubmitting}
                >
                  →
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="login-button"
                >
                  {isSubmitting ? "נרשם..." : "הרשמה"}
                </button>
              </div>
            </form>
          )}
        </div>

        <button
          className="switch-signup"
          onClick={() => navigate("/login")}
          disabled={isSubmitting}
        >
          כבר יש לך חשבון? התחבר כאן
        </button>
      </div>
    </div>
  );
}

export default Signup;
