import React, { useContext } from 'react';
import { AppContext } from '../context/App_Context';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Dropdown } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaUtensils, FaArrowRight, FaCog, FaEdit, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const { user, userRecipe, savedRecipeById, isAuthenticated, deleteRecipe } = useContext(AppContext);
  const navigate = useNavigate();

  const saved = async (id, e) => {
    e.stopPropagation();
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

  const handleEditRecipe = (id, e) => {
    e.stopPropagation();
    navigate(`/edit-recipe/${id}`);
  };

  const handleDeleteRecipe = async (id, e) => {
    e.stopPropagation();
    
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        const result = await deleteRecipe(id);
        if (result.data.status === 'success') {
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
          // Refresh the recipes after deletion
          const response = await getRecipeByUserId(user._id);
          setUserRecipe(response.data.recipe);
        } else {
          toast.error(result.data.message, {
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
        toast.error(error.response?.data?.message , {
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
    }
  };

  return (
    <div className="profile-page" style={{ 
      backgroundColor: '#0a1f1c',
      minHeight: '100vh',
      paddingTop: '2rem'
    }}>
      <ToastContainer />
      
      {/* User Profile Header */}
      <Container className="profile-header py-4" style={{
        backgroundColor: '#1a3b35',
        borderRadius: '10px',
        marginBottom: '2rem',
        border: '1px solid #2a5245'
      }}>
        <Row className="align-items-center">
          <Col md={2} className="d-flex justify-content-center">
            <div className="user-icon" style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#2d4a44',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #4a7c6f'
            }}>
              <FaUser size={30} color="#ffd700" />
            </div>
          </Col>
          <Col md={8}>
            <h1 className="text-offwhite mb-3">
              Welcome, <span style={{ color: '#ffd700' }}>{user.name}</span>
            </h1>
            <div className="d-flex align-items-center">
              <FaEnvelope color="#c8d5d1" className="me-2" />
              <h4 style={{ color: '#c8d5d1' }}>{user.gmail}</h4>
            </div>
            <div className="mt-3 d-flex align-items-center">
              <FaUtensils color="#c8d5d1" className="me-2" />
              <h5 style={{ color: '#c8d5d1' }}>
                {userRecipe?.length || 0} Recipes Created
              </h5>
            </div>
          </Col>
          <Col md={2} className="d-flex justify-content-end">
            <Button 
              variant="outline-light" 
              className="settings-btn"
              onClick={() => navigate('/settings')}
              style={{
                borderColor: '#4a7c6f',
                backgroundColor: '#2d4a44',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FaCog /> Settings
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Recipes Grid */}
      <Container className="pb-5">
        <h2 className="text-center mb-4" style={{ color: '#e8f1ee' }}>
          My Recipe Collection
        </h2>
        
        {userRecipe?.length === 0 ? (
          <div className="text-center py-5">
            <div className="empty-state" style={{
              backgroundColor: '#1a3b35',
              padding: '2rem',
              borderRadius: '10px',
              border: '1px dashed #4a7c6f'
            }}>
              <h4 style={{ color: '#e8f1ee' }}>No Recipes Yet</h4>
              <p style={{ color: '#c8d5d1' }}>
                You haven't created any recipes yet. Start sharing your culinary creations!
              </p>
            </div>
          </div>
        ) : (
          <Row className="g-4">
            {userRecipe?.map((data) => (
              <Col key={data._id} xs={12} sm={6} md={4} lg={3}>
                <Card 
                  className="h-100 recipe-card" 
                  style={{ 
                    backgroundColor: '#1a3b35',
                    border: '1px solid #2a5245',
                    transition: 'transform 0.3s',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => navigate(`/${data._id}`)}
                >
                  <div className="d-flex justify-content-center align-items-center p-3">
                    <Card.Img
                      variant="top"
                      src={data.imgurl}
                      style={{
                        width: '100%',
                        height: '180px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        border: '2px solid #4a7c6f'
                      }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title style={{ color: '#e8f1ee' }}>
                      {data.title}
                    </Card.Title>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      {data.category && (
                        <Badge pill style={{ 
                          backgroundColor: '#4a7c6f',
                          color: '#ffffff'
                        }}>
                          {data.category}
                        </Badge>
                      )}
                      {data.cookTime && (
                        <small style={{ color: '#c8d5d1' }}>{data.cookTime}</small>
                      )}
                    </div>
                    {data.ratings?.count > 0 && (
                      <div className="mb-3">
                        <Badge pill style={{ 
                          backgroundColor: '#ffd700',
                          color: '#000000'
                        }}>
                          {data.ratings.average.toFixed(1)} ★ ({data.ratings.count})
                        </Badge>
                      </div>
                    )}
                    <div className="d-flex justify-content-between mt-auto">
                  
<Dropdown onClick={(e) => e.stopPropagation()}>
  <Dropdown.Toggle 
    variant="outline-light" 
    size="sm"
    style={{ 
      borderColor: '#4a7c6f',
      backgroundColor: 'transparent'
    }}
    // Remove the onClick here since we're handling it on the parent Dropdown
  >
    Actions
  </Dropdown.Toggle>
  <Dropdown.Menu style={{ 
  backgroundColor: '#1a3b35',
  border: '1px solid #2a5245'
}}>
    <Dropdown.Item 
      onClick={(e) => {
        e.stopPropagation();
        handleEditRecipe(data._id, e);
      }}
      style={{ 
        color: '#e8f1ee',
        backgroundColor: 'transparent',
        transition: 'background-color 0.2s ease'
      }}
      className="dropdown-hover-item"
    >
      <FaEdit className="me-2" />Edit
    </Dropdown.Item>
    <Dropdown.Item 
     onClick={(e) => {
      e.stopPropagation();
      handleEditRecipe(data._id, e);
    }}
    style={{ 
      color: '#e8f1ee',
      backgroundColor: 'transparent',
      transition: 'background-color 0.2s ease'
    }}
    className="dropdown-hover-item"
  > Delete
    </Dropdown.Item>
    <Dropdown.Item 
      onClick={(e) => {
        e.stopPropagation();
        handleEditRecipe(data._id, e);
      }}
      style={{ 
        color: '#e8f1ee',
        backgroundColor: 'transparent',
        transition: 'background-color 0.2s ease'
      }}
      className="dropdown-hover-item"
    >
      Save
    </Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => navigate(`/${data._id}`)}
                        style={{ 
                          backgroundColor: '#4a7c6f', 
                          borderColor: '#4a7c6f',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        View <FaArrowRight className="ms-1" />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Profile;