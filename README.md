# task-manager
# ✨ AetherFlow — Premium Real-Time Task Workspace

AetherFlow is a modern full-stack productivity platform built for seamless task management, real-time collaboration, and immersive user experience.

Designed with a futuristic glassmorphism interface and lightning-fast real-time synchronization, AetherFlow transforms traditional task management into an interactive workflow ecosystem.

## 🚀 Highlights

* ⚡ Real-time task synchronization using WebSockets
* 🔐 Secure JWT Authentication & encrypted password handling
* 🎯 Drag-and-drop Kanban workflow system
* 🌌 Premium dark glassmorphism UI with neon visual effects
* 📱 Fully responsive across desktop, tablet, and mobile
* 📊 Smart productivity dashboards & task analytics
* 🔄 Instant multi-tab live updates
* 🧠 Optimized frontend architecture using React Context API
* 🗂️ List & Kanban workspace modes
* 📅 Due dates, priority tracking & status pipelines

## 🛠️ Built With

### Frontend

* React 19
* Vite 6
* Lucide React
* Custom Glassmorphism CSS System

### Backend

* Node.js
* Express.js
* WebSockets (`ws`)

### Security

* JWT Authentication
* bcryptjs Password Encryption

### Database

* Atomic JSON Database Engine

---

## 💡 Vision Behind AetherFlow

AetherFlow was designed to blend productivity with aesthetic experience — creating a workspace that feels modern, fluid, and engaging instead of static and outdated.

The project focuses on:

* Real-time collaboration
* Smooth UI interactions
* Scalable frontend architecture
* Lightweight backend performance
* Premium user experience design

---

## 🖥️ Workspace Preview

> Real-time collaboration meets futuristic productivity.

AetherFlow delivers a responsive workflow environment where tasks update instantly across active sessions while maintaining a clean, elegant visual system.

---

## ⚙️ Run Locally

```bash
npm install
npm run dev
```

Frontend:

```bash
http://localhost:5173
```

Backend:

```bash
http://localhost:5000
```
## File Structure
task-manager/
├── package.json                   # Project config and script shortcuts
├── vite.config.js                 # Vite config (proxy configuration)
├── index.html                     # HTML root page structure
├── README.md                      # Documentation
├── server/                        # Backend REST & WS server
│   ├── index.js                   # Server entrypoint
│   ├── db/
│   │   ├── jsonDb.js              # Atomic JSON database controller
│   │   └── data.json              # Local JSON database storage
│   ├── middleware/
│   │   └── auth.js                # JWT validation guard
│   └── routes/
│       ├── auth.js                # Registration, Login, Profile routes
│       └── tasks.js               # Tasks CRUD endpoints & WS broadcaster
└── src/                           # Frontend React application
    ├── main.jsx                   # React mounting file
    ├── App.jsx                    # Coordinator view switcher & filters
    ├── index.css                  # CSS Variables & Glassmorphism styles
    ├── services/
    │   ├── api.js                 # Fetch client for backend HTTP calls
    │   └── websocket.js           # Real-time WebSocket connection manager
    ├── context/
    │   ├── AuthContext.jsx        # Credentials manager & websocket binder
    │   └── TaskContext.jsx        # Tasks list state & live updates handler
    └── components/
        ├── AuthModal.jsx          # Login & register input modal
        ├── Sidebar.jsx            # Completion ring, view toggles & status filters
        ├── StatsCard.jsx          # Backlog counters & urgent cards
        ├── TaskCard.jsx           # Individual card with HTML5 drag tags
        ├── KanbanBoard.jsx        # Column drop target containers
        ├── TaskList.jsx           # Desktop table / Mobile card list view
        └── TaskModal.jsx          # Create & edit input modal
--- ## Installation & Running ### Prerequisites * [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended) * npm (installed automatically with Node.js) ### Step 1: Install Dependencies Navigate to your project directory and run the install command to download packages:
bash
npm install
### Step 2: Start Development Servers Run the development environment script, which concurrently fires the backend Express server (port 5000) and frontend Vite server (port 5173):
bash
npm run dev
### Step 3: Access Workspace Open your web browser and load:
http://localhost:5173
--- ## API Endpoints Reference ### Authentication Routing (/api/auth) * POST /register: Registers a new user. Expects JSON { name, email, password }. Returns authorization token and profile object. * POST /login: Validates user credentials. Expects JSON { email, password }. Returns authorization token and profile object. * GET /me: Verifies active sessions. Expects Authorization: Bearer <token> in header. Returns active profile JSON. ### Tasks Routing (/api/tasks) * GET /: Retrieves all tasks for the logged-in user. Filtered automatically by owner. * POST /: Adds a task. Expects JSON { title, description, status, priority, dueDate }. Broadcasts update to active WebSockets. * PUT /:id: Modifies task values. Expects JSON update payload. Broadcasts update to active WebSockets. * DELETE /:id: Removes a task. Broadcasts update to active WebSockets.

