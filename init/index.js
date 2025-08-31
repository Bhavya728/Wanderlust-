const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  
  // Create a demo user if it doesn't exist
  let demoUser;
  try {
    demoUser = await User.findOne({ username: "demo-user" });
    
    if (!demoUser) {
      const newUser = new User({
        email: "demo@example.com",
        username: "demo-user"
      });
      demoUser = await User.register(newUser, "password123");
      console.log("Demo user created");
    }
    
    // Use the demo user's ID for the listings
    initData.data = initData.data.map((obj) => ({
      ...obj, 
      owner: demoUser._id
    }));
    
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
  } catch (err) {
    console.log("Error during initialization:", err);
  } finally {
    mongoose.connection.close();
  }
};

initDB();