import { NextResponse } from "next/server";
import axios from "axios";
import { generateContent } from "./utils/Geneartion";
import { generateUserQuestionPrompt } from "./utils/Prompt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);
    const { fen_string, messages, question, difficulty } = body;
    console.log(difficulty, "difficulty");
    console.log(typeof difficulty, "type of difficulty");
    const response = await axios.post("https://chess-api.com/v1", {
      fen: fen_string,
      depth: difficulty,
    });
    console.log(response.data, "backend response chess-api");
    const stockfishdata = JSON.stringify(response.data);
    const prompt = generateUserQuestionPrompt({
      fen_string,
      stockfishdata,
      messages,
      question,
    });
    const answer = await generateContent({ prompt });

    return NextResponse.json({ answer }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Failed to fetch data", status: 500 },
      { status: 500 }
    );
  }
}
