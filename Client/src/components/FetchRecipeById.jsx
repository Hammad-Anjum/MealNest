import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/App_Context";
import { Link, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import { FaDownload } from "react-icons/fa";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Card, Badge, Container, Row, Col, Form } from "react-bootstrap";

const FetchRecipeById = ({ id }) => {
  const location = useLocation();
  const { getRecipeById, addComment, isAuthenticated } = useContext(AppContext);
  const [recipe, setRecipe] = useState(null);
  const [comment, setComment] = useState({ text: "", rating: 5 });

  useEffect(() => {
    const fetchRecipe = async (id) => {
      const result = await getRecipeById(id);
      setRecipe(result.data.recipe);
    };
    fetchRecipe(id);
  }, [id, getRecipeById]);

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setComment({ ...comment, [name]: name === "rating" ? parseInt(value) : value });
  };

  const submitComment = async (e) => {
    e.preventDefault();
    const result = await addComment(id, comment.text, comment.rating);
    if (result.data.recipe) {
      setRecipe(result.data.recipe);
      setComment({ text: "", rating: 5 });
      toast.success("Review submitted successfully!", {
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
    }
  };

  const downloadIngredientsPDF = async () => {
    if (!recipe) return;
  
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text(`${recipe.title} - Ingredients List`, 10, 15);
      
      let yPosition = 30;
      let itemNumber = 1;
  
      // Handle image if it exists
      if (recipe.imgurl) {
        try {
          const img = new Image();
          img.crossOrigin = "Anonymous"; 
          
          // Create a promise to handle image loading
          const imgPromise = new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Image load error'));
            img.src = recipe.imgurl;
          });
  
          // Wait for image to load or timeout
          const loadedImg = await Promise.race([
            imgPromise,
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Image load timeout')), 3000)
            )
          ]);
  
          // Determine image type from URL or content
          let imgType = 'JPEG';
          if (recipe.imgurl.toLowerCase().endsWith('.png')) {
            imgType = 'PNG';
          } else if (recipe.imgurl.toLowerCase().endsWith('.webp')) {
            imgType = 'WEBP';
          }
  
          // Try adding image with different formats
          try {
            doc.addImage(loadedImg, imgType, 10, 25, 50, 50);
            yPosition = 85; // Position after image
          } catch (e) {
            console.warn("Failed to add image with detected type, trying JPEG:", e);
            doc.addImage(loadedImg, 'JPEG', 10, 25, 50, 50);
            yPosition = 85;
          }
        } catch (imgError) {
          console.warn("Could not load image, proceeding without it:", imgError);
          // Continue without image
        }
      }
  
      doc.setFontSize(12);
      
      // First add ingredients from the new array if it exists
      if (recipe.ingredients?.length > 0) {
        recipe.ingredients.forEach((ing) => {
          yPosition += 10;
          doc.text(`${itemNumber}. ${ing.name} - ${ing.quantity}`, 70, yPosition);
          itemNumber++;
        });
      }
  
      // Then add any legacy ingredients that exist and aren't already in the array
      const legacyIngredients = [
        { name: recipe.ing1, quantity: recipe.qty1 },
        { name: recipe.ing2, quantity: recipe.qty2 },
        { name: recipe.ing3, quantity: recipe.qty3 },
        { name: recipe.ing4, quantity: recipe.qty4 }
      ].filter(ing => 
        ing.name && 
        (!recipe.ingredients || !recipe.ingredients.some(i => i.name === ing.name))
      ); // <-- This was the issue - extra parenthesis
  
      legacyIngredients.forEach((ing) => {
        yPosition += 10;
        doc.text(`${itemNumber}. ${ing.name} - ${ing.quantity}`, 70, yPosition);
        itemNumber++;
      });
  
      // If no ingredients at all, show a message
      if (itemNumber === 1) {
        yPosition += 10;
        doc.text("No ingredients listed", 70, yPosition);
      }
      
      doc.save(`${recipe.title.replace(/\s+/g, '_')}_ingredients.pdf`);
      
      toast.success("Ingredients list downloaded!", {
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
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download ingredients list", {
        position: "top-right",
        autoClose: 2000,
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

  if (!recipe) return (
    <div className="text-center py-5">
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <>
      <ToastContainer />
      <div className="home-container" style={{ backgroundColor: "#0a1f1c", minHeight: "100vh" }}>
        {/* Recipe Header */}
        <div className="hero-section py-5" style={{ backgroundColor: "#1a3b35" }}>
          <Container className="text-center">
            <h1 className="text-offwhite mb-3">{recipe.title}</h1>
            <div className="d-flex justify-content-center gap-4">
              {recipe.cookTime && (
                <Badge pill style={{ backgroundColor: "#4a7c6f", fontSize: "1rem" }}>
                  <i className="bi bi-clock me-1"></i> {recipe.cookTime}
                </Badge>
              )}
              {recipe.ratings?.count > 0 && (
                <Badge pill style={{ backgroundColor: "#d4af37", color: "#000", fontSize: "1rem" }}>
                  {recipe.ratings.average.toFixed(1)} ★ ({recipe.ratings.count})
                </Badge>
              )}
            </div>
            <Button
              variant="outline-light"
              className="mt-3"
              onClick={downloadIngredientsPDF}
              style={{ borderColor: "#4a7c6f" }}
            >
              <FaDownload className="me-2" /> Download Ingredients
            </Button>
          </Container>
        </div>

        {/* Recipe Content */}
        <Container className="py-5">
          <Row className="g-4">
            {/* Recipe Image */}
<Col md={4} className="d-flex justify-content-center">
  <Card style={{ 
    backgroundColor: "#1a3b35",
    border: "1px solid #3a5a52",
    width: "100%",
    maxWidth: "300px",
    height: "fit-content" 
  }}>
    <Card.Img
      variant="top"
      src={recipe.imgurl}
      style={{
        height: "auto", 
        maxHeight: "300px",
        width: "100%",
        objectFit: "cover",
        borderBottom: "2px solid #4a7c6f"
      }}
    />
  </Card>
</Col>

            {/* Ingredients and Instructions */}
<Col md={8}>
  <Row className="g-4">
   {/* Ingredients Card */}
<Col md={6}>
  <Card style={{ 
    backgroundColor: "#1a3b35",
    border: "1px solid #3a5a52",
    height: "fit-content"
  }}>
    <Card.Body style={{ padding: "1.25rem" }}>
      <Card.Title className="text-offwhite mb-3">Ingredients</Card.Title>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {/* First show all items from the ingredients array if it exists */}
        {recipe.ingredients?.map((ing, idx) => (
          <div key={`new-${idx}`} style={{ display: "flex", justifyContent: "space-between" }}>
            <span className="text-offwhite">{ing.name}</span>
            <Badge pill style={{ backgroundColor: "#4a7c6f" }}>
              {ing.quantity}
            </Badge>
          </div>
        ))}
        
        {/* Then show any legacy ingredients that exist */}
        {[
          { name: recipe.ing1, quantity: recipe.qty1 },
          { name: recipe.ing2, quantity: recipe.qty2 },
          { name: recipe.ing3, quantity: recipe.qty3 },
          { name: recipe.ing4, quantity: recipe.qty4 }
        ]
        .filter(ing => ing.name && !recipe.ingredients?.some(i => i.name === ing.name))
        .map((ing, idx) => (
          <div key={`legacy-${idx}`} style={{ display: "flex", justifyContent: "space-between" }}>
            <span className="text-offwhite">{ing.name}</span>
            <Badge pill style={{ backgroundColor: "#4a7c6f" }}>
              {ing.quantity}
            </Badge>
          </div>
        ))}
      </div>
    </Card.Body>
  </Card>
</Col>

    {/* Instructions Card */}
    <Col md={6}>
      <Card style={{ 
        backgroundColor: "#1a3b35",
        border: "1px solid #3a5a52",
        height: "100%"
      }}>
        <Card.Body>
          <Card.Title className="text-offwhite mb-3">Instructions</Card.Title>
          <div className="text-offwhite" style={{ whiteSpace: "pre-line" }}>
            {recipe.ist}
          </div>
        </Card.Body>
      </Card>
    </Col>
  </Row>
</Col>
          </Row>

          {/* Comments Section */}
          {location.pathname !== "/saved" && (
            <Row className="mt-5">
              <Col>
                <Card style={{ 
                  backgroundColor: "#1a3b35",
                  border: "1px solid #3a5a52"
                }}>
                  <Card.Body>
                    <Card.Title className="text-offwhite mb-4">Comments & Reviews</Card.Title>
                    
                    {isAuthenticated && (
                      <Form onSubmit={submitComment} className="mb-4">
                        <Form.Group className="mb-3">
                          <Form.Label className="text-offwhite">Rating</Form.Label>
                          <Form.Select 
                            name="rating" 
                            value={comment.rating} 
                            onChange={handleCommentChange}
                            style={{ 
                              backgroundColor: "#2d4a44",
                              color: "#ffffff",
                              border: "1px solid #3a5a52"
                            }}
                          >
                            <option value="5">★★★★★ (5/5)</option>
                            <option value="4">★★★★☆ (4/5)</option>
                            <option value="3">★★★☆☆ (3/5)</option>
                            <option value="2">★★☆☆☆ (2/5)</option>
                            <option value="1">★☆☆☆☆ (1/5)</option>
                          </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-offwhite">Your Comment</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="text"
                            rows={3}
                            value={comment.text}
                            onChange={handleCommentChange}
                            required
                            style={{ 
                              backgroundColor: "#2d4a44",
                              color: "#ffffff",
                              border: "1px solid #3a5a52"
                            }}
                          />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                          Submit Review
                        </Button>
                      </Form>
                    )}

                    {recipe.comments?.length > 0 ? (
                      <div className="comment-list">
                        {recipe.comments.map((comment, idx) => (
                          <Card key={idx} className="mb-3" style={{ 
                            backgroundColor: "#2d4a44",
                            border: "1px solid #3a5a52"
                          }}>
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="text-warning">
                                  {'★'.repeat(comment.rating)}{'☆'.repeat(5 - comment.rating)}
                                </div>
                                <small className="text-offwhite">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </small>
                              </div>
                              <p className="text-offwhite mb-0">{comment.text}</p>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-offwhite">No comments yet. Be the first to review!</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          <div className="text-center mt-5">
            <Link to="/" className="btn btn-warning">
              Back to Home
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
};

export default FetchRecipeById;