import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function encodeQuizData(data: string): string {
  return encodeURIComponent(data);
}

export function decodeQuizData(encoded: string): string {
  return decodeURIComponent(encoded);
}

