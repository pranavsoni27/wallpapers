/**
 * Get today's date string for use as a seed (YYYY-MM-DD format)
 * This ensures the same random selection throughout the day
 */
export const getTodaysSeed = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Seeded random number generator
 * Uses today's date as seed to ensure consistent randomization throughout the day
 */
export const getSeededRandom = (seed: string): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) % 10000 / 10000;
};

/**
 * Shuffle array using seeded random number generator
 * This ensures the same shuffle throughout the day
 */
export const shuffleArrayWithSeed = <T,>(array: T[], seed: string): T[] => {
  const shuffled = [...array];
  let seedIndex = 0;

  for (let i = shuffled.length - 1; i > 0; i--) {
    // Generate consistent random number using seed
    const seedPart = seed.substring(seedIndex % seed.length);
    const random = getSeededRandom(seedPart + i);
    const j = Math.floor(random * (i + 1));

    // Swap
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];

    seedIndex++;
  }

  return shuffled;
};

/**
 * Get random items from array using daily seed
 * Same random items will be selected throughout the day
 */
export const getRandomItemsWithDailySeed = <T,>(
  array: T[],
  count: number,
  seed?: string
): T[] => {
  if (array.length === 0) return [];
  if (array.length <= count) return array;

  const dailySeed = seed || getTodaysSeed();
  const shuffled = shuffleArrayWithSeed(array, dailySeed);
  return shuffled.slice(0, count);
};
