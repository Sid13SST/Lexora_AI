const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanData() {
  try {
    const deleted = await prisma.document.deleteMany({
      where: {
        OR: [
          { filename: { contains: 'test' } },
          { title: { contains: 'test' } }
        ]
      }
    });
    console.log(`Successfully deleted ${deleted.count} test documents.`);
  } catch (error) {
    console.error('Error cleaning documents:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanData();
