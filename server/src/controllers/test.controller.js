const prisma = require("../lib/prisma");

async function testConnection(req, res) {
  const users = await prisma.user.findMany();

  res.json({
    success: true,
    data: users,
  });
}

module.exports = {
  testConnection,
};