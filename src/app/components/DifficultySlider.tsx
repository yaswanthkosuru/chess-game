interface DifficultySliderProps {
  difficulty: number;
  setDifficulty: (value: number) => void;
}

export default function DifficultySlider({
  difficulty,
  setDifficulty,
}: DifficultySliderProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <label className="text-white font-semibold mb-2">
        Difficulty: {difficulty} (
        {difficulty <= 4 ? "Easy" : difficulty <= 8 ? "Medium" : "Hard"})
      </label>
      <input
        title="Select difficulty level"
        type="range"
        min="1"
        max="12"
        value={difficulty}
        onChange={(e) => setDifficulty(Number(e.target.value))}
        className={`w-3/4 ${
          difficulty <= 4
            ? "accent-green-500"
            : difficulty <= 8
            ? "accent-orange-500"
            : "accent-red-500"
        }`}
      />
    </div>
  );
}
