import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/App_Context';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { FaUser, FaLock, FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserSettings = () => {
  const { user, updateUserSettings, isAuthenticated } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user && user.name) {
      setFormData(prev => ({
        ...prev,
        name: user.name
      }));
    }
  }, [user, isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // If user wants to change password
    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to set a new password';
      }
      
      if (formData.newPassword && formData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setSuccess('');
    
    try {
      // Only include password fields if user is changing password
      const updateData = {
        name: formData.name
      };
      
      if (formData.newPassword && formData.currentPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }
      
      const result = await updateUserSettings(updateData);
      
      if (result.data.status === 'success') {
        setSuccess('Your settings have been updated successfully');
        toast.success('Settings updated successfully', {
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
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        if (result.data.field) {
          setErrors({
            [result.data.field]: result.data.message
          });
        } else {
          toast.error(result.data.message || 'Failed to update settings', {
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
    } catch (error) {
      toast.error('An error occurred. Please try again later.', {
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

  return (
    <div className="settings-page" style={{ 
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
            <h2 className="my-2">Account Settings</h2>
          </Card.Header>
          
          <Card.Body className="p-4">
            {success && (
              <Alert variant="success" className="mb-4">
                {success}
              </Alert>
            )}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label style={{ color: '#e8f1ee' }}>
                  <FaUser className="me-2" /> Name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  style={{ 
                    backgroundColor: '#2d4a44',
                    border: '1px solid #4a7c6f',
                    color: '#e8f1ee'
                  }}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label style={{ color: '#e8f1ee' }}>
                  <FaLock className="me-2" /> Current Password
                </Form.Label>
                <Form.Control
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  style={{ 
                    backgroundColor: '#2d4a44',
                    border: '1px solid #4a7c6f',
                    color: '#e8f1ee'
                  }}
                  isInvalid={!!errors.currentPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.currentPassword}
                </Form.Control.Feedback>
                <Form.Text style={{ color: '#c8d5d1' }}>
                  Enter your current password to change it.
                </Form.Text>
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label style={{ color: '#e8f1ee' }}>
                  <FaLock className="me-2" /> New Password
                </Form.Label>
                <Form.Control
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  style={{ 
                    backgroundColor: '#2d4a44',
                    border: '1px solid #4a7c6f',
                    color: '#e8f1ee'
                  }}
                  isInvalid={!!errors.newPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.newPassword}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label style={{ color: '#e8f1ee' }}>
                  <FaLock className="me-2" /> Confirm New Password
                </Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  style={{ 
                    backgroundColor: '#2d4a44',
                    border: '1px solid #4a7c6f',
                    color: '#e8f1ee'
                  }}
                  isInvalid={!!errors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
              
              <div className="d-flex justify-content-end">
                <Button 
                  variant="light"
                  type="submit"
                  disabled={loading}
                  style={{ 
                    backgroundColor: '#4a7c6f', 
                    borderColor: '#4a7c6f',
                    color: '#ffffff'
                  }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default UserSettings;