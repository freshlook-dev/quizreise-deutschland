import React, { PropsWithChildren, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, G, Line, Path, Polygon, Stop, Text as SvgText, LinearGradient as SvgGradient } from 'react-native-svg';

import { colors, radii } from '@/src/theme';
import { StateId, StateStatus } from '@/src/types';

export function AmbientBackground({ children }: PropsWithChildren) {
  const drift = useSharedValue(0);
  useEffect(() => {
    drift.value = withRepeat(withSequence(withTiming(1, { duration: 5200 }), withTiming(0, { duration: 5200 })), -1, false);
  }, [drift]);
  const orbStyle = useAnimatedStyle(() => ({ opacity: 0.18 + drift.value * 0.12, transform: [{ translateY: drift.value * 18 }, { scale: 0.94 + drift.value * 0.08 }] }));
  return <View style={styles.background}>
    <View style={styles.backgroundGradient} />
    <Animated.View style={[styles.orb, styles.orbGold, orbStyle]} />
    <Animated.View style={[styles.orb, styles.orbBlue, orbStyle]} />
    <View style={styles.gridLineOne} /><View style={styles.gridLineTwo} />
    {children}
  </View>;
}

export function BrandMark({ size = 48 }: { size?: number }) {
  return <View style={[styles.brandMark, { width: size, height: size, borderRadius: size * 0.34 }]}>
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Defs><SvgGradient id="brandGold" x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#FFE6A0" /><Stop offset="1" stopColor="#B67D20" /></SvgGradient></Defs>
      <Circle cx="24" cy="24" r="18" fill="none" stroke="url(#brandGold)" strokeWidth="1.8" opacity="0.9" />
      <Circle cx="24" cy="24" r="12" fill="none" stroke="url(#brandGold)" strokeWidth="1" opacity="0.6" />
      <Polygon points="24,7 28,20 41,24 28,28 24,41 20,28 7,24 20,20" fill="url(#brandGold)" />
      <Circle cx="24" cy="24" r="3" fill={colors.backgroundDeep} />
    </Svg>
  </View>;
}

export function JourneyRing({ value, size = 86, label = 'REISE' }: { value: number; size?: number; label?: string }) {
  const radius = 33;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * Math.max(0, Math.min(1, value));
  return <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <Svg width={size} height={size} viewBox="0 0 86 86" style={{ position: 'absolute' }}>
      <Defs><SvgGradient id="ringGold" x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#FFF0B1" /><Stop offset="1" stopColor="#C08C32" /></SvgGradient></Defs>
      <Circle cx="43" cy="43" r={radius} fill="none" stroke={colors.secondary} strokeWidth="7" />
      <Circle cx="43" cy="43" r={radius} fill="none" stroke="url(#ringGold)" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${dash} ${circumference}`} rotation="-90" origin="43,43" />
    </Svg>
    <Text style={styles.ringValue}>{Math.round(value * 100)}%</Text><Text style={styles.ringLabel}>{label}</Text>
  </View>;
}

export function ModeIcon({ type }: { type: 'career' | 'quick' }) {
  return <View style={styles.modeVisual}><Svg width="42" height="42" viewBox="0 0 42 42">
    <Defs><SvgGradient id={`mode-${type}`} x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor={type === 'career' ? '#BFE7FF' : '#FFE49A'} /><Stop offset="1" stopColor={type === 'career' ? '#4C99C8' : '#B77A24'} /></SvgGradient></Defs>
    {type === 'career' ? <><Path d="M8 13.5 21 7l13 6.5v15L21 35 8 28.5v-15Z" fill="none" stroke={`url(#mode-${type})`} strokeWidth="1.8" /><Path d="m8 13.5 13 7 13-7M21 20.5V35" fill="none" stroke={`url(#mode-${type})`} strokeWidth="1.8" /><Circle cx="16" cy="16" r="2" fill={colors.text} /><Circle cx="27" cy="26" r="2" fill={colors.text} /></> : <><Path d="m24 5-13 18h9l-3 14 14-21h-9l2-11Z" fill={`url(#mode-${type})`} /><Line x1="7" y1="31" x2="13" y2="31" stroke={colors.text} strokeWidth="1.5" opacity="0.7" /><Line x1="29" y1="10" x2="35" y2="10" stroke={colors.text} strokeWidth="1.5" opacity="0.7" /></>}
  </Svg></View>;
}

export function StateSeal({ stateId, status }: { stateId: StateId; status: StateStatus }) {
  const initials = stateId === 'HH' ? 'HH' : stateId;
  const accent = status === 'completed' ? colors.gold : status === 'unlocked' ? colors.info : status === 'available' ? '#E1B85B' : colors.locked;
  return <View style={[styles.stateSeal, { borderColor: accent }]}><Svg width="42" height="42" viewBox="0 0 42 42"><Circle cx="21" cy="21" r="16" fill="none" stroke={accent} strokeWidth="1.3" strokeDasharray="2 3" /><Path d="M21 7v28M7 21h28" stroke={accent} strokeWidth="0.8" opacity="0.55" /></Svg><Text style={[styles.stateInitials, { color: accent }]}>{initials}</Text></View>;
}

export function CategoryGlyph({ glyph, delay = 0 }: { glyph: string; delay?: number }) {
  return <Animated.View entering={FadeIn.delay(delay).duration(500)} style={styles.categoryGlyph}><Text style={styles.categoryGlyphText}>{glyph}</Text></Animated.View>;
}

export function Reveal({ children, delay = 0, style }: PropsWithChildren<{ delay?: number; style?: object }>) {
  return <Animated.View entering={FadeInDown.delay(delay).duration(600).springify()} style={style}>{children}</Animated.View>;
}

export function ResultBadge({ type }: { type: 'success' | 'failure' | 'practice' | 'jackpot' | 'quick-failure' }) {
  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(withSequence(withTiming(1, { duration: 1700 }), withTiming(0, { duration: 1700 })), -1, false);
  }, [pulse]);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: 0.96 + pulse.value * 0.05 }], opacity: 0.82 + pulse.value * 0.18 }));
  const accent = type === 'success' || type === 'jackpot' ? colors.gold : type === 'failure' || type === 'quick-failure' ? '#D87882' : colors.info;
  return <Animated.View style={[styles.resultBadge, { borderColor: accent, shadowColor: accent }, pulseStyle]}>
    <Svg width="68" height="68" viewBox="0 0 68 68">
      <Circle cx="34" cy="34" r="28" fill="rgba(16,27,56,0.42)" stroke={accent} strokeWidth="1.4" />
      <Circle cx="34" cy="34" r="22" fill="none" stroke={accent} strokeWidth="0.8" strokeDasharray="2 4" opacity="0.8" />
      {type === 'success' ? <><Polygon points="34,13 39,28 55,28 42,37 47,53 34,43 21,53 26,37 13,28 29,28" fill={accent} /><Circle cx="34" cy="34" r="4" fill={colors.backgroundDeep} /></> : null}
      {type === 'jackpot' ? <><Polygon points="34,14 39,29 54,34 39,39 34,54 29,39 14,34 29,29" fill={accent} /><Circle cx="34" cy="34" r="5" fill={colors.backgroundDeep} /></> : null}
      {type === 'failure' || type === 'quick-failure' ? <><Path d="M23 23 45 45M45 23 23 45" stroke={accent} strokeWidth="4" strokeLinecap="round" /><Circle cx="34" cy="34" r="5" fill="none" stroke={accent} strokeWidth="1.3" /></> : null}
      {type === 'practice' ? <><Path d="M22 45h24M25 40h18M28 35h12M31 25h6M34 21v14" stroke={accent} strokeWidth="2.5" strokeLinecap="round" /><Circle cx="34" cy="22" r="3" fill={accent} /></> : null}
    </Svg>
  </Animated.View>;
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: colors.backgroundDeep, overflow: 'hidden' },
  backgroundGradient: { ...StyleSheet.absoluteFill, backgroundColor: '#101C3A' },
  orb: { position: 'absolute', width: 280, height: 280, borderRadius: 140 },
  orbGold: { top: -165, right: -120, backgroundColor: '#B58A32' },
  orbBlue: { bottom: -190, left: -160, backgroundColor: '#2A5E8E' },
  gridLineOne: { position: 'absolute', top: 145, left: -100, right: -100, height: 1, backgroundColor: 'rgba(255,255,255,0.035)', transform: [{ rotate: '-17deg' }] },
  gridLineTwo: { position: 'absolute', top: 300, left: -100, right: -100, height: 1, backgroundColor: 'rgba(255,255,255,0.025)', transform: [{ rotate: '-17deg' }] },
  brandMark: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(239,198,103,0.08)', borderWidth: 1, borderColor: 'rgba(239,198,103,0.32)' },
  ringValue: { color: colors.text, fontSize: 16, fontWeight: '900', lineHeight: 18 },
  ringLabel: { color: colors.mutedText, fontSize: 7, fontWeight: '900', letterSpacing: 1, marginTop: 1 },
  modeVisual: { width: 64, height: 64, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  stateSeal: { width: 54, height: 54, borderRadius: 18, backgroundColor: 'rgba(16,27,56,0.48)', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, position: 'relative' },
  stateInitials: { position: 'absolute', fontSize: 12, fontWeight: '900', letterSpacing: 0.5 },
  categoryGlyph: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(239,198,103,0.10)', borderWidth: 1, borderColor: 'rgba(239,198,103,0.22)' },
  categoryGlyphText: { color: colors.gold, fontSize: 20, fontWeight: '900' },
  resultBadge: { width: 88, height: 88, borderRadius: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(37,61,99,0.78)', borderWidth: 1.5, shadowOpacity: 0.32, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
});
