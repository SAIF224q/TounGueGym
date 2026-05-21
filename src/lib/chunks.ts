/** Ensures chunk stage always has displayable parts; tolerates legacy items without chunks. */
export function normalizeChunks(text: string, chunks?: string[]): string[] {
  const cleaned = (chunks ?? []).map((chunk) => chunk.trim()).filter(Boolean);
  if (!cleaned.length) {
    return fallbackChunksFromText(text);
  }

  const joined = cleaned.join("").toLowerCase().replace(/[^a-z0-9]/g, "");
  const target = text.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!target.length) {
    return cleaned;
  }

  if (joined === target) {
    return cleaned;
  }

  // Accept chunks that reconstruct the word when spaces are ignored (ordered substrings).
  let cursor = 0;
  const matches = cleaned.every((chunk) => {
    const part = chunk.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!part) return false;
    const index = target.indexOf(part, cursor);
    if (index === -1) return false;
    cursor = index + part.length;
    return true;
  });
  if (matches && cursor === target.length) {
    return cleaned;
  }

  return cleaned.length >= 2 ? cleaned : fallbackChunksFromText(text);
}

function fallbackChunksFromText(text: string): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length ? words : [text];
}
