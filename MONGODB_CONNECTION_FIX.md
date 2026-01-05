# MongoDB Connection Timeout - Root Cause & Resolution

## Issue Summary
The MongoDB connection was timing out with a 30-second timeout error when trying to access the admin dashboard.

## Root Cause
The actual issue is **IP Whitelisting** in MongoDB Atlas:
```
Could not connect to any servers in your MongoDB Atlas cluster. 
One common reason is that you're trying to access the database from an IP that isn't whitelisted.
```

The 30-second timeout was masking the real network connectivity issue.

## Solutions Applied

### 1. **Increased Connection Timeout** ✅
- **Before**: 30 seconds
- **After**: 60 seconds
- **File**: `src/server/db/mongoose.ts`

**Why**: MongoDB Atlas can take longer than 30 seconds to establish initial connections, especially on slower networks or from certain regions.

### 2. **Added Connection Pooling** ✅
```typescript
maxPoolSize: 10,
minPoolSize: 2,
retryWrites: true,
w: 'majority',
```
- **maxPoolSize: 10**: Allows up to 10 concurrent connections
- **minPoolSize: 2**: Keeps 2 connections warm
- **retryWrites**: Automatic retry on transient failures
- **w: 'majority'**: Ensures data consistency

### 3. **Increased Query Timeouts** ✅
- **Before**: 5 seconds per query
- **After**: 15 seconds per query
- **File**: `app/(dashboard)/admin/page.tsx`

### 4. **Improved Connection Caching** ✅
- Added connection state caching to prevent multiple connection attempts
- Better error handling and logging

## How to Fix the IP Whitelisting Issue

### Option 1: Allow All IPs (NOT RECOMMENDED for production)
1. Go to MongoDB Atlas Dashboard
2. Navigate to **Network Access** → **IP Whitelist**
3. Click **Add IP Address**
4. Enter `0.0.0.0/0` to allow all IPs
5. Click **Confirm**

⚠️ **Security Risk**: This opens your database to anyone on the internet

### Option 2: Whitelist Current IP (RECOMMENDED)
1. Find your current public IP address: https://whatismyipaddress.com/
2. Go to MongoDB Atlas Dashboard
3. Navigate to **Network Access** → **IP Whitelist**
4. Click **Add IP Address**
5. Enter your current IP address
6. Click **Confirm**

### Option 3: Use Network Access Manager (BEST for Teams)
1. In MongoDB Atlas, go to **Network Access** → **IP Whitelist**
2. Create separate entries for:
   - Development machine IPs
   - Production server IPs
   - CI/CD pipeline IPs (GitHub Actions, etc.)

### Option 4: Use MongoDB Atlas VPC Peering (Enterprise)
For production deployments with high security requirements.

## Verification

Run the test script to verify connectivity:
```bash
node test-mongo-connection.js
```

Expected output when properly whitelisted:
```
Testing MongoDB connection...
Connection URI: mongodb+srv://sta99175_db_user:...
✅ Successfully connected to MongoDB
Connection State: 1
Database: studyexpress
Host: studyexpress.4wkhoge.mongodb.net
✅ Connection closed successfully
```

## Files Modified
1. `src/server/db/mongoose.ts` - Enhanced connection handling and timeouts
2. `app/(dashboard)/admin/page.tsx` - Increased query timeouts
3. `test-mongo-connection.js` - Created test script for diagnosis

## Next Steps
1. **Immediate**: Whitelist your IP address in MongoDB Atlas (Option 2 above)
2. **Testing**: Run `node test-mongo-connection.js` to verify connection
3. **Development**: Restart your Next.js dev server with `pnpm dev`
4. **Production**: Implement automated IP whitelisting or use VPC peering

## Environment Variables (for reference)
```
MONGODB_URI="mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress"
```

## Connection Timeout Breakdown
- **Mongoose Connection Timeout**: 60 seconds (was 30)
- **Server Selection Timeout**: 60 seconds (was 30)
- **Socket Timeout**: 60 seconds (was 30)
- **Query Timeout**: 15 seconds per operation (was 5)

These are generous timeouts suitable for development. For production, you may want to reduce them once the IP whitelisting is properly configured.

## Support
If you continue experiencing issues after whitelisting:
1. Verify the IP address is correct
2. Check MongoDB Atlas logs for connection errors
3. Ensure your MONGODB_URI has the correct credentials
4. Try connecting from a different network to isolate ISP issues
