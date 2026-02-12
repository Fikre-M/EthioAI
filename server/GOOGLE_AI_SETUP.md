# 🤖 Google AI Setup Guide

## Current Status
❌ **Google AI is NOT connected** - You're seeing fallback responses because the API key isn't configured.

## ✅ Quick Setup (5 minutes)

### Step 1: Get Your FREE Google AI API Key
1. Go to: **https://makersuite.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated API key (starts with `AIza...`)

### Step 2: Update Your Configuration
1. Open `server/.env` file
2. Find this line:
   ```
   GOOGLE_AI_API_KEY=your-google-ai-api-key-here
   ```
3. Replace `your-google-ai-api-key-here` with your actual API key:
   ```
   GOOGLE_AI_API_KEY=AIzaSyA...your-actual-key-here
   ```

### Step 3: Restart Your Server
```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Test Your Connection
```bash
# Test your API key:
node setup-google-ai.js test YOUR_API_KEY

# Or test via API:
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, are you working now?"}'
```

## 🆓 FREE Models Available

✅ **Recommended FREE models:**
- `gemini-1.5-flash` (fast, good quality)
- `gemini-1.5-flash-latest` (latest version)
- `gemini-1.5-pro` (higher quality, limited free usage)

❌ **Avoid these (paid/restricted):**
- `gemini-2.0-flash` (may require paid plan)
- `gemini-pro` (older, may have restrictions)

## 🔧 Troubleshooting

### Problem: "API key is not working"
**Solutions:**
1. Make sure you copied the full API key (starts with `AIza`)
2. Try a different model: `gemini-1.5-flash`
3. Check if your Google account has API access enabled
4. Wait 5-10 minutes after creating the key (propagation delay)

### Problem: "Model not found" or "404 error"
**Solutions:**
1. Use `gemini-1.5-flash` instead of `gemini-2.0-flash`
2. Update your .env file:
   ```
   GOOGLE_AI_MODEL=gemini-1.5-flash
   ```

### Problem: "Quota exceeded"
**Solutions:**
1. You've hit the free tier limit
2. Wait for the quota to reset (usually daily)
3. Consider upgrading to paid plan if needed

## 🧪 Test Commands

```bash
# Test API key directly
node setup-google-ai.js test YOUR_API_KEY

# Test with specific model
node setup-google-ai.js test YOUR_API_KEY gemini-1.5-flash

# Auto-update .env file
node setup-google-ai.js update YOUR_API_KEY gemini-1.5-flash

# Test via HTTP
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the capital of Ethiopia?"}'
```

## ✅ Success Indicators

When properly configured, you should see:
```
✅ Google AI (Gemini) initialized
🤖 Google AI service: ACTIVE
```

And AI responses should be different for different questions, not the same fallback message.

## 🎯 Expected Behavior

**Before setup (current):**
- Same fallback response for all questions
- "Google AI service is not available" errors

**After setup:**
- Different, relevant responses for each question
- Actual AI-generated content about Ethiopian tourism
- No more fallback messages

---

**Need help?** Run `node setup-google-ai.js` for interactive assistance!