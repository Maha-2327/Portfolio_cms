# Portfolio Website with CMS (MERN Stack)

A full-stack developer portfolio with a private CMS dashboard to manage projects, blogs, and
contact messages — built with React, Node.js, Express, and MongoDB.

## Features implemented

- Dashboard-style homepage (stat cards, skill bars, timeline, featured projects)
- Project showcase with search + tech-stack filtering
- Detailed project pages (features, challenges, learnings, tech stack)
- Contact form → saved to MongoDB + email notification (Nodemailer) + success toast
- JWT-based admin authentication (login only — no public signup, by design)
- CMS dashboard: analytics overview, full project CRUD, message inbox with read/delete
- Theme customization: Light / Dark / Blue / Purple / Green, persisted via localStorage
- Responsive design (mobile hamburger menu, fluid grids)
- Security basics: helmet, rate limiting on login + contact form, bcrypt password hashing
- Blog model + API included (ready for a blog UI if you want to extend it)

## Project structure

```
portfolio-cms/
├── backend/           Express API + MongoDB models
│   ├── config/db.js
│   ├── models/        User, Project, Message, Blog
│   ├── middleware/     auth (JWT), errorHandler
│   ├── routes/         auth, projects, contact, blogs, stats
│   ├── seed.js         creates your first admin user + sample projects
│   └── server.js
└── frontend/          React (Vite) app
    └── src/
        ├── api/api.js         axios instance with auth interceptor
        ├── context/           ThemeContext, AuthContext
        ├── components/        Navbar, Footer, ProjectCard, StatCard, ProtectedRoute
        └── pages/             Home, Projects, ProjectDetail, Contact, AdminLogin, AdminDashboard
```

## Setup instructions

### 1. Prerequisites
- Node.js 18+
- A MongoDB database — [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 2. Backend setup

```bash
cd backend
npm install
```

Create admin user and sample projects:
```bash
npm run seed
```

Start the API:
```bash
npm run dev
```
The API runs on `http://localhost:5000`.

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```
The site runs on `http://localhost:5173`.

### 4. Log in to the CMS

Go to `http://localhost:5173/admin/login` and sign in with the `ADMIN_USERNAME` /
`ADMIN_PASSWORD` you set in `backend/.env`. From there you can add/edit/delete projects
and view contact messages.


## Live Demo

 - 🌐https://portfolio-cms-uft4.onrender.com


