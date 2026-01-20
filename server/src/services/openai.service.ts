import OpenAI from 'openai';
import { config } from '../config/index';
import { log } from '../utils/logger';
import { ValidationError } from '../middlewares/error.middleware';

/**
 * OpenAI Service for AI chat integration
 */
export class OpenAIService {
  private static openai: OpenAI | null = null;

  /**
   * Initialize OpenAI client
   */
  private static getClient(): OpenAI {
    if (!this.openai) {
      if (!config.openai.apiKey) {
        throw new ValidationError('OpenAI API key is not configured');
      }

      this.openai = new OpenAI({
        apiKey: config.openai.apiKey,
      });
    }

    return this.openai;
  }

  /**
   * Generate AI response for chat message
   */
  static async generateChatResponse(
    message: string,
    context?: {
      language?: string;
      messageType?: string;
      tourId?: string;
      location?: string;
      budget?: number;
      interests?: string[];
      travelDates?: {
        startDate?: string;
        endDate?: string;
      };
      conversationHistory?: Array<{
        role: 'user' | 'assistant';
        content: string;
      }>;
    }
  ): Promise<string> {
    try {
      const client = this.getClient();

      // Build system prompt based on context
      const systemPrompt = this.buildSystemPrompt(context);

      // Build conversation messages
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
      ];

      // Add conversation history if provided
      if (context?.conversationHistory) {
        context.conversationHistory.forEach(msg => {
          messages.push({
            role: msg.role,
            content: msg.content,
          });
        });
      }

      // Add current user message
      messages.push({ role: 'user', content: message });

      // Generate response
      const completion = await client.chat.completions.create({
        model: config.openai.model,
        messages,
        temperature: config.openai.temperature,
        max_tokens: config.openai.maxTokens,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new Error('No response generated from OpenAI');
      }

      log.info('OpenAI response generated', {
        messageLength: message.length,
        responseLength: response.length,
        model: config.openai.model,
        tokensUsed: completion.usage?.total_tokens,
      });

      return response;

    } catch (error: any) {
      log.error('OpenAI API error', {
        error: error.message,
        code: error.code,
        type: error.type,
      });

      // Return fallback response for common errors
      if (error.code === 'insufficient_quota') {
        return "I'm currently experiencing high demand. Please try again in a few moments, or contact support if the issue persists.";
      }

      if (error.code === 'rate_limit_exceeded') {
        return "I'm processing many requests right now. Please wait a moment and try again.";
      }

      // Generic fallback
      return "I apologize, but I'm having trouble processing your request right now. Please try again or rephrase your question.";
    }
  }

  /**
   * Generate travel suggestions based on context
   */
  static async generateSuggestions(context?: {
    location?: string;
    budget?: number;
    interests?: string[];
    language?: string;
  }): Promise<string[]> {
    try {
      const client = this.getClient();

      const prompt = this.buildSuggestionsPrompt(context);

      const completion = await client.chat.completions.create({
        model: config.openai.model,
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: 'Generate 5 relevant travel questions or suggestions.' },
        ],
        temperature: 0.8,
        max_tokens: 300,
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        return this.getDefaultSuggestions(context?.language);
      }

      // Parse suggestions from response
      const suggestions = response
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
        .filter(suggestion => suggestion.length > 10)
        .slice(0, 5);

      return suggestions.length > 0 ? suggestions : this.getDefaultSuggestions(context?.language);

    } catch (error: any) {
      log.error('Error generating suggestions', { error: error.message });
      return this.getDefaultSuggestions(context?.language);
    }
  }

  /**
   * Build system prompt based on context
   */
  private static buildSystemPrompt(context?: any): string {
    const language = context?.language || 'en';
    const messageType = context?.messageType || 'text';

    let basePrompt = `You are EthioAI, a knowledgeable and friendly AI travel assistant specializing in Ethiopian tourism. You help travelers discover the rich culture, history, and natural beauty of Ethiopia.

Key Guidelines:
- Be warm, welcoming, and enthusiastic about Ethiopia
- Provide accurate, helpful information about Ethiopian destinations, culture, food, and travel
- Use emojis appropriately to make responses engaging
- Keep responses conversational and informative
- If you don't know something specific, acknowledge it and suggest alternatives
- Always prioritize traveler safety and cultural sensitivity
- Encourage respectful cultural exchange`;

    // Add language-specific instructions
    if (language === 'am') {
      basePrompt += `\n- Respond in Amharic (አማርኛ) when appropriate
- Use Ethiopian cultural references and expressions`;
    } else if (language === 'om') {
      basePrompt += `\n- Respond in Oromo (Afaan Oromoo) when appropriate
- Include Oromo cultural perspectives`;
    }

    // Add message type specific instructions
    if (messageType === 'tour_recommendation') {
      basePrompt += `\n\nFocus on tour recommendations:
- Suggest specific tours and itineraries
- Include duration, difficulty, and highlights
- Consider budget and travel dates if provided
- Mention seasonal considerations`;
    } else if (messageType === 'cultural_info') {
      basePrompt += `\n\nFocus on cultural information:
- Share insights about Ethiopian traditions, festivals, and customs
- Explain cultural significance and context
- Provide respectful cultural guidance for visitors`;
    } else if (messageType === 'travel_advice') {
      basePrompt += `\n\nFocus on practical travel advice:
- Provide practical tips for traveling in Ethiopia
- Include safety, health, and logistical information
- Suggest best practices for cultural interaction`;
    }

    // Add context-specific information
    if (context?.location) {
      basePrompt += `\n\nUser is interested in: ${context.location}`;
    }

    if (context?.budget) {
      basePrompt += `\n\nUser's budget range: $${context.budget}`;
    }

    if (context?.interests?.length) {
      basePrompt += `\n\nUser's interests: ${context.interests.join(', ')}`;
    }

    if (context?.travelDates) {
      basePrompt += `\n\nTravel dates: ${context.travelDates.startDate || 'flexible'} to ${context.travelDates.endDate || 'flexible'}`;
    }

    return basePrompt;
  }

  /**
   * Build suggestions prompt based on context
   */
  private static buildSuggestionsPrompt(context?: any): string {
    let prompt = `Generate 5 relevant travel questions or suggestions for someone interested in Ethiopian tourism. 

Make them specific, engaging, and helpful. Format as a simple list without numbers or bullets.`;

    if (context?.location) {
      prompt += `\n\nUser is interested in: ${context.location}`;
    }

    if (context?.interests?.length) {
      prompt += `\n\nUser's interests: ${context.interests.join(', ')}`;
    }

    if (context?.budget) {
      prompt += `\n\nBudget consideration: $${context.budget}`;
    }

    return prompt;
  }

  /**
   * Get default suggestions when AI is unavailable
   */
  private static getDefaultSuggestions(language?: string): string[] {
    if (language === 'am') {
      return [
        'በኢትዮጵያ ውስጥ ምርጥ የቱሪዝም ቦታዎች የትኞቹ ናቸው?',
        'ስለ ላሊበላ ቤተ ክርስቲያናት ንገረኝ',
        'የኢትዮጵያ ባህላዊ ምግቦች ምንድን ናቸው?',
        'መቼ ኢትዮጵያን መጎብኘት ይሻላል?',
        'ስለ የኢትዮጵያ ቡና ሥነ ሥርዓት ንገረኝ',
      ];
    }

    if (language === 'om') {
      return [
        'Bakka turizimii Itoophiyaa keessaa hundarra gaarii kamtu?',
        'Waaʼee mana sagadaa Lalibaalaa natti himi',
        'Nyaanni aadaa Itoophiyaa maali?',
        'Yeroo kam Itoophiyaa daawwachuu gaarii?',
        'Waaʼee aadaa bunaa Itoophiyaa natti himi',
      ];
    }

    // Default English suggestions
    return [
      'What are the best tours in Ethiopia?',
      'Tell me about Ethiopian coffee culture',
      'What should I visit in Lalibela?',
      'When is the best time to visit Ethiopia?',
      'What are traditional Ethiopian dishes I should try?',
    ];
  }

  /**
   * Validate message content for safety
   */
  static validateMessageContent(message: string): boolean {
    // Basic content validation
    if (!message || message.trim().length === 0) {
      return false;
    }

    if (message.length > 2000) {
      return false;
    }

    // Add more sophisticated content filtering as needed
    const inappropriatePatterns = [
      /\b(hate|violence|illegal|drugs)\b/i,
      // Add more patterns as needed
    ];

    return !inappropriatePatterns.some(pattern => pattern.test(message));
  }

  /**
   * Get AI model status and usage
   */
  static async getModelStatus(): Promise<{
    available: boolean;
    model: string;
    lastUsed?: Date;
  }> {
    try {
      const client = this.getClient();
      
      // Test with a simple request
      await client.chat.completions.create({
        model: config.openai.model,
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1,
      });

      return {
        available: true,
        model: config.openai.model,
        lastUsed: new Date(),
      };

    } catch (error: any) {
      log.error('OpenAI model status check failed', { error: error.message });
      
      return {
        available: false,
        model: config.openai.model,
      };
    }
  }
}