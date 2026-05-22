# task-manager
# ✨ AetherFlow — Premium Real-Time Task Workspace

AetherFlow is a futuristic full-stack task management platform built to deliver a smooth, real-time productivity experience with a premium glassmorphism interface.

It combines modern UI/UX principles, secure authentication, live synchronization, drag-and-drop task management, and responsive layouts into one seamless workspace environment.

---

# 🚀 Features

## 🔐 Authentication & Security
- Secure User Registration & Login
- JWT-based Authentication
- Password Encryption using `bcryptjs`
- Protected API Routes & Session Validation

## ⚡ Real-Time Collaboration
- Live task synchronization across active browser tabs
- WebSocket-powered updates using `ws`
- Instant task broadcasting system

## 🧩 Task Management
- Create, Edit & Delete Tasks
- Task Status Pipelines:
  - To Do
  - In Progress
  - Completed
- Priority Levels:
  - Low
  - Medium
  - High
- Due Date Tracking
- Dynamic Task Filtering & Sorting

## 🎯 Interactive Workspace
- Drag-and-drop Kanban Board
- Responsive List View
- Smart Productivity Dashboard
- Circular SVG Progress Indicators
- Smooth animations & hover transitions

## 🌌 Premium UI/UX
- Dark Theme Glassmorphism Design
- Neon Glow Effects
- Responsive Mobile/Desktop Layouts
- Soft shadows & animated interactions
- Modern productivity-inspired interface

---

# 🛠️ Tech Stack

## Frontend
- React 19
- Vite 6
- Lucide React
- Context API
- Vanilla CSS

## Backend
- Node.js
- Express.js
- WebSockets (`ws`)

## Security
- JSON Web Tokens (`jsonwebtoken`)
- `bcryptjs`

## Database
- JSON File Database System

---

# 📁 Project Structure

```bash
task-manager/
├── package.json
├── vite.config.js
├── index.html
├── README.md

├── server/
│   ├── index.js
│   ├── db/
│   │   ├── jsonDb.js
│   │   └── data.json
│   ├── middleware/
│   │   └── auth.js
│   └── routes/
│       ├── auth.js
│       └── tasks.js

└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css

    ├── services/
    │   ├── api.js
    │   └── websocket.js

    ├── context/
    │   ├── AuthContext.jsx
    │   └── TaskContext.jsx

    └── components/
        ├── AuthModal.jsx
        ├── Sidebar.jsx
        ├── StatsCard.jsx
        ├── TaskCard.jsx
        ├── KanbanBoard.jsx
        ├── TaskList.jsx
        └── TaskModal.jsx update to active WebSockets.

