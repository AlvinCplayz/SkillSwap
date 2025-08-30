
import { GoogleGenAI, Type, GenerateContentParameters } from "@google/genai";
import { LessonPlan, Message } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const schema = {
  type: Type.OBJECT,
  properties: {
    skill: { 
      type: Type.STRING,
      description: "The skill the lesson plan is for."
    },
    plan: {
      type: Type.ARRAY,
      description: "A 7-day lesson plan.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: { 
            type: Type.INTEGER,
            description: "The day number (1-7)."
           },
          topic: { 
            type: Type.STRING,
            description: "The main topic for the day."
          },
          goals: {
            type: Type.ARRAY,
            description: "A list of goals for the day.",
            items: { type: Type.STRING },
          },
          exercises: {
            type: Type.ARRAY,
            description: "A list of practice exercises for the day.",
            items: { type: Type.STRING },
          },
        },
        required: ["day", "topic", "goals", "exercises"],
      },
    },
  },
  required: ["skill", "plan"],
};

export async function generateLessonPlan(skillName: string): Promise<LessonPlan | null> {
    try {
        const prompt = `Create a personalized, beginner-friendly 7-day lesson plan for learning "${skillName}". The user is a complete beginner. Break it down day-by-day with a main topic, specific learning goals, and practical exercises for each day. The plan should be encouraging and build confidence gradually.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.7,
            },
        });

        const jsonText = response.text.trim();
        const lessonPlan = JSON.parse(jsonText) as LessonPlan;
        
        if (lessonPlan && lessonPlan.plan && Array.isArray(lessonPlan.plan)) {
            return lessonPlan;
        } else {
            console.error("Invalid lesson plan structure received:", lessonPlan);
            return null;
        }

    } catch (error) {
        console.error("Error generating lesson plan:", error);
        return null;
    }
}

export async function generateChatResponse(chatHistory: Message[], systemInstruction: string, currentUserId: number): Promise<string> {
    try {
        const contents: GenerateContentParameters['contents'] = chatHistory.map(msg => ({
            role: msg.senderId === currentUserId ? 'user' : 'model',
            parts: [{ text: msg.text }],
        }));

        let enhancedSystemInstruction = `You are a helpful and friendly AI assistant on SkillSwap, a skill-trading platform. 
Your persona is defined by the following bio. Converse naturally, be encouraging, and stay on topic with the user's learning goals. 
Avoid being overly repetitive, robotic, or breaking character.
Your persona bio: "${systemInstruction}"`;

        const userMessages = chatHistory.filter(m => m.senderId === currentUserId);
        if (userMessages.length === 1) {
            enhancedSystemInstruction += `\nThis is the user's first message to you. After responding to their initial message, warmly ask them what skill they are interested in learning about today.`;
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                systemInstruction: enhancedSystemInstruction,
                temperature: 0.8,
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error generating chat response:", error);
        return "I'm having a little trouble connecting right now. Please try again in a moment.";
    }
}

export async function generateImage(prompt: string, aiPersona?: string): Promise<string> {
    try {
        const finalPrompt = aiPersona
            ? `An expert in ${aiPersona.substring(0, 100)} is creating art. Generate an image of: ${prompt}`
            : `Generate an image of: ${prompt}`;

        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: finalPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '9:16',
            },
        });
        
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;

    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
}