import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges conditional class names and resolves conflicting Tailwind
 * utility classes, keeping the last one wins.
 *
 * @param inputs - {ClassValue[]} Class values (strings, objects, arrays) to combine.
 * @returns {string} The merged, de-duplicated class string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
