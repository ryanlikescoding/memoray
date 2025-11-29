import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Course, Commitment, RevisionItem, Score, TimetableEntry } from "../types";

// Initialize the client.
// Note: We are using process.env.API_KEY as per the instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const timetableSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    schedule: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING },
          time: { type: Type.STRING },
          activity: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['Class', 'Study', 'Break', 'Commitment'] }
        },
        required: ['day', 'time', 'activity', 'type']
      }
    }
  },
  required: ['schedule']
};

export const generateTimetable = async (
  courses: Course[],
  commitments: Commitment[],
  preferences: { studyStyle: string; sessionLength: number }
): Promise<TimetableEntry[]> => {
  if (!process.env.API_KEY) {
    // Fallback mock if no API key is present for demo purposes
    console.warn("No API Key found, returning mock data.");
    return [
      { day: "Monday", time: "09:00 - 10:00", activity: "Calculus I", type: "Class" },
      { day: "Monday", time: "10:00 - 11:00", activity: "Study: Calculus Review", type: "Study" },
      { day: "Monday", time: "11:00 - 11:15", activity: "Break", type: "Break" },
    ];
  }

  const prompt = `
    Create a weekly study timetable.
    Courses: ${courses.map(c => c.name).join(', ')}.
    Commitments: ${commitments.map(c => `${c.name} (${c.time})`).join(', ')}.
    Preference: I am a ${preferences.studyStyle} person. 
    Study sessions should be around ${preferences.sessionLength} minutes.
    Ensure a balanced schedule.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: timetableSchema,
        systemInstruction: "You are an expert academic planner.",
      },
    });

    const json = JSON.parse(response.text || '{"schedule": []}');
    return json.schedule || [];
  } catch (error) {
    console.error("Gemini Timetable Error:", error);
    return [];
  }
};

const revisionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          topic: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
          description: { type: Type.STRING },
          status: { type: Type.STRING, enum: ['Pending'] }
        },
        required: ['topic', 'priority', 'description']
      }
    }
  }
};

export const generateRevisionList = async (scores: Score[], subject: string): Promise<RevisionItem[]> => {
  if (!process.env.API_KEY) {
    return [
      { id: '1', topic: 'Mock Topic 1', priority: 'High', description: 'Focus on weak areas', status: 'Pending' },
    ];
  }

  const prompt = `
    Analyze these scores for ${subject}: ${JSON.stringify(scores)}.
    Identify weak areas and suggest 3-5 specific revision topics.
    Prioritize them based on performance.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: revisionSchema,
      },
    });

    const json = JSON.parse(response.text || '{"items": []}');
    return json.items.map((item: any, index: number) => ({
        ...item,
        id: `gen-${index}`,
        status: 'Pending'
    })) || [];
  } catch (error) {
    console.error("Gemini Revision Error:", error);
    return [];
  }
};
