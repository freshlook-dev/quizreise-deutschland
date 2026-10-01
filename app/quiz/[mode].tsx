import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AnswerButton, Card, Header, PrimaryButton, ProgressBar, Screen, SecondaryButton, WalletPill } from '@/src/components/ui';
import { FINAL_POOL, findQuestion, getCategoryQuestions, QUICK_POOL } from '@/src/data/questions';
import { getState } from '@/src/data/states';
import { PRIZE_LADDER, getCategoryReward, getCategoryRewardDelta, selectQuestions, shuffleQuestionAnswers } from '@/src/game/rules';
import { useGame } from '@/src/state/GameProvider';
import { colors, formatEuro, spacing } from '@/src/theme';
import { CategoryId, Question, QuizMode, StateId } from '@/src/types';

const ANSWER_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string; stateId?: string; categoryId?: string; resume?: string }>();
  const mode = (params.mode ?? 'quick') as QuizMode;
  const { progress, session, hydrated, recordCategoryResult, completeFinal, setQuickHighScore, saveSession } = useGame();
  const initialized = useRef(false);
  const resumeSession = params.resume === '1' && session?.mode === mode ? session : null;
  const effectiveStateId = (resumeSession?.stateId ?? params.stateId ?? 'HH') as StateId;
  const effectiveCategoryId = (resumeSession?.categoryId ?? params.categoryId ?? 'general') as CategoryId;
  const pool = useMemo(() => mode === 'quick' ? QUICK_POOL : mode === 'final' ? FINAL_POOL : getCategoryQuestions(effectiveStateId, effectiveCategoryId), [effectiveCategoryId, effectiveStateId, mode]);
  const questionCount = mode === 'category' ? 10 : 15;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<Array<{ text: string; originalIndex: number }>>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [usedLifelines, setUsedLifelines] = useState<string[]>([]);
  const [hintVisible, setHintVisible] = useState(false);
  const [lastWasCorrect, setLastWasCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (!hydrated || initialized.current) return;
    initialized.current = true;
    if (resumeSession) {
      const restored = resumeSession.questionIds.map(findQuestion).filter((item): item is Question => Boolean(item));
      if (restored.length > 0) {
        setQuestions(restored);
        setCurrentIndex(Math.min(resumeSession.currentIndex, restored.length - 1));
        setAnswers(resumeSession.answers);
        setUsedLifelines(resumeSession.usedLifelines);
        setCorrectCount(resumeSession.answers.reduce((total, answer, index) => total + (restored[index]?.correctIndex === answer ? 1 : 0), 0));
        return;
      }
    }
    const selectedQuestions = selectQuestions(pool, questionCount, progress.seenQuestionIds, progress.recentQuestionIds);
    setQuestions(selectedQuestions);
  }, [hydrated, mode, params.resume, pool, progress.recentQuestionIds, progress.seenQuestionIds, questionCount, resumeSession]);

  const question = questions[currentIndex];

  useEffect(() => {
    if (!question) return;
    setOptions(shuffleQuestionAnswers(question));
    setSelected(null);
    setAnswered(false);
    setHintVisible(false);
    setLastWasCorrect(null);
  }, [question, currentIndex]);

  useEffect(() => {
    if (!questions.length || !initialized.current) return;
    saveSession({ mode, stateId: mode === 'quick' ? undefined : effectiveStateId, categoryId: mode === 'category' ? effectiveCategoryId : undefined, questionIds: questions.map((item) => item.id), currentIndex, answers, usedLifelines });
  }, [answers, currentIndex, effectiveCategoryId, effectiveStateId, mode, questions, saveSession, usedLifelines]);

  if (!hydrated || !question || options.length === 0) {
    return <Screen scroll={false} contentStyle={styles.loading}><Text style={styles.loadingText}>Fragen werden gemischt …</Text></Screen>;
  }

  const isFinal = mode === 'final';
  const isQuick = mode === 'quick';
  const stateName = getState(effectiveStateId).name;
  const progressValue = currentIndex / questionCount;
  const availablePrize = isQuick ? PRIZE_LADDER[Math.max(0, currentIndex - 1)] : null;

  function selectAnswer(originalIndex: number) {
    if (answered) return;
    const correct = originalIndex === question.correctIndex;
    setSelected(originalIndex);
    setAnswered(true);
    setLastWasCorrect(correct);
    setAnswers((current) => [...current, originalIndex]);
    if (correct) setCorrectCount((current) => current + 1);
  }

  function useFiftyFifty() {
    if (answered || usedLifelines.includes('fifty')) return;
    const incorrect = options.filter((option) => option.originalIndex !== question.correctIndex);
    const keepIncorrect = incorrect[Math.floor(Math.random() * incorrect.length)];
    setOptions(options.filter((option) => option.originalIndex === question.correctIndex || option.originalIndex === keepIncorrect.originalIndex));
    setUsedLifelines((current) => [...current, 'fifty']);
  }

  function useHint() {
    if (answered || usedLifelines.includes('hint')) return;
    setHintVisible(true);
    setUsedLifelines((current) => [...current, 'hint']);
  }

  function useSwap() {
    if (answered || usedLifelines.includes('swap')) return;
    const alternatives = pool.filter((candidate) => candidate.id !== question.id && Math.abs(candidate.difficulty - question.difficulty) <= 1);
    if (!alternatives.length) return;
    const replacement = alternatives[Math.floor(Math.random() * alternatives.length)];
    setQuestions((current) => current.map((item, index) => index === currentIndex ? replacement : item));
    setUsedLifelines((current) => [...current, 'swap']);
  }

  function goToResult(nextCorrectCount: number) {
    saveSession(null);
    if (mode === 'category') {
      const previousBest = progress.categoryBest[effectiveStateId]?.[effectiveCategoryId] ?? 0;
      const earned = getCategoryRewardDelta(previousBest, nextCorrectCount);
      recordCategoryResult(effectiveStateId, effectiveCategoryId, nextCorrectCount, questions.map((item) => item.id));
      router.replace({ pathname: '/result', params: { resultType: 'category', stateId: effectiveStateId, categoryId: effectiveCategoryId, score: String(nextCorrectCount), reward: String(earned), best: String(Math.max(previousBest, nextCorrectCount)) } });
      return;
    }
    if (isFinal) {
      const passed = nextCorrectCount === 15 && lastWasCorrect === true;
      if (passed) completeFinal(effectiveStateId, 15, questions.map((item) => item.id));
      router.replace({ pathname: '/result', params: { resultType: passed ? 'final-success' : 'final-failure', stateId: effectiveStateId, score: String(nextCorrectCount) } });
      return;
    }
    const prize = nextCorrectCount === 15 ? PRIZE_LADDER[14] : nextCorrectCount === 0 ? 0 : PRIZE_LADDER[nextCorrectCount - 1];
    setQuickHighScore(prize);
    router.replace({ pathname: '/result', params: { resultType: 'quick', score: String(nextCorrectCount), prize: String(prize) } });
  }

  function nextQuestion() {
    if (!answered) return;
    if ((isFinal || isQuick) && !lastWasCorrect) {
      goToResult(correctCount);
      return;
    }
    if (currentIndex === questions.length - 1) {
      goToResult(correctCount);
      return;
    }
    setCurrentIndex((current) => current + 1);
  }

  return <Screen>
    <Header title={isQuick ? 'SCHNELLQUIZ' : isFinal ? 'DAS GROSSE FINALE' : getState(effectiveStateId).name} subtitle={isQuick ? '15 Fragen · der Jackpot wartet' : isFinal ? `${stateName} · 15/15 zum Bestehen` : `${getState(effectiveStateId).categories.find((item) => item.id === effectiveCategoryId)?.name ?? 'Quiz'} · 10 Fragen`} onBack={() => router.back()} right={!isQuick ? <WalletPill value={progress.wallet} /> : undefined} />
    <View style={styles.questionMeta}><Text style={styles.questionNumber}>FRAGE {currentIndex + 1} <Text style={styles.questionMuted}>/ {questionCount}</Text></Text>{isQuick && <Text style={styles.prizeText}>{formatEuro(availablePrize ?? 0)}</Text>}</View>
    <ProgressBar value={(currentIndex + (answered ? 1 : 0)) / questionCount} color={isQuick ? colors.gold : colors.info} />
    <Card accent style={styles.questionCard}><Text style={styles.difficulty}>{isFinal || isQuick ? `SCHWIERIGKEIT ${'★'.repeat(Math.min(5, question.difficulty))}` : question.category.toUpperCase()}</Text><Text style={styles.questionText}>{question.text}</Text></Card>

    <View style={styles.lifelineRow}><SecondaryButton compact title="50:50" onPress={useFiftyFifty} disabled={!isFinal && !isQuick || answered || usedLifelines.includes('fifty')} style={styles.lifeline} /><SecondaryButton compact title="Hinweis" onPress={useHint} disabled={!isFinal && !isQuick || answered || usedLifelines.includes('hint')} style={styles.lifeline} /><SecondaryButton compact title="Tauschen" onPress={useSwap} disabled={!isFinal && !isQuick || answered || usedLifelines.includes('swap')} style={styles.lifeline} /></View>
    {hintVisible ? <Card style={styles.hintCard}><Text style={styles.hintTitle}>HINWEIS</Text><Text style={styles.hintText}>{question.hint}</Text></Card> : null}

    <View style={styles.answers}>{options.map((option, index) => <AnswerButton key={`${question.id}-${option.originalIndex}`} label={ANSWER_LABELS[index]} text={option.text} selected={selected === option.originalIndex} correct={answered && option.originalIndex === question.correctIndex} wrong={answered && selected === option.originalIndex && option.originalIndex !== question.correctIndex} disabled={answered} onPress={() => selectAnswer(option.originalIndex)} />)}</View>
    {answered ? <Card style={lastWasCorrect ? styles.feedbackCorrect : styles.feedbackWrong}><Text style={styles.feedbackTitle}>{lastWasCorrect ? 'Richtig!' : isFinal || isQuick ? 'Das war leider falsch.' : 'Nicht ganz.'}</Text><Text style={styles.feedbackText}>{question.explanation}</Text>{!lastWasCorrect && (isFinal || isQuick) ? <Text style={styles.feedbackAnswer}>Richtige Antwort: {question.options[question.correctIndex]}</Text> : null}</Card> : null}
    {answered ? <PrimaryButton title={!lastWasCorrect && (isFinal || isQuick) ? 'Ergebnis anzeigen' : currentIndex === questions.length - 1 ? 'Ergebnis anzeigen' : 'Nächste Frage'} onPress={nextQuestion} /> : null}
    {isFinal ? <Text style={styles.finalRule}>Im Finale beendet eine falsche Antwort den Versuch sofort. Du kannst jederzeit kostenlos neu starten.</Text> : null}
  </Screen>;
}

const styles = StyleSheet.create({
  loading: { alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: colors.mutedText, fontSize: 16 },
  questionMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  questionNumber: { color: colors.gold, fontSize: 12, fontWeight: '900', letterSpacing: 1.1 },
  questionMuted: { color: colors.mutedText },
  prizeText: { color: colors.text, fontSize: 15, fontWeight: '900' },
  questionCard: { padding: spacing.lg, marginTop: spacing.lg, minHeight: 170, justifyContent: 'center' },
  difficulty: { color: colors.gold, fontSize: 10, fontWeight: '900', letterSpacing: 1.1, marginBottom: 13 },
  questionText: { color: colors.text, fontSize: 22, lineHeight: 30, fontWeight: '900' },
  lifelineRow: { flexDirection: 'row', gap: 7, marginBottom: spacing.md },
  lifeline: { flex: 1, paddingHorizontal: 4, minHeight: 42 },
  hintCard: { padding: 12, borderColor: 'rgba(94,167,217,0.45)', marginBottom: spacing.sm },
  hintTitle: { color: colors.info, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  hintText: { color: colors.text, fontSize: 13, lineHeight: 18, marginTop: 4 },
  answers: { marginTop: 4 },
  feedbackCorrect: { borderColor: '#6FCB9B', backgroundColor: 'rgba(36,123,89,0.72)' },
  feedbackWrong: { borderColor: '#DE7580', backgroundColor: 'rgba(181,61,73,0.72)' },
  feedbackTitle: { color: colors.text, fontWeight: '900', fontSize: 17 },
  feedbackText: { color: colors.text, lineHeight: 19, marginTop: 4, fontSize: 13 },
  feedbackAnswer: { color: colors.text, fontWeight: '900', marginTop: 8, fontSize: 13 },
  finalRule: { color: colors.mutedText, textAlign: 'center', fontSize: 11, lineHeight: 16, marginTop: spacing.md },
});
