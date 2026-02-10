# SlotX - Intelligent Exam Slot Booking System

SlotX is a premium, high-performance web application designed to democratize and simplify exam slot booking for students and educational institutions. Built with a modern tech stack, it features a highly responsive interface with fluid animations and robust role-based access control.

## 🚀 Features

- **Role-Based Dashboards**:
  - **Admin**: Monitor system health, track total students, and manage active exam slots.
  - **Student**: Effortlessly search for available slots, manage current bookings, and view activity history.
- **Premium UI/UX**: Overhauled landing page with `framer-motion` animations, `lucide-react` iconography, and a clean, responsive layout.
- **Secure Authentication**: Implementation of JWT-based authentication with secure cookie storage.
- **Real-time Metrics**: Visual representation of platform scale and success rates.
- **Responsive Architecture**: Fully functional on mobile, tablet, and desktop.

## 🛠️ Tech Stack

**Frontend:**

- [React 19](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide React](https://lucide.dev/)
- [React Router DOM](https://reactrouter.com/)

**Backend:**

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) / [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/) & [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)

## 📁 Project Structure

```text
.
├── client/          # React Frontend application
│   ├── src/        # Application source code
│   └── public/     # Static assets and HTML template
└── server/          # Node.js Express Backend
    └── src/        # API routes, controllers, and models
```

## ⚙️ Setup & Installation

### Prerequisites

- Node.js installed
- `pnpm` (recommended) or `npm`
- A running MongoDB instance (Local or Atlas)

### Step 1: Clone the repository

```bash
git clone <repository-url>
cd SlotX
```

### Step 2: Backend Configuration

1. Navigate to the server folder: `cd server`
2. Install dependencies: `pnpm install`
3. Create a `.env` file and configure:

```env
PORT=5001
MONGO_URL=your_mongodb_connection_string
DB_NAME=slotx_db
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
FRONTEND_LOCAL_URL=http://localhost:3000
BACKEND_LOCAL_URL=http://localhost:5001
NODE_ENV=development
```

4. Start server: `pnpm run dev`

### Step 3: Frontend Configuration

1. Navigate to the client folder: `cd ../client`
2. Install dependencies: `pnpm install`
3. Create a `.env` file and configure:

```env
REACT_APP_API_BACKEND_LOCAL_URL=http://localhost:5001
REACT_APP_API_FRONTEND_LOCAL_URL=http://localhost:3000
```

4. Start app: `pnpm run start`

## 🛡️ Security Note

All sensitive code (passwords, tokens) is protected with industry-standard practices. All comments have been removed from the production codebase for a cleaner, professional delivery.

## 📄 License

© 2026 SlotX Inc. All rights reserved.