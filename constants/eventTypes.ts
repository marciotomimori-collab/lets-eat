export interface EventType {
  key: string;
  labelPt: string;
  labelEn: string;
  emoji: string;
}

export const EVENT_TYPES: EventType[] = [
  { key: 'couple', labelPt: 'Sair em casal', labelEn: 'Date night', emoji: '💕' },
  { key: 'family', labelPt: 'Em família', labelEn: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { key: 'solo', labelPt: 'Sozinho(a)', labelEn: 'Solo', emoji: '🧘' },
  { key: 'friends', labelPt: 'Com amigos', labelEn: 'With friends', emoji: '👥' },
  { key: 'celebration', labelPt: 'Comemoração', labelEn: 'Celebration', emoji: '🎉' },
  { key: 'work', labelPt: 'Trabalho', labelEn: 'Work', emoji: '💼' },
];

export const PRICE_LEVELS = [
  { key: 'PRICE_LEVEL_INEXPENSIVE', label: '$', value: 1 },
  { key: 'PRICE_LEVEL_MODERATE', label: '$$', value: 2 },
  { key: 'PRICE_LEVEL_EXPENSIVE', label: '$$$', value: 3 },
  { key: 'PRICE_LEVEL_VERY_EXPENSIVE', label: '$$$$', value: 4 },
] as const;
