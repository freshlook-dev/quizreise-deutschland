import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { STATE_PURCHASE_COST, STATES } from '@/src/data/states';
import { applyCategoryResult, categoryPassed, completeFinalProgress, getCategoryReward, purchaseState as applyPurchase } from '@/src/game/rules';
import { CategoryId, GameProgress, QuizSessionSnapshot, StateId } from '@/src/types';

const STORAGE_KEY = '@quizreise-deutschland/local-demo-v1';

function createDefaultProgress(): GameProgress {
  return {
    playerId: `demo-${Date.now()}`,
    wallet: 0,
    unlockedStates: ['HH'],
    completedStates: [],
    categoryBest: {},
    finalRewardsClaimed: [],
    seenQuestionIds: [],
    recentQuestionIds: [],
    quickQuizHighScore: 0,
    settings: { sound: false, haptics: true },
  };
}

type PersistedData = { progress: GameProgress; session: QuizSessionSnapshot | null };

type GameContextValue = {
  progress: GameProgress;
  session: QuizSessionSnapshot | null;
  hydrated: boolean;
  recordCategoryResult: (stateId: StateId, categoryId: CategoryId, score: number, questionIds?: string[]) => void;
  completeFinal: (stateId: StateId, score: number, questionIds?: string[]) => boolean;
  buyState: (stateId: StateId) => { success: boolean; message: string };
  setQuickHighScore: (score: number) => void;
  saveSession: (nextSession: QuizSessionSnapshot | null) => void;
  resetProgress: () => void;
  toggleSetting: (setting: 'sound' | 'haptics') => void;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: PropsWithChildren) {
  const [progress, setProgress] = useState<GameProgress>(createDefaultProgress);
  const [session, setSession] = useState<QuizSessionSnapshot | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!value) return;
        const saved = JSON.parse(value) as PersistedData;
        if (saved.progress) setProgress(saved.progress);
        if (saved.session) setSession(saved.session);
      })
      .catch(() => {
        // A corrupt local save should never prevent the demo from launching.
      })
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload: PersistedData = { progress, session };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload)).catch(() => undefined);
  }, [hydrated, progress, session]);

  const value = useMemo<GameContextValue>(() => ({
    progress,
    session,
    hydrated,
    recordCategoryResult: (stateId, categoryId, score, questionIds = []) => {
      setProgress((current) => applyCategoryResult(current, stateId, categoryId, score, questionIds));
    },
    completeFinal: (stateId, score, questionIds = []) => {
      if (score !== 15) return false;
      const next = completeFinalProgress(progress, stateId, score, questionIds);
      if (next === progress) return false;
      setProgress(next);
      return true;
    },
    buyState: (stateId) => {
      try {
        const next = applyPurchase(stateId, progress);
        setProgress(next);
        return { success: true, message: `${STATES.find((item) => item.id === stateId)?.name ?? 'Bundesland'} ist jetzt freigeschaltet.` };
      } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : `Kauf nicht möglich. Kosten: ${STATE_PURCHASE_COST} Quiz-Euro.` };
      }
    },
    setQuickHighScore: (score) => {
      setProgress((current) => ({ ...current, quickQuizHighScore: Math.max(current.quickQuizHighScore, score) }));
    },
    saveSession: (nextSession) => setSession(nextSession),
    resetProgress: () => {
      setProgress(createDefaultProgress());
      setSession(null);
    },
    toggleSetting: (setting) => {
      setProgress((current) => ({ ...current, settings: { ...current.settings, [setting]: !current.settings[setting] } }));
    },
  }), [hydrated, progress, session]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame muss innerhalb von GameProvider verwendet werden.');
  return context;
}

export { categoryPassed, getCategoryReward };
