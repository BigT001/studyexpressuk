const mongoose = require('mongoose');

const uri = "mongodb+srv://sta99175_db_user:AuSLHW9gDKvG5j3F@studyexpress.4wkhoge.mongodb.net/?appName=studyexpress&retryWrites=true&w=majority";

async function run() {
  try {
    await mongoose.connect(uri);
    console.log("Connected successfully");
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
