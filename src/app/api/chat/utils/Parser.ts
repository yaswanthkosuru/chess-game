interface Parsejson {
  content: string;
}
export function parseJson({ content }: Parsejson) {
  const bestMove = content.replace(/```json|```/g, "").trim();
  return JSON.parse(bestMove);
}
