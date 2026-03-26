import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";

const DEVICE_COOKIE_NAME = "student_voice_device_id";
const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

export function getOrSetDeviceId(req: Request, res: Response): string {
  const existing = req.cookies?.[DEVICE_COOKIE_NAME];

  if (typeof existing === "string" && existing.trim().length >= 16) {
    return existing;
  }

  const deviceId = randomUUID();

  res.cookie(DEVICE_COOKIE_NAME, deviceId, {
    httpOnly: true,
    maxAge: ONE_YEAR_MS,
    path: "/",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return deviceId;
}
