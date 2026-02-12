#!/usr/bin/env node

/**
 * Test different Google AI model names to find working free models
 */

const axios = require('axios');

const API_KEY = 'AIzaSyBe0O5wrwnHcrrqkJfSWs1wO4yT3gyvQ5k';

// Common free model names to try
const modelsToTry = [
  'gemini-pro',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'models/gemini-pro',
  'models/gemini-1.5-flash',
  'models/gemini-1.5-pro',
  'gemini-1.0-pro',
  'models/gemini-1.0-pro'
];

async function testModel(modelName) {
  try {
    console.log(`🧪 Testing: ${modelName}...`);
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
      {
        contents: [{
          parts: [{
            text: "Say 'Hello from " + modelName + "'"
          }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );

    if (response.data && response.data.candidates && response.data.candidates[0]) {
      const text = response.data.candidates[0].content.parts[0].text;
      console.log(`✅ ${modelName}: WORKS!`);
      console.log(`   Response: ${text}`);
      return { model: modelName, works: true, response: text };
    }
  } catch (error) {
    if (error.response) {
      console.log(`❌ ${modelName}: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`);
    } else {
      console.log(`❌ ${modelName}: ${error.message}`);
    }
    return { model: modelName, works: false, error: error.message };
  }
}

async function findWorkingModel() {
  console.log('🔍 Finding working FREE Google AI models...\n');
  
  const results = [];
  
  for (const model of modelsToTry) {
    const result = await testModel(model);
    results.push(result);
    
    if (result.works) {
      console.log(`\n🎉 FOUND WORKING MODEL: ${model}`);
      console.log('✅ Update your .env file:');
      console.log(`   GOOGLE_AI_MODEL=${model}`);
      break;
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  const workingModels = results.filter(r => r.works);
  
  if (workingModels.length === 0) {
    console.log('\n❌ No working models found. Possible issues:');
    console.log('   1. API key might not be activated yet (wait 5-10 minutes)');
    console.log('   2. Account might need verification');
    console.log('   3. Free tier might be exhausted');
    console.log('\n💡 Try again in a few minutes or check your Google AI Console');
  } else {
    console.log(`\n✅ Found ${workingModels.length} working model(s):`);
    workingModels.forEach(m => console.log(`   - ${m.model}`));
  }
}

findWorkingModel().catch(console.error);