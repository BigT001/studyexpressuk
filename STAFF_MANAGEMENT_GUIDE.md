# Corporate Staff Management - Quick Start Guide

## Accessing the Staff Management Page

As a corporate user, navigate to: `/corporate/staff`

## Features Overview

### 1. Adding Staff Members

**Step 1**: Click "Add Staff Member" button (top right)

**Step 2**: Fill in the form:
- **Email** (Required) - Must be an email of a user already registered in the system
- **Role** (Required) - E.g., "Manager", "Developer", "Trainer", "Coordinator"
- **Department** - Optional, e.g., "Engineering", "HR", "Marketing"
- **Skills** - Optional, add multiple skills one at a time
  - Type skill name and click "Add" or press Enter
  - Click × to remove a skill
- **Certifications** - Optional, add certifications the staff member has

**Step 3**: Click "Add Staff Member" button to save

### 2. Managing Staff

**View Staff List**:
- See all staff members in a table
- Check their status, join date, role, and department
- Stats show: Total Staff, In Training, Completed, Avg Progress

**View Staff Details**:
- Click the eye icon (👁️) next to any staff member
- See their complete profile including skills and certifications
- View all assigned courses with progress tracking

**Remove Staff**:
- Click the trash icon (🗑️) next to any staff member
- Confirm the deletion

### 3. Assigning Courses

**Step 1**: Click "View Details" (eye icon) for any staff member

**Step 2**: In the detail modal, click "Assign Course" button

**Step 3**: Select a course from the available list
- Shows course title, description, and category
- Only shows courses not already assigned to this staff member
- Click "Assign" button next to the course

**Step 4**: Course will appear in the staff member's course list

### 4. Tracking Progress

**View Progress**:
- Click "View Details" for any staff member
- See each course with a progress bar

**Update Progress**:
- Click one of the quick-set buttons: 25%, 50%, 75%, or 100%
- Progress bar updates immediately
- When set to 100%, status automatically changes to "completed"
- Completion date is recorded

**Manual Progress Input**:
- Progress is updated in real-time
- Shows completion date once 100% is reached

**Remove Course**:
- Click trash icon in course card
- Course will be removed from staff's enrollments

## Key Information

### User Requirements
- Users must sign up first before being added as staff
- Email must match the registered account email
- Users can have different roles (INDIVIDUAL, CORPORATE staff, etc.)

### Staff Status
- **Active** - Currently employed/assigned
- **Inactive** - Temporarily unavailable
- **Terminated** - No longer with organization

### Course Status
- **Enrolled** - Just assigned, not started
- **In Progress** - Currently taking the course
- **Completed** - Finished the course

### Skills & Certifications
- Add multiple skills to track competencies
- Add certifications to validate qualifications
- These are for record-keeping and can be updated anytime

## Useful Tips

1. **Find Users to Add**: Ask team members to sign up first, then add them as staff
2. **Quick Progress Updates**: Use the 25%, 50%, 75%, 100% buttons for fast updates
3. **Filter Courses**: When assigning courses, unavailable courses (already assigned) are automatically hidden
4. **Track Performance**: Use the dashboard stats to monitor training completion rates
5. **Department Organization**: Use consistent department names for better organization

## Example Workflow

```
1. Employee A from your company signs up → Creates account
2. Go to Staff Management
3. Click "Add Staff Member"
4. Enter their email and role "Software Engineer"
5. Add department "Engineering"
6. Add skills like "Python", "JavaScript", "Docker"
7. Click "Add Staff Member"
8. Staff member appears in the list
9. Click View Details for Staff Member
10. Click Assign Course
11. Select "Advanced Python Course"
12. Staff member is now enrolled in the course
13. As they progress, update the progress percentage
14. When complete (100%), it shows completion date
```

## Status & Metrics

**Dashboard Stats**:
- **Total Staff**: Count of all staff members
- **In Training**: Estimated staff currently taking courses
- **Completed**: Count of total course completions
- **Avg. Progress**: Overall average completion rate

These are calculated from actual enrollment data.

## Troubleshooting

**"User with this email does not exist"**
- The email you entered hasn't signed up yet
- Ask the person to register first at /auth/signup
- Then add them with their registered email

**Course not showing in available courses**
- Course may already be assigned to this staff member
- Course may not be in "active" status
- Try refreshing the page

**Progress not updating**
- Check your internet connection
- Refresh the page to see latest data
- Try clicking a different progress percentage

## API Reference (For Developers)

All requests require authentication as CORPORATE user.

### Add Staff
```bash
POST /api/corporates/staff
{
  "email": "user@example.com",
  "role": "Manager",
  "department": "Engineering",
  "skills": ["leadership", "agile"],
  "certifications": ["PMP"]
}
```

### Get All Staff
```bash
GET /api/corporates/staff
```

### Update Staff
```bash
PUT /api/corporates/staff
{
  "staffId": "64b3e4f8a2c1d5e9f0g1h2i3",
  "role": "Senior Manager",
  "skills": ["leadership", "agile", "mentoring"]
}
```

### Delete Staff
```bash
DELETE /api/corporates/staff?id=64b3e4f8a2c1d5e9f0g1h2i3
```

### Assign Course
```bash
POST /api/corporates/staff/courses
{
  "staffId": "...",
  "eventId": "..."
}
```

### Get Staff Enrollments
```bash
GET /api/corporates/staff/courses?staffId=...
```

### Update Progress
```bash
PUT /api/corporates/staff/courses
{
  "enrollmentId": "...",
  "progress": 75,
  "status": "in_progress"
}
```

### Remove Course
```bash
DELETE /api/corporates/staff/courses?id=...
```

---

**Last Updated**: January 2026
**Version**: 1.0 - Production Ready
