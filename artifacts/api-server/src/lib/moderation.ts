const BLOCKED_LINK_PATTERNS = [
  /https?:\/\//i,
  /www\./i,
  /t\.me\//i,
  /telegram\.me\//i,
  /discord\.gg\//i,
  /discord\.com\/invite\//i,
  /vk\.com\//i,
  /instagram\.com\//i,
  /youtube\.com\//i,
  /youtu\.be\//i,
];

const BLOCKED_WORD_PATTERNS = [
  /\b(fuck|fucking|bitch|asshole|bastard|slut|whore|dickhead|retard|moron)\b/iu,
  /(сука|блядь|блять|ебать|ебан|пизда|пиздец|хуй|нахуй|мудак|долбоеб|уебок|мразь|шлюха)/iu,
];

export function getModerationErrorMessage(fields: string[]): string | null {
  const content = fields
    .map((field) => field.trim())
    .filter(Boolean)
    .join("\n");

  if (!content) {
    return null;
  }

  if (BLOCKED_LINK_PATTERNS.some((pattern) => pattern.test(content))) {
    return "Links, invites and self-promotion are not allowed here.";
  }

  if (BLOCKED_WORD_PATTERNS.some((pattern) => pattern.test(content))) {
    return "Insults, harassment and offensive language are not allowed here.";
  }

  return null;
}
