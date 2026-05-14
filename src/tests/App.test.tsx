import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { App } from '../App';

describe('App (integration)', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders the header with title', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /dividend quest/i })
    ).toBeInTheDocument();
  });

  it('renders level 1 on first load', () => {
    render(<App />);
    // Level badge shows "1"
    const header = screen.getByRole('banner');
    expect(within(header).getByText('1')).toBeInTheDocument();
  });

  it('renders the XP progress bar', () => {
    render(<App />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders all 3 stat cards', () => {
    render(<App />);
    expect(screen.getByText(/gesamt-kapital/i)).toBeInTheDocument();
    expect(
      screen.getAllByText(/jahres-dividenden/i)[0]
    ).toBeInTheDocument();
    expect(screen.getByText(/20-jahre-gewinn/i)).toBeInTheDocument();
  });

  it('renders the quest form', () => {
    render(<App />);
    expect(
      screen.getByRole('button', { name: /quest starten/i })
    ).toBeInTheDocument();
  });

  it('renders all 8 achievements locked initially', () => {
    render(<App />);
    expect(screen.getByText('0/8')).toBeInTheDocument();
  });

  it('renders the empty quest log', () => {
    render(<App />);
    expect(
      screen.getByText(/noch keine quests/i)
    ).toBeInTheDocument();
  });

  it('renders the footer', () => {
    render(<App />);
    expect(
      screen.getByRole('contentinfo')
    ).toBeInTheDocument();
  });
});
