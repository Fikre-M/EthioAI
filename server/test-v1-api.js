#!/usr/bin/env node

/**
 * Test Google AI using v1 API instead of v1beta
 */

const axios = require('axios');

const API_KEY = 'AIzaSyBe0O5wrwnHcrrqkJfSWs1wO4yT3gyvQ5k';

async function testV1API() {
  console.log('🧪 Testing Google AI v1 API...\n');
  
  // Try to list available models first
  try {
    console.log('📋 Listing available models...');
    const modelsResponse = await axios.get(
      `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`,
      { timeout: 10000 }
    );
    
    if (modelsResponse.data && modelsResponse.data.models) {
      console.log('✅ Available models:');
      modelsResponse.data.models.forEach(model => {
        console.log(`   - ${model.name} (${model.displayName || 'No display name'})`);
      });
      
      // Try the first available model
      const firstModel = modelsResponse.data.models[0];
      if (firstModel) {
        console.log(`\n🧪 Testing first model: ${firstModel.name}...`);
        
        const testResponse = await axios.post(
          `https://generativelanguage.googleapis.com/v1/${firstModel.name}:generateContent?key=${API_KEY}`,
          {
            contents: [{
              parts: [{
                text: "Hello, are you working?"
              }]
            }]
          },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000
          }
        );
        
        if (testResponse.data && testResponse.data.candidates) {
          const text = testResponse.data.candidates[0].content.parts[0].text;
          console.log('✅ SUCCESS! Model is working!');
          console.log(`   Response: ${text}`);
          console.log(`\n🎉 Use this model in your .env:`);
          console.log(`   GOOGLE_AI_MODEL=${firstModel.name.replace('models/', '')}`);
          return firstModel.name;
        }
      }
    }
  } catch (error) {
    console.log('❌ v1 API test failed:');
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${error.response.data?.error?.message || 'Unknown error'}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
  }
  
  return null;
}

testV1API().catch(console.error);