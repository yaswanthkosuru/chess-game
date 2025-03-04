import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyD6AQHrEQ-JA2HIJ3wVKUX5PAno2KKLAHQ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface generateprompt {
  prompt: string;
}
export async function generateContent({ prompt }: generateprompt) {
  const result = await model.generateContent(prompt);
  const generated_text =
    result.response.candidates?.[0]?.content?.parts?.[0]?.text;
  return generated_text;
}
