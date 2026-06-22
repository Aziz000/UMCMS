export const PRESCRIPTIONS = [
  {
    rxId: 'RX-1041',
    patient: 'Ahmed Al-Rashidi',
    doctor: 'Dr. Khalid Omar',
    drugs: ['Warfarin', 'Aspirin'],
    issued: '09/05/2026 08:14',
    interaction: { level: 'moderate', label: 'Moderate' },
  },
  {
    rxId: 'RX-1042',
    patient: 'Sara Al-Mutairi',
    doctor: 'Dr. Noura Fahad',
    drugs: ['Amoxicillin'],
    issued: '09/05/2026 09:02',
    interaction: { level: 'none', label: 'None' },
  },
  {
    rxId: 'RX-1043',
    patient: 'Omar Bin Saleh',
    doctor: 'Dr. Khalid Omar',
    drugs: ['Metformin', 'Lisinopril'],
    issued: '09/05/2026 09:45',
    interaction: { level: 'none', label: 'None' },
  },
];

export function getInteractionBadge(interaction) {
  if (interaction.level === 'none') {
    return { cssClass: 'ok', text: '✓ None' };
  }
  return { cssClass: 'warn', text: `⚠ ${interaction.label}` };
}

export function getReviewMessage(rxId, drugs, interaction) {
  if (interaction.level === 'none') {
    return `Reviewing ${rxId}: No interactions found.`;
  }
  const drugList = drugs.join(' + ');
  return `Reviewing ${rxId}: ${drugList} — ${interaction.label} interaction detected.`;
}

export function getConfirmPrompt(rxId) {
  return `Confirm dispensing for ${rxId}?`;
}

export function getDispensedMessage(rxId) {
  return `${rxId} marked as Dispensed.`;
}
