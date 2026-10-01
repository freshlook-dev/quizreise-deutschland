import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card, Header, PrimaryButton, Screen, SecondaryButton, StatPill, WalletPill } from '@/src/components/ui';
import { getState } from '@/src/data/states';
import { useGame } from '@/src/state/GameProvider';
import { colors, formatEuro, spacing } from '@/src/theme';
import { CategoryId, StateId } from '@/src/types';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ resultType?: string; stateId?: string; categoryId?: string; score?: string; reward?: string; best?: string; prize?: string }>();
  const { progress } = useGame();
  const type = params.resultType ?? 'quick';
  const score = Number(params.score ?? 0);
  const stateId = (params.stateId ?? 'HH') as StateId;
  const state = getState(stateId);
  const categoryId = (params.categoryId ?? 'general') as CategoryId;
  const reward = Number(params.reward ?? 0);
  const prize = Number(params.prize ?? 0);
  const isFinalSuccess = type === 'final-success';
  const isFinalFailure = type === 'final-failure';
  const isCategory = type === 'category';
  const isQuick = type === 'quick';

  function retry() {
    if (isCategory) router.replace({ pathname: '/quiz/[mode]', params: { mode: 'category', stateId, categoryId } });
    else if (isFinalSuccess || isFinalFailure) router.replace({ pathname: '/quiz/[mode]', params: { mode: 'final', stateId } });
    else router.replace({ pathname: '/quiz/[mode]', params: { mode: 'quick' } });
  }

  return <Screen scroll={false} contentStyle={styles.screen}>
    <Header title="ERGEBNIS" onBack={() => router.replace('/')} right={!isQuick ? <WalletPill value={progress.wallet} /> : undefined} />
    <View style={styles.celebration}><Text style={styles.bigEmoji}>{isFinalSuccess ? '🏆' : isFinalFailure ? '🧭' : isCategory ? score >= 8 ? '✨' : '💡' : prize === 1000000 ? '🏆' : '⚡'}</Text><Text style={styles.title}>{isFinalSuccess ? 'BUNDESLAND GEMEISTERT!' : isFinalFailure ? 'NOCH NICHT GESCHAFFT' : isCategory ? score >= 8 ? 'KATEGORIE BESTANDEN' : 'WEITER ÜBEN' : prize === 1000000 ? 'JACKPOT!' : 'RUNDE BEENDET'}</Text><Text style={styles.subtitle}>{isFinalSuccess || isFinalFailure || isCategory ? state.name : 'Schnellquiz'}</Text></View>
    <Card accent style={styles.resultCard}>
      {isFinalSuccess ? <><Text style={styles.resultLead}>15 / 15 richtig</Text><Text style={styles.resultBody}>Du hast das Finale fehlerfrei gemeistert und {state.name} vollständig abgeschlossen.</Text><View style={styles.rewardBox}><Text style={styles.rewardLabel}>EINMALIGE FINALE-BELohnung</Text><Text style={styles.rewardValue}>{formatEuro(1500)}</Text></View></> : isFinalFailure ? <><Text style={styles.resultLead}>{score} / 15 richtig</Text><Text style={styles.resultBody}>Eine falsche Antwort beendet das Finale. Deine Kategorien und dein bisheriges Guthaben bleiben erhalten.</Text><View style={styles.infoBox}><Text style={styles.infoText}>Du kannst das Finale jederzeit kostenlos neu versuchen.</Text></View></> : isCategory ? <><View style={styles.statsRow}><StatPill label="Dein Ergebnis" value={`${score} / 10`} /><StatPill label="Bestwert" value={`${Number(params.best ?? score)} / 10`} /></View><Text style={styles.resultBody}>{score >= 8 ? 'Stark! Diese Kategorie gilt als bestanden.' : 'Für die Kategorie brauchst du mindestens 8 richtige Antworten.'}</Text><View style={styles.rewardBox}><Text style={styles.rewardLabel}>NEU VERDIENT</Text><Text style={styles.rewardValue}>{formatEuro(reward)}</Text></View></> : <><Text style={styles.resultLead}>{formatEuro(prize)}</Text><Text style={styles.resultBody}>{score === 15 ? 'Alle 15 Fragen richtig – der virtuelle Jackpot gehört dir.' : `Du hast ${score} von 15 Fragen richtig beantwortet.`}</Text><View style={styles.infoBox}><Text style={styles.infoText}>Schnellquiz-Gewinne bleiben getrennt und erhöhen nicht dein Karriere-Guthaben.</Text></View></>}
    </Card>
    <View style={styles.actions}><PrimaryButton title={isFinalSuccess ? 'Zur Deutschlandkarte' : isCategory ? 'Nochmal spielen' : 'Nochmal versuchen'} onPress={isFinalSuccess ? () => router.replace('/career/map') : retry} /><SecondaryButton title={isFinalSuccess || isFinalFailure ? 'Zurück zur Karte' : 'Zum Startbildschirm'} onPress={() => router.replace(isFinalSuccess || isFinalFailure ? '/career/map' : '/')} style={styles.secondaryAction} /></View>
  </Screen>;
}

const styles = StyleSheet.create({
  screen: { justifyContent: 'center' },
  celebration: { alignItems: 'center', marginVertical: spacing.lg },
  bigEmoji: { fontSize: 58, marginBottom: 12 },
  title: { color: colors.gold, fontSize: 22, fontWeight: '900', textAlign: 'center', letterSpacing: 0.6 },
  subtitle: { color: colors.mutedText, fontSize: 14, marginTop: 5 },
  resultCard: { padding: spacing.lg },
  resultLead: { color: colors.text, fontSize: 27, fontWeight: '900', textAlign: 'center' },
  resultBody: { color: colors.mutedText, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', gap: 10 },
  rewardBox: { backgroundColor: colors.secondary, borderRadius: 14, alignItems: 'center', padding: 15, marginTop: 18 },
  rewardLabel: { color: colors.mutedText, fontSize: 10, fontWeight: '900', letterSpacing: 0.7 },
  rewardValue: { color: colors.gold, fontSize: 25, fontWeight: '900', marginTop: 4 },
  infoBox: { borderRadius: 12, backgroundColor: colors.secondary, padding: 13, marginTop: 16 },
  infoText: { color: colors.mutedText, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  actions: { marginTop: 18 },
  secondaryAction: { marginTop: 10 },
});
