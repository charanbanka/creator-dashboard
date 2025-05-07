# 🧑‍🎨 Creator Dashboard

A full-stack web app where creators can manage their profile, earn credit points, and interact with a personalized content feed. Built with **Node.js (Express)**, **React + Tailwind CSS**, and **MongoDB Atlas**.

---

## 📁 Project Structure

```bash
creator-dashboard/
├── backend/          # Express.js API server
└── frontend/         # React + Tailwind client
````

---

## 🌐 Live Deployment

* **Backend:** Google Cloud Run
* **Frontend:** Firebase Hosting or Google Cloud Hosting
* **Database:** MongoDB Atlas

---

## 🔧 Local Development Setup

### 1️⃣ Prerequisites

* Node.js >= 18.x
* npm or yarn
* MongoDB Atlas URI (or a local MongoDB instance)
* \[Optional] Firebase CLI for frontend deployment
* `.env` file in each folder

---

## 🚀 Backend (Node.js + Express)

### ▶️ Getting Started

```bash
cd backend
npm install
```

### ⚙️ Environment Variables

Create a `.env` file in `backend/` with:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/creator-dashboard
JWT_SECRET=your_jwt_secret
```

### ✅ Start Backend

```bash
npm run dev
```

Server should run at: `http://localhost:8080`

### 📋 Available Scripts

* `npm run dev` - Starts server in dev mode with `nodemon`
* `npm start` - Starts server in production mode

---

## 🎨 Frontend (React + Tailwind)

### ▶️ Getting Started

```bash
cd frontend
npm install
```

### ⚙️ Environment Variables

Create a `.env` file in `frontend/` with:

```env
VITE_API_GATEWAY_URL=http://localhost:8080
```

### ✅ Start Frontend

```bash
npm run dev
```

App will run at: `http://localhost:5173` (or whatever Vite assigns)

---

## 🌟 Core Features

### 🔐 Authentication

* Register / Login with JWT
* Role-based access: `User`, `Admin`

### 💰 Credit System

* Register = +50 credits
* Daily login = +10 credits
* Completing profile = +25 credits
* Feed interaction = + credits
* Save Post = +2 credits
* Share Post = +3 credits
* UnSave Post = -2 credits
* admin update credits directly applied to user credits

### 📰 Feed Aggregator

* Pulls from **Reddit**, **Twitter**, and **LinkedIn (mocked)** using public APIs
* Users can:

  * Save content
  * Share (copy link)
  * Report inappropriate posts

### 📊 Dashboard

* **User View:** Credit stats, saved feed, recent activity
* **Admin View:** User analytics, feed engagement overview

---

## 🚀 Deployment (Optional for Local)

* Backend: [GCP Cloud Run Docs](https://cloud.google.com/run/docs)
* Frontend: [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)

---

## 🧪 Testing (Optional)

You may include:

* Backend unit tests: Jest or Mocha
* Frontend tests: React Testing Library

---

## 📎 License

MIT

---

## 🤝 Contributing

1. Fork this repo
2. Create a new branch (`feat/new-feature`)
3. Commit your changes
4. Open a pull request

---

## 🙋‍♂️ Questions?

Open an issue or reach out to the maintainer.

```
