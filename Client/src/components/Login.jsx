import React, { useContext, useState } from "react";
import { AppContext } from "../context/App_Context";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AppContext);
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const result = await login(gmail, password);
      
      // Only show success and redirect if login was successful
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
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      // Only show error if login failed
      toast.error(error.response?.data?.message || "Invalid credentials", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
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
        }}>Login</h2>
        <form onSubmit={loginHandler}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              color: "#ffffff",
              marginBottom: "8px",
              fontWeight: "500"
            }}>Email</label>
            <input
              value={gmail}
              onChange={(e) => setGmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
              backgroundColor: "#d4af37",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#3a6a5f"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#d4af37"}
          >
            Login
          </button>
          <p style={{
            color: "#e0e0e0",
            textAlign: "center",
            marginTop: "20px"
          }}>
            Don't have an account?{' '}
            <span 
              style={{
                color: "#4a7c6f",
                cursor: "pointer",
                fontWeight: "500"
              }}
              onClick={() => navigate('/register')}
            >
              Register here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;