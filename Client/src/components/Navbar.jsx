import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/App_Context";
import { Navbar, Container, Nav } from "react-bootstrap";
import { FaHome, FaPlusCircle, FaUtensils, FaSignInAlt, FaUserPlus, FaBookmark, FaSignOutAlt, FaTrophy } from "react-icons/fa";

const CustomNavbar = () => {
  const { isAuthenticated, logOut } = useContext(AppContext);

  
  
  return (
    <Navbar expand="lg" className="custom-navbar" style={{
      backgroundColor: '#0d261f',
      borderBottom: '1px solid #2a5245',
      padding: '0.5rem 0'
    }}>
      <Container>
        {/* Logo and Brand Name */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center" style={{
          color: '#ffd700',
          textDecoration: 'none',
          fontWeight: '700',
          fontSize: '1.5rem'
        }}>
          <img 
            src="/logo.png" 
            alt="MealNest Logo"
            style={{
              height: '40px',
              marginRight: '10px'
            }}
          />
          MealNest
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{
          borderColor: '#ffd700',
          color: '#ffd700'
        }} />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {/* New Home Link - Visible to all users */}
            <Nav.Link as={Link} to="/" className="nav-link-custom mx-2">
              <FaHome className="me-1" />
              Home
            </Nav.Link>

            {/* Top Recipes Link - Visible to all users */}
            <Nav.Link as={Link} to="/top-recipes" className="nav-link-custom mx-2">
              <FaTrophy className="me-1" />
              Top Recipes
            </Nav.Link>

            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/add" className="nav-link-custom mx-2">
                  <FaPlusCircle className="me-1" />
                  Add Recipe
                </Nav.Link>
                <Nav.Link as={Link} to="/profile" className="nav-link-custom mx-2">
                  <FaUtensils className="me-1" />
                  My Recipes
                </Nav.Link>
                <Nav.Link as={Link} to="/saved" className="nav-link-custom mx-2">
                  <FaBookmark className="me-1" />
                  Saved Recipes
                </Nav.Link>
                <Nav.Link 
                  onClick={logOut} 
                  className="nav-link-custom mx-2"
                  style={{ color: '#ff6b6b' }}
                >
                  <FaSignOutAlt className="me-1" />
                  Sign Out
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="nav-link-custom mx-2">
                  <FaSignInAlt className="me-1" />
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="nav-link-custom mx-2">
                  <FaUserPlus className="me-1" />
                  Register
                </Nav.Link>
                <Nav.Link as={Link} to="/saved" className="nav-link-custom mx-2">
                  <FaBookmark className="me-1" />
                  Saved Recipes
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;