const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function testConnection() {
  try {
    console.log('🔗 Attempting to connect to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      retryWrites: true,
      w: 'majority',
    });
    
    console.log('✅ Database connected successfully!');
    console.log('📊 Connection status:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected');
    console.log('🗄️  Database name:', mongoose.connection.name);
    
    await mongoose.disconnect();
    console.log('✅ Disconnected successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
