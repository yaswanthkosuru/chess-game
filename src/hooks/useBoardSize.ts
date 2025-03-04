import { useState, useEffect } from "react";

export function useBoardSize() {
  const [boardSize, setBoardSize] = useState<number | null>(null);

  useEffect(() => {
    function updateBoardSize() {
      const maxWidth = Math.min(window.innerWidth - 60, 500);
      const maxHeight = Math.min(window.innerHeight * 0.8, 500);
      setBoardSize(Math.min(maxWidth, maxHeight));
    }

    updateBoardSize(); // Set initial size after mount

    window.addEventListener("resize", updateBoardSize);
    return () => window.removeEventListener("resize", updateBoardSize);
  }, []);

  return boardSize ?? 500; // Fallback size for SSR
}
