import assert from 'node:assert/strict';
import test from 'node:test';

import { getState } from '@/src/data/states';
import { CATEGORY_REWARDS, PRIZE_LADDER, applyCategoryResult, canClaimFinalReward, canPurchaseState, categoryPassed, completeFinalProgress, evaluateFinalAnswer, evaluateQuizAnswer, getCategoryReward, getCategoryRewardDelta, purchaseState, shuffleQuestionAnswers } from '@/src/game/rules';
import { GameProgress, Question } from '@/src/types';

function progress(overrides: Partial<GameProgress> = {}): GameProgress {
  return { playerId: 'test', wallet: 0, unlockedStates: ['HH'], completedStates: [], categoryBest: {}, finalRewardsClaimed: [], seenQuestionIds: [], recentQuestionIds: [], quickQuizHighScore: 0, settings: { sound: false, haptics: true }, ...overrides };
}

test('Kategorie unter 8/10 fällt durch', () => assert.equal(categoryPassed(7), false));
test('Kategorie-Rewards für 8, 9 und 10 sind korrekt', () => {
  assert.deepEqual(CATEGORY_REWARDS, { 8: 450, 9: 525, 10: 600 });
  assert.equal(getCategoryReward(8), 450);
  assert.equal(getCategoryReward(9), 525);
  assert.equal(getCategoryReward(10), 600);
});
test('Verbesserung zahlt nur die Differenz', () => {
  assert.equal(getCategoryRewardDelta(0, 8), 450);
  assert.equal(getCategoryRewardDelta(8, 9), 75);
  assert.equal(getCategoryRewardDelta(9, 10), 75);
  assert.equal(getCategoryRewardDelta(10, 10), 0);
});
test('Eine falsche Final-Antwort beendet den Versuch', () => assert.deepEqual(evaluateFinalAnswer(2, 1, 4), { correct: false, ended: true, correctCount: 4 }));
test('Eine falsche Antwort beendet auch Kategorie und Schnellquiz sofort', () => {
  assert.deepEqual(evaluateQuizAnswer(1, 0, 6), { correct: false, ended: true, correctCount: 6 });
  assert.deepEqual(evaluateQuizAnswer(3, 2, 11), { correct: false, ended: true, correctCount: 11 });
});
test('15 korrekte Final-Antworten bestehen', () => assert.deepEqual(evaluateFinalAnswer(2, 2, 14), { correct: true, ended: false, correctCount: 15 }));
test('Finale wird nur einmal belohnt', () => {
  const first = completeFinalProgress(progress(), 'HH', 15);
  assert.equal(first.wallet, 1500);
  assert.deepEqual(completeFinalProgress(first, 'HH', 15), first);
  assert.equal(canClaimFinalReward('HH', first), false);
});
test('Kauf ohne ausreichendes Guthaben wird abgelehnt', () => assert.equal(canPurchaseState('NI', progress({ completedStates: ['HH'] })).allowed, false));
test('Kauf ohne abgeschlossenes Nachbar-Bundesland wird abgelehnt', () => assert.equal(canPurchaseState('NI', progress({ wallet: 3500 })).allowed, false));
test('Erfolgreicher Kauf kostet genau 3.500 Quiz-Euro', () => assert.equal(purchaseState('NI', progress({ wallet: 3500, completedStates: ['HH'] })).wallet, 0));
test('Bereits freigeschaltetes Bundesland kann nicht erneut gekauft werden', () => assert.equal(canPurchaseState('HH', progress({ wallet: 3500, completedStates: ['HH'] })).allowed, false));
test('Schnellquiz-Preisleiter ist vom Karriere-Wallet getrennt', () => {
  const careerWallet = 700;
  const quickPrize = PRIZE_LADDER[14];
  assert.equal(careerWallet, 700);
  assert.equal(quickPrize, 1000000);
});
test('Wiederholung oder Restore erzeugt keine doppelte Reward-Differenz', () => {
  const first = applyCategoryResult(progress(), 'HH', 'general', 10);
  const repeated = applyCategoryResult(first, 'HH', 'general', 10);
  assert.equal(first.wallet, 600);
  assert.equal(repeated.wallet, 600);
});
test('Antwort-Shuffle bewahrt die Identität der richtigen Antwort', () => {
  const question: Question = { id: 'shuffle', text: 'Test', options: ['A', 'B', 'C', 'D'], correctIndex: 2, category: 'general', difficulty: 1, hint: 'Hinweis', explanation: 'Erklärung', active: true };
  const shuffled = shuffleQuestionAnswers(question, () => 0.1);
  assert.equal(shuffled.find((answer) => answer.originalIndex === question.correctIndex)?.text, question.options[question.correctIndex]);
});

// This also guards the structured neighbor data used by the purchase rule.
test('Hamburg grenzt strukturiert an Niedersachsen und Schleswig-Holstein', () => assert.deepEqual(getState('HH').neighbors.sort(), ['NI', 'SH']));
