export const colors = {
  background: '#101B38',
  backgroundDeep: '#0A1228',
  secondary: '#1D3154',
  card: '#253D63',
  cardElevated: '#2E4A75',
  gold: '#EFC667',
  goldDark: '#BE9130',
  text: '#FFFFFF',
  mutedText: '#A9B8D2',
  correct: '#247B59',
  wrong: '#B53D49',
  info: '#5EA7D9',
  border: 'rgba(239,198,103,0.28)',
  locked: '#43506B',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
};

export function formatEuro(value: number): string {
  return `${new Intl.NumberFormat('de-DE').format(value)} €`;
}
