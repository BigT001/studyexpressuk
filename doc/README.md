# STUDY EXPRESS UK – Production-Ready Setup

## ✅ Completed Deliverables

### 1. Project Architecture & Documentation
- **PRD** (`doc/PRD.md`): Full product requirements, stages, and acceptance criteria.
- **Data Models** (`src/server/db/models/`): 11 Mongoose models with strict schemas (Users, Profiles, Corporates, Staff, Memberships, Events, Enrollments, Messages, Notifications, Payments).
- **API Spec** (`doc/openapi.yaml`): OpenAPI 3.0 contract for core endpoints.
- **Middleware & Auth** (`doc/middleware-session-strategy.md`): Two-layer RBAC strategy (Edge + server-side JWT).

### 2. Authentication & Authorization
- **NextAuth v5** with MongoDB adapter: Session persistence, JWT tokens, role-based access.
- **Credentials Provider**: Email + password authentication against User model (bcrypt).
- **Sign-up API** (`/api/auth/signup`): Creates User + IndividualProfile.
- **RBAC Middleware** + **Server-Side Session Checks**: Enforced on all protected routes.

### 3. Core Services & APIs
- **User Service**: Create, list users (with password hashing).
- **Events Service**: Create, list events.
- **Memberships Service**: Transactional purchase with MongoDB sessions (Payment + Membership in one atomic write).
- **API Controllers** (thin, stateless):
  - `POST /api/auth/signup` – Register user.
  - `GET /api/users` – List users (admin only).
  - `POST /api/events` – Create event (admin/sub-admin only).
  - `GET /api/events` – List events.
  - `POST /api/memberships` – Purchase membership (transactional).

### 4. Validation & Type Safety
- **Zod Validators**: For all request bodies (User, Event, Membership, etc.).
- **TypeScript**: Strict typing across all models and services.

### 5. Testing & CI
- **Unit Tests** (vitest): RBAC helpers, Zod validators.
- **Integration Tests** (vitest + mongodb-memory-server): Users, Events, Memberships services.
- **Route Tests** (mocked sessions): Route-level RBAC enforcement.
- **CI/CD** (GitHub Actions): Runs tests on push/PR.

### 6. Code Structure (Enforced)
```
/app
├── api/                  # Controllers only (thin)
│   ├── auth/
│   ├── users/
│   ├── events/
│   └── memberships/
├── middleware.ts         # Edge-level RBAC (headers)
└── (future dashboards)

/src
├── server/
│   ├── auth/             # Auth services, session helpers, RBAC
│   ├── users/            # User business logic
│   ├── events/           # Event business logic
│   ├── memberships/      # Membership business logic (with transactions)
│   ├── db/
│   │   ├── mongoose.ts   # DB connection
│   │   └── models/       # Mongoose schemas
│   └── (other domains)
└── shared/
    ├── validators/       # Zod schemas (request validation)
    ├── types/            # Shared TypeScript interfaces
    └── constants/        # Shared constants

/doc
├── PRD.md
├── openapi.yaml
├── middleware-session-strategy.md
└── todo.md
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 20+
- pnpm

### Setup

1. **Clone and install**:
```bash
pnpm install
```

2. **Configure environment** (`.env.local`):
```env
MONGODB_URI=mongodb://localhost:27017/studyexpressuk
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=http://localhost:3000
```

3. **Run development server**:
```bash
pnpm dev
```
Server will start at `http://localhost:3000`.

4. **Run tests**:
```bash
pnpm test -- --run
```

5. **Build for production**:
```bash
pnpm build
pnpm start
```

---

## 📋 Key API Endpoints (MVP)

### Authentication
- `POST /api/auth/signin` – Login (NextAuth Credentials).
- `POST /api/auth/signup` – Register new user.
- `POST /api/auth/signout` – Logout.

### Users (Admin only)
- `GET /api/users` – List all users.

### Events
- `GET /api/events` – List events (public).
- `POST /api/events` – Create event (admin/sub-admin).

### Memberships
- `POST /api/memberships` – Purchase membership (individual/corporate, transactional).

---

## 🔒 Security & Production Checklist

- [x] Passwords hashed (bcryptjs).
- [x] Sessions encrypted (NextAuth JWT).
- [x] RBAC enforced at middleware + service level.
- [x] Zod validation on all inputs.
- [x] MongoDB references (no deep embedding).
- [x] Transactions for critical writes (memberships, payments).
- [ ] Environment secrets (NEXTAUTH_SECRET, MONGODB_URI) – set in Vercel/production.
- [ ] Rate limiting on auth endpoints – add with express-rate-limit or Vercel middleware.
- [ ] CORS configured if API is accessed from external domains.
- [ ] Helmet.js for security headers – add if needed.

---

## 📦 Next Steps (Post-MVP)

1. **Stripe Integration**:
   - Add Stripe checkout flow.
   - Webhooks for payment confirmation.
   - Update membership status on successful payment.

2. **Messaging & Notifications**:
   - Implement Message & Notification APIs.
   - Email delivery via Resend/SendGrid.

3. **Dashboards**:
   - Individual dashboard (React components in `app/(dashboard)/individual`).
   - Admin dashboard (user/event management).
   - Corporate dashboard (staff management).

4. **File Uploads**:
   - Cloudinary integration for profile images, logos, certificates.

5. **Deployment**:
   - Deploy to Vercel.
   - Configure MongoDB Atlas.
   - Set up environment variables.
   - Enable HTTPS, CSP, and security headers.

6. **Analytics & Monitoring**:
   - Sentry for error tracking.
   - Logging service (e.g., CloudWatch, LogRocket).

---

## 📚 Documentation Files

- `doc/PRD.md` – Complete product requirements and development stages.
- `doc/openapi.yaml` – API contract for all endpoints.
- `doc/middleware-session-strategy.md` – Authentication & RBAC design.
- `doc/todo.md` – Tracked deliverables.

---

## 🛠 Tech Stack Summary

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind, shadcn/ui |
| **Backend** | Node.js, Next.js API Routes |
| **Database** | MongoDB, Mongoose ODM |
| **Auth** | NextAuth v5, JWT, bcryptjs |
| **Validation** | Zod |
| **Testing** | Vitest, mongodb-memory-server |
| **CI/CD** | GitHub Actions |
| **Deployment** | Vercel, MongoDB Atlas |

---

**Status**: ✅ **MVP Foundation Ready**. The codebase is production-disciplined, tested, and ready for feature development.
