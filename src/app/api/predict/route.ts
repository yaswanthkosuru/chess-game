import { NextResponse } from "next/server";
// import { parseJson } from "../utils/Parser";
// import { generatePredictionPrompt } from "../utils/Prompt";
// import { GenerateText } from "../utils/Geneartion";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);
    const { fen_string } = body;
    const response = await axios.post("https://chess-api.com/v1", {
      fen: fen_string,
      depth: 12,
    });
    console.log(response.data, "response");
    const stockfishprediction = response.data;

    return NextResponse.json(stockfishprediction, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Failed to fetch data", status: 500 },
      { status: 500 }
    );
  }
}
