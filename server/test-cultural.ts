import axios from 'axios';
import { config } from './src/config';

const API_BASE_URL = `http://localhost:${config.port}`;

// Test data
const testUser = {
  email: 'culturaltest@example.com',
  password: 'testpassword123',
  name: 'Cultural Test User',
};

let authToken = '';
let testContentId = '';

/**
 * Test Cultural Content System Implementation
 * Tests all cultural content endpoints and functionality
 */
async function testCulturalSystem() {
  console.log('🧪 Testing Cultural Content System Implementation...\n');

  try {
    // Step 1: Register/Login test user
    await setupTestUser();

    // Step 2: Test content overview
    await testContentOverview();

    // Step 3: Test content creation
    await testContentCreation();

    // Step 4: Test content retrieval and filtering
    await testContentRetrieval();

    // Step 5: Test content search
    await testContentSearch();

    // Step 6: Test content recommendations
    await testContentRecommendations();

    // Step 7: Test content interactions
    await testContentInteractions();

    // Step 8: Test content management
    await testContentManagement();

    // Step 9: Test categories and tags
    await testCategoriesAndTags();

    // Step 10: Test multilingual content
    await testMultilingualContent();

    // Step 11: Test admin features
    await testAdminFeatures();

    console.log('✅ All cultural content system tests passed!\n');
    console.log('🎉 Cultural Content API (Step 10) completed successfully!');

  } catch (error: any) {
    console.error('❌ Cultural content system test failed:', error.message);
    if (error.response?.data) {
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

/**
 * Setup test user for authentication
 */
async function setupTestUser() {
  console.log('👤 Setting up test user...');

  try {
    // Try to register user
    await axios.post(`${API_BASE_URL}/api/auth/register`, testUser);
    console.log('✅ Test user registered');
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log('ℹ️ Test user already exists');
    } else {
      throw error;
    }
  }

  // Login to get token
  const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
    email: testUser.email,
    password: testUser.password,
  });

  authToken = loginResponse.data.data.accessToken;
  console.log('✅ Test user logged in\n');
}

/**
 * Test content overview endpoint
 */
async function testContentOverview() {
  console.log('📊 Testing content overview...');

  const response = await axios.get(`${API_BASE_URL}/api/cultural/overview`);
  
  console.log('Overview sections:', Object.keys(response.data.data));
  console.log('Featured content count:', response.data.data.featured?.length || 0);
  console.log('Recent content count:', response.data.data.recent?.length || 0);
  console.log('Popular content count:', response.data.data.popular?.length || 0);
  console.log('Categories count:', response.data.data.categories?.length || 0);
  console.log('Total content:', response.data.data.stats?.totalContent || 0);
  
  console.log('✅ Content overview test passed\n');
}

/**
 * Test content creation
 */
async function testContentCreation() {
  console.log('📝 Testing content creation...');

  // Test article creation
  const articleData = {
    title: 'The Rich History of Ethiopian Coffee',
    content: `Ethiopia is widely considered the birthplace of coffee. Legend has it that a goat herder named Kaldi discovered coffee when he noticed his goats becoming energetic after eating certain berries.

The coffee ceremony is an integral part of Ethiopian culture, representing hospitality and community. The process involves roasting green coffee beans, grinding them by hand, and brewing them in a traditional clay pot called a jebena.

Ethiopian coffee is known for its complex flavors and aromatic qualities. The country produces some of the world's finest coffee beans, including varieties from regions like Sidamo, Yirgacheffe, and Harrar.`,
    excerpt: 'Discover the fascinating history and cultural significance of Ethiopian coffee, from its legendary origins to modern-day traditions.',
    type: 'article',
    category: 'Food & Drink',
    tags: ['coffee', 'history', 'culture', 'tradition', 'ceremony'],
    language: 'en',
    featured: true,
    metaTitle: 'Ethiopian Coffee History and Culture',
    metaDescription: 'Learn about the rich history and cultural significance of Ethiopian coffee, from ancient legends to modern traditions.',
    authorName: 'Cultural Test User',
  };

  const articleResponse = await axios.post(
    `${API_BASE_URL}/api/cultural/content`,
    articleData,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );

  testContentId = articleResponse.data.data.content.id;
  console.log('Article created:', articleResponse.data.data.content.title);
  console.log('Article ID:', testContentId);

  // Test recipe creation
  const recipeData = {
    title: 'Traditional Ethiopian Injera Recipe',
    content: `Injera is the staple bread of Ethiopia, made from teff flour. This spongy, sourdough flatbread serves as both plate and utensil in Ethiopian cuisine.

Ingredients:
- 4 cups teff flour
- 4-5 cups water
- 1/2 cup starter (optional)

Instructions:
1. Mix teff flour with water to create a smooth batter
2. Let it ferment for 2-3 days at room temperature
3. Cook on a mitad (clay plate) or non-stick pan
4. Cover and steam until bubbles form on surface
5. Remove and let cool

Injera has a unique tangy flavor and spongy texture that perfectly complements Ethiopian stews and vegetables.`,
    excerpt: 'Learn how to make traditional Ethiopian injera bread from teff flour with this authentic recipe.',
    type: 'recipe',
    category: 'Food & Drink',
    tags: ['injera', 'recipe', 'teff', 'bread', 'traditional', 'cooking'],
    language: 'en',
    authorName: 'Cultural Test User',
  };

  const recipeResponse = await axios.post(
    `${API_BASE_URL}/api/cultural/content`,
    recipeData,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );

  console.log('Recipe created:', recipeResponse.data.data.content.title);

  // Test tradition creation
  const traditionData = {
    title: 'The Ethiopian Coffee Ceremony',
    content: `The Ethiopian coffee ceremony is a traditional ritual that brings people together to share coffee and conversation. It is an important social and cultural practice that can take several hours.

The ceremony involves three main stages:

1. Abol (First Round): The hostess washes green coffee beans and roasts them over an open flame. The aromatic smoke is wafted toward guests as a blessing.

2. Tona (Second Round): The roasted beans are ground by hand using a mortar and pestle, then brewed in a clay pot called a jebena.

3. Baraka (Third Round): The final round is considered the most important, as it is believed to bestow blessings upon the participants.

Throughout the ceremony, frankincense is burned to create a spiritual atmosphere. The coffee is served in small cups called cini, often accompanied by popcorn or roasted barley.

This ceremony represents hospitality, community, and respect for tradition. It is performed daily in many Ethiopian households and is an essential part of social gatherings.`,
    excerpt: 'Explore the sacred Ethiopian coffee ceremony, a traditional ritual that brings communities together through the sharing of coffee.',
    type: 'tradition',
    category: 'Rituals & Ceremonies',
    tags: ['coffee ceremony', 'tradition', 'ritual', 'community', 'hospitality', 'culture'],
    language: 'en',
    authorName: 'Cultural Test User',
  };

  const traditionResponse = await axios.post(
    `${API_BASE_URL}/api/cultural/content`,
    traditionData,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );

  console.log('Tradition created:', traditionResponse.data.data.content.title);
  console.log('✅ Content creation test passed\n');
}

/**
 * Test content retrieval and filtering
 */
async function testContentRetrieval() {
  console.log('📋 Testing content retrieval...');

  // Test getting all content
  const allContentResponse = await axios.get(`${API_BASE_URL}/api/cultural/content`);
  console.log('Total content items:', allContentResponse.data.pagination.total);

  // Test getting specific content
  if (testContentId) {
    const specificContentResponse = await axios.get(`${API_BASE_URL}/api/cultural/content/${testContentId}`);
    console.log('Specific content retrieved:', specificContentResponse.data.data.content.title);
  }

  // Test filtering by type
  const articlesResponse = await axios.get(`${API_BASE_URL}/api/cultural/content?type=article`);
  console.log('Articles found:', articlesResponse.data.data.length);

  const recipesResponse = await axios.get(`${API_BASE_URL}/api/cultural/content?type=recipe`);
  console.log('Recipes found:', recipesResponse.data.data.length);

  // Test filtering by category
  const foodContentResponse = await axios.get(`${API_BASE_URL}/api/cultural/content?category=Food`);
  console.log('Food & Drink content found:', foodContentResponse.data.data.length);

  // Test featured content
  const featuredResponse = await axios.get(`${API_BASE_URL}/api/cultural/featured`);
  console.log('Featured content:', featuredResponse.data.data.content.length);

  // Test recent content
  const recentResponse = await axios.get(`${API_BASE_URL}/api/cultural/recent`);
  console.log('Recent content:', recentResponse.data.data.content.length);

  console.log('✅ Content retrieval test passed\n');
}

/**
 * Test content search functionality
 */
async function testContentSearch() {
  console.log('🔍 Testing content search...');

  // Test basic search
  const searchResponse = await axios.get(`${API_BASE_URL}/api/cultural/search?q=coffee`);
  console.log('Coffee search results:', searchResponse.data.data.content.length);

  // Test search with filters
  const filteredSearchResponse = await axios.get(
    `${API_BASE_URL}/api/cultural/search?q=Ethiopian&type=article&limit=5`
  );
  console.log('Filtered search results:', filteredSearchResponse.data.data.content.length);

  // Test advanced search
  const advancedSearchData = {
    search: 'tradition',
    type: 'tradition',
    language: 'en',
    limit: 10,
  };

  const advancedSearchResponse = await axios.post(
    `${API_BASE_URL}/api/cultural/advanced-search`,
    advancedSearchData
  );
  console.log('Advanced search results:', advancedSearchResponse.data.data.length);

  console.log('✅ Content search test passed\n');
}

/**
 * Test content recommendations
 */
async function testContentRecommendations() {
  console.log('💡 Testing content recommendations...');

  // Test basic recommendations
  const basicRecommendations = await axios.post(`${API_BASE_URL}/api/cultural/recommendations`, {
    interests: ['coffee', 'culture', 'tradition'],
    language: 'en',
    limit: 5,
  });

  console.log('Basic recommendations:', basicRecommendations.data.data.content.length);

  // Test content-based recommendations
  if (testContentId) {
    const contentBasedRecommendations = await axios.post(`${API_BASE_URL}/api/cultural/recommendations`, {
      contentId: testContentId,
      limit: 3,
    });

    console.log('Content-based recommendations:', contentBasedRecommendations.data.data.content.length);
  }

  // Test type-specific recommendations
  const typeRecommendations = await axios.post(`${API_BASE_URL}/api/cultural/recommendations`, {
    type: 'recipe',
    interests: ['cooking', 'food'],
    limit: 4,
  });

  console.log('Recipe recommendations:', typeRecommendations.data.data.content.length);

  console.log('✅ Content recommendations test passed\n');
}

/**
 * Test content interactions
 */
async function testContentInteractions() {
  console.log('👆 Testing content interactions...');

  if (!testContentId) {
    console.log('⚠️ Skipping interactions test - no test content ID');
    return;
  }

  // Test view interaction
  await axios.post(
    `${API_BASE_URL}/api/cultural/content/${testContentId}/interact`,
    {
      interactionType: 'view',
      metadata: { source: 'test', timestamp: new Date().toISOString() },
    },
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );

  console.log('✅ View interaction tracked');

  // Test like interaction
  await axios.post(
    `${API_BASE_URL}/api/cultural/content/${testContentId}/interact`,
    {
      interactionType: 'like',
      metadata: { rating: 5 },
    },
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );

  console.log('✅ Like interaction tracked');

  // Test share interaction
  await axios.post(
    `${API_BASE_URL}/api/cultural/content/${testContentId}/interact`,
    {
      interactionType: 'share',
      metadata: { platform: 'test', url: 'https://example.com' },
    },
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );

  console.log('✅ Share interaction tracked');

  // Test bookmark interaction
  await axios.post(
    `${API_BASE_URL}/api/cultural/content/${testContentId}/interact`,
    {
      interactionType: 'bookmark',
    },
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );

  console.log('✅ Bookmark interaction tracked');
  console.log('✅ Content interactions test passed\n');
}

/**
 * Test content management
 */
async function testContentManagement() {
  console.log('⚙️ Testing content management...');

  if (!testContentId) {
    console.log('⚠️ Skipping management test - no test content ID');
    return;
  }

  // Test content update
  const updateData = {
    excerpt: 'Updated excerpt: Discover the fascinating history and cultural significance of Ethiopian coffee.',
    tags: ['coffee', 'history', 'culture', 'tradition', 'ceremony', 'updated'],
  };

  const updateResponse = await axios.put(
    `${API_BASE_URL}/api/cultural/content/${testContentId}`,
    updateData,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );

  console.log('Content updated:', updateResponse.data.data.content.title);
  console.log('Updated tags count:', updateResponse.data.data.content.tags.length);

  // Test status update
  const statusUpdateResponse = await axios.patch(
    `${API_BASE_URL}/api/cultural/content/${testContentId}/status`,
    {
      status: 'PUBLISHED',
      reason: 'Content review completed',
    },
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );

  console.log('Status updated to:', statusUpdateResponse.data.data.content.status);

  console.log('✅ Content management test passed\n');
}

/**
 * Test categories and tags
 */
async function testCategoriesAndTags() {
  console.log('🏷️ Testing categories and tags...');

  // Test categories
  const categoriesResponse = await axios.get(`${API_BASE_URL}/api/cultural/categories`);
  console.log('Categories found:', categoriesResponse.data.data.categories.length);
  if (categoriesResponse.data.data.categories.length > 0) {
    console.log('Sample category:', categoriesResponse.data.data.categories[0]);
  }

  // Test content types
  const typesResponse = await axios.get(`${API_BASE_URL}/api/cultural/types`);
  console.log('Content types:', typesResponse.data.data.types.length);
  if (typesResponse.data.data.types.length > 0) {
    console.log('Sample type:', typesResponse.data.data.types[0]);
  }

  // Test popular tags
  const tagsResponse = await axios.get(`${API_BASE_URL}/api/cultural/tags?limit=10`);
  console.log('Popular tags:', tagsResponse.data.data.tags.length);
  if (tagsResponse.data.data.tags.length > 0) {
    console.log('Sample tag:', tagsResponse.data.data.tags[0]);
  }

  // Test content by type
  const articlesByTypeResponse = await axios.get(`${API_BASE_URL}/api/cultural/type/article`);
  console.log('Articles by type:', articlesByTypeResponse.data.data.content.length);

  console.log('✅ Categories and tags test passed\n');
}

/**
 * Test multilingual content
 */
async function testMultilingualContent() {
  console.log('🌍 Testing multilingual content...');

  // Test Amharic content creation
  const amharicContentData = {
    title: 'የኢትዮጵያ ቡና ሥነ ሥርዓት',
    content: `የኢትዮጵያ ቡና ሥነ ሥርዓት ባህላዊ ሥርዓት ሲሆን ሰዎችን አንድ ላይ በማሰባሰብ ቡና እና ውይይት እንዲካፈሉ ያደርጋል። ይህ አስፈላጊ ማህበራዊ እና ባህላዊ ልምምድ ብዙ ሰዓታት ሊወስድ ይችላል።

ሥነ ሥርዓቱ ሦስት ዋና ዋና ደረጃዎች አሉት፦

1. አቦል (የመጀመሪያ ዙር)፦ አስተናጋጁ አረንጓዴ የቡና ፍሬዎችን በማጠብ በክፍት እሳት ላይ ያጠብሳል።

2. ቶና (ሁለተኛ ዙ)፦ የተጠበሰው ቡና በእጅ በመፍጨት በጀበና ውስጥ ይቀቅላል።

3. ባረካ (ሦስተኛ ዙር)፦ የመጨረሻው ዙር በጣም አስፈላጊ ተብሎ ይታሰባል።

በሥነ ሥርዓቱ ወቅት እጣን ይቃጠላል። ቡናው በሲኒ የሚባሉ ትናንሽ ኩባያዎች ውስጥ ይቀርባል።`,
    excerpt: 'የኢትዮጵያ ቡና ሥነ ሥርዓት ባህላዊ ሥርዓት ነው።',
    type: 'tradition',
    category: 'ሥነ ሥርዓቶች',
    tags: ['ቡና', 'ሥነ ሥርዓት', 'ባህል', 'ወግ'],
    language: 'am',
    authorName: 'Cultural Test User',
  };

  const amharicResponse = await axios.post(
    `${API_BASE_URL}/api/cultural/content`,
    amharicContentData,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );

  console.log('Amharic content created:', amharicResponse.data.data.content.title);

  // Test Oromo content creation
  const oromoContentData = {
    title: 'Aadaa Bunaa Itoophiyaa',
    content: `Aadaan bunaa Itoophiyaa aadaa haaraa kan namoota walitti fiduudha. Kun gocha hawaasummaa fi aadaa barbaachisaa ta'ee sa'aatota hedduu fudhachuu danda'a.

Aadaan kun sadarkaa gurguddoo sadii qaba:

1. Abol (Marsaa Jalqabaa): Namni keessummeessitu buna magariisa dhiqee ibidda banaa irratti gubata.

2. Tona (Marsaa Lammaffaa): Buni gubate harkaan daakamee jabanaa keessatti affeelama.

3. Baraka (Marsaa Sadaffaa): Marsaan dhumaa baay'ee barbaachisaa ta'ee yaadama.

Yeroo aadaa kanaa ixaanni gubama. Buni xoofoo xiqqaa siinii jedhaman keessatti dhiyaata.`,
    excerpt: 'Aadaan bunaa Itoophiyaa aadaa haaraa kan namoota walitti fiduudha.',
    type: 'tradition',
    category: 'Aadaa fi Duudhaa',
    tags: ['bunaa', 'aadaa', 'duudhaa', 'Itoophiyaa'],
    language: 'om',
    authorName: 'Cultural Test User',
  };

  const oromoResponse = await axios.post(
    `${API_BASE_URL}/api/cultural/content`,
    oromoContentData,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );

  console.log('Oromo content created:', oromoResponse.data.data.content.title);

  // Test filtering by language
  const amharicContentResponse = await axios.get(`${API_BASE_URL}/api/cultural/content?language=am`);
  console.log('Amharic content found:', amharicContentResponse.data.data.length);

  const oromoContentResponse = await axios.get(`${API_BASE_URL}/api/cultural/content?language=om`);
  console.log('Oromo content found:', oromoContentResponse.data.data.length);

  console.log('✅ Multilingual content test passed\n');
}

/**
 * Test admin features
 */
async function testAdminFeatures() {
  console.log('👑 Testing admin features...');

  try {
    // Test content statistics
    const statsResponse = await axios.get(`${API_BASE_URL}/api/cultural/stats`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    console.log('Content statistics:', {
      totalContent: statsResponse.data.data.totalContent,
      publishedContent: statsResponse.data.data.publishedContent,
      draftContent: statsResponse.data.data.draftContent,
      featuredContent: statsResponse.data.data.featuredContent,
    });

    console.log('Content by type:', statsResponse.data.data.contentByType);
    console.log('Content by language:', statsResponse.data.data.contentByLanguage);

    console.log('✅ Admin features test passed\n');

  } catch (error: any) {
    if (error.response?.status === 403) {
      console.log('ℹ️ Admin features test skipped - user not admin\n');
    } else {
      throw error;
    }
  }
}

// Run the test
if (require.main === module) {
  testCulturalSystem();
}

export { testCulturalSystem };