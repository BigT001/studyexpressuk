# Quick Reference: Dashboard File Locations

## Corporate Dashboard Files

### Pages (9 total)
```
app/(dashboard)/corporate/
├── page.tsx                 (Main dashboard)
├── profile/page.tsx         (Company profile)
├── memberships/page.tsx     (Membership management)
├── staff/page.tsx           (Staff management)
├── courses/page.tsx         (Training & courses)
├── messages/page.tsx        (Messages/inbox)
├── announcements/page.tsx   (Announcements)
├── notifications/page.tsx   (Notifications)
├── settings/page.tsx        (Settings & security)
└── layout.tsx               (Main layout with sidebar)
```

### Components (9 total)
```
src/components/corporate/
├── CorporateDashboardHeader.tsx
├── CorporateQuickStats.tsx
├── CorporateQuickActions.tsx
├── CorporateProfileSection.tsx
├── CorporateMembershipSection.tsx
├── CorporateStaffSection.tsx
├── CorporateCoursesSection.tsx
├── CorporateCommunicationSection.tsx
├── CorporateNotificationsSection.tsx
└── index.ts                 (Barrel export)
```

---

## Individual Dashboard Files

### Pages (7 total)
```
app/(dashboard)/individual/
├── page.tsx                 (Main dashboard)
├── profile/page.tsx         (Profile management)
├── memberships/page.tsx     (Membership tracking)
├── enrollments/page.tsx     (Course progress)
├── messages/page.tsx        (Messages/inbox)
├── announcements/page.tsx   (Announcements)
└── notifications/page.tsx   (Notifications)
```

### Components (8 total)
```
src/components/individual/
├── IndividualDashboardHeader.tsx
├── IndividualQuickStats.tsx
├── ProfileSection.tsx
├── MembershipSection.tsx
├── LearningSection.tsx
├── CommunicationSection.tsx
├── NotificationsSection.tsx
├── QuickActionsSection.tsx
└── index.ts                 (Barrel export)
```

---

## Admin Dashboard Files

### Pages (12 total)
```
app/(dashboard)/admin/
├── page.tsx                 (Main dashboard)
├── users/page.tsx           (User management)
├── events/page.tsx          (Event management)
├── memberships/page.tsx     (Membership management)
├── corporate/page.tsx       (Corporate management)
├── payments/page.tsx        (Payment management)
├── analytics/page.tsx       (Analytics dashboard)
├── courses/page.tsx         (Course management)
├── communications/page.tsx  (Communications)
├── settings/page.tsx        (System settings)
├── subadmins/page.tsx       (Sub-admin management)
└── layout.tsx               (Main layout with sidebar)
```

---

## Documentation Files

```
Project Root:
├── INDIVIDUAL_DASHBOARD_AUDIT.md         (Individual dashboard details)
├── CORPORATE_DASHBOARD_AUDIT.md          (Corporate dashboard details)
└── DASHBOARD_IMPLEMENTATION_COMPLETE.md  (Overall summary)
```

---

## Import Examples

### Using Corporate Components
```typescript
// Option 1: Named imports
import { 
  CorporateDashboardHeader,
  CorporateQuickStats,
  CorporateQuickActions 
} from '@/components/corporate';

// Option 2: Barrel import
import * as Corporate from '@/components/corporate';
```

### Using Individual Components
```typescript
// Named imports
import {
  IndividualDashboardHeader,
  ProfileSection,
  MembershipSection
} from '@/components/individual';
```

---

## URL Routes

### Corporate Routes
- `/corporate` - Main dashboard
- `/corporate/profile` - Company profile
- `/corporate/memberships` - Memberships
- `/corporate/staff` - Staff management
- `/corporate/courses` - Training & courses
- `/corporate/messages` - Messages
- `/corporate/announcements` - Announcements
- `/corporate/notifications` - Notifications
- `/corporate/settings` - Settings

### Individual Routes
- `/individual` - Main dashboard
- `/individual/profile` - Profile
- `/individual/memberships` - Memberships
- `/individual/enrollments` - Enrollments
- `/individual/messages` - Messages
- `/individual/announcements` - Announcements
- `/individual/notifications` - Notifications

### Admin Routes
- `/admin` - Main dashboard
- `/admin/users` - Users
- `/admin/events` - Events
- `/admin/memberships` - Memberships
- `/admin/corporate` - Corporate accounts
- `/admin/payments` - Payments
- `/admin/analytics` - Analytics
- `/admin/courses` - Courses
- `/admin/communications` - Communications
- `/admin/settings` - Settings
- `/admin/subadmins` - Sub-admins

---

## Key Features by Page

### Corporate Dashboard
- **Main Page**: Welcome, stats, quick actions, recent activity
- **Profile**: Company info, logo upload, contact details, password change, access control
- **Memberships**: Current status, plan upgrades, renewal history
- **Staff**: Add/edit/remove staff, performance tracking
- **Courses**: Browse courses, assign to staff, track progress
- **Messages**: Inbox with message detail panel
- **Announcements**: Pinned announcements, categories, detail view
- **Notifications**: Event updates, staff alerts, membership renewals
- **Settings**: Password change, 2FA, access control, active sessions

### Individual Dashboard
- **Main Page**: Welcome, stats, quick actions, activity feed
- **Profile**: Personal details, interests, qualifications, password change, security settings
- **Memberships**: Status cards, upgrade options, renewal history
- **Enrollments**: Enrolled courses, progress tracking, certificates
- **Messages**: Message inbox with detail panel
- **Announcements**: Announcement feed
- **Notifications**: All notifications by type
- **Messages**: Dedicated inbox for admin communications

---

## Component Composition

### Corporate Dashboard Page Structure
```tsx
import {
  CorporateDashboardHeader,
  CorporateQuickStats,
  CorporateQuickActions,
  CorporateProfileSection,
  CorporateMembershipSection,
  CorporateStaffSection,
  CorporateCoursesSection,
  CorporateCommunicationSection,
  CorporateNotificationsSection
} from '@/components/corporate';

export default function CorporateDashboardPage() {
  return (
    <div className="space-y-8 p-6">
      <CorporateDashboardHeader />
      <CorporateQuickStats />
      <CorporateQuickActions />
      <CorporateProfileSection />
      <CorporateMembershipSection />
      <CorporateStaffSection />
      <CorporateCoursesSection />
      <CorporateCommunicationSection />
      <CorporateNotificationsSection />
    </div>
  );
}
```

---

## Design System

### Colors
- Blue: #3B82F6 (primary)
- Green: #10B981 (success)
- Orange: #F97316 (warning)
- Red: #DC2626 (danger)
- Purple: #A855F7 (secondary)

### Spacing (Tailwind)
- `p-4` (1rem) - Small padding
- `p-6` (1.5rem) - Medium padding
- `p-8` (2rem) - Large padding
- `gap-4` (1rem) - Small gaps
- `gap-6` (1.5rem) - Medium gaps

### Typography
- `text-3xl` - Main headings
- `text-2xl` - Section headings
- `text-lg` - Card titles
- `text-sm` - Labels
- `text-xs` - Captions

---

## Responsive Breakpoints (Tailwind)

- `md:` - 768px+ (tablets and up)
- `lg:` - 1024px+ (desktops)
- `xl:` - 1280px+ (large desktops)

### Responsive Patterns
```tsx
// Mobile first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

// Conditional rendering
<div className="hidden md:block">
  {/* Desktop only */}
</div>
```

---

## Common Tasks

### Add a New Page
1. Create folder: `app/(dashboard)/corporate/[section]/`
2. Create `page.tsx` with client component (`'use client'`)
3. Update layout.tsx navItems array
4. Add to this quick reference

### Create a New Component
1. Create file: `src/components/corporate/ComponentName.tsx`
2. Mark as client: `'use client'`
3. Export function: `export function ComponentName() { ... }`
4. Add to: `src/components/corporate/index.ts`
5. Use in pages

### Update Navigation
File: `app/(dashboard)/corporate/layout.tsx`
Update the `navItems` array with new routes

---

## Testing URLs

When testing locally, navigate to:
- `http://localhost:3000/corporate` (Corporate main)
- `http://localhost:3000/corporate/staff` (Staff management)
- `http://localhost:3000/corporate/courses` (Courses)
- etc.

---

## Useful Commands

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Run linter
pnpm lint

# Run tests
pnpm test
```

---

## Next Integration Steps

1. Connect forms to backend APIs
2. Replace mock data with real data
3. Implement image upload
4. Set up authentication
5. Add error handling
6. Implement real notifications
7. Add loading states
8. Add error boundaries

---

This quick reference covers all file locations, routes, and basic usage patterns for the dashboard implementation.
