# GloBai

Academic management web app. Spring Boot backend in `academiko`, React + Vite frontend in the project root, MySQL database `academiko_db`.

## Run

Backend (MySQL must be running on port 3306):
```
cd academiko
$env:DB_PASSWORD='your-mysql-password'
./mvnw spring-boot:run
```

Frontend:
```
npm install
npm run dev
```

Backend runs on http://localhost:8080 and frontend on http://localhost:5173. Tables are created automatically.

## Features

- Register and log in as Student or Teacher
- Teacher: full CRUD of Users, Students, Teachers, Courses and Enrollments
- Student: view courses and own enrollments

## API

Base paths: `/user/api`, `/student/api`, `/teacher/api`, `/course/api`, `/enrollment/api`

Each one has `post...`, `getAll...s`, `put.../{id}` and `delete.../{id}`. Users also has `login`.