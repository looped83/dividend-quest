import { describe, it, expect } from 'vitest';
import {
  computeAchievements,
  getNewlyUnlocked,
  ACHIEVEMENT_DEFINITIONS,
} from '../lib/achievements';
import type { Quest, Achievement } from '../types';

function makeQuest(
  amount: number,
  dividendYield: number,
  name = 'Test'
): Quest {
  return {
    id: crypto.randomUUID(),
    name,
    amount,
    dividendYield,
    date: new Date().toISOString(),
    xpGained: amount,
  };
}

function locked(): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.map((d) => ({
    ...d,
    unlocked: false,
  }));
}

describe('computeAchievements', () => {
  it('unlocks first-quest after one quest', () => {
    const quests = [makeQuest(100, 4)];
    const result = computeAchievements(quests, 100, locked());
    const achievement = result.find((a) => a.id === 'first-quest');
    expect(achievement?.unlocked).toBe(true);
  });

  it('does not unlock first-quest with empty list', () => {
    const result = computeAchievements([], 0, locked());
    const achievement = result.find((a) => a.id === 'first-quest');
    expect(achievement?.unlocked).toBe(false);
  });

  it('unlocks quest-collector at 5 quests', () => {
    const quests = Array.from({ length: 5 }, () =>
      makeQuest(100, 4)
    );
    const result = computeAchievements(quests, 500, locked());
    expect(
      result.find((a) => a.id === 'quest-collector')?.unlocked
    ).toBe(true);
    expect(
      result.find((a) => a.id === 'quest-master')?.unlocked
    ).toBe(false);
  });

  it('unlocks quest-master at 10 quests', () => {
    const quests = Array.from({ length: 10 }, () =>
      makeQuest(100, 4)
    );
    const result = computeAchievements(quests, 1_000, locked());
    expect(
      result.find((a) => a.id === 'quest-master')?.unlocked
    ).toBe(true);
  });

  it('unlocks savings-rookie at 1000 € capital', () => {
    const quests = [makeQuest(1_000, 4)];
    const result = computeAchievements(quests, 1_000, locked());
    expect(
      result.find((a) => a.id === 'savings-rookie')?.unlocked
    ).toBe(true);
  });

  it('does not unlock savings-rookie below 1000 €', () => {
    const quests = [makeQuest(999, 4)];
    const result = computeAchievements(quests, 999, locked());
    expect(
      result.find((a) => a.id === 'savings-rookie')?.unlocked
    ).toBe(false);
  });

  it('unlocks savings-pro at 10000 € capital', () => {
    const quests = [makeQuest(10_000, 4)];
    const result = computeAchievements(quests, 10_000, locked());
    expect(
      result.find((a) => a.id === 'savings-pro')?.unlocked
    ).toBe(true);
  });

  it('unlocks dividend-starter at 100 €/year', () => {
    // 2500 € @ 4% = 100 €/year
    const quests = [makeQuest(2_500, 4)];
    const result = computeAchievements(quests, 2_500, locked());
    expect(
      result.find((a) => a.id === 'dividend-starter')?.unlocked
    ).toBe(true);
  });

  it('does not unlock dividend-starter below 100 €/year', () => {
    const quests = [makeQuest(2_499, 4)];
    const result = computeAchievements(quests, 2_499, locked());
    expect(
      result.find((a) => a.id === 'dividend-starter')?.unlocked
    ).toBe(false);
  });

  it('unlocks dividend-hunter at 1000 €/year', () => {
    // 25000 € @ 4% = 1000 €/year
    const quests = [makeQuest(25_000, 4)];
    const result = computeAchievements(quests, 25_000, locked());
    expect(
      result.find((a) => a.id === 'dividend-hunter')?.unlocked
    ).toBe(true);
  });

  it('unlocks level-warrior at level 5 (4000 XP)', () => {
    // level = floor(4000/1000)+1 = 5
    const result = computeAchievements([], 4_000, locked());
    expect(
      result.find((a) => a.id === 'level-warrior')?.unlocked
    ).toBe(true);
  });

  it('does not unlock level-warrior below level 5', () => {
    // level = floor(3999/1000)+1 = 4
    const result = computeAchievements([], 3_999, locked());
    expect(
      result.find((a) => a.id === 'level-warrior')?.unlocked
    ).toBe(false);
  });

  it('preserves unlockedAt when re-computing', () => {
    const timestamp = '2024-01-01T00:00:00.000Z';
    const prev: Achievement[] = ACHIEVEMENT_DEFINITIONS.map(
      (d) => ({
        ...d,
        unlocked: d.id === 'first-quest',
        unlockedAt:
          d.id === 'first-quest' ? timestamp : undefined,
      })
    );

    const quests = [makeQuest(100, 4)];
    const result = computeAchievements(quests, 100, prev);
    const achievement = result.find((a) => a.id === 'first-quest');

    expect(achievement?.unlockedAt).toBe(timestamp);
  });

  it('sets unlockedAt for newly unlocked achievements', () => {
    const quests = [makeQuest(100, 4)];
    const result = computeAchievements(quests, 100, locked());
    const achievement = result.find((a) => a.id === 'first-quest');

    expect(achievement?.unlockedAt).toBeDefined();
    expect(typeof achievement?.unlockedAt).toBe('string');
  });

  it('does not set unlockedAt for locked achievements', () => {
    const result = computeAchievements([], 0, locked());
    result
      .filter((a) => !a.unlocked)
      .forEach((a) => {
        expect(a.unlockedAt).toBeUndefined();
      });
  });

  it('returns all 8 achievement definitions', () => {
    const result = computeAchievements([], 0, locked());
    expect(result).toHaveLength(8);
  });
});

describe('getNewlyUnlocked', () => {
  it('returns achievements that are newly unlocked', () => {
    const prev = locked();
    const updated: Achievement[] = ACHIEVEMENT_DEFINITIONS.map(
      (d) => ({
        ...d,
        unlocked: d.id === 'first-quest',
        unlockedAt:
          d.id === 'first-quest'
            ? new Date().toISOString()
            : undefined,
      })
    );

    const result = getNewlyUnlocked(prev, updated);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('first-quest');
  });

  it('returns empty array when nothing newly unlocked', () => {
    const prev = locked();
    const result = getNewlyUnlocked(prev, locked());
    expect(result).toHaveLength(0);
  });

  it('does not return already-unlocked achievements', () => {
    const alreadyUnlocked: Achievement[] =
      ACHIEVEMENT_DEFINITIONS.map((d) => ({
        ...d,
        unlocked: d.id === 'first-quest',
        unlockedAt:
          d.id === 'first-quest'
            ? new Date().toISOString()
            : undefined,
      }));

    // Still the same unlock state
    const result = getNewlyUnlocked(
      alreadyUnlocked,
      alreadyUnlocked
    );
    expect(result).toHaveLength(0);
  });
});
