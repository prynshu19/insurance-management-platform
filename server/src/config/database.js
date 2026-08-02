const prisma = require("../lib/prisma");

async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ Database Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
