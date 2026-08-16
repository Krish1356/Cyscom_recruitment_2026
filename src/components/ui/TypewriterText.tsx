"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const WORDS = ["SECURE.", "DEFEND.", "EXPLORE."];
const TYPING_SPEED = 100;
const ERASING_SPEED = 70;
const PAUSE_DURATION = 1800;
const SHORT_PAUSE = 400;

export function TypewriterText() {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setText(WORDS[0]);
      return;
    }

    let timeout: NodeJS.Timeout;
    
    const currentWord = WORDS[wordIndex];

    if (isDeleting) {
      setIsPaused(false);
      timeout = setTimeout(() => {
        setText((prev) => prev.slice(0, -1));
        if (text.length === 1) { // When it slices the last char, text length will be 0 on next render
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % WORDS.length);
          setIsPaused(true);
          timeout = setTimeout(() => setIsPaused(false), SHORT_PAUSE);
        }
      }, ERASING_SPEED);
    } else {
      setIsPaused(false);
      if (text === currentWord) {
        setIsPaused(true);
        timeout = setTimeout(() => {
          setIsDeleting(true);
          setIsPaused(false);
        }, PAUSE_DURATION);
      } else {
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, text.length + 1));
        }, TYPING_SPEED);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, reducedMotion]);

  if (reducedMotion) {
    return (
      <span className="text-[#67E8F9] drop-shadow-[0_0_10px_rgba(103,232,249,0.3)]">
        SECURE.
      </span>
    );
  }

  return (
    <span className="relative inline-block text-left text-[#67E8F9] drop-shadow-[0_0_10px_rgba(103,232,249,0.3)]">
      <span className="invisible opacity-0 select-none">EXPLORE.</span>
      <span className="absolute left-0 top-0 flex items-center h-full">
        <span>{text}</span>
        <motion.span
          animate={{ opacity: isPaused ? [1, 0, 1] : 1 }}
          transition={{
            duration: 1,
            repeat: isPaused ? Infinity : 0,
            ease: "easeInOut",
          }}
          className="w-[4px] h-[0.75em] bg-[#00D9FF] ml-1 shadow-[0_0_10px_rgba(0,217,255,0.7)]"
        />
      </span>
    </span>
  );
}
