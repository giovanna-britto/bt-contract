const { testConnection, prisma } = require('../lib/prisma');

async function main() {
  const isConnected = await testConnection();
  
  if (isConnected) {
    // Try to count some records to verify deeper access
    // Replace 'User' with an actual model from your schema
    try {
      const count = await prisma.user.count();
      console.log(`Database connected and working. User count: ${count}`);
    } catch (err) {
      console.log('Connected but error querying model:', err);
    }
  }
  
  // Close the Prisma client
  await prisma.$disconnect();
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
