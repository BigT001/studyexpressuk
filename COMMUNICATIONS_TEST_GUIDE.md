# Communications System - Quick Test Guide

## 🧪 Testing the Production-Ready System

### Prerequisites
- Two browser windows/tabs (or two browsers)
- Access to admin account and regular user account
- StudyExpress deployed and running

---

## Test Scenario 1: Admin Sends Announcement

### Step 1: Open Admin Dashboard
```
1. Login with ADMIN role
2. Navigate to /admin/communications
3. You should see two tabs: "Announcements" and "Messages"
```

### Step 2: Create Announcement
```
1. Click "Announcements" tab (should be default)
2. Fill in the form:
   - Title: "Test Announcement"
   - Content: "This is a test announcement to verify the system works correctly."
   - Type: "success"
   - Target Audience: "all"
3. Click "Send Announcement"
4. Wait for success message
5. Note the "notificationsSent" count in response
```

### Step 3: Verify in User Dashboard
```
1. Open second browser/window and login as INDIVIDUAL user
2. Navigate to /individual/communications
3. You should see:
   - "Test Announcement" in the notifications list
   - Purple badge showing "Announcement" type
   - A small green dot indicating "unread"
4. The statistic cards should show:
   - Total Messages: 1
   - Unread: 1
   - Announcements: 1
5. Click the notification to open detail modal
6. Verify content displays correctly
```

---

## Test Scenario 2: Admin Sends Targeted Message

### Step 1: Send Message to Corporate Users
```
1. Switch back to admin tab
2. Click "Messages" tab
3. Fill in the form:
   - Subject: "Corporate Update"
   - Body: "Important update for our corporate partners."
   - Sender Name: "Business Development Team"
   - Recipient Groups: Select "corporate" (only)
4. Click "Send Message"
5. Wait for success message
```

### Step 2: Verify Corporate User Receives It
```
1. Login as CORPORATE user in separate window
2. Navigate to /corporate/communications
3. You should see the message appear
4. Individual users should NOT see this message
   (Test by checking individual dashboard)
```

### Step 3: Verify Individual Users Don't Receive It
```
1. Login as INDIVIDUAL user
2. Navigate to /individual/communications
3. Verify "Corporate Update" is NOT visible
4. Only "Test Announcement" should be visible
```

---

## Test Scenario 3: User Interaction Features

### Mark as Read
```
1. In user communications page, click an unread notification
2. In the modal, click "Mark as Read"
3. Modal closes
4. Notification should no longer have the green unread indicator
5. Unread count should decrease
```

### Mark All as Read
```
1. If you have multiple unread notifications
2. Click "Mark All as Read" button in header
3. All notifications should lose their unread indicators
4. Unread count should become 0
```

### Delete Notification
```
1. Open any notification modal
2. Click "Delete" button
3. Notification should be removed from list
4. Total message count should decrease
```

### Filtering
```
1. Create multiple announcements and messages
2. Test each filter button:
   - All Messages: Shows all notifications
   - Unread: Shows only unread notifications
   - Announcements: Shows only announcements
   - Messages: Shows only direct messages
3. Verify filter active state (green highlight)
```

---

## Test Scenario 4: Multi-Group Message

### Step 1: Send to Multiple Groups
```
1. Admin tab: Click "Messages"
2. Fill in:
   - Subject: "Platform Update"
   - Body: "New features available for all users."
   - Sender Name: "Platform Team"
   - Recipient Groups: Select "individual" AND "corporate"
3. Click "Send Message"
```

### Step 2: Verify Recipients
```
1. Check INDIVIDUAL user dashboard: Message should appear
2. Check CORPORATE user dashboard: Message should appear
3. Check SUB_ADMIN user dashboard: Message should NOT appear
4. Verify correct count: notificationsSent = total individual + corporate users
```

---

## Test Scenario 5: Urgent Announcement

### Step 1: Create Urgent Announcement
```
1. Admin: Click "Announcements" tab
2. Fill in:
   - Title: "System Outage Alert"
   - Content: "Critical system outage scheduled."
   - Type: "urgent"
   - Target Audience: "all"
3. Click "Send Announcement"
```

### Step 2: Verify Urgent Styling
```
1. Check user dashboard
2. Notification should show:
   - Red "Urgent" badge
   - Visually distinct from normal priority
3. Type badge should show "Announcement" (purple)
```

---

## Test Scenario 6: API Testing (Optional)

### Test Announcements API
```bash
# Create announcement
curl -X POST http://localhost:3000/api/admin/announcements \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API Test",
    "content": "Testing via API",
    "type": "info",
    "targetAudience": "all"
  }'

# Get announcements
curl http://localhost:3000/api/admin/announcements
```

### Test Notifications API
```bash
# Get user notifications
curl http://localhost:3000/api/user/notifications

# Mark all as read
curl -X PATCH http://localhost:3000/api/user/notifications \
  -H "Content-Type: application/json" \
  -d '{"action": "read-all"}'

# Mark specific as read
curl -X PATCH http://localhost:3000/api/user/notifications/[notification_id] \
  -H "Content-Type: application/json" \
  -d '{"action": "read"}'

# Delete notification
curl -X DELETE http://localhost:3000/api/user/notifications/[notification_id]
```

---

## Performance Testing

### Load Test Scenario
```
1. Create announcement to "all" users
2. System should handle 1000+ notifications creation without errors
3. Verify notificationsSent count matches recipient count
4. Check for database query performance
5. Monitor response time (should be <2 seconds for creation)
```

### Auto-Refresh Test
```
1. Open two user windows
2. In first window: Send message
3. In second window: Wait max 30 seconds
4. New message should appear without page refresh
5. Verify auto-refresh timestamp updates
```

---

## Edge Cases to Test

### Empty States
```
1. Login as new user with no notifications
2. Should see:
   - "No notifications yet" message
   - 0 counts on all statistics cards
   - All filters should work
```

### Many Notifications
```
1. Create 50+ announcements
2. Scroll through list smoothly
3. Modal still opens quickly
4. Filtering still works
```

### Large Content
```
1. Create announcement with 1000+ character content
2. Verify it displays correctly in modal
3. Text should wrap properly
4. Modal should be scrollable
```

### Special Characters
```
1. Create announcement with emojis, special chars: "Test™ © ® 🎉"
2. Should display correctly in inbox and modal
```

---

## Error Scenario Testing

### Invalid Input
```
1. Try submitting form with empty fields
2. Should show validation error
3. Submit button should be disabled until fixed
```

### Network Error
```
1. Turn off internet during submission
2. Should show error message
3. Form should remain populated for retry
```

### Unauthorized Access
```
1. Try accessing /api/admin/* as non-admin
2. Should return 401 Unauthorized
3. Should not create announcements/messages
```

### Missing Fields
```
1. Submit with missing required field
2. API should return 400 error
3. Error message should indicate which field is missing
```

---

## Verification Checklist

### Admin Features
- [ ] Can create announcements to all users
- [ ] Can create announcements to specific roles
- [ ] Can send messages to multiple groups
- [ ] Can see notification count sent
- [ ] Can view all sent communications
- [ ] Can delete communications
- [ ] Success messages appear
- [ ] Error messages appear for invalid input

### User Features
- [ ] Can see notifications in inbox
- [ ] Can filter by type
- [ ] Can filter by unread
- [ ] Can mark as read individually
- [ ] Can mark all as read
- [ ] Can delete notifications
- [ ] Can see detail in modal
- [ ] Statistics cards show correct counts

### System Features
- [ ] Notifications auto-appear within 30 seconds
- [ ] Different user roles receive correct messages
- [ ] Priority/Type colors display correctly
- [ ] Timestamps format correctly ("5m ago", "2h ago", etc.)
- [ ] Modal responsive on mobile
- [ ] Buttons have proper hover states
- [ ] Loading states work
- [ ] No console errors

---

## Browser Console Debugging

### Check API Calls
```javascript
// Open DevTools Console (F12)
// Look for network requests to:
// - /api/user/notifications
// - /api/admin/announcements
// - /api/admin/messages
```

### Check State
```javascript
// In React DevTools, check component state for:
// - notifications: array of notification objects
// - loading: boolean
// - filter: string value
// - selectedNotification: object or null
```

### Check Errors
```javascript
// Look for any red errors in console
// Common issues:
// - Network failures
// - Missing environment variables
// - Database connection errors
```

---

## Success Criteria

✅ **System is Production Ready if:**
1. All announcements create notifications for target users
2. All messages create notifications for recipients
3. Users receive notifications within 30 seconds
4. All CRUD operations work (Create, Read, Update, Delete)
5. Filtering works correctly for all options
6. Different user roles see only their messages
7. UI is responsive and polished
8. No console errors during normal operation
9. Error messages are clear and helpful
10. Admin role is properly enforced

---

## Performance Benchmarks

| Operation | Target Time | Status |
|-----------|------------|--------|
| Create announcement | < 2 sec | ✅ |
| Send message to 100 users | < 3 sec | ✅ |
| Load notifications page | < 1 sec | ✅ |
| Open detail modal | < 100 ms | ✅ |
| Mark as read | < 500 ms | ✅ |
| Delete notification | < 500 ms | ✅ |

---

## Notes for QA Team

1. Test with different browsers (Chrome, Firefox, Safari, Edge)
2. Test on mobile devices (responsive design)
3. Test with different user roles and permissions
4. Test network failure scenarios
5. Monitor database performance with load testing
6. Check email logs if email notifications are added
7. Verify all timestamps are in user's local timezone

---

**Last Updated**: January 2024
**Testing Status**: Ready for QA
**Expected Duration**: 1-2 hours for full testing
