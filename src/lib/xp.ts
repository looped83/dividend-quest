import type { LevelInfo } from '../types';

const XP_PER_LEVEL = 1_000;
const MAX_AMOUNT = 999_999;

export function calculateQuestXp(amount: number): number {
  if (!isFinite(amount) || amount <= 0) return 0;
  return Math.floor(Math.min(amount, MAX_AMOUNT));
}

export function calculateLevel(totalXp: number): number {
  if (!isFinite(totalXp) || totalXp < 0) return 1;
  return Math.floor(totalXp / XP_PER_LEVEL) + 1;
}

export function calculateLevelInfo(totalXp: number): LevelInfo {
  const safeXp = isFinite(totalXp) && totalXp >= 0 ? totalXp : 0;
  const level = calculateLevel(safeXp);
  const xpAtLevelStart = (level - 1) * XP_PER_LEVEL;
  const currentXp = safeXp - xpAtLevelStart;

  return {
    level,
    currentXp,
    xpForNextLevel: XP_PER_LEVEL,
    totalXp: safeXp,
  };
}

export function getPlayerClass(level: number): string {
  if (level >= 17) return 'Legende';
  if (level >= 12) return 'Meister';
  if (level >= 8) return 'Veteran';
  if (level >= 5) return 'Krieger';
  if (level >= 3) return 'Lehrling';
  return 'Novize';
}
