interface PredictionPrompt {
  fen_string: string;
  stockfishdata: string;
  messages: { text: string; sender: string }[];
  question: string;
}

function generateChatPrompt(
  messages: { text: string; sender: string }[]
): string {
  let prompt = "Previous conversation:\n";

  messages.forEach(({ text, sender }) => {
    const role = sender === "user" ? "User" : "Bot";
    prompt += `${role}: ${text}\n`;
  });

  prompt +=
    "\nContinue the conversation based on the game state and answer the user's question accurately.";
  return prompt;
}

export function generateUserQuestionPrompt({
  fen_string,
  messages,
  stockfishdata,
  question,
}: PredictionPrompt): string {
  const chatHistory = generateChatPrompt(messages);

  const prompt = `
  You are a highly skilled chess assistant analyzing a game position in Forsyth-Edwards Notation (FEN): "${fen_string}".

  Additional data from the Stockfish engine (for reference only, not to be used in the direct answer): "${stockfishdata}".

  ${chatHistory}

  **User's Question:** "${question}"

  **Instructions:**
  - Provide a clear and concise response.
  - Do NOT include FEN or Stockfish data in the response.
  - Your answer should be directly related to the question and game context.
  - Maintain a natural, conversational tone.

  **Your Response:**
  `;

  return prompt.trim();
}
