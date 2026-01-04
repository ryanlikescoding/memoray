// Gemini Service for Vanilla JS
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const generateTimetable = async (courses, commitments, preferences) => {
  const apiKey = localStorage.getItem('GEMINI_API_KEY') || '';
  
  if (!apiKey) {
    console.warn("No API Key found in localStorage, returning mock data.");
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
    Return ONLY valid JSON with this schema:
    {
      "schedule": [
        { "day": "string", "time": "string", "activity": "string", "type": "Class|Study|Break|Commitment" }
      ]
    }
  `;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    const json = JSON.parse(text);
    return json.schedule || [];
  } catch (error) {
    console.error("Gemini Timetable Error:", error);
    return [];
  }
};

// Expose to window
window.generateTimetable = generateTimetable;
