// Safe text parsing utilities to prevent undefined errors

export const safeParseText = (text: any): string => {
  if (typeof text === "string") {
    return text;
  }

  if (text && typeof text === "object") {
    // Handle different response structures
    if (text.content) return text.content;
    if (text.text) return text.text;
    if (text.message) return text.message;
  }

  // Fallback for any other type
  return String(text || "");
};

export const safeTextWithFallback = (
  text: any,
  fallback: string = "Content not available",
): string => {
  const parsed = safeParseText(text);
  return parsed.trim() || fallback;
};
