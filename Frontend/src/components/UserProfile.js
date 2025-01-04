import React, { useEffect, useState } from 'react';
import { getProfile, uploadProfileImage } from '../utils/api';
import { Container, Row, Col, Card, Spinner, Button, Form } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import './UserProfile.css';  // Custom styles for animations

// Register chart components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [userStats, setUserStats] = useState({ active: 0, inactive: 0 });
  const [showCard, setShowCard] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getProfile(token)
        .then((data) => {
          if (data) {
            setProfile(data);
            setUserStats({
              active: data.active || 0,
              inactive: data.inactive || 0
            });
            setImageUrl(data.profileImage);
          }
        })
        .catch((err) => {
          console.error('Error fetching profile data:', err);
          setError('Failed to fetch profile data');
        });
    } else {
      setError('No token found. Please log in.');
    }

    setTimeout(() => {
      setShowCard(true); 
    }, 500);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleImageUpload = async () => {
    const token = localStorage.getItem('token');
    const userId = profile._id; 

    if (token && imageFile) {
      try {
        // Upload the profile image
        const data = await uploadProfileImage(token, imageFile, userId);

        // Fetch the updated profile after image upload
        const updatedProfile = await getProfile(token);

        // Update the profile data with the new image URL
        setProfile(updatedProfile);
        setImageUrl(updatedProfile.profileImage); // Update the image URL
      } catch (error) {
        console.error('Image upload failed:', error);
        setError('Failed to upload profile image');
      }
    } else {
      setError('No file selected or token is missing');
    }
  };

  // Bar Chart Data for User Stats
  const userStatsChartData = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        label: 'User Activity',
        data: [userStats.active, userStats.inactive],
        backgroundColor: ['#4CAF50', '#FF6347'],
        borderColor: ['#388E3C', '#D32F2F'],
        borderWidth: 1,
      },
    ],
  };

  // Bar Chart Options
  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (error) {
    return <div className="error-message text-center">{error}</div>;
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        {/* Profile Card Column */}
        <Col xs={12} md={6} lg={4}>
          <Card className={`user-profile-card shadow-lg rounded animate-card ${showCard ? 'show' : ''}`}>
            <Card.Body>
              {profile ? (
                <>
                  <Card.Title className="text-center text-muted mb-3">{profile.username}</Card.Title>
                  <Card.Subtitle className="text-center text-muted mb-3">{profile.email}</Card.Subtitle>
                  <Card.Text className="text-center text-muted mb-4">
                    <strong>Role:</strong> {profile.role}
                  </Card.Text>

                  {/* Profile Image */}
                  {imageUrl ? (
                    <div className="profile-image-container text-center mb-3">
                      <img
                        src={imageUrl}
                        alt="Profile"
                        className="profile-image"
                      />
                    </div>
                  ) : (
                    <div className="profile-image-container text-center mb-3">
                      <p>No profile image</p>
                    </div>
                  )}

                  {/* Image Upload */}
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Upload Profile Image</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} />
                  </Form.Group>
                  <Button variant="primary" onClick={handleImageUpload}>
                    Upload Image
                  </Button>
                </>
              ) : (
                <div className="d-flex justify-content-center align-items-center">
                  <Spinner animation="border" variant="primary" />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>


      </Row>
    </Container>
  );
};

export default UserProfile;
