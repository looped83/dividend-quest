# ⚔️ Dividend Quest

A gamified portfolio tracking tool that turns avoided purchases into dividend
capital. Every skipped impulse buy becomes a quest — earning XP, unlocking
achievements, and building real long-term wealth.

## Features

- **Quest System** – Log avoided purchases with amount and dividend yield
- **Level Progression** – Earn 1 XP per euro; level up every 1,000 XP
- **Player Classes** – Novize → Lehrling → Krieger → Veteran → Meister → Legende
- **8 Achievements** – Capital, dividend, quest-count, and level milestones
- **Portfolio Statistics** – Total capital, annual dividends, 20-year projection
- **Sortable Quest Log** – Full history sortable by name, amount, yield, or date
- **Persistent State** – localStorage with graceful degradation
- **Accessible** – WCAG 2.1 AA (ARIA, keyboard navigation, screen readers)
- **Dark RPG Design** – Custom CSS, no UI framework

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 + TypeScript (strict) | UI + type safety |
| Vite 5 | Dev server & bundler |
| Vitest + Testing Library | Unit tests |
| ESLint 8 + jsx-a11y | Linting incl. accessibility rules |
| Prettier | Code formatting |

## Setup

**Requirements:** Node.js ≥ 18

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

```bash
npm run dev            # Start dev server with HMR
npm run build          # Type-check + production build
npm run preview        # Preview production build locally
npm run test           # Run test suite once
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
npm run lint           # ESLint
npm run format         # Prettier (write)
```

## Project Structure

```
src/
├── types/index.ts           # Shared TypeScript interfaces
├── lib/
│   ├── xp.ts                # XP & level calculations
│   ├── calculations.ts      # Dividend & portfolio math
│   ├── validation.ts        # Form input validation
│   └── achievements.ts      # Achievement logic (8 milestones)
├── hooks/
│   ├── useLocalStorage.ts   # Generic persistent state hook
│   └── useQuests.ts         # Core quest state management
├── components/
│   ├── Header.tsx           # Level badge + XP progress bar
│   ├── QuestForm.tsx        # Quest input with validation
│   ├── Statistics.tsx       # Capital / dividends / profit cards
│   ├── Achievements.tsx     # Achievement grid
│   └── QuestLog.tsx         # Sortable quest history table
├── tests/
│   ├── setup.ts             # Vitest setup + localStorage mock
│   ├── xp.test.ts
│   ├── calculations.test.ts
│   ├── achievements.test.ts
│   └── validation.test.ts
├── App.tsx
├── main.tsx
└── index.css                # Design system (CSS custom properties)
```

## Game Mechanics

### XP & Levels
- **1 XP per €** of avoided purchase (capped at 999,999 per quest)
- **1,000 XP per level** (flat progression)

### Achievements

| Achievement | Condition |
|---|---|
| Erster Schritt | 1 quest completed |
| Quest-Sammler | 5 quests completed |
| Quest-Meister | 10 quests completed |
| Spar-Novize | 1,000 € total capital |
| Spar-Profi | 10,000 € total capital |
| Dividenden-Starter | 100 €/year dividends |
| Dividenden-Jäger | 1,000 €/year dividends |
| Stufe-5-Krieger | Reach level 5 |

### Statistics Formula
- **Jahres-Dividenden** = Σ (amount × yield / 100)
- **20-Jahre-Gewinn** = Jahres-Dividenden × 20

## Accessibility

- Semantic HTML (`<header>`, `<main>`, `<section>`, `<table>`)
- All form inputs have associated `<label>` elements
- Inline error messages linked via `aria-describedby`
- XP progress bar uses `role="progressbar"` with value attributes
- Achievements use `aria-live="polite"` for dynamic state changes
- Skip-to-content link for keyboard users
- `prefers-reduced-motion` media query supported
- Colour contrast ≥ 4.5:1 for all text elements

## License

MIT
