# Communications System - Developer Quick Reference

**For**: Developers maintaining or extending the system
**Version**: 1.0.0
**Last Updated**: January 2024

---

## 🎯 Quick Navigation

| Task | Location | File |
|------|----------|------|
| Understand the system | | COMMUNICATIONS_SYSTEM_GUIDE.md |
| Test the system | | COMMUNICATIONS_TEST_GUIDE.md |
| Architecture overview | | COMMUNICATIONS_ARCHITECTURE_DIAGRAMS.md |
| Deploy to production | | COMMUNICATIONS_DEPLOYMENT_OPERATIONS.md |
| Understand implementation | | COMMUNICATIONS_IMPLEMENTATION_COMPLETE.md |
| This quick ref | | COMMUNICATIONS_QUICK_REFERENCE.md |

---

## 📂 File Structure Reference

```
App Structure:
app/
├── api/
│   ├── admin/
│   │   ├── announcements/route.ts    ← POST/GET announcements
│   │   └── messages/route.ts         ← POST/GET messages
│   └── user/
│       └── notifications/
│           ├── route.ts              ← GET/PATCH notifications
│           └── [id]/route.ts         ← PATCH/DELETE individual
│
└── (dashboard)/
    ├── admin/
    │   └── communications/page.tsx   ← Admin panel
    ├── individual/
    │   └── communications/page.tsx   ← Individual inbox
    ├── corporate/
    │   └── communications/page.tsx   ← Corporate inbox
    └── subadmin/
        └── communications/page.tsx   ← Sub-admin inbox
```

---

## 🔌 API Quick Reference

### Admin Announcements

```typescript
// Create announcement
POST /api/admin/announcements
{
  "title": "string",
  "content": "string",
  "type": "info" | "warning" | "success" | "urgent",
  "targetAudience": "all" | "individual" | "corporate" | "subadmin"
}

// Returns
{
  "success": true,
  "announcement": { /* announcement object */ },
  "notificationsSent": 150
}

// Get announcements
GET /api/admin/announcements
// Returns: { "success": true, "announcements": [...] }
```

### Admin Messages

```typescript
// Send message
POST /api/admin/messages
{
  "subject": "string",
  "body": "string",
  "senderName": "string",
  "recipientGroups": ["individual"] | ["corporate"] | etc
}

// Returns
{
  "success": true,
  "message": { /* message object */ },
  "notificationsSent": 200
}

// Get messages
GET /api/admin/messages
// Returns: { "success": true, "messages": [...] }
```

### User Notifications

```typescript
// Get all notifications
GET /api/user/notifications
// Returns: { "success": true, "notifications": [...] }

// Mark all as read
PATCH /api/user/notifications
{ "action": "read-all" }

// Update individual notification
PATCH /api/user/notifications/[id]
{ "action": "read" }

// Delete notification
DELETE /api/user/notifications/[id]
// Returns: { "success": true }
```

---

## 🛠️ Common Development Tasks

### Adding a New Audience Type

1. **Database Schema** - Update announcements/messages schema
2. **API Route** - Update role mapping in API handler
3. **Admin UI** - Add to select dropdown
4. **Documentation** - Update COMMUNICATIONS_SYSTEM_GUIDE.md

```typescript
// In API route, update roleMap:
const roleMap: any = {
  'all': null,
  'individual': 'INDIVIDUAL',
  'corporate': 'CORPORATE',
  'subadmin': 'SUB_ADMIN',
  'newgroup': 'NEW_ROLE'  // Add here
};
```

### Adding Email Notifications

```typescript
// In /api/admin/announcements POST handler:
// After creating notifications, add:

// Send email
if (type === 'urgent') {
  const emailService = new EmailService();
  for (const recipient of recipients) {
    await emailService.send({
      to: recipient.email,
      subject: title,
      body: content
    });
  }
}
```

### Adding Real-time Updates (WebSocket)

1. Install `socket.io`: `npm install socket.io`
2. Create socket server in API
3. Replace `setInterval` polling in component with socket.on()
4. Emit notification events when notifications created

```typescript
// Instead of setInterval in component:
useEffect(() => {
  socket.on('new-notification', (notification) => {
    setNotifications(prev => [notification, ...prev]);
  });
  return () => socket.off('new-notification');
}, []);
```

---

## 🔍 Key Patterns Used

### Error Handling Pattern
```typescript
try {
  await connectToDatabase();
  // Logic here
  return NextResponse.json({ success: true, data });
} catch (error: any) {
  console.error('Error:', error);
  return NextResponse.json(
    { success: false, error: error.message },
    { status: 500 }
  );
}
```

### Auth Check Pattern
```typescript
const session: any = await getServerAuthSession();
if (!session || !session.user?.id) {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}
```

### Admin Check Pattern
```typescript
if (session.user?.role !== 'ADMIN') {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}
```

### Component State Pattern
```typescript
const [items, setItems] = useState<Item[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetchItems();
}, []);

const fetchItems = async () => {
  try {
    setLoading(true);
    const res = await fetch('/api/...');
    const data = await res.json();
    if (data.success) setItems(data.items);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

## 🐛 Debugging Tips

### Check Notifications Creation
```javascript
// In browser console:
fetch('/api/user/notifications')
  .then(r => r.json())
  .then(d => console.log(d.notifications))
```

### Check Admin API Response
```bash
# In terminal:
curl -X POST http://localhost:3000/api/admin/announcements \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "content": "Test",
    "type": "info",
    "targetAudience": "all"
  }'
```

### MongoDB Query
```javascript
// In MongoDB shell:
db.notifications.find({ userId: ObjectId("...") }).sort({ createdAt: -1 })
db.announcements.find({}).sort({ createdAt: -1 })
db.messages.find({}).sort({ sentAt: -1 })
```

### Check Component State
- Open React DevTools in browser
- Find component in tree
- Check props and state in right panel
- Look for `notifications`, `loading`, `filter` values

### View Network Requests
- Open DevTools Network tab
- Filter by XHR/Fetch
- Look for `/api/user/notifications`, `/api/admin/*` requests
- Check response and status code

---

## 📊 Database Schema Quick Reference

### Announcements
```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  type: "info|warning|success|urgent",
  targetAudience: "all|individual|corporate|subadmin",
  createdBy: ObjectId,
  createdAt: Date,
  isActive: Boolean
}
```

### Messages
```javascript
{
  _id: ObjectId,
  subject: String,
  body: String,
  senderName: String,
  senderId: ObjectId,
  recipientGroups: [String],
  status: "draft|scheduled|sent|failed",
  sentAt: Date,
  readBy: [ObjectId]
}
```

### Notifications
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: "announcement|message|email",
  title: String,
  content: String,
  sender: String,
  priority: "normal|urgent",
  status: "read|unread",
  createdAt: Date
}
```

---

## 🎨 UI Component Reference

### Admin Dashboard Components
- Form inputs: TextInput, TextArea, Select, Checkbox
- Buttons: Submit, Delete, Close
- Lists: Table, Grid
- Modals: Confirmation, Detail
- States: Loading, Error, Success

### User Inbox Components
- Header: Title, Action buttons
- Statistics: Cards with counts
- Sidebar: Filter buttons
- List: Notification items (clickable)
- Modal: Notification detail
- States: Loading, Empty, Error

### Shared Components
- Icons: From lucide-react
- Styling: Tailwind CSS
- Colors: #008200 (primary green)
- Spacing: Tailwind spacing scale
- Responsive: grid-cols-1, lg:grid-cols-3, etc

---

## 🔐 Security Checklist for Changes

Before deploying changes:
- [ ] Check user authentication (`session.user?.id`)
- [ ] Check authorization (correct role required)
- [ ] Validate all inputs (required fields, enums)
- [ ] No direct DB injection risk (using Mongoose)
- [ ] Error messages don't leak sensitive data
- [ ] No console.log of sensitive data
- [ ] User can only access their own data
- [ ] Admin endpoints require ADMIN role

---

## 📈 Performance Tips

### Optimize Database Queries
- [ ] Use indexes on frequently queried fields
- [ ] Use `.lean()` for read-only queries
- [ ] Limit returned fields with `.select()`
- [ ] Implement pagination for large result sets

### Optimize Frontend
- [ ] Use React.memo for expensive components
- [ ] Use useMemo for computed values
- [ ] Implement virtualization for large lists
- [ ] Lazy load modals and heavy components

### Optimize Network
- [ ] Compress responses with gzip
- [ ] Implement caching headers
- [ ] Use CDN for static assets
- [ ] Batch API requests when possible

---

## 🚀 Testing Checklist

Before each deployment:
```
Admin Functionality:
☐ Login with ADMIN role
☐ Navigate to /admin/communications
☐ Create announcement - see success message
☐ See correct notificationsSent count
☐ Delete announcement - confirm deletion
☐ Create message - select multiple recipients
☐ See all sent messages in list

User Functionality:
☐ Login with INDIVIDUAL/CORPORATE/SUBADMIN
☐ Navigate to communications page
☐ See notifications appear (may take 30 sec)
☐ Click notification to see detail
☐ Mark as read - notification updates
☐ Delete notification - removed from list
☐ Filter by type - correct notifications shown
☐ Mark all as read - all updated

Technical:
☐ No console errors
☐ No API 500 errors
☐ Response times < 2 seconds
☐ Auto-refresh working (30 seconds)
☐ Mobile responsive
☐ All buttons clickable and functional
```

---

## 🔗 Useful Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run lint                   # Run ESLint

# Database
mongosh                        # Open MongoDB shell
db.notifications.find()        # View notifications
db.announcements.find()        # View announcements
db.notifications.drop()        # Clear collection (testing only)

# Deployment
npm run build && npm start     # Build and start
pm2 start "npm start"          # Start with PM2
pm2 logs                       # View logs
pm2 restart all                # Restart application

# Testing
curl -X GET http://localhost:3000/api/user/notifications
curl -X POST http://localhost:3000/api/admin/announcements \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Test","type":"info","targetAudience":"all"}'
```

---

## 📞 Getting Help

### Documentation
- System Guide: `COMMUNICATIONS_SYSTEM_GUIDE.md`
- Implementation Details: `COMMUNICATIONS_IMPLEMENTATION_COMPLETE.md`
- Test Guide: `COMMUNICATIONS_TEST_GUIDE.md`
- Architecture: `COMMUNICATIONS_ARCHITECTURE_DIAGRAMS.md`

### Code Comments
- Check route files: `/api/admin/announcements/route.ts`
- Check component files: `/app/(dashboard)/admin/communications/page.tsx`
- Check for JSDoc comments above functions

### Common Issues
1. **Notifications not appearing**: Check role matches target audience
2. **API 401**: Check user is logged in and authenticated
3. **API 400**: Check required fields are provided
4. **Slow responses**: Check database indexes are created
5. **Cannot connect**: Check MongoDB URI in .env

---

## 🎯 Next Developer Onboarding

1. [ ] Read COMMUNICATIONS_SYSTEM_GUIDE.md (30 min)
2. [ ] Read COMMUNICATIONS_ARCHITECTURE_DIAGRAMS.md (20 min)
3. [ ] Review API route files (30 min)
4. [ ] Review UI component files (30 min)
5. [ ] Run system locally (15 min)
6. [ ] Follow COMMUNICATIONS_TEST_GUIDE.md (45 min)
7. [ ] Ask questions, get code review (varies)

**Total Onboarding Time**: ~3 hours

---

**Quick Reference Version**: 1.0
**Last Updated**: January 2024
**Tested**: Yes
**Status**: Production Ready

For detailed information, see the comprehensive guides listed above.
