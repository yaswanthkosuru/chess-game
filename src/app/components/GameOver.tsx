import { motion } from "motion/react";
import { useState } from "react";

export default function GameOverPopup() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-0 left-0 w-full bg-red-700 text-white text-center py-4 text-xl font-bold shadow-lg"
      >
        Game Over
        <button
          onClick={() => setShow(false)}
          className="absolute right-4 top-2 text-white text-lg"
        >
          ✖
        </button>
      </motion.div>
    </div>
  );
}
