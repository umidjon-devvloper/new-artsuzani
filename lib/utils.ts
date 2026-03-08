import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const generateNumericId = (): string => {
  let id = "";
  for (let i = 0; i < 4; i++) {
    id += Math.floor(Math.random() * 10).toString();
  }
  return id;
};
