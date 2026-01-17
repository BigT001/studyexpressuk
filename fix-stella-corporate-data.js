const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress";

async function fix() {
  try {
    console.log('🔗 Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    
    const corporates = mongoose.connection.collection('corporateprofiles');
    const staff = mongoose.connection.collection('corporatestaff');
    const users = mongoose.connection.collection('users');

    // Get Stella's user
    const stella = await users.findOne({ email: 'stellajo@gmail.com' });
    console.log('Found Stella:', stella?.email);

    // Get corporate
    const corporate = await corporates.findOne({ companyName: 'Netcrest' });
    console.log('Found Corporate:', corporate?.companyName);

    // The 3 course IDs from Stella's enrollments
    const courseIds = [
      new mongoose.Types.ObjectId('695d81a3535cd73a0b065526'),
      new mongoose.Types.ObjectId('695d8aeb535cd73a0b065551'),
      new mongoose.Types.ObjectId('695de60f535cd73a0b06555a')
    ];

    if (stella && corporate) {
      // 1. Add registered courses to corporate
      console.log('\n📚 Adding registered courses to corporate...');
      await corporates.updateOne(
        { _id: corporate._id },
        { $set: { registeredCourses: courseIds } }
      );
      console.log('✅ Registered courses added:', courseIds.length);

      // 2. Create corporate staff entry for Stella
      console.log('\n👤 Creating corporate staff entry for Stella...');
      const existingStaff = await staff.findOne({
        corporateId: corporate._id,
        userId: stella._id
      });

      if (!existingStaff) {
        await staff.insertOne({
          userId: stella._id,
          corporateId: corporate._id,
          role: 'staff',
          department: 'Training',
          joinDate: new Date(),
          status: 'active',
          approvalStatus: 'approved',
          approvedBy: corporate.ownerId,
          approvalDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log('✅ Staff entry created for Stella');
      } else {
        console.log('ℹ️  Staff entry already exists for Stella');
      }

      console.log('\n✅ All fixes applied!\n');
    } else {
      console.log('❌ Could not find Stella or Corporate');
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    mongoose.connection.close();
  }
}

fix();
