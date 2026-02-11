# SlotX - Intelligent Exam Slot Booking System

SlotX is a premium, high-performance web application designed to democratize and simplify exam slot booking for students and educational institutions. Built with a modern tech stack, it features a highly responsive interface with fluid animations and robust role-based access control.

🔗 **Repository**: [https://github.com/himaniag10/SlotX](https://github.com/himaniag10/SlotX)

## 🚀 Features

- **Role-Based Dashboards**:
  - **Admin**: Monitor system health, track total students, manage active exam slots, and view audit logs.
  - **Student**: Effortlessly search for available slots, manage current bookings, and view activity history.
- **Premium UI/UX**: Overhauled landing page with `framer-motion` animations, `lucide-react` iconography, and a clean, responsive layout.
- **Secure Authentication**: Implementation of JWT-based authentication with secure cookie storage and role-based access control.
- **Real-time Metrics**: Visual representation of platform scale and success rates.
- **Responsive Architecture**: Fully functional on mobile, tablet, and desktop.
- **Robust Error Handling**: Standardized error responses with user-friendly toast notifications.

## 🛠️ Tech Stack

**Frontend:**

- [React 19](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide React](https://lucide.dev/)
- [React Router DOM](https://reactrouter.com/)
- [React Hot Toast](https://react-hot-toast.com/)

**Backend:**

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) / [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/) & [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)

## 📁 Project Structure

```text
.
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React Context (Auth, etc.)
│   │   ├── pages/           # Application views
│   │   │   ├── admin/       # Management dashboards & logs
│   │   │   ├── auth/        # Authentication forms
│   │   │   ├── common/      # Public pages (Landing)
│   │   │   └── student/     # Student dashboards & booking
│   │   └── utils/           # API clients & helpers
│   └── public/              # Static assets
└── server/                  # Node.js Backend
    └── src/
        ├── configs/         # Database & server config
        ├── controllers/     # Route logic & handlers
        ├── middlewares/     # Auth & error handling
        ├── models/          # Mongoose schemas
        └── routes/          # API endpoint definitions
```

## ⚙️ Setup & Installation

This project uses **pnpm** for package management.

### Prerequisites

- Node.js installed (v16+ recommended)
- `pnpm` installed globally:
  ```bash
  npm install -g pnpm
  ```
- A running MongoDB instance (Local or Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/himaniag10/SlotX.git
cd SlotX
```

### 2. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
pnpm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5001
MONGO_URL=your_mongodb_connection_string
DB_NAME=slotx_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
FRONTEND_LOCAL_URL=http://localhost:3000
BACKEND_LOCAL_URL=http://localhost:5001
NODE_ENV=development
```

Start the backend server:

```bash
pnpm run dev
# Or for production mode:
# pnpm start
```

### 3. Frontend Setup

Open a new terminal, navigate to the client directory, and install dependencies:

```bash
cd client
pnpm install
```

Create a `.env` file in the `client` directory:

```env
REACT_APP_API_BACKEND_LOCAL_URL=http://localhost:5001
REACT_APP_API_FRONTEND_LOCAL_URL=http://localhost:3000
```

Start the frontend application:

```bash
pnpm start
```

The application should now be running at `http://localhost:3000`.

## 📜 Scripts

### Server

- `pnpm run dev`: Runs the server in development mode with `nodemon`.
- `pnpm start`: Runs the server in production mode.

### Client

- `pnpm start`: Runs the app in development mode.
- `pnpm run build`: Builds the app for production to the `build` folder.

## 🛡️ Security Note

All sensitive code (passwords, tokens) is protected with industry-standard practices. All comments have been removed from the production codebase for a cleaner, professional delivery.

## 📄 License

© 2026 SlotX Inc. All rights reserved.
