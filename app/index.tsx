import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, PrimaryButton, Screen, StatPill, WalletPill } from '@/src/components/ui';
import { BrandMark, JourneyRing, ModeIcon, Reveal } from '@/src/components/visuals';
import { useGame } from '@/src/state/GameProvider';
import { colors, radii, spacing } from '@/src/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { progress, session, hydrated } = useGame();
  const completed = progress.completedStates.length;
  const journeyProgress = completed / 16;

  if (!hydrated) {
    return <Screen scroll={false} contentStyle={styles.loading}><Text style={styles.loadingText}>Deine Reise wird geladen …</Text></Screen>;
  }

  return <Screen>
    <Reveal delay={30} style={styles.topRow}><View style={styles.brandRow}><BrandMark size={48} /><View style={styles.brandCopy}><Text style={styles.kicker}>DAS TRIVIA-ABENTEUER</Text><Text style={styles.logo}>QUIZREISE</Text><Text style={styles.logoAccent}>DEUTSCHLAND</Text></View></View><Pressable onPress={() => router.push('/settings')} style={({ pressed }) => [styles.profile, pressed && styles.pressed]} accessibilityLabel="Einstellungen öffnen"><Text style={styles.profileText}>•••</Text></Pressable></Reveal>

    <Reveal delay={120}>
      <Card accent style={styles.heroCard}>
        <View style={styles.heroGlow} /><View style={styles.heroTop}><View style={styles.heroCopy}><Text style={styles.heroEyebrow}>DEINE REISE BEGINNT</Text><Text style={styles.heroTitle}>Bereit für Deutschland?</Text><Text style={styles.heroBody}>Sammle Wissen. Schalte Länder frei. Werde zur Trivia-Legende.</Text></View><JourneyRing value={journeyProgress} label="REISE" /></View>
        <View style={styles.heroLine} /><View style={styles.heroStats}><WalletPill value={progress.wallet} /><StatPill label="Meisterschaften" value={`${completed} / 16`} /><View style={styles.status}><View style={styles.statusDot} /><Text style={styles.statusText}>DEMO</Text></View></View>
      </Card>
    </Reveal>

    {session ? <Reveal delay={190}><Card style={styles.resumeCard}><View style={styles.resumeRow}><View style={styles.resumeIcon}><Text style={styles.resumeIconText}>↗</Text></View><View style={styles.resumeText}><Text style={styles.resumeEyebrow}>DEIN SPIELSTAND</Text><Text style={styles.resumeTitle}>Reise fortsetzen</Text><Text style={styles.resumeBody}>Dein Quiz wartet auf dich.</Text></View></View><PrimaryButton title="Weiter spielen" compact onPress={() => router.push({ pathname: '/quiz/[mode]', params: { mode: session.mode, resume: '1' } })} /></Card></Reveal> : null}

    <Reveal delay={230}><View style={styles.sectionHeader}><Text style={styles.sectionLabel}>WÄHLE DEINE ROUTE</Text><Text style={styles.sectionIndex}>01 / 02</Text></View></Reveal>
    <Reveal delay={280}><Pressable onPress={() => router.push('/career/map')} accessibilityRole="button"><Card style={styles.modeCard}><ModeIcon type="career" /><View style={styles.modeCopy}><Text style={styles.modeKicker}>HAUPTREISE</Text><Text style={styles.modeTitle}>Karrieremodus</Text><Text style={styles.modeDescription}>16 Bundesländer, ein großes Finale und deine persönliche Reise.</Text><View style={styles.modeFooter}><Text style={styles.modeMeta}>FORTSCHRITT {completed} / 16</Text><Text style={styles.modeLink}>ÖFFNEN ↗</Text></View></View></Card></Pressable></Reveal>
    <Reveal delay={330}><Pressable onPress={() => router.push({ pathname: '/quiz/[mode]', params: { mode: 'quick' } })} accessibilityRole="button"><Card style={styles.modeCard}><ModeIcon type="quick" /><View style={styles.modeCopy}><Text style={styles.modeKicker}>ARCADE-RUNDE</Text><Text style={styles.modeTitle}>Schnellquiz</Text><Text style={styles.modeDescription}>15 Fragen. Drei Joker. Ein virtueller Jackpot.</Text><View style={styles.modeFooter}><Text style={styles.modeMeta}>TOP-PREIS 1.000.000 €</Text><Text style={styles.modeLink}>STARTEN ↗</Text></View></View></Card></Pressable></Reveal>

    <Reveal delay={380} style={styles.demoNote}><View style={styles.demoLine} /><Text style={styles.demoText}>Lokaler Demo-Modus · Fortschritt bleibt auf diesem Gerät.</Text><View style={styles.demoLine} /></Reveal>
  </Screen>;
}

const styles = StyleSheet.create({
  loading: { alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: colors.mutedText, fontSize: 16 },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.lg },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brandCopy: { marginLeft: 11 },
  kicker: { color: colors.gold, fontSize: 9, fontWeight: '900', letterSpacing: 1.8 },
  logo: { color: colors.text, fontSize: 29, fontWeight: '900', letterSpacing: 1.6, lineHeight: 31 },
  logoAccent: { color: colors.gold, fontSize: 13, fontWeight: '900', letterSpacing: 3.3, lineHeight: 16 },
  profile: { width: 44, height: 44, backgroundColor: 'rgba(42,68,106,0.72)', borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
  profileText: { color: colors.gold, fontSize: 18, fontWeight: '900', letterSpacing: 2, marginTop: -7 },
  heroCard: { padding: spacing.lg, marginBottom: spacing.lg, overflow: 'hidden' },
  heroGlow: { position: 'absolute', width: 170, height: 170, borderRadius: 85, backgroundColor: 'rgba(239,198,103,0.08)', right: -55, top: -65 },
  heroTop: { flexDirection: 'row', alignItems: 'center' },
  heroCopy: { flex: 1, paddingRight: 10 },
  heroEyebrow: { color: colors.gold, fontWeight: '900', fontSize: 10, letterSpacing: 1.5 },
  heroTitle: { color: colors.text, fontSize: 24, fontWeight: '900', marginTop: 7, letterSpacing: -0.3 },
  heroBody: { color: colors.mutedText, fontSize: 13, lineHeight: 19, marginTop: 8, maxWidth: 220 },
  heroLine: { height: 1, backgroundColor: 'rgba(255,255,255,0.10)', marginVertical: 18 },
  heroStats: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  status: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#63D69A', marginRight: 5 },
  statusText: { color: colors.mutedText, fontWeight: '900', fontSize: 9, letterSpacing: 1 },
  resumeCard: { borderColor: 'rgba(94,167,217,0.40)' },
  resumeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  resumeIcon: { width: 43, height: 43, borderRadius: 15, backgroundColor: 'rgba(94,167,217,0.20)', alignItems: 'center', justifyContent: 'center', marginRight: 11, borderWidth: 1, borderColor: 'rgba(94,167,217,0.35)' },
  resumeIconText: { color: colors.info, fontSize: 22, fontWeight: '900' },
  resumeText: { flex: 1 },
  resumeEyebrow: { color: colors.info, fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
  resumeTitle: { color: colors.text, fontSize: 16, fontWeight: '900', marginTop: 3 },
  resumeBody: { color: colors.mutedText, fontSize: 11, marginTop: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm, marginBottom: spacing.sm },
  sectionLabel: { color: colors.mutedText, fontSize: 10, letterSpacing: 1.6, fontWeight: '900' },
  sectionIndex: { color: colors.gold, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  modeCard: { padding: 13, flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  modeCopy: { flex: 1 },
  modeKicker: { color: colors.gold, fontSize: 9, letterSpacing: 1.2, fontWeight: '900' },
  modeTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: 3 },
  modeDescription: { color: colors.mutedText, fontSize: 12, lineHeight: 17, marginTop: 4 },
  modeFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  modeMeta: { color: '#7C91B2', fontSize: 9, fontWeight: '900', letterSpacing: 0.7 },
  modeLink: { color: colors.gold, fontSize: 10, fontWeight: '900', letterSpacing: 0.6 },
  pressed: { opacity: 0.78 },
  demoNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.md, gap: 8 },
  demoLine: { height: 1, flex: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  demoText: { color: colors.mutedText, fontSize: 9, letterSpacing: 0.2 },
});
