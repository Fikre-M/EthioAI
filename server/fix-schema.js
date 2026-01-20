const fs = require('fs');
const path = require('path');

// Read the schema file
const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Replace MySQL-specific types with SQLite-compatible ones
const replacements = [
  // Remove all @db.Decimal specifications
  [/@db\.Decimal\(\d+,\s*\d+\)/g, ''],
  
  // Remove @db.Text
  [/@db\.Text/g, ''],
  
  // Remove @db.VarChar specifications
  [/@db\.VarChar\(\d+\)/g, ''],
  
  // Remove @db.LongText
  [/@db\.LongText/g, ''],
  
  // Clean up extra spaces
  [/\s+@db\.\w+(\(\d+(,\s*\d+)?\))?/g, ''],
];

// Apply all replacements
replacements.forEach(([pattern, replacement]) => {
  schema = schema.replace(pattern, replacement);
});

// Write the updated schema back
fs.writeFileSync(schemaPath, schema);

console.log('✅ Schema updated for SQLite compatibility');