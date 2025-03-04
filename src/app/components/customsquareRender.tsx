import { Square } from "chess.js";
import React from "react";

interface CustomSquareProps {
  square: string; // the square identifier provided by react-chessboard
  style: React.CSSProperties;
  children: React.ReactNode;
  FromSquare?: string;
  possibleMovesofpiece: string[];
  prevmovefromSquare?: Square;
  prevmoveToSquare?: Square;
}
export const CustomSquareRender: React.FC<CustomSquareProps> = ({
  children,
  style,
  square,
  FromSquare,
  possibleMovesofpiece,
  prevmovefromSquare,
  prevmoveToSquare,
}) => {
  const customStyles = {
    ...style,
  };
  if (possibleMovesofpiece.includes(square)) {
    customStyles.position = "relative";
    // customStyles.backgroundColor = "green";
    return (
      <div style={customStyles}>
        <div className="relative -z-0">{children}</div>
        <div className="absolute z-50 top-1/2 left-1/2 w-2 h-2 bg-green-900/60 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    );
  }
  return <div style={customStyles}>{children}</div>;
};
