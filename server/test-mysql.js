const mysql = require('mysql2/promise');

async function testMySQLConnection() {
  console.log('🔍 Testing MySQL connection options...\n');

  const testConfigs = [
    { host: 'localhost', port: 3307, user: 'root', password: '' },
    { host: 'localhost', port: 3307, user: 'root', password: 'root' },
    { host: 'localhost', port: 3307, user: 'root', password: 'password' },
    { host: 'localhost', port: 3307, user: 'root', password: 'mysql' },
    { host: 'localhost', port: 3306, user: 'root', password: '' },
    { host: 'localhost', port: 3306, user: 'root', password: 'root' },
    { host: 'localhost', port: 3306, user: 'root', password: 'password' },
    { host: 'localhost', port: 3306, user: 'root', password: 'mysql' },
  ];

  for (const config of testConfigs) {
    try {
      console.log(`Testing: mysql://${config.user}:${config.password ? '***' : '(no password)'}@${config.host}:${config.port}`);
      
      const connection = await mysql.createConnection(config);
      await connection.execute('SELECT 1');
      await connection.end();
      
      console.log('✅ Connection successful!');
      console.log(`\n🎉 Use this connection string:`);
      console.log(`DATABASE_URL="mysql://${config.user}:${config.password}@${config.host}:${config.port}/ethioai_tourism"`);
      
      // Test if database exists
      try {
        const dbConnection = await mysql.createConnection({
          ...config,
          database: 'ethioai_tourism'
        });
        await dbConnection.execute('SELECT 1');
        await dbConnection.end();
        console.log('✅ Database "ethioai_tourism" exists');
      } catch (dbError) {
        console.log('⚠️ Database "ethioai_tourism" does not exist. Create it with:');
        console.log(`   CREATE DATABASE ethioai_tourism;`);
      }
      
      return;
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
    }
  }
  
  console.log('\n❌ No working MySQL connection found.');
  console.log('\n💡 Alternatives:');
  console.log('1. Check if MySQL/MariaDB is running');
  console.log('2. Check your MySQL credentials');
  console.log('3. Use SQLite for development (no server required)');
}

testMySQLConnection().catch(console.error);