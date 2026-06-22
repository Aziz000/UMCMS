import { describe, it, expect } from 'vitest';
import { validateLoginInput, handleLogin } from '../src/login.js';

describe('validateLoginInput', () => {
  it('returns true when both username and password are provided', () => {
    expect(validateLoginInput('admin', 'password123')).toBe(true);
  });

  it('returns false when username is empty', () => {
    expect(validateLoginInput('', 'password123')).toBe(false);
  });

  it('returns false when password is empty', () => {
    expect(validateLoginInput('admin', '')).toBe(false);
  });

  it('returns false when both fields are empty', () => {
    expect(validateLoginInput('', '')).toBe(false);
  });

  it('returns false when username is whitespace only', () => {
    expect(validateLoginInput('   ', 'password123')).toBe(false);
  });

  it('returns false when password is whitespace only', () => {
    expect(validateLoginInput('admin', '   ')).toBe(false);
  });

  it('returns false when both fields are whitespace only', () => {
    expect(validateLoginInput('   ', '   ')).toBe(false);
  });

  it('returns true for a valid non-ASCII username', () => {
    expect(validateLoginInput('مستخدم', 'pass123')).toBe(true);
  });
});

describe('handleLogin', () => {
  it('returns success with redirect URL for valid credentials', () => {
    const result = handleLogin('admin', 'password123');
    expect(result.success).toBe(true);
    expect(result.redirectUrl).toBe('dispensing.html');
  });

  it('returns failure message for empty username', () => {
    const result = handleLogin('', 'password123');
    expect(result.success).toBe(false);
    expect(result.message).toBe('Please enter username and password.');
  });

  it('returns failure message for empty password', () => {
    const result = handleLogin('admin', '');
    expect(result.success).toBe(false);
    expect(result.message).toBe('Please enter username and password.');
  });

  it('returns failure when both fields are empty', () => {
    const result = handleLogin('', '');
    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();
  });

  it('does not include redirectUrl on failure', () => {
    const result = handleLogin('', '');
    expect(result.redirectUrl).toBeUndefined();
  });

  it('returns failure for whitespace-only username', () => {
    const result = handleLogin('   ', 'password');
    expect(result.success).toBe(false);
  });

  it('returns failure for whitespace-only password', () => {
    const result = handleLogin('admin', '   ');
    expect(result.success).toBe(false);
  });

  it('success result does not include a message', () => {
    const result = handleLogin('admin', 'pass');
    expect(result.message).toBeUndefined();
  });
});
