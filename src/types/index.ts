export interface Quest {
  id: string;
  name: string;
  amount: number;
  dividendYield: number;
  date: string;
  xpGained: number;
}

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Achievement extends AchievementDefinition {
  unlocked: boolean;
  unlockedAt?: string;
}

export interface LevelInfo {
  level: number;
  currentXp: number;
  xpForNextLevel: number;
  totalXp: number;
}

export interface QuestResult {
  xpGained: number;
  newlyUnlocked: Achievement[];
}

export type SortField =
  | 'date'
  | 'amount'
  | 'dividendYield'
  | 'name';

export type SortDirection = 'asc' | 'desc';

export interface QuestFormData {
  name: string;
  amount: string;
  dividendYield: string;
}

export type FormErrors = Partial<Record<keyof QuestFormData, string>>;
