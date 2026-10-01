import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card, Header, PrimaryButton, ProgressBar, Screen, StatPill, WalletPill } from '@/src/components/ui';
import { getState } from '@/src/data/states';
import { allCategoriesPassed } from '@/src/game/rules';
import { useGame } from '@/src/state/GameProvider';
import { colors, formatEuro, radii, spacing } from '@/src/theme';
import { CategoryId, StateId } from '@/src/types';

export default function StateOverviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ stateId?: string }>();
  const stateId = (params.stateId ?? 'HH') as StateId;
  const state = getState(stateId);
  const { progress } = useGame();
  const best = progress.categoryBest[stateId] ?? {};
  const passedCount = state.categories.filter((category) => (best[category.id] ?? 0) >= 8).length;
  const finalUnlocked = allCategoriesPassed(progress, stateId, state.categories.map((category) => category.id));

  return <Screen>
    <Header title={state.name.toUpperCase()} subtitle="Bundesland-Übersicht" onBack={() => router.back()} right={<WalletPill value={progress.wallet} />} />
    <Card accent style={styles.hero}>
      <View style={styles.heroTop}><View style={styles.bigIcon}><Text style={styles.bigEmoji}>{state.emoji}</Text></View><View style={styles.heroCopy}><Text style={styles.heroTitle}>Deine Reise in {state.name}</Text><Text style={styles.heroSubtitle}>Hauptstadt · {state.capital}</Text></View></View>
      <View style={styles.progressLine}><Text style={styles.progressText}>{passedCount} / 6 Kategorien bestanden</Text><Text style={styles.progressText}>{Math.round((passedCount / 6) * 100)} %</Text></View><ProgressBar value={passedCount / 6} />
    </Card>

    <Text style={styles.sectionLabel}>QUIZ-KATEGORIEN</Text>
    <View style={styles.grid}>{state.categories.map((category) => {
      const score = best[category.id] ?? 0;
      const passed = score >= 8;
      return <Card key={category.id} style={styles.categoryCard}><View style={styles.categoryTop}><View style={styles.categoryIcon}><Text style={styles.categoryIconText}>{category.icon}</Text></View><View style={styles.categoryCopy}><Text style={styles.categoryName}>{category.name}</Text><Text style={styles.categoryMeta}>10 Fragen · bis {formatEuro(600)}</Text></View></View><View style={styles.categoryBottom}><StatPill label="Bestwert" value={`${score} / 10`} /><Text style={[styles.completionText, passed && styles.completedText]}>{passed ? '✓ Bestanden' : 'Offen'}</Text></View><PrimaryButton title={passed ? 'Verbessern' : 'Starten'} compact onPress={() => router.push({ pathname: '/quiz/[mode]', params: { mode: 'category', stateId, categoryId: category.id } })} /></Card>;
    })}</View>

    <Card accent style={[styles.finalCard, !finalUnlocked && styles.lockedCard]}><View style={styles.finalHeader}><View style={styles.trophy}><Text style={styles.trophyText}>{finalUnlocked ? '🏆' : '🔒'}</Text></View><View style={styles.finalCopy}><Text style={styles.finalTitle}>DAS GROSSE FINALE</Text><Text style={styles.finalSubtitle}>15 Fragen · 15/15 zum Bestehen · {formatEuro(1500)}</Text></View></View><Text style={styles.finalBody}>{finalUnlocked ? 'Alle Kategorien sind bestanden. Jetzt wartet die Meisterprüfung auf dich.' : `Noch ${6 - passedCount} Kategorien bis zur Meisterprüfung.`}</Text><PrimaryButton title={finalUnlocked ? 'Finale starten' : 'Finale gesperrt'} disabled={!finalUnlocked} onPress={() => router.push({ pathname: '/quiz/[mode]', params: { mode: 'final', stateId } })} /></Card>
    <Text style={styles.disclaimer}>Alle Einnahmen sind fiktive Quiz-Euro und nicht gegen echtes Geld einlösbar.</Text>
  </Screen>;
}

const styles = StyleSheet.create({
  hero: { padding: spacing.lg },
  heroTop: { flexDirection: 'row', alignItems: 'center' },
  bigIcon: { width: 62, height: 62, borderRadius: 21, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  bigEmoji: { fontSize: 32 },
  heroCopy: { flex: 1 },
  heroTitle: { color: colors.text, fontSize: 20, fontWeight: '900' },
  heroSubtitle: { color: colors.mutedText, fontSize: 13, marginTop: 3 },
  progressLine: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 8 },
  progressText: { color: colors.mutedText, fontSize: 12, fontWeight: '800' },
  sectionLabel: { color: colors.mutedText, fontSize: 11, letterSpacing: 1.4, fontWeight: '900', marginTop: spacing.md, marginBottom: spacing.sm },
  grid: { gap: 0 },
  categoryCard: { padding: spacing.md },
  categoryTop: { flexDirection: 'row', alignItems: 'center' },
  categoryIcon: { width: 43, height: 43, borderRadius: 14, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  categoryIconText: { color: colors.gold, fontSize: 21 },
  categoryCopy: { flex: 1 },
  categoryName: { color: colors.text, fontSize: 16, fontWeight: '900' },
  categoryMeta: { color: colors.mutedText, fontSize: 11, marginTop: 3 },
  categoryBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 12 },
  completionText: { color: colors.mutedText, fontSize: 12, fontWeight: '800' },
  completedText: { color: '#7FE1B2' },
  finalCard: { marginTop: 8, padding: spacing.lg },
  lockedCard: { borderColor: 'rgba(255,255,255,0.1)', opacity: 0.76 },
  finalHeader: { flexDirection: 'row', alignItems: 'center' },
  trophy: { width: 50, height: 50, borderRadius: 17, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  trophyText: { fontSize: 25 },
  finalCopy: { flex: 1 },
  finalTitle: { color: colors.gold, fontSize: 16, fontWeight: '900', letterSpacing: 0.7 },
  finalSubtitle: { color: colors.mutedText, fontSize: 12, marginTop: 4 },
  finalBody: { color: colors.mutedText, lineHeight: 19, marginVertical: 14, fontSize: 13 },
  disclaimer: { color: colors.mutedText, fontSize: 10, textAlign: 'center', lineHeight: 15, marginTop: spacing.sm },
});
