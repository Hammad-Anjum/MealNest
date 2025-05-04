import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/App_Context';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { FaArrowLeft, FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditRecipe = () => {
  const { getRecipeById, updateRecipe, isAuthenticated } = useContext(AppContext);
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    ist: '',
    imgurl: '',
    cookTime: '30 minutes',
    category: 'other',
    ingredients: []
  });
  
  // For backward compatibility with old recipe format
  const [oldIngredients, setOldIngredients] = useState({
    ing1: '', ing2: '', ing3: '', ing4: '',
    qty1: '', qty2: '', qty3: '', qty4: ''
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const fetchRecipeData = async () => {
      try {
        const response = await getRecipeById(id);
        const recipe = response.data.recipe;
        
        if (!recipe) {
          toast.error("Recipe not found", {
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
          navigate('/profile');
          return;
        }
        
        // Set the form data from recipe
        setFormData({
          title: recipe.title || '',
          ist: recipe.ist || '',
          imgurl: recipe.imgurl || '',
          cookTime: recipe.cookTime || '30 minutes',
          category: recipe.category || 'other',
          ingredients: Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 
            ? recipe.ingredients 
            : []
        });
        
        // For backward compatibility
        setOldIngredients({
          ing1: recipe.ing1 || '',
          ing2: recipe.ing2 || '',
          ing3: recipe.ing3 || '',
          ing4: recipe.ing4 || '',
          qty1: recipe.qty1 || '',
          qty2: recipe.qty2 || '',
          qty3: recipe.qty3 || '',
          qty4: recipe.qty4 || ''
        });
        
      } catch (error) {
        toast.error("Failed to load recipe data", {
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
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipeData();
  }, [id, getRecipeById, isAuthenticated, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleOldIngredientChange = (e) => {
    const { name, value } = e.target;
    setOldIngredients(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      ingredients: updatedIngredients
    }));
  };
  
  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { name: '', quantity: '' }
      ]
    }));
  };
  
  const removeIngredient = (index) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      ingredients: updatedIngredients
    }));
  };

  // New function to clear legacy ingredient fields
  const clearLegacyIngredient = (ingredientNumber) => {
    setOldIngredients(prev => ({
      ...prev,
      [`ing${ingredientNumber}`]: '',
      [`qty${ingredientNumber}`]: ''
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.ist || !formData.imgurl) {
      toast.error("Please fill all required fields", {
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
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Prepare the legacy ingredients data
      const legacyIngredients = {};
      for (let i = 1; i <= 4; i++) {
        // Only include legacy ingredient if either name or quantity exists
        if (oldIngredients[`ing${i}`] || oldIngredients[`qty${i}`]) {
          legacyIngredients[`ing${i}`] = oldIngredients[`ing${i}`];
          legacyIngredients[`qty${i}`] = oldIngredients[`qty${i}`];
        } else {
          // Explicitly set to empty string if both are empty
          legacyIngredients[`ing${i}`] = '';
          legacyIngredients[`qty${i}`] = '';
        }
      }
  
      // Combine the data for submission
      const recipeData = {
        ...formData,
        ...legacyIngredients
      };
      
      const result = await updateRecipe(id, recipeData);
      
      if (result.data.status === 'success') {
        toast.success("Recipe updated successfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        
        // Redirect after successful update
        setTimeout(() => {
          navigate(`/${id}`);
        }, 1500);
      } else {
        toast.error(result.data.message || "Failed to update recipe", {
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
    } catch (error) {
      toast.error("An error occurred. Please try again later.", {
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="edit-recipe-page" style={{ 
      backgroundColor: '#0a1f1c',
      minHeight: '100vh',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    }}>
      <ToastContainer />
      
      <Container>
        <div className="mb-4">
          <Button 
            variant="outline-light" 
            onClick={() => navigate('/profile')}
            style={{
              borderColor: '#4a7c6f',
              backgroundColor: '#2d4a44',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaArrowLeft /> Back to Profile
          </Button>
        </div>
        
        <Card style={{ 
          backgroundColor: '#1a3b35',
          border: '1px solid #2a5245',
          borderRadius: '10px'
        }}>
          <Card.Header style={{ 
            backgroundColor: '#2d4a44', 
            borderBottom: '1px solid #2a5245',
            color: '#e8f1ee'
          }}>
            <h2 className="my-2">Edit Recipe</h2>
          </Card.Header>
          
          <Card.Body className="p-4">
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#e8f1ee' }}>Recipe Title*</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter recipe title"
                      required
                      style={{ 
                        backgroundColor: '#2d4a44',
                        border: '1px solid #4a7c6f',
                        color: '#e8f1ee'
                      }}
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#e8f1ee' }}>Image URL*</Form.Label>
                    <Form.Control
                      type="text"
                      name="imgurl"
                      value={formData.imgurl}
                      onChange={handleChange}
                      placeholder="Enter image URL"
                      required
                      style={{ 
                        backgroundColor: '#2d4a44',
                        border: '1px solid #4a7c6f',
                        color: '#e8f1ee'
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#e8f1ee' }}>Cook Time</Form.Label>
                    <Form.Control
                      type="text"
                      name="cookTime"
                      value={formData.cookTime}
                      onChange={handleChange}
                      placeholder="e.g. 30 minutes"
                      style={{ 
                        backgroundColor: '#2d4a44',
                        border: '1px solid #4a7c6f',
                        color: '#e8f1ee'
                      }}
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#e8f1ee' }}>Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      style={{ 
                        backgroundColor: '#2d4a44',
                        border: '1px solid #4a7c6f',
                        color: '#e8f1ee'
                      }}
                    >
                      <option value="other">Other</option>
                      <option value="vegan">Vegan</option>
                      <option value="non veg">Non Veg</option>
                      <option value="keto">Keto</option>
                      <option value="gluten-free">Gluten-Free</option>
                      <option value="dairy-free">Dairy-Free</option>
                      <option value="low-carb">Low-Carb</option>
                      <option value="dessert">Dessert</option>
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-4">
                <Form.Label style={{ color: '#e8f1ee' }}>Instructions*</Form.Label>
                <Form.Control
                  as="textarea"
                  name="ist"
                  value={formData.ist}
                  onChange={handleChange}
                  placeholder="Enter recipe instructions"
                  required
                  rows={6}
                  style={{ 
                    backgroundColor: '#2d4a44',
                    border: '1px solid #4a7c6f',
                    color: '#e8f1ee'
                  }}
                />
              </Form.Group>
              
              {/* Dynamic ingredients section */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 style={{ color: '#e8f1ee' }}>Ingredients</h4>
                  <Button 
                    variant="outline-light" 
                    size="sm"
                    onClick={addIngredient}
                    style={{
                      borderColor: '#4a7c6f',
                      backgroundColor: '#2d4a44',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <FaPlus /> Add Ingredient
                  </Button>
                </div>
                
                {formData.ingredients.map((ingredient, index) => (
                  <Row key={index} className="mb-2">
                    <Col xs={5}>
                      <Form.Control
                        placeholder="Ingredient name"
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                        style={{ 
                          backgroundColor: '#2d4a44',
                          border: '1px solid #4a7c6f',
                          color: '#e8f1ee'
                        }}
                      />
                    </Col>
                    <Col xs={5}>
                      <Form.Control
                        placeholder="Quantity"
                        value={ingredient.quantity}
                        onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                        style={{ 
                          backgroundColor: '#2d4a44',
                          border: '1px solid #4a7c6f',
                          color: '#e8f1ee'
                        }}
                      />
                    </Col>
                    <Col xs={2}>
                      <Button 
                        variant="outline-danger" 
                        onClick={() => removeIngredient(index)}
                        style={{
                          borderColor: '#dc3545',
                          backgroundColor: 'transparent'
                        }}
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                ))}
         
                
        
{/* Legacy ingredients section - only show if at least one has content */}
{(oldIngredients.ing1 || oldIngredients.ing2 || oldIngredients.ing3 || oldIngredients.ing4) && (
  <div className="mb-4">
  
    {[1, 2, 3, 4].map(num => (
      (oldIngredients[`ing${num}`] || oldIngredients[`qty${num}`]) && (
        <Row key={num} className="mb-2 align-items-center">
          <Col xs={5}>
            <Form.Control
              placeholder={`Ingredient ${num}`}
              name={`ing${num}`}
              value={oldIngredients[`ing${num}`]}
              onChange={handleOldIngredientChange}
              style={{ 
                backgroundColor: '#2d4a44',
                border: '1px solid #4a7c6f',
                color: '#e8f1ee'
              }}
            />
          </Col>
          <Col xs={5}>
            <Form.Control
              placeholder={`Quantity ${num}`}
              name={`qty${num}`}
              value={oldIngredients[`qty${num}`]}
              onChange={handleOldIngredientChange}
              style={{ 
                backgroundColor: '#2d4a44',
                border: '1px solid #4a7c6f',
                color: '#e8f1ee'
              }}
            />
          </Col>
          <Col xs={2}>
            <Button 
              variant="outline-danger" 
              onClick={() => clearLegacyIngredient(num)}
              style={{
                borderColor: '#dc3545',
                backgroundColor: 'transparent'
              }}
            >
              <FaTrash />
            </Button>
          </Col>
        </Row>
      )
    ))}
  </div>
)}
              </div>
              
              <div className="d-flex justify-content-end">
                <Button 
                  variant="light"
                  type="submit"
                  disabled={submitting}
                  style={{ 
                    backgroundColor: '#4a7c6f', 
                    borderColor: '#4a7c6f',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaSave /> {submitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default EditRecipe;