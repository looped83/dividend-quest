import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '../components/Header';
import { Statistics } from '../components/Statistics';
import { Achievements } from '../components/Achievements';
import { QuestLog } from '../components/QuestLog';
import { QuestForm } from '../components/QuestForm';
import { ACHIEVEMENT_DEFINITIONS } from '../lib/achievements';
import type { LevelInfo, Achievement, Quest } from '../types';

// ── Helpers ────────────────────────────────────────────────

function makeLevelInfo(
  overrides: Partial<LevelInfo> = {}
): LevelInfo {
  return {
    level: 1,
    currentXp: 200,
    xpForNextLevel: 1_000,
    totalXp: 200,
    ...overrides,
  };
}

function makeAchievements(
  unlockedIds: string[] = []
): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.map((d) => ({
    ...d,
    unlocked: unlockedIds.includes(d.id),
    unlockedAt: unlockedIds.includes(d.id)
      ? new Date().toISOString()
      : undefined,
  }));
}

function makeQuest(
  overrides: Partial<Quest> = {}
): Quest {
  return {
    id: crypto.randomUUID(),
    name: 'Test Quest',
    amount: 1_000,
    dividendYield: 4,
    date: '2024-06-15T10:00:00.000Z',
    xpGained: 1_000,
    ...overrides,
  };
}

// ── Header ─────────────────────────────────────────────────

describe('Header', () => {
  it('renders the app title', () => {
    render(
      <Header levelInfo={makeLevelInfo()} questCount={0} />
    );
    expect(
      screen.getByRole('heading', { name: /dividend quest/i })
    ).toBeInTheDocument();
  });

  it('displays the current level number', () => {
    render(
      <Header levelInfo={makeLevelInfo({ level: 5 })} questCount={3} />
    );
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders the XP progress bar', () => {
    render(
      <Header levelInfo={makeLevelInfo()} questCount={0} />
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('sets correct aria-valuenow on progress bar', () => {
    render(
      <Header
        levelInfo={makeLevelInfo({ currentXp: 350, xpForNextLevel: 1_000 })}
        questCount={0}
      />
    );
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '350');
    expect(bar).toHaveAttribute('aria-valuemax', '1000');
  });

  it('shows quest count', () => {
    render(
      <Header levelInfo={makeLevelInfo()} questCount={7} />
    );
    expect(screen.getByText(/7 quests/i)).toBeInTheDocument();
  });

  it('uses singular "Quest" for count 1', () => {
    render(
      <Header levelInfo={makeLevelInfo()} questCount={1} />
    );
    expect(screen.getByText(/1 quest$/i)).toBeInTheDocument();
  });

  it('contains a skip navigation link', () => {
    render(
      <Header levelInfo={makeLevelInfo()} questCount={0} />
    );
    expect(
      screen.getByRole('link', { name: /hauptinhalt/i })
    ).toBeInTheDocument();
  });
});

// ── Statistics ─────────────────────────────────────────────

describe('Statistics', () => {
  it('shows zero values when no quests', () => {
    render(<Statistics quests={[]} />);
    const values = screen.getAllByText(/0,00/);
    expect(values.length).toBeGreaterThanOrEqual(3);
  });

  it('calculates annual dividends correctly', () => {
    // 2500 € @ 4% = 100 €/year
    const quests = [makeQuest({ amount: 2_500, dividendYield: 4 })];
    render(<Statistics quests={quests} />);
    // 100,00 € should appear
    expect(
      screen.getByText(/gesamt-kapital/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/jahres-dividenden/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/20-jahre-gewinn/i)
    ).toBeInTheDocument();
  });
});

// ── Achievements ───────────────────────────────────────────

describe('Achievements', () => {
  it('renders all 8 achievements', () => {
    render(<Achievements achievements={makeAchievements()} />);
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(8);
  });

  it('shows 0/8 count when none unlocked', () => {
    render(<Achievements achievements={makeAchievements()} />);
    expect(screen.getByText('0/8')).toBeInTheDocument();
  });

  it('shows correct count when some unlocked', () => {
    render(
      <Achievements
        achievements={makeAchievements(['first-quest', 'savings-rookie'])}
      />
    );
    expect(screen.getByText('2/8')).toBeInTheDocument();
  });

  it('applies unlocked CSS class to unlocked achievements', () => {
    render(
      <Achievements
        achievements={makeAchievements(['first-quest'])}
      />
    );
    const unlocked = screen
      .getAllByRole('article')
      .filter((el) =>
        el.className.includes('achievement--unlocked')
      );
    expect(unlocked).toHaveLength(1);
  });

  it('renders achievement names', () => {
    render(<Achievements achievements={makeAchievements()} />);
    expect(
      screen.getByText('Erster Schritt')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Quest-Sammler')
    ).toBeInTheDocument();
  });
});

// ── QuestLog ───────────────────────────────────────────────

describe('QuestLog', () => {
  it('shows empty state when no quests', () => {
    render(<QuestLog quests={[]} />);
    expect(
      screen.getByText(/noch keine quests/i)
    ).toBeInTheDocument();
  });

  it('renders quest rows', () => {
    const quests = [
      makeQuest({ name: 'Alpha Quest' }),
      makeQuest({ name: 'Beta Quest' }),
    ];
    render(<QuestLog quests={quests} />);
    expect(screen.getByText('Alpha Quest')).toBeInTheDocument();
    expect(screen.getByText('Beta Quest')).toBeInTheDocument();
  });

  it('shows quest count badge', () => {
    const quests = [makeQuest(), makeQuest()];
    render(<QuestLog quests={quests} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders sortable column headers', () => {
    render(<QuestLog quests={[makeQuest()]} />);
    expect(
      screen.getByRole('button', { name: /nach name sortieren/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /nach betrag sortieren/i })
    ).toBeInTheDocument();
  });

  it('toggles sort direction on repeated column click', async () => {
    const user = userEvent.setup();
    const quests = [
      makeQuest({ name: 'Alpha', amount: 500 }),
      makeQuest({ name: 'Zebra', amount: 2000 }),
    ];
    render(<QuestLog quests={quests} />);

    const nameBtn = screen.getByRole('button', {
      name: /nach name sortieren/i,
    });
    // First click: ascending
    await user.click(nameBtn);
    const rows = screen.getAllByRole('row').slice(1);
    expect(within(rows[0]).getByText('Alpha')).toBeInTheDocument();

    // Second click: descending
    await user.click(nameBtn);
    const rowsDesc = screen.getAllByRole('row').slice(1);
    expect(
      within(rowsDesc[0]).getByText('Zebra')
    ).toBeInTheDocument();
  });
});

// ── QuestForm ──────────────────────────────────────────────

describe('QuestForm', () => {
  it('renders all form fields', () => {
    render(<QuestForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/quest-name/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/kaufbetrag/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/dividendenrendite/i)
    ).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<QuestForm onSubmit={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: /quest starten/i })
    ).toBeInTheDocument();
  });

  it('shows validation error when amount is empty', async () => {
    const user = userEvent.setup();
    render(<QuestForm onSubmit={vi.fn()} />);
    await user.click(
      screen.getByRole('button', { name: /quest starten/i })
    );
    expect(
      screen.getByText(/bitte einen betrag eingeben/i)
    ).toBeInTheDocument();
  });

  it('shows validation error when yield is missing', async () => {
    const user = userEvent.setup();
    render(<QuestForm onSubmit={vi.fn()} />);
    await user.type(screen.getByLabelText(/kaufbetrag/i), '1000');
    await user.click(
      screen.getByRole('button', { name: /quest starten/i })
    );
    expect(
      screen.getByText(/bitte eine dividendenrendite eingeben/i)
    ).toBeInTheDocument();
  });

  it('calls onSubmit with parsed values on valid input', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockReturnValue({ xpGained: 1000 });
    render(<QuestForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByLabelText(/quest-name/i),
      'MacBook'
    );
    await user.type(
      screen.getByLabelText(/kaufbetrag/i),
      '1000'
    );
    await user.type(
      screen.getByLabelText(/dividendenrendite/i),
      '4'
    );
    await user.click(
      screen.getByRole('button', { name: /quest starten/i })
    );

    expect(onSubmit).toHaveBeenCalledWith('MacBook', 1000, 4);
  });

  it('resets form after successful submission', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockReturnValue({ xpGained: 500 });
    render(<QuestForm onSubmit={onSubmit} />);

    const amountInput = screen.getByLabelText(/kaufbetrag/i);
    await user.type(amountInput, '500');
    await user.type(
      screen.getByLabelText(/dividendenrendite/i),
      '3'
    );
    await user.click(
      screen.getByRole('button', { name: /quest starten/i })
    );

    expect(amountInput).toHaveValue('');
  });

  it('shows XP toast after successful submission', async () => {
    const user = userEvent.setup();
    const onSubmit = vi
      .fn()
      .mockReturnValue({ xpGained: 750 });
    render(<QuestForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByLabelText(/kaufbetrag/i),
      '750'
    );
    await user.type(
      screen.getByLabelText(/dividendenrendite/i),
      '4'
    );
    await user.click(
      screen.getByRole('button', { name: /quest starten/i })
    );

    expect(screen.getByRole('status')).toHaveTextContent(/xp/i);
  });

  it('shows error for negative amount', async () => {
    const user = userEvent.setup();
    render(<QuestForm onSubmit={vi.fn()} />);
    await user.type(
      screen.getByLabelText(/kaufbetrag/i),
      '-100'
    );
    await user.type(
      screen.getByLabelText(/dividendenrendite/i),
      '4'
    );
    await user.click(
      screen.getByRole('button', { name: /quest starten/i })
    );
    expect(
      screen.getByText(/betrag muss größer als 0/i)
    ).toBeInTheDocument();
  });
});
