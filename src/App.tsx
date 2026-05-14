import { useQuests } from './hooks/useQuests';
import { Header } from './components/Header';
import { QuestForm } from './components/QuestForm';
import { Statistics } from './components/Statistics';
import { Achievements } from './components/Achievements';
import { QuestLog } from './components/QuestLog';
import { ACHIEVEMENT_DEFINITIONS } from './lib/achievements';
import type { Achievement } from './types';

function buildInitialAchievements(): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.map((def) => ({
    ...def,
    unlocked: false,
  }));
}

export function App() {
  const {
    quests,
    achievements,
    levelInfo,
    addQuest,
  } = useQuests();

  const displayAchievements =
    achievements.length > 0
      ? achievements
      : buildInitialAchievements();

  return (
    <div className="app">
      <Header
        levelInfo={levelInfo}
        questCount={quests.length}
      />

      <main id="main-content" className="main">
        <div className="main__top">
          <QuestForm onSubmit={addQuest} />
          <Statistics quests={quests} />
        </div>

        <div className="main__bottom">
          <Achievements achievements={displayAchievements} />
          <QuestLog quests={quests} />
        </div>
      </main>

      <footer className="footer" role="contentinfo">
        <p>
          Dividend Quest &copy; {new Date().getFullYear()} &mdash;
          Gamifiziertes Dividenden-Portfolio-Tracking
        </p>
      </footer>
    </div>
  );
}
