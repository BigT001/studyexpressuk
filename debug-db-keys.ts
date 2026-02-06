
import mongoose from 'mongoose';
const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?retryWrites=true&w=majority&serverSelectionTimeoutMS=5000";

async function debug() {
    try {
        await mongoose.connect(MONGODB_URI);
        const docs = await mongoose.connection.db.collection('sitecontents').find({}).toArray();
        console.log('ALL KEYS IN DB:');
        docs.forEach(d => console.log(`- ${d.key} (${d.title})`));

        const about = docs.find(d => d.key === 'about-us');
        if (about) {
            console.log('Fields in about-us:', Object.keys(about).join(', '));
            console.log('About tagline:', about.tagline || 'MISSING');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}
debug();
