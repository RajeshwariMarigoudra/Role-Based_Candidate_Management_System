const express = require('express');
const { swaggerUi, specs } = require('./swagger'); 
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // Assuming you have user routes
const authRoutes = require('./routes/authRoutes');  // Assuming you have authentication routes
const connectDB = require('./config/db'); // Adjust path if needed

const app = express();

// Enable CORS
app.use(cors());

// Load environment variables
dotenv.config();

connectDB(); // Establish MongoDB connection'

// Parse incoming request bodies
app.use(bodyParser.json());

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Authentication routes
app.use('/api/auth', authRoutes); // For login, registration, etc.

// User routes
app.use('/api/users', userRoutes); // Routes that require authentication

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the User Management API');
});

// Set your backend port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
