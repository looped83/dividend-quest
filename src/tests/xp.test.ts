import { describe, it, expect } from 'vitest';
import {
  calculateQuestXp,
  calculateLevel,
  calculateLevelInfo,
  getPlayerClass,
} from '../lib/xp';

describe('calculateQuestXp', () => {
  it('returns 1 XP per euro for normal amounts', () => {
    expect(calculateQuestXp(100)).toBe(100);
    expect(calculateQuestXp(1200)).toBe(1200);
    expect(calculateQuestXp(0.99)).toBe(0);
  });

  it('returns 0 for invalid inputs', () => {
    expect(calculateQuestXp(0)).toBe(0);
    expect(calculateQuestXp(-50)).toBe(0);
    expect(calculateQuestXp(NaN)).toBe(0);
    expect(calculateQuestXp(Infinity)).toBe(0);
    expect(calculateQuestXp(-Infinity)).toBe(0);
  });

  it('caps at 999_999', () => {
    expect(calculateQuestXp(999_999)).toBe(999_999);
    expect(calculateQuestXp(1_000_000)).toBe(999_999);
    expect(calculateQuestXp(9_999_999)).toBe(999_999);
  });

  it('floors fractional euros', () => {
    expect(calculateQuestXp(100.9)).toBe(100);
    expect(calculateQuestXp(1.5)).toBe(1);
  });
});

describe('calculateLevel', () => {
  it('returns level 1 for 0 XP', () => {
    expect(calculateLevel(0)).toBe(1);
  });

  it('stays on level 1 below 1000 XP', () => {
    expect(calculateLevel(999)).toBe(1);
    expect(calculateLevel(1)).toBe(1);
  });

  it('advances to level 2 at exactly 1000 XP', () => {
    expect(calculateLevel(1_000)).toBe(2);
    expect(calculateLevel(1_999)).toBe(2);
  });

  it('advances to level 3 at exactly 2000 XP', () => {
    expect(calculateLevel(2_000)).toBe(3);
  });

  it('handles large XP values', () => {
    expect(calculateLevel(10_000)).toBe(11);
    expect(calculateLevel(50_000)).toBe(51);
  });

  it('returns level 1 for invalid inputs', () => {
    expect(calculateLevel(-100)).toBe(1);
    expect(calculateLevel(NaN)).toBe(1);
    expect(calculateLevel(Infinity)).toBe(1);
  });
});

describe('calculateLevelInfo', () => {
  it('returns correct info at 0 XP', () => {
    const info = calculateLevelInfo(0);
    expect(info.level).toBe(1);
    expect(info.currentXp).toBe(0);
    expect(info.xpForNextLevel).toBe(1_000);
    expect(info.totalXp).toBe(0);
  });

  it('returns correct info mid-level', () => {
    const info = calculateLevelInfo(1_500);
    expect(info.level).toBe(2);
    expect(info.currentXp).toBe(500);
    expect(info.xpForNextLevel).toBe(1_000);
    expect(info.totalXp).toBe(1_500);
  });

  it('returns correct info at exact level boundary', () => {
    const info = calculateLevelInfo(3_000);
    expect(info.level).toBe(4);
    expect(info.currentXp).toBe(0);
  });

  it('handles invalid inputs gracefully', () => {
    const info = calculateLevelInfo(NaN);
    expect(info.level).toBe(1);
    expect(info.totalXp).toBe(0);
  });

  it('handles negative XP gracefully', () => {
    const info = calculateLevelInfo(-500);
    expect(info.level).toBe(1);
    expect(info.totalXp).toBe(0);
  });
});

describe('getPlayerClass', () => {
  it('returns Novize for levels 1–2', () => {
    expect(getPlayerClass(1)).toBe('Novize');
    expect(getPlayerClass(2)).toBe('Novize');
  });

  it('returns Lehrling for levels 3–4', () => {
    expect(getPlayerClass(3)).toBe('Lehrling');
    expect(getPlayerClass(4)).toBe('Lehrling');
  });

  it('returns Krieger for levels 5–7', () => {
    expect(getPlayerClass(5)).toBe('Krieger');
    expect(getPlayerClass(7)).toBe('Krieger');
  });

  it('returns Veteran for levels 8–11', () => {
    expect(getPlayerClass(8)).toBe('Veteran');
    expect(getPlayerClass(11)).toBe('Veteran');
  });

  it('returns Meister for levels 12–16', () => {
    expect(getPlayerClass(12)).toBe('Meister');
    expect(getPlayerClass(16)).toBe('Meister');
  });

  it('returns Legende for level 17+', () => {
    expect(getPlayerClass(17)).toBe('Legende');
    expect(getPlayerClass(100)).toBe('Legende');
  });
});
