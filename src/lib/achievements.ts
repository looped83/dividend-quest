import type {
  Quest,
  Achievement,
  AchievementDefinition,
} from '../types';
import { calculateLevel } from './xp';
import {
  calculateTotalCapital,
  calculateTotalAnnualDividends,
} from './calculations';

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    id: 'first-quest',
    name: 'Erster Schritt',
    description: 'Erste Quest erfolgreich abgeschlossen',
    icon: '⚔️',
  },
  {
    id: 'quest-collector',
    name: 'Quest-Sammler',
    description: '5 Quests abgeschlossen',
    icon: '📜',
  },
  {
    id: 'quest-master',
    name: 'Quest-Meister',
    description: '10 Quests abgeschlossen',
    icon: '🏆',
  },
  {
    id: 'savings-rookie',
    name: 'Spar-Novize',
    description: '1.000 € Kapital angesammelt',
    icon: '💰',
  },
  {
    id: 'savings-pro',
    name: 'Spar-Profi',
    description: '10.000 € Kapital angesammelt',
    icon: '💎',
  },
  {
    id: 'dividend-starter',
    name: 'Dividenden-Starter',
    description: '100 € Jahres-Dividenden erreicht',
    icon: '🌱',
  },
  {
    id: 'dividend-hunter',
    name: 'Dividenden-Jäger',
    description: '1.000 € Jahres-Dividenden erreicht',
    icon: '🎯',
  },
  {
    id: 'level-warrior',
    name: 'Stufe-5-Krieger',
    description: 'Level 5 erreicht',
    icon: '⭐',
  },
];

function checkAchievement(
  id: string,
  quests: Quest[],
  totalXp: number
): boolean {
  const totalCapital = calculateTotalCapital(quests);
  const annualDividends = calculateTotalAnnualDividends(quests);
  const level = calculateLevel(totalXp);

  switch (id) {
    case 'first-quest':
      return quests.length >= 1;
    case 'quest-collector':
      return quests.length >= 5;
    case 'quest-master':
      return quests.length >= 10;
    case 'savings-rookie':
      return totalCapital >= 1_000;
    case 'savings-pro':
      return totalCapital >= 10_000;
    case 'dividend-starter':
      return annualDividends >= 100;
    case 'dividend-hunter':
      return annualDividends >= 1_000;
    case 'level-warrior':
      return level >= 5;
    default:
      return false;
  }
}

export function computeAchievements(
  quests: Quest[],
  totalXp: number,
  previous: Achievement[]
): Achievement[] {
  const now = new Date().toISOString();

  return ACHIEVEMENT_DEFINITIONS.map((definition) => {
    const prev = previous.find((a) => a.id === definition.id);
    const isUnlocked = checkAchievement(
      definition.id,
      quests,
      totalXp
    );

    return {
      ...definition,
      unlocked: isUnlocked,
      unlockedAt: isUnlocked
        ? (prev?.unlockedAt ?? now)
        : undefined,
    };
  });
}

export function getNewlyUnlocked(
  previous: Achievement[],
  updated: Achievement[]
): Achievement[] {
  return updated.filter((achievement) => {
    if (!achievement.unlocked) return false;
    const prev = previous.find((a) => a.id === achievement.id);
    return !prev?.unlocked;
  });
}
