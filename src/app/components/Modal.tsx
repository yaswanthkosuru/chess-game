"use client";
import { motion } from "motion/react";

export const Modal = ({
  children,
}: {
  children: React.ReactNode;
  isOpen: boolean;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }} // Start small and transparent
        animate={{ opacity: 1, scale: 1 }} // Grow to full size
        exit={{ opacity: 0, scale: 0.8 }} // Shrink when closing
        transition={{ duration: 0.3, ease: "easeOut" }} // Smooth transition
        className="bg-white p-4 rounded-lg"
      >
        <h1 className="text-black">Waiting Room</h1>

        {children}
      </motion.div>
    </div>
  );
};
