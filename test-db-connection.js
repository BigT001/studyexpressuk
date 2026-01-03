const mongoose = require('mongoose');

const mongoUri = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function testConnection() {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log(`URI: ${mongoUri.substring(0, 50)}...`);
    
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      minPoolSize: 1,
    });

    console.log('✅ Connected to MongoDB successfully!');
    console.log(`Database: ${mongoose.connection.name}`);
    console.log(`Host: ${mongoose.connection.host}`);
    console.log(`Port: ${mongoose.connection.port}`);
    
    // Get database info
    const adminDb = mongoose.connection.db.admin();
    const serverStatus = await adminDb.serverStatus();
    console.log(`\n📊 Server Status:`);
    console.log(`Version: ${serverStatus.version}`);
    console.log(`Uptime: ${serverStatus.uptime} seconds`);
    
    await mongoose.disconnect();
    console.log('\n✅ Connection test completed and closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

testConnection();
