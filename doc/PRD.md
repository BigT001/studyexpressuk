# STUDY EXPRESS UK — Product Requirements Document (PRD)

Version: 0.1
Date: 2025-12-30
Author: Code Pilot (draft)

## 1. Project Overview

STUDY EXPRESS UK is a role-based education and engagement platform for individual members (students/applicants), corporate members (organizations and staff), sub-admins (account managers/support), and admins (system operators). The platform handles memberships, events/courses, corporate staff management, messaging, notifications and reporting.

Design principle: single Next.js codebase (modular monolith) with a strict separation between UI and server/service logic.

## 2. Goals & Success Criteria

- Provide secure, role-based access to platform features.
- Support subscriptions, payments, and corporate staff workflows.
- Enable reliable notifications and messaging.
- Scalable MongoDB data model with strict validation.
- Clean separation: UI (app router) vs backend services (in `/src/server`).

Success metrics:
- Auth and RBAC enforced at middleware/service layer.
- End-to-end critical flows use MongoDB transactions.
- CI passing, deployment to Vercel and connections to managed services (MongoDB Atlas, Stripe, Cloudinary).

## 3. Users & Roles

- Individual — personal profile, memberships, enrollments, messaging.
- Corporate — organization admin, manage corporate profile, manage staff and assignments.
- Sub-Admin — support, limited member views, onboarding assistance.
- Admin — full system control and reporting.

## 4. Core Principles (enforced)

- Single Next.js codebase (App Router) with TypeScript.
- Frontend: UI only (no DB or privileged logic).
- Backend: services, permissions, data access under `/src/server`.
- MongoDB + Mongoose with strict schemas and reference-based relationships.
- RBAC enforced by middleware + service-level checks.
- Zod (or equivalent) for request/body validation.

## 5. Tech Stack

- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS, shadcn/ui or Headless UI
- Auth.js (NextAuth v5) for authentication
- MongoDB Atlas + Mongoose
- Stripe (payments & webhooks)
- Cloudinary (file storage)
- Resend/SendGrid (emails)
- Vercel deployment

## 6. High-Level Architecture

Public Website -> Next.js Web App (Dashboards) -> API Layer (Next.js API Routes) -> Service Layer (`/src/server`) -> MongoDB (Mongoose)

Services are plain modules (no direct network calls from UI). API routes should be controllers that call services and respond only with sanitized outputs.

## 7. Folder Structure (Mandatory)

Use the following canonical structure (shortened):

/app
  (public)
  (auth)
  (dashboard)
  api/*  (controllers only)
  middleware.ts  (RBAC + route protection)

/src
  /server
    /auth
    /users
    /corporates
    /staff
    /memberships
    /payments
    /events
    /courses
    /messaging
    /notifications
    /reports
    /db
      mongoose.ts
      /models
  /shared
    /types
    /validators
    /constants

Rules:
- API routes: controllers only.
- Business logic: `/src/server`.
- DB access: Mongoose models only.
- UI components: no direct DB calls or privileged logic.

## 8. Core Data Models (summary)

- User
  - role: INDIVIDUAL | CORPORATE | SUB_ADMIN | ADMIN
  - email, phone, passwordHash, status

- IndividualProfile
  - userId (ref User), firstName, lastName, dob, metadata

- CorporateProfile
  - userId (owner), companyName, address, logo

- CorporateStaff
  - userId (ref), corporateId (ref), role, status

- Membership
  - subjectId (userId or corporateId), planId, status, startDate, endDate

- Event / Course
  - title, type, access (free/premium/corporate), schedule, capacity

- Enrollment
  - userId, eventId/courseId, progress, status, completionDate

- Message / Notification
  - senderId, recipientId, content, metadata, readAt

- Payment
  - userId or corporateId, stripeSessionId, amount, status, metadata

All models should use references (ObjectId refs). Avoid deep nested objects for frequently-updated collections.

## 9. RBAC & Security

- Middleware: page-level route protection (based on role and route metadata).
- Service layer: final permission checks on every operation affecting data or state.
- Never trust client-side checks.
- Log and audit admin/sub-admin actions.

## 10. Transactions & Critical Flows

Use MongoDB sessions for atomic operations where multiple writes must be consistent:

- Membership purchase/upgrade: create payment record, update membership, update invoices, send notifications — all in a session.
- Staff enrollment and course access grants.
- Refunds and payment reversals.

## 11. API Contracts

- API routes live under `/app/api/*` and should be thin controllers calling service methods in `/src/server/*`.
- Use OpenAPI-style contract files or Markdown endpoint specs for each controller.

Example controller responsibilities:
- Validate request using Zod.
- Call service method with typed DTO.
- Map service errors to HTTP codes.

## 12. Development Roadmap & Production Stages

Stage 0 — Discovery (1 week)
- Finalize PRD and acceptance criteria.
- Define data retention, legal, and compliance needs.
- Create initial environment in Vercel/MongoDB Atlas for dev.

Stage 1 — Foundation & Auth (2 weeks)
- Implement Mongoose connection (`/src/server/db/mongoose.ts`).
- Create base models: User, IndividualProfile, CorporateProfile.
- Implement authentication (NextAuth v5) + email/password + session strategy.
- Add RBAC middleware and basic role seeding script.

Stage 2 — MVP: Individual Dashboard (3 weeks)
- Individual dashboard UI and pages.
- Membership model and simple membership purchase flow (Stripe sandbox).
- Events/Courses listing and enrollment (basic).
- In-app notifications and basic messaging.

Stage 3 — Admin & Corporate (3 weeks)
- Admin dashboard for user and corporate management.
- Corporate profile + staff management workflows.
- Permissions for sub-admin roles.

Stage 4 — Payments, Webhooks & Transactions (2 weeks)
- Stripe integration (checkout, webhooks) and payment records.
- MongoDB transactions for membership/payment flows.

Stage 5 — QA, Tests, and Hardening (2 weeks)
- Integration tests for critical flows (auth, payments, membership updates).
- Security review: secrets, CSP, helmet, rate-limiting for APIs.
- Performance checks and DB indexes.

Stage 6 — Launch & Monitoring (1 week)
- Deploy to production, configure environment variables in Vercel.
- Set up logging, Sentry, and monitoring.
- Run smoke tests and sign-off checklist.

Stage 7 — Post-launch & Iteration (ongoing)
- Bug fixes, analytics, feature backlog.

Minimum viable timeline: ~12 weeks for a production-disciplined MVP (see stages above). Adjust based on team size.

## 13. Acceptance Criteria (MVP)

- Secure auth and role-based route protection enforced.
- Users can sign up, view dashboard, enroll in an event/course, and view membership status.
- Admins can manage users and corporates.
- Payments complete end-to-end (sandbox) and membership updates are transactional.

## 14. Operational & Deployment Notes

- Use environment variables; never commit secrets.
- Use MongoDB Atlas backups and enable read replicas if needed.
- Use Vercel for Next.js hosting and configure environment for server actions and API routes.

## 15. Next Actions (suggested immediate items)

1. Accept this PRD or request edits.
2. I will create the first set of Mongoose models in `/src/server/db/models` (Users, Profiles, Memberships, Events), plus Zod validators.
3. Scaffold authentication (NextAuth v5) and RBAC middleware.

---

If you want, I can now generate the Mongoose schema files (with Zod validators) and place them under `/src/server/db/models`. Which models do you want first? `User` and `IndividualProfile` are recommended starting points.
