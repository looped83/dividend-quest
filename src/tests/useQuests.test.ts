import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useQuests } from '../hooks/useQuests';

describe('useQuests', () => {
  it('initializes with empty quests', () => {
    const { result } = renderHook(() => useQuests());
    expect(result.current.quests).toHaveLength(0);
  });

  it('starts at level 1 with 0 XP', () => {
    const { result } = renderHook(() => useQuests());
    expect(result.current.levelInfo.level).toBe(1);
    expect(result.current.totalXp).toBe(0);
  });

  it('addQuest adds a quest with correct fields', () => {
    const { result } = renderHook(() => useQuests());
    act(() => {
      result.current.addQuest('Test Quest', 1_000, 4);
    });
    expect(result.current.quests).toHaveLength(1);
    expect(result.current.quests[0].name).toBe('Test Quest');
    expect(result.current.quests[0].amount).toBe(1_000);
    expect(result.current.quests[0].dividendYield).toBe(4);
  });

  it('addQuest assigns fallback name when name is empty', () => {
    const { result } = renderHook(() => useQuests());
    act(() => {
      result.current.addQuest('', 100, 4);
    });
    expect(result.current.quests[0].name).toMatch(/Quest #\d+/);
  });

  it('addQuest increments totalXp', () => {
    const { result } = renderHook(() => useQuests());
    act(() => {
      result.current.addQuest('', 500, 4);
    });
    expect(result.current.totalXp).toBe(500);
  });

  it('addQuest returns correct xpGained', () => {
    const { result } = renderHook(() => useQuests());
    let questResult!: { xpGained: number };
    act(() => {
      questResult = result.current.addQuest('', 750, 4);
    });
    expect(questResult.xpGained).toBe(750);
  });

  it('addQuest accumulates XP across multiple quests', () => {
    const { result } = renderHook(() => useQuests());
    // Each act waits for re-render so the next call sees fresh state
    act(() => { result.current.addQuest('', 500, 4); });
    act(() => { result.current.addQuest('', 300, 4); });
    expect(result.current.totalXp).toBe(800);
    expect(result.current.quests).toHaveLength(2);
  });

  it('addQuest assigns a unique id per quest', () => {
    const { result } = renderHook(() => useQuests());
    act(() => { result.current.addQuest('A', 100, 4); });
    act(() => { result.current.addQuest('B', 200, 4); });
    const [q1, q2] = result.current.quests;
    expect(q1.id).not.toBe(q2.id);
  });

  it('clearQuests empties quests and resets XP', () => {
    const { result } = renderHook(() => useQuests());
    act(() => {
      result.current.addQuest('Test', 1_000, 4);
    });
    act(() => {
      result.current.clearQuests();
    });
    expect(result.current.quests).toHaveLength(0);
    expect(result.current.totalXp).toBe(0);
    expect(result.current.achievements.every((a) => !a.unlocked))
      .toBe(true);
  });

  it('unlocks first-quest achievement after one quest', () => {
    const { result } = renderHook(() => useQuests());
    act(() => {
      result.current.addQuest('Test', 100, 4);
    });
    const achievement = result.current.achievements.find(
      (a) => a.id === 'first-quest'
    );
    expect(achievement?.unlocked).toBe(true);
  });

  it('returns newlyUnlocked in addQuest result', () => {
    const { result } = renderHook(() => useQuests());
    let questResult!: {
      xpGained: number;
      newlyUnlocked: { id: string }[];
    };
    act(() => {
      questResult = result.current.addQuest('Test', 100, 4);
    });
    const unlocked = questResult.newlyUnlocked.map((a) => a.id);
    expect(unlocked).toContain('first-quest');
  });

  it('does not return already-unlocked achievements as new', () => {
    const { result } = renderHook(() => useQuests());
    // First quest unlocks first-quest
    act(() => {
      result.current.addQuest('A', 100, 4);
    });
    let secondResult!: { newlyUnlocked: { id: string }[] };
    act(() => {
      secondResult = result.current.addQuest('B', 100, 4);
    });
    const ids = secondResult.newlyUnlocked.map((a) => a.id);
    expect(ids).not.toContain('first-quest');
  });

  it('updates levelInfo when XP increases', () => {
    const { result } = renderHook(() => useQuests());
    act(() => {
      result.current.addQuest('', 5_000, 4);
    });
    expect(result.current.levelInfo.level).toBe(6);
  });
});
