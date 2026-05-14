import type { LevelInfo } from '../types';
import { getPlayerClass } from '../lib/xp';

interface HeaderProps {
  levelInfo: LevelInfo;
  questCount: number;
}

export function Header({ levelInfo, questCount }: HeaderProps) {
  const playerClass = getPlayerClass(levelInfo.level);
  const progressPercent = Math.min(
    100,
    (levelInfo.currentXp / levelInfo.xpForNextLevel) * 100
  );

  return (
    <header className="header" role="banner">
      <a href="#main-content" className="skip-link">
        Zum Hauptinhalt springen
      </a>

      <div className="header__brand">
        <h1 className="header__title">
          <span aria-hidden="true">⚔️</span>
          {'  '}Dividend Quest
        </h1>
        <p className="header__subtitle">
          Verwandle vermiedene Käufe in Dividendenkapital
        </p>
      </div>

      <div
        className="header__player"
        aria-label={`Level ${levelInfo.level} ${playerClass}, ${questCount} Quests abgeschlossen`}
      >
        <div className="header__level-badge" aria-hidden="true">
          {levelInfo.level}
        </div>

        <div className="header__player-info">
          <div className="header__player-meta">
            <span className="header__class">{playerClass}</span>
            <span className="header__quest-count">
              {questCount}{' '}
              {questCount === 1 ? 'Quest' : 'Quests'}
            </span>
          </div>

          <div
            className="xp-bar"
            role="progressbar"
            aria-valuenow={levelInfo.currentXp}
            aria-valuemin={0}
            aria-valuemax={levelInfo.xpForNextLevel}
            aria-label={`${levelInfo.currentXp} von ${levelInfo.xpForNextLevel} XP für Level ${levelInfo.level + 1}`}
          >
            <div
              className="xp-bar__fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="header__xp-text" aria-hidden="true">
            {levelInfo.currentXp.toLocaleString('de-DE')} /{' '}
            {levelInfo.xpForNextLevel.toLocaleString('de-DE')} XP
          </p>
        </div>
      </div>
    </header>
  );
}
