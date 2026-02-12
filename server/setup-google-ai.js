#!/usr/bin/env node

/**
 * Google AI Setup Helper
 * Helps you get and test a valid Google AI API key
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

console.log('🤖 Google AI Setup Helper');
console.log('========================\n');

console.log('📋 Steps to get your FREE Google AI API key:');
console.log('1. Go to: https://makersuite.google.com/app/apikey');
console.log('2. Sign in with your Google account');
console.log('3. Click "Create API Key"');
console.log('4. Copy the generated API key');
console.log('5. Replace "your-google-ai-api-key-here" in your .env file\n');

console.log('🆓 FREE Models Available:');
console.log('- gemini-1.5-flash (recommended)');
console.log('- gemini-1.5-flash-latest');
console.log('- gemini-1.5-pro (limited free usage)');
console.log('- gemini-pro (older, may have restrictions)\n');

// Function to test API key
async function testApiKey(apiKey, model = 'gemini-1.5-flash') {
  try {
    console.log(`🧪 Testing API key with model: ${model}...`);
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        contents: [{
          parts: [{
            text: "Hello, can you respond with just 'API key is working!'?"
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.candidates && response.data.candidates[0]) {
      const text = response.data.candidates[0].content.parts[0].text;
      console.log('✅ API Key is WORKING!');
      console.log(`📝 Response: ${text}`);
      return true;
    } else {
      console.log('❌ Unexpected response format');
      return false;
    }
  } catch (error) {
    console.log('❌ API Key test failed:');
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${error.response.data?.error?.message || 'Unknown error'}`);
      
      if (error.response.status === 400) {
        console.log('💡 Try a different model name (gemini-1.5-flash, gemini-pro, etc.)');
      } else if (error.response.status === 403) {
        console.log('💡 API key may be invalid or doesn\'t have access to this model');
      } else if (error.response.status === 429) {
        console.log('💡 Rate limit exceeded - try again in a few minutes');
      }
    } else {
      console.log(`   Error: ${error.message}`);
    }
    return false;
  }
}

// Function to update .env file
function updateEnvFile(apiKey, model) {
  const envPath = path.join(__dirname, '.env');
  
  try {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update API key
    envContent = envContent.replace(
      /GOOGLE_AI_API_KEY=.*/,
      `GOOGLE_AI_API_KEY=${apiKey}`
    );
    
    // Update model
    envContent = envContent.replace(
      /GOOGLE_AI_MODEL=.*/,
      `GOOGLE_AI_MODEL=${model}`
    );
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated successfully!');
    return true;
  } catch (error) {
    console.log('❌ Failed to update .env file:', error.message);
    return false;
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('💡 Usage Examples:');
    console.log('   node setup-google-ai.js test YOUR_API_KEY');
    console.log('   node setup-google-ai.js test YOUR_API_KEY gemini-1.5-flash');
    console.log('   node setup-google-ai.js update YOUR_API_KEY gemini-1.5-flash');
    console.log('\n🔧 Manual Setup:');
    console.log('   1. Get your API key from: https://makersuite.google.com/app/apikey');
    console.log('   2. Edit server/.env file');
    console.log('   3. Replace: GOOGLE_AI_API_KEY=your-google-ai-api-key-here');
    console.log('   4. Restart your server: npm run dev');
    return;
  }
  
  const [command, apiKey, model = 'gemini-1.5-flash'] = args;
  
  if (command === 'test' && apiKey) {
    const success = await testApiKey(apiKey, model);
    if (success) {
      console.log('\n🎉 Your API key is working! You can now:');
      console.log(`   1. Update your .env: GOOGLE_AI_API_KEY=${apiKey}`);
      console.log(`   2. Update your model: GOOGLE_AI_MODEL=${model}`);
      console.log('   3. Restart your server: npm run dev');
    }
  } else if (command === 'update' && apiKey) {
    const testSuccess = await testApiKey(apiKey, model);
    if (testSuccess) {
      const updateSuccess = updateEnvFile(apiKey, model);
      if (updateSuccess) {
        console.log('\n🎉 Setup complete! Restart your server with: npm run dev');
      }
    }
  } else {
    console.log('❌ Invalid command. Use: test or update');
  }
}

main().catch(console.error);