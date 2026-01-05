const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress&retryWrites=true&w=majority";

async function testConnection() {
  console.log('🔍 Testing MongoDB connection...');
  console.log('URI:', MONGODB_URI.substring(0, 50) + '...');
  
  try {
    console.log('⏳ Attempting to connect (timeout: 30s)...');
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      retryWrites: true,
      w: 'majority',
      retryReads: true,
    });
    
    console.log('✅ Connection successful!');
    console.log('📊 Status:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected');
    console.log('🗄️  Database:', mongoose.connection.name);
    
    // Try a simple query
    try {
      const result = await mongoose.connection.db.admin().ping();
      console.log('✅ Ping successful:', result);
    } catch (pingErr) {
      console.error('❌ Ping failed:', pingErr.message);
    }
    
    await mongoose.disconnect();
    console.log('✅ Disconnected gracefully');
    
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('\n🔧 Troubleshooting steps:');
    console.log('1. Check if MongoDB Atlas cluster is running');
    console.log('2. Verify your IP is whitelisted in MongoDB Atlas Network Access');
    console.log('3. Check if credentials are correct');
    console.log('4. Try disabling VPN/Proxy if using one');
    process.exit(1);
  }
}

testConnection();
