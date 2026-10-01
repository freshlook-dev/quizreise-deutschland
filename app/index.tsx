import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, PrimaryButton, Screen, StatPill, WalletPill } from '@/src/components/ui';
import { useGame } from '@/src/state/GameProvider';
import { colors, radii, spacing } from '@/src/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { progress, session, hydrated } = useGame();
  const completed = progress.completedStates.length;

  if (!hydrated) {
    return <Screen scroll={false} contentStyle={styles.loading}><Text style={styles.loadingText}>Deine Reise wird geladen …</Text></Screen>;
  }

  return <Screen>
    <View style={styles.topRow}><View><Text style={styles.kicker}>DAS TRIVIA-ABENTEUER</Text><Text style={styles.logo}>QUIZREISE</Text><Text style={styles.logoAccent}>DEUTSCHLAND</Text></View><Pressable onPress={() => router.push('/settings')} style={styles.profile} accessibilityLabel="Einstellungen öffnen"><Text style={styles.profileText}>⚙</Text></Pressable></View>

    <Card accent style={styles.heroCard}>
      <Text style={styles.heroEyebrow}>BEREIT FÜR DEINE</Text>
      <Text style={styles.heroTitle}>Reise durch Deutschland?</Text>
      <Text style={styles.heroBody}>Sammle Quiz-Euro, meistere Bundesländer und werde zur Trivia-Legende.</Text>
      <View style={styles.heroStats}><WalletPill value={progress.wallet} /><StatPill label="Meisterschaften" value={`${completed} / 16`} /></View>
    </Card>

    {session ? <Card style={styles.resumeCard}><View style={styles.resumeRow}><View style={styles.resumeIcon}><Text>▶</Text></View><View style={styles.resumeText}><Text style={styles.resumeTitle}>Quiz fortsetzen</Text><Text style={styles.resumeBody}>Dein Spielstand ist auf diesem Gerät gespeichert.</Text></View></View><PrimaryButton title="Weiter spielen" compact onPress={() => router.push({ pathname: '/quiz/[mode]', params: { mode: session.mode, resume: '1' } })} /></Card> : null}

    <Text style={styles.sectionLabel}>WÄHLE DEINEN MODUS</Text>
    <Pressable style={({ pressed }) => [styles.modeCard, pressed && styles.pressed]} onPress={() => router.push('/career/map')} accessibilityRole="button"><View style={[styles.modeIcon, { backgroundColor: '#315987' }]}><Text style={styles.modeEmoji}>🗺️</Text></View><View style={styles.modeCopy}><Text style={styles.modeTitle}>Karrieremodus</Text><Text style={styles.modeDescription}>Reise durch alle 16 Bundesländer und verdiene Quiz-Euro.</Text></View><Text style={styles.chevron}>›</Text></Pressable>
    <Pressable style={({ pressed }) => [styles.modeCard, pressed && styles.pressed]} onPress={() => router.push({ pathname: '/quiz/[mode]', params: { mode: 'quick' } })} accessibilityRole="button"><View style={[styles.modeIcon, { backgroundColor: '#775E2C' }]}><Text style={styles.modeEmoji}>⚡</Text></View><View style={styles.modeCopy}><Text style={styles.modeTitle}>Schnellquiz</Text><Text style={styles.modeDescription}>15 Fragen, drei Joker, bis zu 1.000.000 €.</Text></View><Text style={styles.chevron}>›</Text></Pressable>

    <View style={styles.demoNote}><Text style={styles.demoDot}>●</Text><Text style={styles.demoText}>Demo-Modus aktiv · Fortschritt bleibt lokal auf diesem Gerät.</Text></View>
  </Screen>;
}

const styles = StyleSheet.create({
  loading: { alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: colors.mutedText, fontSize: 16 },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.lg },
  kicker: { color: colors.gold, fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  logo: { color: colors.text, fontSize: 36, fontWeight: '900', letterSpacing: 1, lineHeight: 38 },
  logoAccent: { color: colors.gold, fontSize: 18, fontWeight: '900', letterSpacing: 4 },
  profile: { width: 44, height: 44, backgroundColor: colors.secondary, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  profileText: { color: colors.gold, fontSize: 21 },
  heroCard: { padding: spacing.lg, marginBottom: spacing.lg },
  heroEyebrow: { color: colors.gold, fontWeight: '900', fontSize: 11, letterSpacing: 1.4 },
  heroTitle: { color: colors.text, fontSize: 25, fontWeight: '900', marginTop: 5 },
  heroBody: { color: colors.mutedText, fontSize: 14, lineHeight: 21, marginTop: 8 },
  heroStats: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: spacing.lg },
  resumeCard: { borderColor: 'rgba(94,167,217,0.4)' },
  resumeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  resumeIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.info, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  resumeText: { flex: 1 },
  resumeTitle: { color: colors.text, fontSize: 16, fontWeight: '900' },
  resumeBody: { color: colors.mutedText, fontSize: 12, marginTop: 2 },
  sectionLabel: { color: colors.mutedText, fontSize: 11, letterSpacing: 1.5, fontWeight: '900', marginBottom: spacing.sm, marginTop: spacing.sm },
  modeCard: { backgroundColor: colors.card, borderRadius: radii.lg, padding: spacing.md, flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  modeIcon: { width: 52, height: 52, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  modeEmoji: { fontSize: 25 },
  modeCopy: { flex: 1 },
  modeTitle: { color: colors.text, fontSize: 17, fontWeight: '900' },
  modeDescription: { color: colors.mutedText, fontSize: 12, lineHeight: 17, marginTop: 3 },
  chevron: { color: colors.gold, fontSize: 30, fontWeight: '300', marginLeft: 5 },
  pressed: { opacity: 0.78 },
  demoNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg },
  demoDot: { color: colors.correct, fontSize: 12, marginRight: 6 },
  demoText: { color: colors.mutedText, fontSize: 11 },
});
