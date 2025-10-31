import mongoose from 'mongoose';
import User from './models/User.js';

// 1. Replace this array with ALL your 72 roll numbers
const rollNumbers = [
  "24505a0510",
  "24505a0512",
  "23501a05A1",
  "21031CM036"
  // ...rest of your 72 roll numbers
];

async function seedUsers() {
  await mongoose.connect('mongodb://127.0.0.1:27017/assignmentsDB');
  for (const rollNo of rollNumbers) {
    const userid = rollNo;
    const password = rollNo.slice(0, 5);
    // Avoid duplicates
    const exists = await User.findOne({ userid });
    if (!exists) {
      await User.create({ userid, password });
      console.log(`Inserted: ${userid} / ${password}`);
    } else {
      console.log(`Already exists: ${userid}`);
    }
  }
  mongoose.connection.close();
}

seedUsers();
