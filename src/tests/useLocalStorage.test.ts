import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useLocalStorage } from '../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  it('returns initialValue when localStorage is empty', () => {
    const { result } = renderHook(() =>
      useLocalStorage('hook-test-1', 42)
    );
    expect(result.current[0]).toBe(42);
  });

  it('reads existing value from localStorage on init', () => {
    localStorage.setItem('hook-test-2', JSON.stringify(99));
    const { result } = renderHook(() =>
      useLocalStorage('hook-test-2', 0)
    );
    expect(result.current[0]).toBe(99);
  });

  it('writes value to localStorage', () => {
    const { result } = renderHook(() =>
      useLocalStorage('hook-test-3', 'initial')
    );
    act(() => {
      result.current[1]('updated');
    });
    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('hook-test-3')).toBe(
      JSON.stringify('updated')
    );
  });

  it('supports functional updater form', () => {
    const { result } = renderHook(() =>
      useLocalStorage('hook-test-4', 10)
    );
    act(() => {
      result.current[1]((prev) => prev + 5);
    });
    expect(result.current[0]).toBe(15);
  });

  it('handles complex objects', () => {
    const initial = { name: 'test', value: 0 };
    const { result } = renderHook(() =>
      useLocalStorage('hook-test-5', initial)
    );
    act(() => {
      result.current[1]({ name: 'updated', value: 42 });
    });
    expect(result.current[0].name).toBe('updated');
    expect(result.current[0].value).toBe(42);
  });

  it('returns initialValue when localStorage getItem throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(
      () => {
        throw new Error('Storage error');
      }
    );
    const { result } = renderHook(() =>
      useLocalStorage('hook-test-6', 'fallback')
    );
    expect(result.current[0]).toBe('fallback');
    vi.restoreAllMocks();
  });

  it('does not throw when setItem fails', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(
      () => {
        throw new Error('Storage full');
      }
    );
    const { result } = renderHook(() =>
      useLocalStorage('hook-test-7', 0)
    );
    expect(() => {
      act(() => {
        result.current[1](99);
      });
    }).not.toThrow();
    // In-memory state should still update
    expect(result.current[0]).toBe(99);
    vi.restoreAllMocks();
  });
});
