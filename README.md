# 🎓 CampusConnect — College Club & Event Management Platform

> A full-stack, production-quality, responsive college club event management website designed with a modern **navy, purple, and blue** visual identity. Empowering student bodies, societies, and attendees with seamless event discovery, instant registration with duplicate protection, digital entry passes, and an admin management portal.

---

## 🌟 Key Highlights & Features

### 👨‍🎓 For Students
- **Dynamic Homepage**: High-impact hero section, live metrics pill, featured event spotlight, upcoming event grid, and campus clubs showcase.
- **Advanced Search & Filtering**: Instant search across titles, descriptions, venues, and tags; category pills (*Hackathon*, *Technical*, *Workshop*, *Cultural*, *Sports*, *Seminar*, *Social*); timeframe filtering (*Upcoming*, *Past*, *All*); and sorting (*Date Soonest*, *Most Popular*, *Capacity*).
- **Comprehensive Event Details (`/events/:idOrSlug`)**: High-res banners, date/time breakdown, venue, organizing club profile, requirements checklist, tags, and real-time seat availability progress bar.
- **Smart Registration System**:
  - Full Name, Email, College/University, Academic Year (*1st Year* to *Post Graduate*), Phone Number, and Optional Notes.
  - **Duplicate Prevention Guarantee**: Enforces single registration per email per event (rejects duplicate attempts with HTTP 409 Conflict).
  - **Capacity Safeguards**: Prevents overbooking once capacity is reached.
  - **Digital Event Pass & Badge**: Generates a unique Registration ID (e.g., `CC-2026-X8K3A1`), digital QR pass mockup, confetti celebration, copyable ID, and printable pass.

### 🛡️ For Club Leads & Administrators
- **Secure JWT Authentication**: Protected admin routes with session validation and quick demo autofill.
- **Overview Dashboard (`/admin`)**: Metric cards (*Total Events*, *Upcoming Events*, *Total Registrations*, *Active Clubs*), real-time database connection status, and category breakdown.
- **Full Event CRUD (`/admin/events`)**: Add, edit, publish/draft/complete/cancel, and delete events with cascade cleanup.
- **Registration Management & CSV Export (`/admin/registrations`)**: Filter by event, academic year, and status; inspect student details; cancel entries; and **one-click download of full attendee rosters in CSV format** for check-in desks.
- **Club Directory Management (`/admin/clubs`)**: Register clubs, assign student coordinators, update social links, and track organized event counts.
- **Responsive Admin UI**: Fixed desktop sidebar + smooth collapsible mobile navigation drawer.

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Canvas Confetti |
| **Backend** | Node.js, Express, TypeScript, Mongoose, Zod, JWT (`jsonwebtoken`), `bcryptjs` |
| **Database** | **MongoDB Atlas** (with resilient built-in storage fallback for instant zero-config dev) |
| **Validation** | Zod schemas on client and server |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended, verified on Node v24)
- **npm** (v9+ or higher)

### 2. Project Directory
The project is located at:
```bash
cd C:\Users\suyas\.gemini\antigravity\scratch\campusconnect
```

### 3. Install Dependencies
```bash
# From the root directory:
npm run install:all
```
*(Or individually in both `client` and `server` folders via `npm install`)*

### 4. Configure Environment (`server/.env`)
The server comes pre-configured with a `.env` file:
```env
PORT=5000
NODE_ENV=development
# Set your MongoDB Atlas connection string:
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campusconnect?retryWrites=true&w=majority
JWT_SECRET=campusconnect_super_secret_jwt_key_2026_dev_prod
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

> ⚡ **Resilient Atlas Fallback**: If you don't have a MongoDB Atlas connection string yet, the app automatically runs its high-performance built-in storage engine with realistic seed data. All CRUD, registration, duplicate checks, and CSV exports work immediately! Once you provide your Atlas URI, it seamlessly connects to MongoDB Atlas.

### 5. Start Development Servers
From the root directory, run:
```bash
npm run dev
```
Or start individually:
- **Backend**: `npm run dev:server` (runs on `http://localhost:5000`)
- **Frontend**: `npm run dev:client` (runs on `http://localhost:5173`)

---

## 🔐 Default Admin Credentials

Access the Admin Portal at **`http://localhost:5173/admin/login`**:

| Field | Value |
|---|---|
| **Email** | `admin@campusconnect.edu` |
| **Password** | `Admin@CampusConnect2026` |
| **Role** | `superadmin` |

*(A **"Fill Default Admin Credentials"** button is built into the login card for 1-click testing)*

---

## 🧪 Automated Test Suite

A complete verification suite is included to test all endpoints, registration, duplicate prevention, and CSV exports:

```bash
cd server
node test-api.js
```

### Test Results:
```text
🧪 Starting CampusConnect Automated Verification Suite...

1. Health check: ✅ PASS
2. Admin Login: ✅ PASS (Token received)
3. Verify /auth/me: ✅ PASS (superadmin)
4. List Events: ✅ PASS (7 events found)
5. Student Registration: ✅ PASS (Registration ID: CC-2026-XXXXXX)
6. Duplicate Prevention Check: ✅ PASS (Successfully rejected duplicate with 409 Conflict)
7. Admin Stats Endpoint: ✅ PASS (Total Regs: 5, Events: 7)
8. Registration CSV Export: ✅ PASS (Generated CSV lines with RFC headers)
9a. Admin Create Event: ✅ PASS
9b. Admin Update Event: ✅ PASS
9c. Admin Delete Event: ✅ PASS

🎉 ALL BACKEND ENDPOINTS AND LOGICAL WORKFLOWS VERIFIED 100% WORKING!
```

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/login` — Authenticate admin, returns JWT token & admin profile.
- `GET /api/auth/me` — Verify active token (Bearer token required).

### Events (`/api/events`)
- `GET /api/events` — Query events with `search`, `category`, `club`, `timeframe`, `sort`, `page`, `limit`.
- `GET /api/events/featured` — Get top featured event and highlights.
- `GET /api/events/:idOrSlug` — Get event details with populated club info.
- `POST /api/events` — Create new event (Admin only, Zod validated).
- `PUT /api/events/:id` — Update event (Admin only, Zod validated).
- `DELETE /api/events/:id` — Delete event & clean associated registrations (Admin only).

### Student Registrations (`/api/registrations`)
- `POST /api/registrations` — Register student (Public, checks duplicates & capacity, returns unique ID).
- `GET /api/registrations` — List registrations with filters (Admin only).
- `GET /api/registrations/export/csv` — Stream/Download full CSV file (Admin only).
- `DELETE /api/registrations/:id` — Cancel registration and release spot (Admin only).

### Clubs (`/api/clubs`)
- `GET /api/clubs` — List all campus clubs with active event counts.
- `GET /api/clubs/:idOrSlug` — Get single club details and organized events.
- `POST /api/clubs` — Register new club (Admin only).
- `PUT /api/clubs/:id` — Update club profile (Admin only).
- `DELETE /api/clubs/:id` — Delete club (Admin only).

### System & Stats (`/api/stats`)
- `GET /api/stats` — Dashboard metrics & database engine telemetry (Admin only).
- `POST /api/stats/seed` — Reset & populate realistic seed dataset.

---

## 📁 Project Structure

```
campusconnect/
├── client/                     # Vite + React + TypeScript + Tailwind CSS
│   ├── index.html              # Custom fonts & branding
│   ├── vite.config.ts          # Dev proxy to backend port 5000
│   ├── tailwind.config.js      # Navy, purple, and blue custom theme
│   ├── postcss.config.js
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, Badge, Loader
│   │   │   ├── events/         # EventCard, FeaturedEvent, EventFilters, RegistrationModal, RegistrationSuccessModal
│   │   │   ├── clubs/          # ClubCard
│   │   │   └── admin/          # AdminLayout, AdminSidebar, StatCard, EventFormModal, ClubFormModal, ConfirmDialog
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── EventsPage.tsx
│   │   │   ├── EventDetailPage.tsx
│   │   │   ├── ClubsPage.tsx
│   │   │   ├── AdminLoginPage.tsx
│   │   │   ├── AdminDashboardPage.tsx
│   │   │   ├── AdminEventsPage.tsx
│   │   │   ├── AdminRegistrationsPage.tsx
│   │   │   ├── AdminClubsPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── services/           # api, auth, events, registrations, clubs, stats
│   │   └── types/              # TypeScript contracts
│   └── package.json
├── server/                     # Node.js + Express + Mongoose + Zod + JWT
│   ├── src/
│   │   ├── config/             # env.ts, db.ts (resilient Atlas connection)
│   │   ├── models/             # Admin, Club, Event, Registration (Mongoose)
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── middleware/         # auth (JWT), validate (Zod), errorHandler
│   │   ├── controllers/        # auth, event, registration, club, stats
│   │   ├── routes/             # REST route declarations
│   │   ├── services/           # store.ts (unified data access layer)
│   │   ├── seed/               # seedData.ts, seeder.ts
│   │   ├── utils/              # csvExporter.ts
│   │   ├── app.ts              # Express application setup
│   │   └── index.ts            # Entrypoint
│   ├── test-api.js             # Automated end-to-end verification script
│   ├── tsconfig.json
│   └── package.json
├── package.json                # Root orchestration scripts
├── .env.example
└── README.md
```

---

## 🚢 Deployment Guidelines

### 1. MongoDB Atlas Setup
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Under **Database Access**, create a user with Read & Write permissions.
3. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere).
4. Copy your connection string into `MONGODB_URI` in `server/.env`.

### 2. Backend Deployment (Render / Railway / AWS / GCP)
- **Root Directory**: `server`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- Set environment variables (`MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `PORT=5000`).

### 3. Frontend Deployment (Vercel / Netlify / Cloudflare Pages)
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- Set environment variable: `VITE_API_URL=https://your-backend-domain.com/api`.
