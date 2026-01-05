#!/usr/bin/env node

const mongoose = require('mongoose');

// Load environment variables from .env
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI not defined in .env');
  process.exit(1);
}

console.log('Testing MongoDB connection...');
console.log(`Connection URI: ${MONGODB_URI.substring(0, 50)}...`);

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 60000,
    socketTimeoutMS: 60000,
    connectTimeoutMS: 60000,
    maxPoolSize: 10,
    minPoolSize: 2,
    retryWrites: true,
    w: 'majority',
  })
  .then(() => {
    console.log('✅ Successfully connected to MongoDB');
    console.log(`Connection State: ${mongoose.connection.readyState}`);
    console.log(`Database: ${mongoose.connection.name}`);
    console.log(`Host: ${mongoose.connection.host}`);
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('✅ Connection closed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  });

// Timeout after 90 seconds
setTimeout(() => {
  console.error('❌ Test timeout - no response from MongoDB');
  process.exit(1);
}, 90000);
