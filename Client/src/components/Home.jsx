import React, { useContext, useState } from "react";
import { AppContext } from "../context/App_Context";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Card, Badge, Container, Row, Col, Form, InputGroup } from "react-bootstrap";

const Home = () => {
  const navigate = useNavigate();
  const { recipe, savedRecipeById, isAuthenticated } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [searchMode, setSearchMode] = useState("title"); 

  const categories = [
    "all",
    "other",
    "vegan",
     "non veg",
    "keto",
    "gluten-free",
    "dairy-free",
    "low-carb",
    "dessert",
    "breakfast",
    "lunch",
    "dinner"
  ];

  const saved = async (id) => {
    if (!isAuthenticated) {
      toast.error("Please login to save recipes", {
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
      return;
    }

    const result = await savedRecipeById(id);
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
  };

  const filteredRecipes = recipe.filter(recipe => {

    const matchesCategory = selectedCategory === "all" || 
                          (recipe.category && recipe.category.toLowerCase() === selectedCategory.toLowerCase());
    
    // Search filter depends on the search mode
    let matchesSearch = true;
    if (searchMode === "title" && searchQuery) {
      matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (searchMode === "ingredient" && ingredientSearch) {
      // Check both new ingredients array and legacy ing1, ing2, etc. fields
      const ingredientsToCheck = [
        ...(recipe.ingredients?.map(ing => ing.name.toLowerCase()) || []),
        recipe.ing1?.toLowerCase(),
        recipe.ing2?.toLowerCase(),
        recipe.ing3?.toLowerCase(),
        recipe.ing4?.toLowerCase()
      ].filter(Boolean);
      
      matchesSearch = ingredientsToCheck.some(ing => 
        ing.includes(ingredientSearch.toLowerCase())
      );
    }
    
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <ToastContainer />
      <div className="home-container" style={{ backgroundColor: "#0a1f1c", minHeight: "100vh" }}>
        {/* Hero Section */}
        <div className="hero-section py-5" style={{ backgroundColor: "#1a3b35" }}>
          <Container>
            <h1 className="text-offwhite mb-4">Discover Delicious Recipes</h1>
            <p className="text-offwhite mb-4" style={{ color: "#e0e0e0" }}>
              Find and save your favorite recipes from around the world
            </p>
            
            {/* Search Toggle */}
            <div className="d-flex justify-content-center mb-3">
              <Button
                variant={searchMode === "title" ? "primary" : "outline-primary"}
                onClick={() => setSearchMode("title")}
                className="me-2"
                style={{
                  backgroundColor: searchMode === "title" ? "#4a7c6f" : "transparent",
                  borderColor: "#4a7c6f",
                  color: "#ffffff"
                }}
              >
                Search by Title
              </Button>
              <Button
                variant={searchMode === "ingredient" ? "primary" : "outline-primary"}
                onClick={() => setSearchMode("ingredient")}
                style={{
                  backgroundColor: searchMode === "ingredient" ? "#4a7c6f" : "transparent",
                  borderColor: "#4a7c6f",
                  color: "#ffffff"
                }}
              >
                Search by Ingredient
              </Button>
            </div>
            
            {/* Search Bar - Changes based on mode */}
            <Form.Group className="mb-4">
              {searchMode === "title" ? (
                <Form.Control
                  type="text"
                  placeholder="Search recipes by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ 
                    backgroundColor: "#2d4a44", 
                    color: "#ffffff",
                    border: "1px solid #3a5a52"
                  }}
                />
              ) : (
                <Form.Control
                  type="text"
                  placeholder="Search recipes by ingredient (e.g., chicken, flour)..."
                  value={ingredientSearch}
                  onChange={(e) => setIngredientSearch(e.target.value)}
                  style={{ 
                    backgroundColor: "#2d4a44", 
                    color: "#ffffff",
                    border: "1px solid #3a5a52"
                  }}
                />
              )}
            </Form.Group>
          </Container>
        </div>

        {/* Category Filter */}
        <Container className="py-4">
          <div className="category-scroll mb-4" style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
            {categories.map(category => (
              <Button
                key={category}
                variant="outline-light"
                className={`mx-2 ${selectedCategory === category ? "active-category" : ""}`}
                onClick={() => setSelectedCategory(category)}
                style={{
                  backgroundColor: selectedCategory === category ? "#2d4a44" : "transparent",
                  borderColor: "#3a5a52",
                  color: "#ffffff",
                  borderRadius: "20px",
                  textTransform: "capitalize"
                }}
              >
                {category}
              </Button>
            ))}
          </div>
        </Container>

        {/* Recipes Grid */}
        <Container className="pb-5">
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-5">
              <h4 className="text-offwhite">No recipes found</h4>
              <Button 
                variant="outline-light" 
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                  setIngredientSearch("");
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <Row className="g-4">
              {filteredRecipes.map((data) => (
                <Col key={data._id} xs={12} sm={6} md={4} lg={3}>
                  <Card className="h-100 recipe-card" style={{ 
                    backgroundColor: "#1a3b35",
                    border: "1px solid #3a5a52",
                    transition: "transform 0.3s",
                    cursor: "pointer"
                  }}>
                    <div className="d-flex justify-content-center align-items-center p-3">
                      <Card.Img
                        variant="top"
                        src={data.imgurl}
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
                      <Card.Title className="text-offwhite">{data.title}</Card.Title>
                      <div className="d-flex justify-content-between mb-2">
                        {data.category && (
                          <Badge pill bg="secondary" style={{ backgroundColor: "#4a7c6f" }}>
                            {data.category}
                          </Badge>
                        )}
                        {data.cookTime && (
                          <small className="text-offwhite">{data.cookTime}</small>
                        )}
                      </div>
                      {data.ratings?.count > 0 && (
                        <div className="mb-3">
                          <Badge pill className="rating-badge">
                            {data.ratings.average.toFixed(1)} ★ ({data.ratings.count})
                          </Badge>
                        </div>
                      )}
                      <div className="d-flex justify-content-between">
                        <Button
                          variant="outline-light"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            saved(data._id);
                          }}
                          style={{ borderColor: "#4a7c6f" }}
                        >
                          Save
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => navigate(`/${data._id}`)}
                          style={{ backgroundColor: "#4a7c6f", borderColor: "#4a7c6f" }}
                        >
                          View
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>

        {/* About Section */}
        <div className="py-5" style={{ backgroundColor: "#1a3b35" }}>
          <Container>
            <h2 className="text-center text-offwhite mb-4">About MealNest</h2>
            <Row className="justify-content-center">
              <Col md={8} className="text-center">
                <p className="text-offwhite" style={{ color: "#e0e0e0" }}>
                  MealNest is your go-to platform for discovering, saving, and sharing delicious recipes.
                  Whether you're looking for quick weekday meals or gourmet dishes, we've got you covered.
                  Join our community of food enthusiasts today!
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Home;