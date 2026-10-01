import { CategoryId, StateId, StateMeta } from '@/src/types';

export const STATE_PURCHASE_COST = 3500;
export const FINAL_REWARD = 1500;

const GENERAL_CATEGORIES: Array<{ id: CategoryId; name: string; icon: string }> = [
  { id: 'general', name: 'Allgemeinwissen', icon: '✦' },
  { id: 'geography', name: 'Geografie', icon: '⌖' },
  { id: 'history', name: 'Geschichte', icon: '⌛' },
  { id: 'science', name: 'Wissenschaft & Technik', icon: '⚗' },
  { id: 'culture', name: 'Sport & Kultur', icon: '★' },
];

const state = (
  id: StateId,
  name: string,
  capital: string,
  emoji: string,
  neighbors: StateId[],
  playable: boolean,
  localName: string,
): StateMeta => ({
  id,
  name,
  capital,
  emoji,
  neighbors,
  playable,
  categories: [...GENERAL_CATEGORIES, { id: 'local', name: localName, icon: emoji }],
});

export const STATES: StateMeta[] = [
  state('HH', 'Hamburg', 'Hamburg', '⚓', ['SH', 'NI'], true, 'Hamburg Spezial'),
  state('NI', 'Niedersachsen', 'Hannover', '🌾', ['SH', 'HH', 'HB', 'MV', 'BB', 'ST', 'TH', 'HE', 'NW'], true, 'Niedersachsen Lokal'),
  state('SH', 'Schleswig-Holstein', 'Kiel', '🌊', ['HH', 'NI', 'MV'], true, 'Schleswig-Holstein Lokal'),
  state('HB', 'Bremen', 'Bremen', '⚓', ['NI'], false, 'Bremen Lokal'),
  state('MV', 'Mecklenburg-Vorpommern', 'Schwerin', '⛵', ['SH', 'NI', 'BB'], false, 'MV Lokal'),
  state('BB', 'Brandenburg', 'Potsdam', '🌲', ['MV', 'NI', 'ST', 'SN', 'BE'], false, 'Brandenburg Lokal'),
  state('BE', 'Berlin', 'Berlin', '🏛️', ['BB'], false, 'Berlin Lokal'),
  state('ST', 'Sachsen-Anhalt', 'Magdeburg', '🏰', ['NI', 'BB', 'SN', 'TH'], false, 'Sachsen-Anhalt Lokal'),
  state('SN', 'Sachsen', 'Dresden', '🎼', ['BB', 'ST', 'TH', 'BY'], false, 'Sachsen Lokal'),
  state('TH', 'Thüringen', 'Erfurt', '🌳', ['NI', 'ST', 'SN', 'BY', 'HE'], false, 'Thüringen Lokal'),
  state('NW', 'Nordrhein-Westfalen', 'Düsseldorf', '⛏️', ['NI', 'HE', 'RP'], false, 'NRW Lokal'),
  state('HE', 'Hessen', 'Wiesbaden', '🌿', ['NW', 'NI', 'TH', 'BY', 'BW', 'RP'], false, 'Hessen Lokal'),
  state('RP', 'Rheinland-Pfalz', 'Mainz', '🍇', ['NW', 'HE', 'BW', 'SL'], false, 'Rheinland-Pfalz Lokal'),
  state('SL', 'Saarland', 'Saarbrücken', '🌉', ['RP', 'BW'], false, 'Saarland Lokal'),
  state('BW', 'Baden-Württemberg', 'Stuttgart', '🦁', ['RP', 'HE', 'BY'], false, 'Baden-Württemberg Lokal'),
  state('BY', 'Bayern', 'München', '🏔️', ['BW', 'HE', 'TH', 'SN'], false, 'Bayern Lokal'),
];

export const STATE_BY_ID = Object.fromEntries(STATES.map((item) => [item.id, item])) as Record<StateId, StateMeta>;

export function getState(id: StateId): StateMeta {
  return STATE_BY_ID[id];
}

export function getStateStatus(stateId: StateId, progress: { unlockedStates: StateId[]; completedStates: StateId[] }): 'locked' | 'available' | 'unlocked' | 'completed' | 'unavailable' {
  const stateMeta = getState(stateId);
  if (!stateMeta.playable) return 'unavailable';
  if (progress.completedStates.includes(stateId)) return 'completed';
  if (progress.unlockedStates.includes(stateId)) return 'unlocked';
  const hasCompletedNeighbor = stateMeta.neighbors.some((neighbor) => progress.completedStates.includes(neighbor));
  return hasCompletedNeighbor ? 'available' : 'locked';
}
