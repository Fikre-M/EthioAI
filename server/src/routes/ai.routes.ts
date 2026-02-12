import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { googleAI } from '../server';
// import { openaiClient, anthropicClient } from '../server'; // PREPARED for later

const router = Router();

// Rate limiting for AI endpoints
const aiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: parseInt(process.env.AI_RATE_LIMIT_PER_MINUTE || '60', 10),
  message: {
    success: false,
    message: 'Too many AI requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all AI routes
router.use(aiRateLimit);

/**
 * POST /api/ai/chat
 * Proxy endpoint for Google AI (Gemini) chat
 */
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, context = '' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Message is required and must be a string',
      });
    }

    if (!googleAI) {
      return res.status(503).json({
        success: false,
        message: 'Google AI service is not available',
      });
    }

    // Get the generative model
    const model = googleAI.getGenerativeModel({ 
      model: process.env.GOOGLE_AI_MODEL || 'gemini-1.5-flash-latest' 
    });

    // Prepare the prompt with context
    const prompt = context 
      ? `Context: ${context}\n\nUser: ${message}\n\nAssistant:` 
      : message;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      data: {
        message: text,
        provider: 'google-gemini',
        model: process.env.GOOGLE_AI_MODEL || 'gemini-1.5-flash-latest',
        tokensUsed: response.usageMetadata?.totalTokenCount || 0,
      },
    });

  } catch (error: any) {
    console.error('Google AI chat error:', error);
    
    // Provide a helpful fallback response for development
    if (process.env.NODE_ENV === 'development') {
      res.json({
        success: true,
        data: {
          message: `I'm currently experiencing technical difficulties with the AI service. This is a fallback response for development. Original error: ${error.message}`,
          provider: 'fallback-development',
          model: 'development-fallback',
          tokensUsed: 0,
          note: 'This is a development fallback. In production, please ensure your Google AI API key is valid and has access to the specified model.',
        },
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to generate AI response',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
});

/**
 * POST /api/ai/analyze
 * Analyze text for sentiment, keywords, etc.
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { text, analysisType = 'sentiment' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Text is required and must be a string',
      });
    }

    if (!googleAI) {
      return res.status(503).json({
        success: false,
        message: 'Google AI service is not available',
      });
    }

    const model = googleAI.getGenerativeModel({ 
      model: process.env.GOOGLE_AI_MODEL || 'gemini-2.0-flash' 
    });

    let prompt = '';
    switch (analysisType) {
      case 'sentiment':
        prompt = `Analyze the sentiment of this text and return a JSON object with sentiment (positive/negative/neutral), confidence (0-1), and key emotions detected:\n\n"${text}"`;
        break;
      case 'keywords':
        prompt = `Extract the most important keywords and phrases from this text. Return a JSON array of keywords:\n\n"${text}"`;
        break;
      case 'summary':
        prompt = `Provide a concise summary of this text in 2-3 sentences:\n\n"${text}"`;
        break;
      default:
        prompt = `Analyze this text and provide insights:\n\n"${text}"`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisResult = response.text();

    res.json({
      success: true,
      data: {
        analysis: analysisResult,
        analysisType,
        provider: 'google-gemini',
        tokensUsed: response.usageMetadata?.totalTokenCount || 0,
      },
    });

  } catch (error: any) {
    console.error('AI analysis error:', error);
    
    // Provide a helpful fallback response for development
    if (process.env.NODE_ENV === 'development') {
      res.json({
        success: true,
        data: {
          analysis: `Analysis fallback for development. Original request: "${text}" (${analysisType}). Error: ${error.message}`,
          analysisType,
          provider: 'fallback-development',
          tokensUsed: 0,
          note: 'This is a development fallback. In production, please ensure your Google AI API key is valid.',
        },
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to analyze text',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
});

/**
 * GET /api/ai/models
 * List available models for debugging
 */
router.get('/models', async (req: Request, res: Response) => {
  try {
    if (!googleAI) {
      return res.status(503).json({
        success: false,
        message: 'Google AI service is not available',
      });
    }

    // Try to list models
    try {
      const models = await googleAI.listModels();
      res.json({
        success: true,
        data: {
          models: models.models?.map(model => ({
            name: model.name,
            displayName: model.displayName,
            supportedGenerationMethods: model.supportedGenerationMethods,
          })) || [],
        },
      });
    } catch (listError: any) {
      // If listing fails, just return the error info
      res.json({
        success: false,
        message: 'Could not list models',
        error: listError.message,
        suggestion: 'Try using models: gemini-2.0-flash, gemini-2.0-flash-exp, or gemini-1.5-flash',
      });
    }

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Models endpoint failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /api/ai/health
 * Check AI service health
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const services = {
      'google-gemini': {
        available: !!googleAI,
        model: process.env.GOOGLE_AI_MODEL || 'gemini-2.0-flash',
      },
      // PREPARED for later
      // 'openai': {
      //   available: !!openaiClient,
      //   model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      // },
      // 'anthropic': {
      //   available: !!anthropicClient,
      //   model: process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307',
      // },
    };

    const availableServices = Object.values(services).filter(s => s.available).length;

    res.json({
      success: true,
      data: {
        status: availableServices > 0 ? 'healthy' : 'degraded',
        services,
        availableProviders: availableServices,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// PREPARED ROUTES for OpenAI and Anthropic (commented out for later)
/*
router.post('/openai/chat', async (req: Request, res: Response) => {
  try {
    const { message, model = 'gpt-4o-mini' } = req.body;

    if (!openaiClient) {
      return res.status(503).json({
        success: false,
        message: 'OpenAI service is not available',
      });
    }

    const completion = await openaiClient.chat.completions.create({
      model,
      messages: [{ role: 'user', content: message }],
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '2000', 10),
    });

    res.json({
      success: true,
      data: {
        message: completion.choices[0]?.message?.content,
        provider: 'openai',
        model: completion.model,
        tokensUsed: completion.usage?.total_tokens,
      },
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'OpenAI request failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

router.post('/anthropic/chat', async (req: Request, res: Response) => {
  try {
    const { message, model = 'claude-3-haiku-20240307' } = req.body;

    if (!anthropicClient) {
      return res.status(503).json({
        success: false,
        message: 'Anthropic service is not available',
      });
    }

    const response = await anthropicClient.messages.create({
      model,
      max_tokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS || '2000', 10),
      messages: [{ role: 'user', content: message }],
    });

    res.json({
      success: true,
      data: {
        message: response.content[0]?.text,
        provider: 'anthropic',
        model: response.model,
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
      },
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Anthropic request failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});
*/

export default router;