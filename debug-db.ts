
import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?retryWrites=true&w=majority&serverSelectionTimeoutMS=5000";

const SiteContentSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    title: { type: String, required: true },
}, { strict: false });

const SiteContent = mongoose.models.SiteContent || mongoose.model('SiteContent', SiteContentSchema);

async function debug() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');
        const count = await SiteContent.countDocuments({});
        console.log('Total documents:', count);
        const all = await SiteContent.find({}, { key: 1, title: 1 }).lean();
        console.log('--- SITE CONTENT KEYS ---');
        console.log(JSON.stringify(all, null, 2));

        const about = await SiteContent.findOne({ key: 'about-us' }).lean();
        if (about) {
            console.log('--- ABOUT US DETAIL ---');
            console.log(JSON.stringify(about, null, 2));
        } else {
            console.log('No about-us document found!');
        }
    } catch (e) {
        console.error('Debug error:', e);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

debug();
