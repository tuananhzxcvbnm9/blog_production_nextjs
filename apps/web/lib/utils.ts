import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
export const maxUploadSize = 5 * 1024 * 1024;
