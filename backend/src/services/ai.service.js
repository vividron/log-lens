import { GoogleGenAI, Type } from '@google/genai';

let client = null;

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API not configured: set GEMINI_API_KEY in your environment');
  if (!client) client = new GoogleGenAI({ apiKey });
  return client;
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    explanation: { type: Type.STRING },
    likelyCause: { type: Type.STRING },
    recommendedNextStep: { type: Type.STRING }
  },
  required: ['explanation', 'likelyCause', 'recommendedNextStep']
};

export const analyzeAnomaly = async (log) => {
  const ai = getClient();
  const prompt = `You are explaining an anomaly that has ALREADY been detected by a deterministic log anomaly engine. Do not decide whether it is anomalous and do not change its score. Explain only the supplied evidence.

Return concise, practical JSON with:
- explanation: what happened
- likelyCause: likely technical root cause(s), clearly framed as possibilities
- recommendedNextStep: concrete next investigation/action

Detected anomaly context:
${JSON.stringify(log, null, 2)}`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json', responseSchema }
  });

  const text = response.text;
  if (!text) throw new Error('Empty response from Gemini');
  let parsed;
  try { parsed = JSON.parse(text); } catch { throw new Error('Invalid AI response: could not parse JSON'); }
  if (!parsed?.explanation || !parsed?.likelyCause || !parsed?.recommendedNextStep) throw new Error('Invalid AI response');
  return { ...parsed, generatedAt: new Date() };
};
