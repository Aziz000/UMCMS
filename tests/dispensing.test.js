import { describe, it, expect } from 'vitest';
import {
  PRESCRIPTIONS,
  getInteractionBadge,
  getReviewMessage,
  getConfirmPrompt,
  getDispensedMessage,
} from '../src/dispensing.js';

describe('PRESCRIPTIONS data', () => {
  it('contains exactly 3 prescriptions', () => {
    expect(PRESCRIPTIONS).toHaveLength(3);
  });

  it('each prescription has all required fields', () => {
    for (const rx of PRESCRIPTIONS) {
      expect(rx).toHaveProperty('rxId');
      expect(rx).toHaveProperty('patient');
      expect(rx).toHaveProperty('doctor');
      expect(rx).toHaveProperty('drugs');
      expect(rx).toHaveProperty('issued');
      expect(rx).toHaveProperty('interaction');
    }
  });

  it('drugs field is always a non-empty array', () => {
    for (const rx of PRESCRIPTIONS) {
      expect(Array.isArray(rx.drugs)).toBe(true);
      expect(rx.drugs.length).toBeGreaterThan(0);
    }
  });

  it('each interaction has a level and label', () => {
    for (const rx of PRESCRIPTIONS) {
      expect(rx.interaction).toHaveProperty('level');
      expect(rx.interaction).toHaveProperty('label');
    }
  });

  it('RX-1041 has a moderate interaction with two drugs', () => {
    const rx = PRESCRIPTIONS.find(r => r.rxId === 'RX-1041');
    expect(rx).toBeDefined();
    expect(rx.interaction.level).toBe('moderate');
    expect(rx.drugs).toEqual(['Warfarin', 'Aspirin']);
  });

  it('RX-1042 has no interaction and one drug', () => {
    const rx = PRESCRIPTIONS.find(r => r.rxId === 'RX-1042');
    expect(rx).toBeDefined();
    expect(rx.interaction.level).toBe('none');
    expect(rx.drugs).toEqual(['Amoxicillin']);
  });

  it('RX-1043 has no interaction and two drugs', () => {
    const rx = PRESCRIPTIONS.find(r => r.rxId === 'RX-1043');
    expect(rx).toBeDefined();
    expect(rx.interaction.level).toBe('none');
    expect(rx.drugs).toEqual(['Metformin', 'Lisinopril']);
  });

  it('all RX IDs are unique', () => {
    const ids = PRESCRIPTIONS.map(rx => rx.rxId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('getInteractionBadge', () => {
  it('returns warn class for a moderate interaction', () => {
    const badge = getInteractionBadge({ level: 'moderate', label: 'Moderate' });
    expect(badge.cssClass).toBe('warn');
  });

  it('returns the label in warn badge text', () => {
    const badge = getInteractionBadge({ level: 'moderate', label: 'Moderate' });
    expect(badge.text).toBe('⚠ Moderate');
  });

  it('returns ok class for no interaction', () => {
    const badge = getInteractionBadge({ level: 'none', label: 'None' });
    expect(badge.cssClass).toBe('ok');
  });

  it('returns checkmark text for no interaction', () => {
    const badge = getInteractionBadge({ level: 'none', label: 'None' });
    expect(badge.text).toBe('✓ None');
  });

  it('returns warn for any non-none level', () => {
    const badge = getInteractionBadge({ level: 'severe', label: 'Severe' });
    expect(badge.cssClass).toBe('warn');
    expect(badge.text).toContain('Severe');
  });

  it('warn badge text always starts with the warning symbol', () => {
    const badge = getInteractionBadge({ level: 'minor', label: 'Minor' });
    expect(badge.text).toMatch(/^⚠/);
  });
});

describe('getReviewMessage', () => {
  it('generates the correct message for RX-1041 (moderate interaction)', () => {
    const msg = getReviewMessage('RX-1041', ['Warfarin', 'Aspirin'], { level: 'moderate', label: 'Moderate' });
    expect(msg).toBe('Reviewing RX-1041: Warfarin + Aspirin — Moderate interaction detected.');
  });

  it('generates the correct message for RX-1042 (no interaction)', () => {
    const msg = getReviewMessage('RX-1042', ['Amoxicillin'], { level: 'none', label: 'None' });
    expect(msg).toBe('Reviewing RX-1042: No interactions found.');
  });

  it('generates the correct message for RX-1043 (no interaction)', () => {
    const msg = getReviewMessage('RX-1043', ['Metformin', 'Lisinopril'], { level: 'none', label: 'None' });
    expect(msg).toBe('Reviewing RX-1043: No interactions found.');
  });

  it('always includes the RX ID', () => {
    const msg = getReviewMessage('RX-9999', ['DrugA'], { level: 'none', label: 'None' });
    expect(msg).toContain('RX-9999');
  });

  it('joins multiple drugs with " + "', () => {
    const msg = getReviewMessage('RX-0001', ['DrugA', 'DrugB', 'DrugC'], { level: 'moderate', label: 'Moderate' });
    expect(msg).toContain('DrugA + DrugB + DrugC');
  });

  it('no-interaction message does not contain drug names', () => {
    const msg = getReviewMessage('RX-1042', ['Amoxicillin'], { level: 'none', label: 'None' });
    expect(msg).not.toContain('Amoxicillin');
  });

  it('interaction message includes the interaction label', () => {
    const msg = getReviewMessage('RX-0001', ['DrugA', 'DrugB'], { level: 'moderate', label: 'Moderate' });
    expect(msg).toContain('Moderate');
  });
});

describe('getConfirmPrompt', () => {
  it('returns the correct prompt for RX-1041', () => {
    expect(getConfirmPrompt('RX-1041')).toBe('Confirm dispensing for RX-1041?');
  });

  it('returns the correct prompt for RX-1042', () => {
    expect(getConfirmPrompt('RX-1042')).toBe('Confirm dispensing for RX-1042?');
  });

  it('always includes the RX ID', () => {
    expect(getConfirmPrompt('RX-9999')).toContain('RX-9999');
  });

  it('ends with a question mark', () => {
    expect(getConfirmPrompt('RX-1043')).toMatch(/\?$/);
  });
});

describe('getDispensedMessage', () => {
  it('returns the correct message for RX-1041', () => {
    expect(getDispensedMessage('RX-1041')).toBe('RX-1041 marked as Dispensed.');
  });

  it('returns the correct message for RX-1042', () => {
    expect(getDispensedMessage('RX-1042')).toBe('RX-1042 marked as Dispensed.');
  });

  it('always includes the RX ID', () => {
    expect(getDispensedMessage('RX-9999')).toContain('RX-9999');
  });

  it('ends with a period', () => {
    expect(getDispensedMessage('RX-1043')).toMatch(/\.$/);
  });

  it('always says "Dispensed"', () => {
    expect(getDispensedMessage('RX-0001')).toContain('Dispensed');
  });
});
