import axios from 'axios';

// Set the base URL for API requests
const API_URL = 'http://localhost:5000/api';



// Function to login an existing user
export const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    //   console.log(response.data); // Debugging log
      return response.data; // Returns the response data, including the token and user data
    } catch (error) {
      throw error.response ? error.response.data : error.message; // Return error message if any
    }
  };
  

// Function to get the user profile (for regular users)
export const getProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }, // Send JWT token in the Authorization header
    });
    return response.data; // Return profile data
  } catch (error) {
    throw error.response ? error.response.data : error.message; // Return error message if any
  }
};


// Function to get the list of users (for admin)
export const getUsersList = async (token, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, limit }, // Pagination parameters
    });
    return response.data.users; // Return the list of users
  } catch (error) {
    throw error.response ? error.response.data : error.message; // Return error message if any
  }
};

// Function to update user details (Admin or self-update)
export const updateUser = async (token, userId, updatedData) => {
    try {
      const response = await axios.patch(`${API_URL}/users/users/${userId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Returns updated user data
    } catch (error) {
      throw error.response ? error.response.data : error.message; // Return error message if any
    }
  };
   

  // Function to toggle user status (Active/Inactive)
export const toggleUserStatus = async (token, userId) => {
    try {
      const response = await axios.patch(`${API_URL}/auth/users/${userId}/status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Returns success message or updated user status
    } catch (error) {
      throw error.response ? error.response.data : error.message; // Return error message if any
    }
  };
  
  // Function to logout the user (Clear JWT token)
export const logout = () => {
    localStorage.removeItem('token'); // Or whatever storage you use
    // Redirect or update the UI as needed
  };
  


  // Function to create a new user
  export const createUser = async (username, email, password, mobile, role = 'user') => {
    try {
      const response = await axios.post(`${API_URL}/users/create`, {
        username,
        email,
        password,
        mobile, // Added mobile field
        role,   // Default to 'user' if no role is specified
      });
      return response.data; // Returns the response data after user creation
    } catch (error) {
      throw error.response ? error.response.data : error.message; // Return error message if any
    }
  };
  


  // Function to update the user profile, including the image
  export const uploadProfileImage = async (token, imageFile, userId) => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile); // Append the image file to the FormData
  
      const response = await axios.post(`${API_URL}/users/uploadprofile/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Send JWT token in the Authorization header
          'Content-Type': 'multipart/form-data', // Set the content type to handle file upload
        },
      });
  
      return response.data; // Return the response data (e.g., success message or image URL)
    } catch (error) {
      throw error.response ? error.response.data : error.message; // Return error message if any
    }
  };
  

  // Function to delete a user by their ID
export const deleteUser = async (token, userId) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }, // Send JWT token in the Authorization header
    });
    return response.data; // Return the response data (e.g., success message)
  } catch (error) {
    throw error.response ? error.response.data : error.message; // Return error message if any
  }
};
