import { LinearGradient } from 'expo-linear-gradient';
import React, { PropsWithChildren } from 'react';
import { Pressable, PressableProps, SafeAreaView, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors, formatEuro, radii, spacing } from '@/src/theme';

export function Screen({ children, scroll = true, contentStyle }: PropsWithChildren<{ scroll?: boolean; contentStyle?: StyleProp<ViewStyle> }>) {
  const body = scroll ? <ScrollView contentContainerStyle={[styles.scrollContent, contentStyle]} showsVerticalScrollIndicator={false}>{children}</ScrollView> : <View style={[styles.fill, contentStyle]}>{children}</View>;
  return <LinearGradient colors={[colors.backgroundDeep, colors.background]} style={styles.fill}><SafeAreaView style={styles.fill}>{body}</SafeAreaView></LinearGradient>;
}

export function Header({ title, subtitle, onBack, right }: { title: string; subtitle?: string; onBack?: () => void; right?: React.ReactNode }) {
  return <View style={styles.header}>
    <View style={styles.headerLeft}>
      {onBack ? <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Zurück" style={styles.backButton}><Text style={styles.backText}>‹</Text></Pressable> : null}
      <View><Text style={styles.headerTitle}>{title}</Text>{subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}</View>
    </View>
    {right}
  </View>;
}

export function WalletPill({ value }: { value: number }) {
  return <View style={styles.wallet}><Text style={styles.walletIcon}>€</Text><Text style={styles.walletText}>{formatEuro(value)}</Text></View>;
}

export function PrimaryButton({ title, onPress, disabled = false, compact = false, style, ...props }: PressableProps & { title: string; compact?: boolean; style?: StyleProp<ViewStyle> }) {
  const isDisabled = Boolean(disabled);
  return <Pressable onPress={onPress} disabled={isDisabled} accessibilityRole="button" accessibilityState={{ disabled: isDisabled }} style={({ pressed }) => [styles.primaryButton, compact && styles.compactButton, isDisabled && styles.disabledButton, pressed && !isDisabled && styles.pressed, style]} {...props}>
    <Text style={[styles.primaryText, isDisabled && styles.disabledText]}>{title}</Text>
  </Pressable>;
}

export function SecondaryButton({ title, onPress, disabled = false, compact = false, style, ...props }: PressableProps & { title: string; compact?: boolean; style?: StyleProp<ViewStyle> }) {
  const isDisabled = Boolean(disabled);
  return <Pressable onPress={onPress} disabled={isDisabled} accessibilityRole="button" accessibilityState={{ disabled: isDisabled }} style={({ pressed }) => [styles.secondaryButton, compact && styles.compactButton, isDisabled && styles.disabledSecondary, pressed && !isDisabled && styles.pressed, style]} {...props}>
    <Text style={[styles.secondaryText, isDisabled && styles.disabledText]}>{title}</Text>
  </Pressable>;
}

export function Card({ children, style, accent = false }: PropsWithChildren<{ style?: StyleProp<ViewStyle>; accent?: boolean }>) {
  return <View style={[styles.card, accent && styles.accentCard, style]}>{children}</View>;
}

export function SectionTitle({ title, caption }: { title: string; caption?: string }) {
  return <View style={styles.sectionTitle}><Text style={styles.sectionTitleText}>{title}</Text>{caption ? <Text style={styles.sectionCaption}>{caption}</Text> : null}</View>;
}

export function ProgressBar({ value, color = colors.gold }: { value: number; color?: string }) {
  return <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.max(0, Math.min(1, value)) * 100}%`, backgroundColor: color }]} /></View>;
}

export function StatPill({ label, value }: { label: string; value: string }) {
  return <View style={styles.statPill}><Text style={styles.statLabel}>{label}</Text><Text style={styles.statValue}>{value}</Text></View>;
}

export function AnswerButton({ label, text, selected, correct, wrong, disabled, onPress }: { label: string; text: string; selected?: boolean; correct?: boolean; wrong?: boolean; disabled?: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={`${label}: ${text}`} style={({ pressed }) => [styles.answer, selected && styles.answerSelected, correct && styles.answerCorrect, wrong && styles.answerWrong, pressed && !disabled && styles.pressed]}>
    <View style={styles.answerLabel}><Text style={styles.answerLabelText}>{label}</Text></View><Text style={styles.answerText}>{text}</Text>
  </Pressable>;
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return <Card><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyMessage}>{message}</Text></Card>;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scrollContent: { padding: spacing.md, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  backText: { color: colors.text, fontSize: 34, lineHeight: 36, fontWeight: '300' },
  headerTitle: { color: colors.text, fontSize: 20, fontWeight: '800', letterSpacing: 0.5 },
  headerSubtitle: { color: colors.mutedText, fontSize: 12, marginTop: 2 },
  wallet: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.secondary, paddingVertical: 8, paddingHorizontal: 12, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border },
  walletIcon: { color: colors.gold, fontWeight: '900', marginRight: 6, fontSize: 15 },
  walletText: { color: colors.text, fontWeight: '800', fontSize: 13 },
  primaryButton: { backgroundColor: colors.gold, minHeight: 54, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  compactButton: { minHeight: 42, paddingHorizontal: spacing.md, borderRadius: radii.sm },
  primaryText: { color: colors.backgroundDeep, fontSize: 16, fontWeight: '900' },
  secondaryButton: { backgroundColor: 'transparent', minHeight: 52, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  secondaryText: { color: colors.gold, fontSize: 15, fontWeight: '800' },
  disabledButton: { backgroundColor: colors.locked },
  disabledSecondary: { borderColor: colors.locked },
  disabledText: { color: '#8995AA' },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  card: { backgroundColor: colors.card, borderRadius: radii.lg, padding: spacing.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.md },
  accentCard: { borderColor: colors.border },
  sectionTitle: { marginBottom: spacing.sm, marginTop: spacing.sm },
  sectionTitleText: { color: colors.text, fontSize: 18, fontWeight: '900' },
  sectionCaption: { color: colors.mutedText, marginTop: 3, fontSize: 13 },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: colors.secondary, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  statPill: { backgroundColor: colors.secondary, borderRadius: radii.sm, paddingVertical: 8, paddingHorizontal: 10, minWidth: 78 },
  statLabel: { color: colors.mutedText, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.4 },
  statValue: { color: colors.text, fontWeight: '900', fontSize: 15, marginTop: 2 },
  answer: { minHeight: 62, borderRadius: radii.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: colors.card, flexDirection: 'row', alignItems: 'center', padding: 9, marginBottom: 10 },
  answerSelected: { borderColor: colors.gold },
  answerCorrect: { backgroundColor: colors.correct, borderColor: '#74D3A5' },
  answerWrong: { backgroundColor: colors.wrong, borderColor: '#E17E87' },
  answerLabel: { height: 40, width: 40, borderRadius: 12, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  answerLabelText: { color: colors.gold, fontWeight: '900' },
  answerText: { color: colors.text, fontSize: 15, fontWeight: '700', flex: 1 },
  emptyTitle: { color: colors.text, fontWeight: '900', fontSize: 17 },
  emptyMessage: { color: colors.mutedText, lineHeight: 21, marginTop: 5 },
});
