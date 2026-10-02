import { FINAL_REWARD, getState, STATE_PURCHASE_COST } from '@/src/data/states';
import { CategoryId, GameProgress, Question, StateId } from '@/src/types';

export const CATEGORY_REWARDS: Record<8 | 9 | 10, number> = {
  8: 450,
  9: 525,
  10: 600,
};

export const PRIZE_LADDER = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];

export function getCategoryReward(score: number): number {
  if (score < 8) return 0;
  return CATEGORY_REWARDS[Math.min(score, 10) as 8 | 9 | 10] ?? 0;
}

export function categoryPassed(score: number): boolean {
  return score >= 8;
}

export function getCategoryRewardDelta(previousBest: number, newScore: number): number {
  return Math.max(0, getCategoryReward(newScore) - getCategoryReward(previousBest));
}

export function applyCategoryResult(progress: GameProgress, stateId: StateId, categoryId: CategoryId, score: number, questionIds: string[] = []): GameProgress {
  const currentBest = progress.categoryBest[stateId]?.[categoryId] ?? 0;
  return {
    ...progress,
    wallet: progress.wallet + getCategoryRewardDelta(currentBest, score),
    categoryBest: {
      ...progress.categoryBest,
      [stateId]: { ...progress.categoryBest[stateId], [categoryId]: Math.max(currentBest, score) },
    },
    seenQuestionIds: Array.from(new Set([...progress.seenQuestionIds, ...questionIds])),
    recentQuestionIds: questionIds.slice(-12),
  };
}

export function allCategoriesPassed(progress: GameProgress, stateId: StateId, categoryIds: CategoryId[]): boolean {
  const best = progress.categoryBest[stateId] ?? {};
  return categoryIds.every((categoryId) => (best[categoryId] ?? 0) >= 8);
}

export function canPurchaseState(stateId: StateId, progress: Pick<GameProgress, 'wallet' | 'unlockedStates' | 'completedStates'>): { allowed: boolean; reason?: string } {
  const stateMeta = getState(stateId);
  if (!stateMeta.playable) return { allowed: false, reason: 'Dieses Bundesland wird im Prototyp noch vorbereitet.' };
  if (progress.unlockedStates.includes(stateId)) return { allowed: false, reason: 'Dieses Bundesland ist bereits freigeschaltet.' };
  const hasCompletedNeighbor = stateMeta.neighbors.some((neighbor) => progress.completedStates.includes(neighbor));
  if (!hasCompletedNeighbor) return { allowed: false, reason: 'Schließe zuerst das Finale eines Nachbar-Bundeslandes ab.' };
  if (progress.wallet < STATE_PURCHASE_COST) return { allowed: false, reason: `Dir fehlen noch ${STATE_PURCHASE_COST - progress.wallet} Quiz-Euro.` };
  return { allowed: true };
}

export function purchaseState(stateId: StateId, progress: GameProgress): GameProgress {
  const result = canPurchaseState(stateId, progress);
  if (!result.allowed) throw new Error(result.reason ?? 'Kauf nicht möglich.');
  return {
    ...progress,
    wallet: progress.wallet - STATE_PURCHASE_COST,
    unlockedStates: [...progress.unlockedStates, stateId],
  };
}

export function canClaimFinalReward(stateId: StateId, progress: Pick<GameProgress, 'finalRewardsClaimed' | 'completedStates'>): boolean {
  return !progress.finalRewardsClaimed.includes(stateId) && !progress.completedStates.includes(stateId);
}

export function evaluateQuizAnswer(correctIndex: number, selectedIndex: number, correctCount: number): { correct: boolean; ended: boolean; correctCount: number } {
  const correct = correctIndex === selectedIndex;
  return { correct, ended: !correct, correctCount: correct ? correctCount + 1 : correctCount };
}

export function evaluateFinalAnswer(correctIndex: number, selectedIndex: number, correctCount: number): { correct: boolean; ended: boolean; correctCount: number } {
  return evaluateQuizAnswer(correctIndex, selectedIndex, correctCount);
}

export function completeFinalProgress(progress: GameProgress, stateId: StateId, correctCount: number, questionIds: string[] = []): GameProgress {
  if (correctCount !== 15 || !canClaimFinalReward(stateId, progress)) return progress;
  return {
    ...progress,
    wallet: progress.wallet + FINAL_REWARD,
    completedStates: [...progress.completedStates, stateId],
    finalRewardsClaimed: [...progress.finalRewardsClaimed, stateId],
    seenQuestionIds: Array.from(new Set([...progress.seenQuestionIds, ...questionIds])),
    recentQuestionIds: questionIds.slice(-12),
  };
}

export function shuffleQuestionAnswers(question: Question, random: () => number = Math.random): Array<{ text: string; originalIndex: number }> {
  const answers = question.options.map((text, originalIndex) => ({ text, originalIndex }));
  for (let index = answers.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [answers[index], answers[target]] = [answers[target], answers[index]];
  }
  return answers;
}

export function selectQuestions(pool: Question[], count: number, seenIds: string[] = [], recentIds: string[] = [], random: () => number = Math.random): Question[] {
  const recent = new Set(recentIds);
  const unseen = pool.filter((question) => !seenIds.includes(question.id) && !recent.has(question.id));
  const unseenWithoutRecent = pool.filter((question) => !seenIds.includes(question.id));
  const candidates = [...unseen, ...unseenWithoutRecent, ...pool].filter((question, index, all) => all.findIndex((candidate) => candidate.id === question.id) === index);
  const shuffled = [...candidates];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
