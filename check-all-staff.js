const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function checkAllStaff() {
  try {
    console.log('🔗 Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    
    const corporates = mongoose.connection.collection('corporateprofiles');
    const corporate = await corporates.findOne({ companyName: 'Netcrest' });
    
    console.log('=== ALL STAFF MEMBERS ===\n');

    // Check all staff in the system
    const allStaff = await mongoose.connection.collection('corporatestaff').find({}).toArray();
    console.log(`Total corporate staff in system: ${allStaff.length}`);
    
    for (const s of allStaff) {
      const user = await mongoose.connection.collection('users').findOne({ _id: s.userId });
      const corp = await mongoose.connection.collection('corporateprofiles').findOne({ _id: s.corporateId });
      console.log(`- ${user?.email || 'Unknown'} (Corporate: ${corp?.companyName || 'Unknown'})`);
    }

    console.log(`\n=== STAFF UNDER NETCREST ===\n`);
    const netcrestStaff = await mongoose.connection.collection('corporatestaff')
      .find({ corporateId: corporate._id })
      .toArray();
    
    console.log(`Staff count: ${netcrestStaff.length}`);
    for (const s of netcrestStaff) {
      const user = await mongoose.connection.collection('users').findOne({ _id: s.userId });
      console.log(`- ${user?.email || 'Unknown'}`);
    }

    // Check if biggy@gmail.com exists as a user
    console.log(`\n=== CHECKING BIGGY USER ===\n`);
    const biggyUser = await mongoose.connection.collection('users').findOne({ email: 'biggy@gmail.com' });
    console.log('Biggy user found:', !!biggyUser);
    if (biggyUser) {
      console.log('  ID:', biggyUser._id);
      console.log('  Email:', biggyUser.email);
      const isBiggyStaff = await mongoose.connection.collection('corporatestaff').findOne({ userId: biggyUser._id });
      console.log('  Is corporate staff:', !!isBiggyStaff);
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    mongoose.connection.close();
  }
}

checkAllStaff();
