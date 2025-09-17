# Swimming Lessons Management System

## Overview
REST API system for swimming lessons management with React client, Node.js/Express server, and MySQL database.

## Architecture
- **Client**: React with Vite
- **Server**: Node.js with Express
- **Database**: MySQL

## Environment Setup
Create `.env` file in server directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=swimming_lessons

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
```

## API Routes

### Authentication
- `POST /login` - User login
- `POST /signup` - User registration
- `POST /logout` - User logout
- `POST /refresh` - Refresh token

### Users
- `GET /users` - Get users list
- `GET /users?teachers` - Get teachers
- `GET /users?students` - Get students
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Resources
- `GET /lessons` - Get lessons
- `GET /registerLessons` - Get registrations
- `GET /messages` - Get messages
- `GET /branches` - Get branches
- `GET /pools` - Get pools
- `GET /lessonRequests` - Get lesson requests

## Installation and Running

### Prerequisites
Node.js, MySQL Server

### Database Setup
Create database `swimming_lessons`

### Server
```bash
cd server
npm install
npm start
```
Runs on port 3000

### Client
```bash
cd client
npm install
npm run dev
```
Runs on port 5173

## Security
- JWT authentication
- Password encryption
- Dynamic permissions system
- Server-side authorization

## Technologies
**Client**: React 18, React Router, Vite, React Big Calendar, React Leaflet, React Hook Form
**Server**: Node.js, Express, JWT, bcrypt, MySQL2, Multer, Nodemailer
**Tools**: npm, nodemon, dotenv, CORS
