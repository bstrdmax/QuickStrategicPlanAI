
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { GoogleGenAI, Type } from "@google/genai";
import type { StrategicPlan } from '../../types';

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "API_KEY environment variable is not set." }),
    };
  }

  try {
    const { mission, vision } = JSON.parse(event.body || '{}');
    if (!mission || !vision) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Mission and vision are required." }),
        }
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are a world-class business strategy consultant AI. Your task is to create a comprehensive, actionable strategic plan based on the user's provided mission and vision statements.

      Mission: "${mission}"
      Vision: "${vision}"

      Based on this, generate a strategic plan with the following components. For the 'How to Win' section, perform a brief conceptual analysis of market trends or common strategies for similar types of businesses to justify your choice between a price-based or differentiation-based strategy.

      The output must be a valid JSON object that adheres to the provided schema. Fill each section with insightful and practical suggestions.
    `;

    const schema = {
        type: Type.OBJECT,
        properties: {
          direction: {
            type: Type.STRING,
            description: "A clear, concise statement defining the strategic direction of the company.",
          },
          howToWin: {
            type: Type.OBJECT,
            description: "The core competitive strategy.",
            properties: {
              strategy: {
                type: Type.STRING,
                enum: ['PRICE', 'DIFFERENTIATION'],
                description: "The chosen strategy: either price leadership or product/service differentiation."
              },
              justification: {
                type: Type.STRING,
                description: "A well-reasoned justification for the chosen strategy based on market analysis."
              }
            },
            required: ['strategy', 'justification']
          },
          capabilities: {
            type: Type.ARRAY,
            description: "Key capabilities and resources the company will need to develop or acquire.",
            items: { type: Type.STRING }
          },
          leadership: {
            type: Type.STRING,
            description: "The leadership style and team structure required to execute the strategy."
          },
          goals: {
            type: Type.ARRAY,
            description: "High-level, long-term goals that align with the mission and vision.",
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ['title', 'description']
            }
          },
          objectives: {
            type: Type.ARRAY,
            description: "Specific, measurable objectives that contribute to achieving the goals.",
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ['title', 'description']
            }
          },
          initiatives: {
            type: Type.ARRAY,
            description: "Key strategic initiatives or projects to be undertaken.",
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ['title', 'description']
            }
          },
          tasks: {
            type: Type.ARRAY,
            description: "Actionable tasks that break down the initiatives into smaller steps.",
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ['title', 'description']
            }
          }
        },
        required: ['direction', 'howToWin', 'capabilities', 'leadership', 'goals', 'objectives', 'initiatives', 'tasks']
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });
  
      const jsonText = response.text.trim();
      const plan: StrategicPlan = JSON.parse(jsonText);

      return {
        statusCode: 200,
        body: JSON.stringify(plan),
      };

  } catch (error) {
    console.error("Error in Netlify function:", error);
    return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to generate strategic plan from Gemini API." }),
    };
  }
};

export { handler };