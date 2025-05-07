
```markdown
# 📊 Creator Dashboard

A full-stack web application that allows **creators** to manage their profile, earn credits, and interact with personalized content fetched from **Reddit** and **Twitter** public APIs.

---

## 🚀 Features

### 🔐 User Authentication
- Register/Login using JWT
- Role-based access control (User, Admin)

### 💰 Credit Points System
- Earn credits for:
  - Logging in daily
  - Completing profile
  - Interacting with feed
- Admins can view and update user credits

### 📰 Feed Aggregator
- Fetch posts using **Reddit** and **Twitter** APIs
- Infinite scrollable feed
- Users can:
  - Save content
  - Share content (copy link/simulated share)
  - Report inappropriate posts

### 📋 Dashboard
- **User View**:
  - Credit stats
  - Saved feed items
  - Recent activity
- **Admin View**:
  - User analytics
  - Feed interaction analytics

---

## 📁 Project Structure

```

.
├── backend
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middlewares/
│   ├── utils/
│   └── common/
│       ├── config.js
│       └── constants.js
└── frontend
└── (Vite + React + Tailwind project)

````

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Deployment**:
  - Frontend: Firebase Hosting / Google Cloud
  - Backend: Google Cloud Run

---

## 🔧 Setup Instructions

### 🔙 Backend

```bash
cd backend
npm install
# Configure your `.env` file based on `.env.example`
node server.js
````

### 🌐 Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌍 Public APIs Used

* **Reddit**: `https://www.reddit.com/r/{subreddit}/.json`
* **Twitter**: Twitter API (random tweets or search endpoints – with API key if needed)

---

## 🔒 Environment Variables

### Backend `.env`

```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
TWITTER_BEARER_TOKEN=your_token_if_using_official_api
```

---

## 🧪 Testing

> Basic unit and integration tests can be added in `/tests` or with tools like Jest, Supertest, and React Testing Library.

---

## 📡 Deployment

1. **Backend**: Deploy `server.js` on Google Cloud Run
2. **Frontend**: Deploy build folder (`npm run build`) to Firebase Hosting or Google Cloud Hosting

---

## 👥 Roles

| Role  | Capabilities                                       |
| ----- | -------------------------------------------------- |
| User  | View & interact with feed, earn points             |
| Admin | Manage users, view analytics, edit credit balances |

---

## 📄 License

MIT

---

## 🧑‍💻 Author

Created as part of Assignment 1 – Creator Dashboard

---

```

Would you like a sample `.env.example` and deployment `firebase.json` or `Dockerfile` too?
```
