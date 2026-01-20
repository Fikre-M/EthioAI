const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupDatabase() {
  console.log('🗄️  Setting up database...\n');

  try {
    // Test database connection
    console.log('1. Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Check if tables exist by trying to count users
    console.log('\n2. Checking database tables...');
    const userCount = await prisma.user.count();
    console.log(`✅ Database tables exist. Current user count: ${userCount}`);

    // Create a test user if none exist
    if (userCount === 0) {
      console.log('\n3. Creating initial test user...');
      const bcrypt = require('bcryptjs');
      
      const testUser = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          passwordHash: await bcrypt.hash('password123', 12),
          phone: '+251911234567',
          role: 'USER',
        },
      });
      
      console.log('✅ Test user created:', {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name
      });
      
      console.log('\n📝 You can now login with:');
      console.log('   Email: test@example.com');
      console.log('   Password: password123');
    } else {
      console.log('\n3. Database already has users, skipping test user creation');
    }

    console.log('\n🎉 Database setup complete!');

  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    
    if (error.code === 'P1001') {
      console.log('\n💡 Database connection failed. Please check:');
      console.log('   1. MySQL is running on port 3307');
      console.log('   2. Database "ethioai_tourism" exists');
      console.log('   3. Connection string in .env is correct');
      console.log('   4. Run: npx prisma migrate dev');
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupDatabase();