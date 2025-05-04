import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/App_Context";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col, Spinner, Card, Badge } from "react-bootstrap";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Saved = () => {
  const {
    savedRecipe,
    isAuthenticated,
    user
  } = useContext(AppContext);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        // Get the token from localStorage
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }
        
        // Make the API call directly instead of using context
        const response = await axios.get("http://localhost:3000/api/saved", {
          headers: {
            "Content-Type": "application/json",
            "Auth": token
          },
          withCredentials: true
        });
        
        console.log("Saved recipes response:", response.data);
        
        if (response.data && response.data.recipe) {
          setRecipes(response.data.recipe);
          setError(null);
        } else {
          setRecipes([]);
        }
      } catch (err) {
        console.error("Failed to fetch saved recipes:", err);
        setError("Failed to load saved recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedRecipes();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container text-center my-5" style={{ color: "#e0e0e0", backgroundColor: "#0a1f1c", minHeight: "100vh", paddingTop: "50px" }}>
        <h3>Please login to view your saved recipes</h3>
        <Button
          className="mt-3"
          onClick={() => navigate('/login')}
          style={{ backgroundColor: "#4a7c6f", borderColor: "#4a7c6f" }}
        >
          Login
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center my-5" style={{ color: "#e0e0e0", backgroundColor: "#0a1f1c", minHeight: "100vh", paddingTop: "50px" }}>
        <Spinner animation="border" role="status" style={{ color: "#4a7c6f" }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading your saved recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center my-5" style={{ color: "#e0e0e0", backgroundColor: "#0a1f1c", minHeight: "100vh", paddingTop: "50px" }}>
        <div className="alert alert-danger">{error}</div>
        <Button
          onClick={() => window.location.reload()}
          style={{ backgroundColor: "#4a7c6f", borderColor: "#4a7c6f" }}
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Check if we have any recipes to display
  const hasSavedRecipes = Array.isArray(recipes) && recipes.length > 0;

  return (
    <div style={{ backgroundColor: "#0a1f1c", minHeight: "100vh", paddingTop: "30px", paddingBottom: "50px" }}>
      <ToastContainer />
      <Container>
        <h2 className="text-center mb-4" style={{ color: "#e0e0e0" }}>
          {user?.name ? `${user.name}'s Saved Recipes` : 'Your Saved Recipes'}
        </h2>
        
        {!hasSavedRecipes ? (
          <div className="text-center" style={{ color: "#e0e0e0" }}>
            <p>You haven't saved any recipes yet.</p>
            <Button
              onClick={() => navigate('/')}
              style={{ backgroundColor: "#4a7c6f", borderColor: "#4a7c6f" }}
            >
              Browse Recipes
            </Button>
          </div>
        ) : (
          <Row className="g-4">
            {recipes.map((item) => {
              // Handle different possible data structures
              const recipeData = item.recipe || item;
              
              // Skip if no valid recipe data
              if (!recipeData || typeof recipeData === 'string' || !recipeData.title) {
                console.log("Recipe not properly populated:", recipeData);
                return null;
              }
              
              return (
                <Col key={item._id || `recipe-${recipeData._id}`} xs={12} sm={6} md={4} lg={3}>
                  <Card className="h-100 recipe-card" style={{ 
                    backgroundColor: "#1a3b35",
                    border: "1px solid #3a5a52",
                    transition: "transform 0.3s",
                    cursor: "pointer"
                  }}>
                    <div className="d-flex justify-content-center align-items-center p-3">
                      <Card.Img
                        variant="top"
                        src={recipeData.imgurl}
                        style={{
                          width: "100%",
                          height: "180px",
                          borderRadius: "10px",
                          objectFit: "cover",
                          border: "2px solid #4a7c6f"
                        }}
                      />
                    </div>
                    <Card.Body>
                      <Card.Title style={{ color: "#e0e0e0" }}>{recipeData.title}</Card.Title>
                      <div className="d-flex justify-content-between mb-2">
                        {recipeData.category && (
                          <Badge pill bg="secondary" style={{ backgroundColor: "#4a7c6f" }}>
                            {recipeData.category}
                          </Badge>
                        )}
                        {recipeData.cookTime && (
                          <small style={{ color: "#e0e0e0" }}>{recipeData.cookTime}</small>
                        )}
                      </div>
                      {recipeData.ratings?.count > 0 && (
                        <div className="mb-3">
                          <Badge pill className="rating-badge">
                            {recipeData.ratings.average.toFixed(1)} ★ ({recipeData.ratings.count})
                          </Badge>
                        </div>
                      )}
                      <div className="d-flex justify-content-between">
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => navigate(`/${recipeData._id}`)}
                          style={{ backgroundColor: "#4a7c6f", borderColor: "#4a7c6f" }}
                        >
                          View Recipe
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Saved;