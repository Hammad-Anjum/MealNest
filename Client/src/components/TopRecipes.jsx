import React, { useContext } from "react";
import { AppContext } from "../context/App_Context";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Card, Badge, Container, Row, Col } from "react-bootstrap";
import { FaStar, FaUtensils, FaClock } from "react-icons/fa";

const TopRecipes = () => {
  const { recipe } = useContext(AppContext);
  const navigate = useNavigate();

  // Filter and sort recipes to get top 5 by rating
  const topRecipes = [...recipe]
    .filter(r => r.ratings?.count > 0) // Only recipes with ratings
    .sort((a, b) => {
      // First sort by average rating (descending)
      if (b.ratings.average !== a.ratings.average) {
        return b.ratings.average - a.ratings.average;
      }
      // If ratings are equal, sort by number of ratings (descending)
      return b.ratings.count - a.ratings.count;
    })
    .slice(0, 5); // Take top 5

  return (
    <div className="top-recipes-container" style={{ backgroundColor: "#0a1f1c", minHeight: "100vh" }}>
      <ToastContainer />
      <div className="hero-section py-5" style={{ backgroundColor: "#1a3b35" }}>
        <Container>
          <h1 className="text-offwhite mb-4">Top Recipes of the Week</h1>
          <p className="text-offwhite mb-4" style={{ color: "#e0e0e0" }}>
            Discover the most loved recipes in our community
          </p>
        </Container>
      </div>

      <Container className="py-5">
        {topRecipes.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="text-offwhite">No top recipes found</h4>
            <p className="text-offwhite" style={{ color: "#e0e0e0" }}>
              Recipes will appear here once they receive ratings
            </p>
          </div>
        ) : (
          <Row className="g-4 justify-content-center">
            {topRecipes.map((data, index) => (
              <Col key={data._id} xs={12} md={8} lg={6}>
                <Card className="h-100 recipe-card" style={{ 
                  backgroundColor: "#1a3b35",
                  border: "1px solid #3a5a52",
                  transition: "transform 0.3s",
                  cursor: "pointer"
                }}>
                  <div className="d-flex">
                    <div className="p-3" style={{ width: "40%" }}>
                      <Card.Img
                        variant="top"
                        src={data.imgurl}
                        style={{
                          width: "100%",
                          height: "200px",
                          borderRadius: "10px",
                          objectFit: "cover",
                          border: "2px solid #4a7c6f"
                        }}
                      />
                    </div>
                    <Card.Body style={{ width: "60%" }}>
                      <div className="d-flex align-items-center mb-2">
                        <Badge pill style={{ 
                          backgroundColor: "#ffd700", 
                          color: "#000",
                          fontSize: "1.2rem",
                          marginRight: "10px",
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          {index + 1}
                        </Badge>
                        <Card.Title className="text-offwhite mb-0" style={{ fontSize: "1.5rem" }}>
                          {data.title}
                        </Card.Title>
                      </div>
                      
                      <div className="d-flex align-items-center mb-3">
                        <FaStar className="me-1" style={{ color: "#ffd700" }} />
                        <span className="text-offwhite me-3" style={{ fontSize: "1.2rem" }}>
                          {data.ratings.average.toFixed(1)} ({data.ratings.count} ratings)
                        </span>
                        {data.cookTime && (
                          <>
                            <FaClock className="me-1" style={{ color: "#4a7c6f" }} />
                            <span className="text-offwhite">{data.cookTime}</span>
                          </>
                        )}
                      </div>

                      {data.category && (
                        <Badge pill bg="secondary" className="mb-3" style={{ backgroundColor: "#4a7c6f" }}>
                          <FaUtensils className="me-1" />
                          {data.category}
                        </Badge>
                      )}

                      <div className="d-flex justify-content-start mt-4">
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => navigate(`/${data._id}`)}
                          style={{ 
                            backgroundColor: "#4a7c6f", 
                            borderColor: "#4a7c6f",
                            padding: "8px 20px"
                          }}
                        >
                          View Recipe
                        </Button>
                      </div>
                    </Card.Body>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default TopRecipes;