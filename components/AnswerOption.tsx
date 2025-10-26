"use client";

import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface AnswerOptionProps {
  option: string;
  index: number;
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  isAnswered: boolean;
  onClick: () => void;
}

export function AnswerOption({
  option,
  index,
  isSelected,
  isCorrect,
  isWrong,
  isAnswered,
  onClick,
}: AnswerOptionProps) {
  const optionLabel = String.fromCharCode(65 + index); // A, B, C, D

  const getButtonStyle = () => {
    if (!isAnswered) {
      return isSelected
        ? "bg-blue-100 border-blue-500 ring-2 ring-blue-500"
        : "hover:bg-gray-50 border-gray-300";
    }

    if (isCorrect) {
      return "bg-green-100 border-green-500 text-green-900";
    }
    if (isWrong) {
      return "bg-red-100 border-red-500 text-red-900";
    }
    return "border-gray-300 opacity-50";
  };

  return (
    <button
      onClick={onClick}
      disabled={isAnswered}
      className={cn(
        "w-full text-left p-4 rounded-lg border-2 transition-all",
        "flex items-start gap-3",
        getButtonStyle()
      )}
    >
      <span className="font-bold text-lg min-w-[2rem]">{optionLabel}.</span>
      <span className="flex-1 font-medium">{option}</span>
      {isCorrect && isAnswered && (
        <span className="text-green-600 font-bold">✓</span>
      )}
      {isWrong && isAnswered && (
        <span className="text-red-600 font-bold">✗</span>
      )}
    </button>
  );
}

