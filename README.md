# Role-Based User Management Project

This is a project for managing users with role-based access (Admin/User) with authentication and authorization. The application consists of two main parts: **Frontend (React)** and **Backend (Node.js with Express)**.

- **Frontend**: A React app that handles user interaction, user profile, and admin dashboard.

You can view the live demo of the project hosted on Vercel at:

[Live Demo - Role-Based Candidate Management System](https://rolebasedusermangmentproject.vercel.app/)


- **Backend**: A Node.js app with Express, connected to a MongoDB database. It handles user authentication, role-based access, and CRUD operations.

You can view the live demo of the project hosted on render at:

[Live Demo - Role-Based Candidate Management System](https://rolebasedusermangmentproject.onrender.com/api-docs/)

---

## Frontend Setup
__________________

##The frontend will be running on http://localhost:3000 and follow the below steps:
    cd frontend
    npm install
    npm start

## Backend Setup
__________________

cd backend
npm install

Create a .env file in the backend folder and add the following variables:

MONGODB_URI=your-mongo-db-uri
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=your-jwt-expiration (e.g., '1h')
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

Run the Backend Server
node server.js
The backend will now be running on http://localhost:5000
