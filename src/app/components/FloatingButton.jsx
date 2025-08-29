"use client";

import { useState } from "react";
import FeedbackModal from "./FeedbackModal";

export default function FloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Enviar Feedback"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-palette-2 text-white shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-300 focus:outline-none cursor-pointer border border-white"
      >
        <i className="fa-solid fa-bullhorn text-xl"></i>
      </button>

      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}