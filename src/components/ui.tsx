import { LinearGradient } from 'expo-linear-gradient';
import React, { PropsWithChildren } from 'react';
import { Pressable, PressableProps, SafeAreaView, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { AmbientBackground } from '@/src/components/visuals';
import { colors, formatEuro, radii, spacing } from '@/src/theme';

export function Screen({ children, scroll = true, contentStyle }: PropsWithChildren<{ scroll?: boolean; contentStyle?: StyleProp<ViewStyle> }>) {
  const body = scroll ? <ScrollView contentContainerStyle={[styles.scrollContent, contentStyle]} showsVerticalScrollIndicator={false}>{children}</ScrollView> : <View style={[styles.fill, contentStyle]}>{children}</View>;
  return <AmbientBackground><SafeAreaView style={styles.fill}>{body}</SafeAreaView></AmbientBackground>;
}

export function Header({ title, subtitle, onBack, right }: { title: string; subtitle?: string; onBack?: () => void; right?: React.ReactNode }) {
  return <View style={styles.header}>
    <View style={styles.headerLeft}>
      {onBack ? <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Zurück" style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}><Text style={styles.backText}>‹</Text></Pressable> : null}
      <View><Text style={styles.headerTitle}>{title}</Text>{subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}</View>
    </View>
    {right}
  </View>;
}

export function WalletPill({ value }: { value: number }) {
  return <LinearGradient colors={['rgba(239,198,103,0.20)', 'rgba(190,145,48,0.08)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.wallet}><View style={styles.walletIcon}><Text style={styles.walletIconText}>€</Text></View><Text style={styles.walletText}>{formatEuro(value)}</Text></LinearGradient>;
}

export function PrimaryButton({ title, onPress, disabled = false, compact = false, style, ...props }: PressableProps & { title: string; compact?: boolean; style?: StyleProp<ViewStyle> }) {
  const isDisabled = Boolean(disabled);
  return <Pressable onPress={onPress} disabled={isDisabled} accessibilityRole="button" accessibilityState={{ disabled: isDisabled }} style={({ pressed }) => [styles.buttonShell, compact && styles.compactButton, pressed && !isDisabled && styles.pressed, style]} {...props}>
    <LinearGradient colors={isDisabled ? [colors.locked, '#303C55'] : ['#F9D77D', '#D7A63D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.primaryButton}><Text style={[styles.primaryText, isDisabled && styles.disabledText]}>{title}</Text>{!isDisabled ? <Text style={styles.buttonArrow}>↗</Text> : null}</LinearGradient>
  </Pressable>;
}

export function SecondaryButton({ title, onPress, disabled = false, compact = false, style, ...props }: PressableProps & { title: string; compact?: boolean; style?: StyleProp<ViewStyle> }) {
  const isDisabled = Boolean(disabled);
  return <Pressable onPress={onPress} disabled={isDisabled} accessibilityRole="button" accessibilityState={{ disabled: isDisabled }} style={({ pressed }) => [styles.secondaryButton, compact && styles.compactButton, isDisabled && styles.disabledSecondary, pressed && !isDisabled && styles.pressed, style]} {...props}><Text style={[styles.secondaryText, isDisabled && styles.disabledText]}>{title}</Text></Pressable>;
}

export function Card({ children, style, accent = false }: PropsWithChildren<{ style?: StyleProp<ViewStyle>; accent?: boolean }>) {
  return <LinearGradient colors={accent ? ['rgba(49,74,113,0.98)', 'rgba(30,49,82,0.96)'] : ['rgba(39,63,99,0.96)', 'rgba(31,51,83,0.96)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.card, accent && styles.accentCard, style]}>{children}</LinearGradient>;
}

export function SectionTitle({ title, caption }: { title: string; caption?: string }) {
  return <View style={styles.sectionTitle}><View style={styles.sectionMarker} /><View><Text style={styles.sectionTitleText}>{title}</Text>{caption ? <Text style={styles.sectionCaption}>{caption}</Text> : null}</View></View>;
}

export function ProgressBar({ value, color = colors.gold }: { value: number; color?: string }) {
  return <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.max(0, Math.min(1, value)) * 100}%`, backgroundColor: color }]} /></View>;
}

export function StatPill({ label, value }: { label: string; value: string }) {
  return <View style={styles.statPill}><Text style={styles.statLabel}>{label}</Text><Text style={styles.statValue}>{value}</Text></View>;
}

export function AnswerButton({ label, text, selected, correct, wrong, disabled, onPress }: { label: string; text: string; selected?: boolean; correct?: boolean; wrong?: boolean; disabled?: boolean; onPress: () => void }) {
  const answerColors: [string, string] = correct ? [colors.correct, '#1E664A'] : wrong ? [colors.wrong, '#81323C'] : ['rgba(42,68,106,0.98)', 'rgba(31,51,83,0.98)'];
  return <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={`${label}: ${text}`} style={({ pressed }) => [styles.answerShell, selected && styles.answerSelected, pressed && !disabled && styles.pressed]}><LinearGradient colors={answerColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.answer}><View style={[styles.answerLabel, selected && styles.answerLabelSelected]}><Text style={styles.answerLabelText}>{label}</Text></View><Text style={styles.answerText}>{text}</Text>{correct ? <Text style={styles.answerCheck}>✓</Text> : wrong ? <Text style={styles.answerCheck}>×</Text> : null}</LinearGradient></Pressable>;
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return <Card><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyMessage}>{message}</Text></Card>;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scrollContent: { padding: spacing.md, paddingBottom: 44 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  backButton: { width: 42, height: 42, borderRadius: 15, backgroundColor: 'rgba(42,68,106,0.75)', alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  backText: { color: colors.text, fontSize: 34, lineHeight: 36, fontWeight: '300', marginTop: -2 },
  headerTitle: { color: colors.text, fontSize: 19, fontWeight: '900', letterSpacing: 1 },
  headerSubtitle: { color: colors.mutedText, fontSize: 11, marginTop: 3, letterSpacing: 0.3 },
  wallet: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, paddingHorizontal: 8, paddingRight: 12, borderRadius: radii.pill, borderWidth: 1, borderColor: 'rgba(239,198,103,0.42)' },
  walletIcon: { width: 25, height: 25, borderRadius: 9, backgroundColor: 'rgba(239,198,103,0.18)', alignItems: 'center', justifyContent: 'center', marginRight: 7 },
  walletIconText: { color: colors.gold, fontWeight: '900', fontSize: 13 },
  walletText: { color: colors.text, fontWeight: '900', fontSize: 12 },
  buttonShell: { minHeight: 54, borderRadius: radii.md, overflow: 'hidden' },
  primaryButton: { minHeight: 54, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg, flexDirection: 'row' },
  compactButton: { minHeight: 43, borderRadius: radii.sm },
  primaryText: { color: colors.backgroundDeep, fontSize: 15, fontWeight: '900', letterSpacing: 0.2 },
  buttonArrow: { color: colors.backgroundDeep, fontSize: 18, fontWeight: '900', marginLeft: 9, marginTop: -2 },
  secondaryButton: { backgroundColor: 'rgba(28,49,82,0.55)', minHeight: 52, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  secondaryText: { color: colors.gold, fontSize: 14, fontWeight: '900' },
  disabledSecondary: { borderColor: colors.locked, backgroundColor: 'rgba(40,50,72,0.38)' },
  disabledText: { color: '#8995AA' },
  pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
  card: { borderRadius: radii.lg, padding: spacing.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', marginBottom: spacing.md, shadowColor: '#000', shadowOpacity: 0.22, shadowRadius: 18, shadowOffset: { width: 0, height: 9 }, elevation: 5 },
  accentCard: { borderColor: 'rgba(239,198,103,0.30)' },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, marginTop: spacing.sm },
  sectionMarker: { width: 4, height: 23, borderRadius: 2, backgroundColor: colors.gold, marginRight: 9 },
  sectionTitleText: { color: colors.text, fontSize: 17, fontWeight: '900', letterSpacing: 0.2 },
  sectionCaption: { color: colors.mutedText, marginTop: 3, fontSize: 12 },
  progressTrack: { height: 7, borderRadius: 4, backgroundColor: 'rgba(16,27,56,0.58)', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  progressFill: { height: '100%', borderRadius: 4 },
  statPill: { backgroundColor: 'rgba(16,27,56,0.35)', borderRadius: radii.sm, paddingVertical: 8, paddingHorizontal: 10, minWidth: 78, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  statLabel: { color: colors.mutedText, fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { color: colors.text, fontWeight: '900', fontSize: 14, marginTop: 2 },
  answerShell: { minHeight: 63, borderRadius: radii.md, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
  answerSelected: { borderColor: colors.gold, shadowColor: colors.gold, shadowOpacity: 0.28, shadowRadius: 12, elevation: 3 },
  answer: { minHeight: 61, borderRadius: radii.md, flexDirection: 'row', alignItems: 'center', padding: 9 },
  answerLabel: { height: 40, width: 40, borderRadius: 12, backgroundColor: 'rgba(16,27,56,0.48)', alignItems: 'center', justifyContent: 'center', marginRight: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
  answerLabelSelected: { backgroundColor: colors.gold },
  answerLabelText: { color: colors.gold, fontWeight: '900' },
  answerText: { color: colors.text, fontSize: 14, fontWeight: '800', flex: 1, lineHeight: 19 },
  answerCheck: { color: colors.text, fontSize: 22, fontWeight: '900', marginLeft: 8 },
  emptyTitle: { color: colors.text, fontWeight: '900', fontSize: 17 },
  emptyMessage: { color: colors.mutedText, lineHeight: 21, marginTop: 5 },
});
