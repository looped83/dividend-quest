import { useCallback, useMemo } from 'react';
import type { Quest, Achievement, LevelInfo, QuestResult } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { calculateQuestXp, calculateLevelInfo } from '../lib/xp';
import {
  computeAchievements,
  getNewlyUnlocked,
} from '../lib/achievements';

interface UseQuestsReturn {
  quests: Quest[];
  achievements: Achievement[];
  levelInfo: LevelInfo;
  totalXp: number;
  addQuest: (
    name: string,
    amount: number,
    dividendYield: number
  ) => QuestResult;
  clearQuests: () => void;
}

export function useQuests(): UseQuestsReturn {
  const [quests, setQuests] = useLocalStorage<Quest[]>(
    'dq:quests',
    []
  );
  const [achievements, setAchievements] = useLocalStorage<
    Achievement[]
  >('dq:achievements', []);

  const totalXp = useMemo(
    () => quests.reduce((sum, quest) => sum + quest.xpGained, 0),
    [quests]
  );

  const levelInfo = useMemo(
    () => calculateLevelInfo(totalXp),
    [totalXp]
  );

  const addQuest = useCallback(
    (
      name: string,
      amount: number,
      dividendYield: number
    ): QuestResult => {
      const xpGained = calculateQuestXp(amount);
      const questName =
        name.trim() || `Quest #${quests.length + 1}`;

      const newQuest: Quest = {
        id: crypto.randomUUID(),
        name: questName,
        amount,
        dividendYield,
        date: new Date().toISOString(),
        xpGained,
      };

      const updatedQuests = [...quests, newQuest];
      const newTotalXp = totalXp + xpGained;
      const updatedAchievements = computeAchievements(
        updatedQuests,
        newTotalXp,
        achievements
      );
      const newlyUnlocked = getNewlyUnlocked(
        achievements,
        updatedAchievements
      );

      setQuests(updatedQuests);
      setAchievements(updatedAchievements);

      return { xpGained, newlyUnlocked };
    },
    [quests, totalXp, achievements, setQuests, setAchievements]
  );

  const clearQuests = useCallback(() => {
    setQuests([]);
    setAchievements([]);
  }, [setQuests, setAchievements]);

  return {
    quests,
    achievements,
    levelInfo,
    totalXp,
    addQuest,
    clearQuests,
  };
}
