# GloBai

A student and teacher dashboard web app for tracking grades, attendance, quizzes, and grade concerns.

## Tech stack
- Frontend: React + Vite
- Backend: Spring Boot (Java 21+), in the `academiko` folder
- Database: MySQL (`academiko_db`)

## Requirements
- Node.js and npm
- Java 21 or newer
- MySQL, running on port 3306

## Setup

### 1. Create the database
Run this once in MySQL (Workbench or the command line):
```
CREATE DATABASE IF NOT EXISTS academiko_db;
```
The `users` table is created automatically when the backend starts.

### 2. Run the backend
Set your own MySQL password in the terminal first. Never write it in a file.
```
cd academiko
$env:DB_PASSWORD='your-mysql-password'
./mvnw spring-boot:run
```
Runs on http://localhost:8080

The username defaults to `root`. To use another one, set `$env:DB_USERNAME` the same way.

### 3. Run the frontend
```
npm install
npm run dev
```
Usually runs on http://localhost:5173

## Accounts
- Admin (test account): `admin@school.edu` or `admin` / `admin123`. Log in on the Admin tab to preview the student and teacher dashboards.
- Students and teachers register themselves with **Register here**. The email is the username, and the password needs at least 6 characters.
- Passwords are stored hashed (BCrypt).

## Forgot password
1. Click **Forgot password?** and enter the registered email.
2. The backend creates a one-time link that expires in 30 minutes.
3. For now, the link is printed in the backend terminal (`PASSWORD RESET LINK for ...`). Sending it by email is still to do.
4. Open the link, enter a new password, and log in.

## API (test with Postman)

| Method | URL | What it does |
|---|---|---|
| POST | `/api/auth/register` | Register a student or teacher |
| POST | `/api/auth/login` | Log in with email and password |
| POST | `/api/auth/forgot-password` | Create a reset link |
| POST | `/api/auth/reset-password` | Set a new password with the token |
| GET | `/api/users` | List all users |
| GET | `/api/users/{id}` | Get one user |
| POST | `/api/users` | Create a user |
| PUT | `/api/users/{id}` | Update a user |
| DELETE | `/api/users/{id}` | Delete a user (the admin cannot be deleted) |

Example register body:
```
{
  "name": "Juan Dela Cruz",
  "email": "juan@gmail.com",
  "password": "juan123",
  "role": "Student",
  "studentId": "12345678"
}
```

