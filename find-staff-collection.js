const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function findStaffCollection() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected\n');

    // List all collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('📦 All Collections in Database:\n');
    collections.forEach(col => {
      console.log('  -', col.name);
    });

    // Search for staff-related collections
    console.log('\n🔍 Staff-related collections:');
    const staffCollections = collections.filter(col => col.name.includes('staff'));
    
    if (staffCollections.length === 0) {
      console.log('  ❌ No staff collections found');
    } else {
      for (const col of staffCollections) {
        const collection = db.collection(col.name);
        const count = await collection.countDocuments();
        console.log(`  ${col.name}: ${count} documents`);
        
        if (count > 0) {
          const sample = await collection.findOne();
          console.log('    Sample:', JSON.stringify(sample, null, 2).substring(0, 200));
        }
      }
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

findStaffCollection();
