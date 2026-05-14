import type { Achievement } from '../types';

interface AchievementCardProps {
  achievement: Achievement;
}

function AchievementCard({ achievement }: AchievementCardProps) {
  const { unlocked, icon, name, description } = achievement;

  return (
    <article
      className={`achievement${unlocked ? ' achievement--unlocked' : ''}`}
      aria-label={`${name}: ${description}${unlocked ? ' (freigeschaltet)' : ' (gesperrt)'}`}
    >
      <span
        className="achievement__icon"
        aria-hidden="true"
      >
        {icon}
      </span>
      <h3 className="achievement__name">{name}</h3>
      <p className="achievement__description">{description}</p>
      {unlocked && (
        <span className="achievement__badge" aria-hidden="true">
          ✓
        </span>
      )}
    </article>
  );
}

interface AchievementsProps {
  achievements: Achievement[];
}

export function Achievements({ achievements }: AchievementsProps) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <section
      className="card achievements"
      aria-labelledby="achievements-heading"
    >
      <h2 id="achievements-heading" className="card__title">
        <span aria-hidden="true">🏆</span> Erfolge
        <span className="achievements__count" aria-label={`${unlockedCount} von ${achievements.length} freigeschaltet`}>
          {unlockedCount}/{achievements.length}
        </span>
      </h2>

      <div
        className="achievements__grid"
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions"
      >
        {achievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
          />
        ))}
      </div>
    </section>
  );
}
