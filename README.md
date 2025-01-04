# Role-Based User Management Project

This is a project for managing users with role-based access (Admin/User) with authentication and authorization. The application consists of two main parts: **Frontend (React)** and **Backend (Node.js with Express)**.

- **Frontend**: A React app that handles user interaction, user profile, and admin dashboard.
- **Backend**: A Node.js app with Express, connected to a MongoDB database. It handles user authentication, role-based access, and CRUD operations.

You can view the live demo of the project hosted on Vercel at:

[Live Demo - Role-Based User Management](https://rolebasedusermangmentproject.vercel.app/)

---

## Table of Contents

- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [Running the App](#running-the-app)
- [Tech Stack](#tech-stack)
- [Environment Variables](#environment-variables)

---

## Frontend Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/role-based-user-management.git
cd role-based-user-management

cd frontend

npm install

npm start


[](url)## **Backend Setup** #0000
### Clone the repository:


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
