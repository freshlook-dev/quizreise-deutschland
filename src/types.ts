export type StateId =
  | 'BW'
  | 'BY'
  | 'BE'
  | 'BB'
  | 'HB'
  | 'HH'
  | 'HE'
  | 'MV'
  | 'NI'
  | 'NW'
  | 'RP'
  | 'SL'
  | 'ST'
  | 'SN'
  | 'SH'
  | 'TH';

export type CategoryId = 'general' | 'geography' | 'history' | 'science' | 'culture' | 'local';
export type QuizMode = 'category' | 'final' | 'quick';
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export type Question = {
  id: string;
  text: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  category: CategoryId;
  difficulty: Difficulty;
  stateIds?: StateId[];
  hint: string;
  explanation: string;
  sourceUrl?: string;
  active: boolean;
};

export type CategoryBestScores = Partial<Record<CategoryId, number>>;

export type GameProgress = {
  playerId: string;
  wallet: number;
  unlockedStates: StateId[];
  completedStates: StateId[];
  categoryBest: Partial<Record<StateId, CategoryBestScores>>;
  finalRewardsClaimed: StateId[];
  seenQuestionIds: string[];
  recentQuestionIds: string[];
  quickQuizHighScore: number;
  settings: {
    sound: boolean;
    haptics: boolean;
  };
};

export type QuizSessionSnapshot = {
  mode: QuizMode;
  stateId?: StateId;
  categoryId?: CategoryId;
  questionIds: string[];
  currentIndex: number;
  answers: number[];
  usedLifelines: string[];
};

export type StateStatus = 'locked' | 'available' | 'unlocked' | 'completed' | 'unavailable';

export type StateMeta = {
  id: StateId;
  name: string;
  capital: string;
  emoji: string;
  playable: boolean;
  categories: Array<{ id: CategoryId; name: string; icon: string }>;
  neighbors: StateId[];
};
