/**
 * The unique images used as memory-match pairs (2 cards per image).
 * 12 real RADIKAL photos -> 24 cards total.
 */
export const memoryCardImages: string[] = Array.from(
  { length: 12 },
  (_, i) => `/images/memory/${String(i + 1).padStart(2, "0")}.jpg`
);
