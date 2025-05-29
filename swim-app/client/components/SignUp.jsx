import React, { useState, useContext } from "react";
// import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
// import "../css/login.css";
import { userContext } from "./App";

function Signup() {
  const [isSuccessfulSignUp, setIsSuccessfulSignUp] = useState(false);
  const [firstFormData, setFirstFormData] = useState(null); // To store username and password
  const { setUserData } = useContext(userContext);
  const navigate = useNavigate();

//   const {
//     register: registerFirstForm,
//     handleSubmit: handleFirstSubmit,
//     formState: { errors: firstFormErrors },
//   } = useForm();

//   const {
//     register: registerSecondForm,
//     handleSubmit: handleSecondSubmit,
//     formState: { errors: secondFormErrors },
//   } = useForm();

  const onFirstFormSubmit = async (data) => {
    const { username, password, verifyPassword } = data;

    if (password !== verifyPassword) {
      alert("Passwords do not match");
      return;
    }

    const response = await fetch(`http://localhost:3000/users/?username=${username}`);
    if (response.ok) {
      const users = await response.json();
      if (users.length === 0) {
        setFirstFormData({ username, password }); // Store username and password
        setIsSuccessfulSignUp(true);
      } else {
        alert("User already exists");
      }
    } else {
      alert("Error checking username. Please try again.");
    }
  };

  const onSecondFormSubmit = async (data) => {
    const createUser = {
      username: firstFormData.username,
      name: data.name,
      email: data.email,
      address: {
        city: data.city,
        suite: data.suite,
        street: data.street,
        zipcode: data.zipcode,
        geo: {
          lat: data.latitude,
          lng: data.longitude,
        },
      },
      phone: data.phone,
      website: firstFormData.password,
      company: {
        name: data.companyName,
        catchPhrase: data.catchPhrase,
        bs: data.bs,
      },
    };

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createUser),
      });

      if (response.ok) {
        const createdUser = await response.json();
        const { website, ...userWithoutPassword } = createdUser;
        setUserData(userWithoutPassword);
        localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
        navigate(`/home`);
      } else {
        alert("Error creating user. Please try again.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div>
      {!isSuccessfulSignUp && (
        <form className="login-container" onSubmit={handleFirstSubmit(onFirstFormSubmit)}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="login-input"
            {...registerFirstForm("username", {
              required: "Username is required",
              minLength: { value: 3, message: "Username must be at least 3 characters" },
            })}
          />
          {firstFormErrors.username && <span className="error-message">{firstFormErrors.username.message}</span>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="login-input"
            {...registerFirstForm("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
          />
          {firstFormErrors.password && <span className="error-message">{firstFormErrors.password.message}</span>}

          <input
            type="password"
            name="verifyPassword"
            placeholder="Verify Password"
            className="login-input"
            {...registerFirstForm("verifyPassword", { required: "Please verify your password" })}
          />
          {firstFormErrors.verifyPassword && (
            <span className="error-message">{firstFormErrors.verifyPassword.message}</span>
          )}

          <button type="submit" className="login-button">
            Submit
          </button>
        </form>
      )}

      {isSuccessfulSignUp && (
        <form className="login-container" onSubmit={handleSecondSubmit(onSecondFormSubmit)}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="login-input"
            {...registerSecondForm("name", {
              required: "Name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
            })}
          />
          {secondFormErrors.name && <span className="error-message">{secondFormErrors.name.message}</span>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="login-input"
            {...registerSecondForm("email", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
            })}
          />
          {secondFormErrors.email && <span className="error-message">{secondFormErrors.email.message}</span>}

          <label>Address:</label>
          <input
            type="text"
            name="city"
            placeholder="City"
            className="login-input"
            {...registerSecondForm("city", { required: "City is required" })}
          />
          {secondFormErrors.city && <span className="error-message">{secondFormErrors.city.message}</span>}

          <input type="text" name="suite" placeholder="Suite" className="login-input" {...registerSecondForm("suite")} />

          <input
            type="text"
            name="street"
            placeholder="Street"
            className="login-input"
            {...registerSecondForm("street", { required: "Street is required" })}
          />
          {secondFormErrors.street && <span className="error-message">{secondFormErrors.street.message}</span>}

          <input
            type="text"
            name="zipcode"
            placeholder="Zipcode"
            className="login-input"
            {...registerSecondForm("zipcode", {
              required: "Zipcode is required",
              pattern: { value: /^[0-9\-]+$/, message: "Invalid zipcode" },
            })}
          />
          {secondFormErrors.zipcode && <span className="error-message">{secondFormErrors.zipcode.message}</span>}

          <label>Geo:</label>
          <input
            type="text"
            name="latitude"
            placeholder="Latitude"
            className="login-input"
            {...registerSecondForm("latitude", {
              required: "Latitude is required",
              pattern: { value: /^-?([0-8]?[0-9]|90)(\.[0-9]+)?$/, message: "Invalid latitude (-90 to 90)" },
            })}
          />
          {secondFormErrors.latitude && <span className="error-message">{secondFormErrors.latitude.message}</span>}

          <input
            type="text"
            name="longitude"
            placeholder="Longitude"
            className="login-input"
            {...registerSecondForm("longitude", {
              required: "Longitude is required",
              pattern: { value: /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]+)?$/, message: "Invalid longitude (-180 to 180)" },
            })}
          />
          {secondFormErrors.longitude && <span className="error-message">{secondFormErrors.longitude.message}</span>}

          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            className="login-input"
            {...registerSecondForm("phone", {
              required: "Phone number is required",
              pattern: { value: /^[0-9\-\+]{9,}$/, message: "Invalid phone number" },
            })}
          />
          {secondFormErrors.phone && <span className="error-message">{secondFormErrors.phone.message}</span>}

          <label>Company:</label>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            className="login-input"
            {...registerSecondForm("companyName", { required: "Company name is required" })}
          />
          {secondFormErrors.companyName && (
            <span className="error-message">{secondFormErrors.companyName.message}</span>
          )}

          <input type="text" name="catchPhrase" placeholder="Catch Phrase" className="login-input" {...registerSecondForm("catchPhrase")} />
          <input type="text" name="bs" placeholder="BS" className="login-input" {...registerSecondForm("bs")} />

          <button type="submit" className="login-button">
            Submit
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