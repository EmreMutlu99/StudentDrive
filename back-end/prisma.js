// back-end/prisma.js
const { PrismaClient } = require('./src/generated/prisma');  // <-- not @prisma/client
const prisma = new PrismaClient();

module.exports = { prisma };
