import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const LIKED_POSTS_STORAGE_KEY = "student-voice-liked-posts";

function normalizeApiErrorMessage(message: string): string {
  return message.replace(/^HTTP \d+ [^:]+:\s*/i, "").trim();
}

function readLikedPosts(): number[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(LIKED_POSTS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((value): value is number => typeof value === "number")
      : [];
  } catch {
    return [];
  }
}

export function hasLikedPost(postId: number): boolean {
  return readLikedPosts().includes(postId);
}

export function markPostLiked(postId: number): void {
  if (typeof window === "undefined") {
    return;
  }

  const likedPosts = new Set(readLikedPosts());
  likedPosts.add(postId);
  window.localStorage.setItem(
    LIKED_POSTS_STORAGE_KEY,
    JSON.stringify([...likedPosts]),
  );
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim() !== "") {
    return normalizeApiErrorMessage(error.message);
  }

  return fallback;
}

export function isAlreadyLikedError(message: string): boolean {
  const normalized = message.toLowerCase();
  return normalized.includes("already") || normalized.includes("only once");
}
