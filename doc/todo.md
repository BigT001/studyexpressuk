# Project Todo List

This file mirrors the tracked project todo list for STUDY EXPRESS UK.

## High-level tasks

- [x] Convert spec to PRD — Turn the provided project summary into a formal Product Requirements Document (PRD).
- [ ] Create Mongoose schemas — Design and implement Mongoose models under `/src/server/db/models` for Users, Profiles, Corporates, Staff, Memberships, Events, Courses, Enrollments, Messages, Notifications, Payments.
- [ ] Draft development timeline — Create milestones and sprint plan for MVP (auth, individual/admin dashboards, events, memberships).
- [ ] Create API contract docs — Document API routes under `/app/api` (controllers-only) and service contracts.
- [ ] Scaffold MVP skeleton — Implement auth (Auth.js), RBAC middleware, and basic dashboards and routes using Next.js App Router and TypeScript.
- [ ] Implement payments & webhooks — Integrate Stripe payments, webhooks, and MongoDB transactions for purchases and membership changes.
- [ ] Setup deployment & infra — Configure Vercel, MongoDB Atlas, Cloudinary, Stripe, and environment secrets; prepare CI steps.
- [ ] Implement RBAC & service checks — Middleware-level and service-level RBAC enforcement with comprehensive permission tests.
- [ ] Docs, tests & QA — Write documentation, validation (Zod), unit/integration tests, and security checks.

## Notes

- The canonical source of truth for services, schemas and API contracts will be in `/src/server` and `/app/api` respectively.
- Use Zod validators alongside Mongoose schemas to enforce both runtime validation and type safety.

## How to use

1. Update this file as tasks progress.
2. Use the project `manage_todo_list` to keep the tasks synchronized with the tracker.
