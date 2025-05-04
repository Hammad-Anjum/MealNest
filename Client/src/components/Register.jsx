import React, { useContext, useState } from "react";
import { AppContext } from "../context/App_Context";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AppContext);
  const [name, setname] = useState("");
  const [gmail, setgmail] = useState("");
  const [password, setpassword] = useState("");

  const registerHandler = async (e) => {
    e.preventDefault();
    const result = await register(name ,gmail, password);
    
    toast.success(result.data.message, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
    console.log(result.data)
    if (result.data.message !== "User Already exist") {
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  };

  return (
    <div style={{ 
      backgroundColor: "#0a1f1c", 
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <ToastContainer />
      <div style={{
        width: "100%",
        maxWidth: "500px",
        backgroundColor: "#1a3b35",
        borderRadius: "10px",
        padding: "40px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        border: "1px solid #3a5a52"
      }}>
        <h2 style={{
          color: "#ffffff",
          textAlign: "center",
          marginBottom: "30px",
          fontWeight: "600"
        }}>Register</h2>
        <form onSubmit={registerHandler}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              color: "#ffffff",
              marginBottom: "8px",
              fontWeight: "500"
            }}>Name</label>
            <input
              value={name}
              onChange={(e) => setname(e.target.value)}
              type="text"
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #3a5a52",
                backgroundColor: "#2d4a44",
                color: "#ffffff",
                fontSize: "16px"
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              color: "#ffffff",
              marginBottom: "8px",
              fontWeight: "500"
            }}>Email</label>
            <input
              value={gmail}
              onChange={(e) => setgmail(e.target.value)}
              type="email"
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #3a5a52",
                backgroundColor: "#2d4a44",
                color: "#ffffff",
                fontSize: "16px"
              }}
            />
          </div>
          <div style={{ marginBottom: "30px" }}>
            <label style={{
              display: "block",
              color: "#ffffff",
              marginBottom: "8px",
              fontWeight: "500"
            }}>Password</label>
            <input
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              type="password"
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #3a5a52",
                backgroundColor: "#2d4a44",
                color: "#ffffff",
                fontSize: "16px"
              }}
            />
          </div>
          <button 
            type="submit" 
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              border: "none",
              backgroundColor:  "#d4af37",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#3a6a5f"}
            onMouseOut={(e) => e.target.style.backgroundColor =  "#d4af37"}
          >
            Register
          </button>
          <p style={{
            color: "#e0e0e0",
            textAlign: "center",
            marginTop: "20px"
          }}>
            Already have an account?{' '}
            <span 
              style={{
                color: "#4a7c6f",
                cursor: "pointer",
                fontWeight: "500"
              }}
              onClick={() => navigate('/login')}
            >
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;