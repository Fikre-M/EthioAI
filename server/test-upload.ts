import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_BASE_URL = 'http://localhost:5000/api';

// Test user credentials
const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

let authToken = '';

/**
 * Test the file upload system
 */
async function testUploadSystem() {
  console.log('🧪 Testing File Upload System...\n');

  try {
    // 1. Login to get auth token
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, testUser);
    authToken = loginResponse.data.data.accessToken;
    console.log('✅ Login successful\n');

    // 2. Test single file upload
    await testSingleFileUpload();

    // 3. Test multiple file upload
    await testMultipleFileUpload();

    // 4. Test profile image upload
    await testProfileImageUpload();

    // 5. Test file deletion
    await testFileDelete();

    // 6. Test optimized URL generation
    await testOptimizedUrl();

    console.log('🎉 File upload system test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

/**
 * Test single file upload
 */
async function testSingleFileUpload() {
  console.log('2. Testing single file upload...');
  
  try {
    // Create a test image file (1x1 pixel PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x5C, 0xC2, 0x5D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    const formData = new FormData();
    formData.append('file', testImageBuffer, {
      filename: 'test-image.png',
      contentType: 'image/png'
    });
    formData.append('type', 'general');
    formData.append('tags', 'test,upload');

    const response = await axios.post(`${API_BASE_URL}/upload/single`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('✅ Single file uploaded successfully');
    console.log(`   URL: ${response.data.data.url}`);
    console.log(`   Public ID: ${response.data.data.publicId}`);
    console.log(`   Size: ${response.data.data.size} bytes`);
    console.log(`   Format: ${response.data.data.format}\n`);

    return response.data.data.publicId;

  } catch (error) {
    console.error('❌ Single file upload failed:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Test multiple file upload
 */
async function testMultipleFileUpload() {
  console.log('3. Testing multiple file upload...');
  
  try {
    // Create test image buffers
    const testImageBuffer1 = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x5C, 0xC2, 0x5D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    const testImageBuffer2 = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x02,
      0x08, 0x02, 0x00, 0x00, 0x00, 0xFD, 0xD5, 0x9A, 0x7A, 0x00, 0x00, 0x00,
      0x12, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x0F, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB4, 0x1C, 0x00, 0x00, 0x00, 0x00,
      0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    const formData = new FormData();
    formData.append('files', testImageBuffer1, {
      filename: 'test-image-1.png',
      contentType: 'image/png'
    });
    formData.append('files', testImageBuffer2, {
      filename: 'test-image-2.png',
      contentType: 'image/png'
    });
    formData.append('type', 'product');
    formData.append('tags', 'test,multiple,upload');

    const response = await axios.post(`${API_BASE_URL}/upload/multiple`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('✅ Multiple files uploaded successfully');
    console.log(`   Files uploaded: ${response.data.data.length}`);
    response.data.data.forEach((file: any, index: number) => {
      console.log(`   File ${index + 1}: ${file.url}`);
      console.log(`   Public ID: ${file.publicId}`);
    });
    console.log('');

    return response.data.data.map((file: any) => file.publicId);

  } catch (error) {
    console.error('❌ Multiple file upload failed:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Test profile image upload
 */
async function testProfileImageUpload() {
  console.log('4. Testing profile image upload...');
  
  try {
    // Create a test profile image
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x5C, 0xC2, 0x5D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    const formData = new FormData();
    formData.append('profileImage', testImageBuffer, {
      filename: 'profile.png',
      contentType: 'image/png'
    });

    const response = await axios.post(`${API_BASE_URL}/upload/profile`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('✅ Profile image uploaded successfully');
    console.log(`   URL: ${response.data.data.url}`);
    console.log(`   Thumbnail URL: ${response.data.data.thumbnailUrl}`);
    console.log(`   Public ID: ${response.data.data.publicId}\n`);

    return response.data.data.publicId;

  } catch (error) {
    console.error('❌ Profile image upload failed:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Test file deletion
 */
async function testFileDelete() {
  console.log('5. Testing file deletion...');
  
  try {
    // First upload a file to delete
    const publicId = await testSingleFileUpload();

    // Then delete it
    const response = await axios.delete(`${API_BASE_URL}/upload/${publicId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        resourceType: 'image'
      }
    });

    console.log('✅ File deleted successfully');
    console.log(`   Deleted public ID: ${publicId}\n`);

  } catch (error) {
    console.error('❌ File deletion failed:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Test optimized URL generation
 */
async function testOptimizedUrl() {
  console.log('6. Testing optimized URL generation...');
  
  try {
    // First upload a file
    const publicId = await testSingleFileUpload();

    // Generate optimized URL
    const response = await axios.get(`${API_BASE_URL}/upload/optimize/${publicId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      params: {
        width: 300,
        height: 200,
        quality: 'auto:good',
        format: 'webp'
      }
    });

    console.log('✅ Optimized URL generated successfully');
    console.log(`   Original Public ID: ${response.data.data.originalPublicId}`);
    console.log(`   Optimized URL: ${response.data.data.optimizedUrl}`);
    console.log(`   Transformations: ${JSON.stringify(response.data.data.transformations)}\n`);

  } catch (error) {
    console.error('❌ Optimized URL generation failed:', error.response?.data || error.message);
    throw error;
  }
}

// Run the test
if (require.main === module) {
  testUploadSystem();
}

export { testUploadSystem };