import { connectToDatabase } from '../src/server/db/mongoose';
import EventModel from '../src/server/db/models/event.model';

async function migrateFormat() {
  try {
    await connectToDatabase();
    console.log('Connected to database');

    // Find all events that don't have format field or have undefined format
    const result = await EventModel.updateMany(
      { $or: [{ format: { $exists: false } }, { format: null }, { format: undefined }] },
      { $unset: { format: "" } } // Remove the format field from events that don't have it
    );

    console.log('Migration complete:');
    console.log(`Updated ${result.modifiedCount} documents`);
    console.log(`Matched ${result.matchedCount} documents`);

    // Verify by fetching a sample
    const sampleEvents = await EventModel.find().limit(5).lean();
    console.log('\nSample events after migration:');
    sampleEvents.forEach(event => {
      console.log(`- ${event.title}: format = ${event.format || 'undefined'}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateFormat();
