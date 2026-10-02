import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { GermanyMap } from '@/src/components/GermanyMap';
import { Card, Header, PrimaryButton, Screen, SecondaryButton, WalletPill } from '@/src/components/ui';
import { Reveal, StateSeal } from '@/src/components/visuals';
import { getState, getStateStatus, STATE_PURCHASE_COST } from '@/src/data/states';
import { canPurchaseState } from '@/src/game/rules';
import { useGame } from '@/src/state/GameProvider';
import { colors, formatEuro, spacing } from '@/src/theme';
import { StateId } from '@/src/types';

export default function CareerMapScreen() {
  const router = useRouter();
  const { progress, buyState } = useGame();
  const [selectedId, setSelectedId] = useState<StateId>('HH');
  const selected = useMemo(() => getState(selectedId), [selectedId]);
  const status = getStateStatus(selectedId, progress);
  const purchase = canPurchaseState(selectedId, progress);
  const best = progress.categoryBest[selectedId] ?? {};
  const completedCategories = Object.values(best).filter((score) => (score ?? 0) >= 8).length;

  function handleAction() {
    if (status === 'unlocked' || status === 'completed') {
      router.push({ pathname: '/career/state/[stateId]', params: { stateId: selectedId } });
      return;
    }
    if (status === 'available' && purchase.allowed) {
      const result = buyState(selectedId);
      if (result.success) Alert.alert('Reise freigeschaltet', result.message);
      else Alert.alert('Kauf nicht möglich', result.message);
    }
  }

  return <Screen>
    <Header title="DEUTSCHLANDREISE" subtitle="Dein Weg durch 16 Bundesländer" onBack={() => router.back()} right={<WalletPill value={progress.wallet} />} />
    <Reveal delay={80}><View style={styles.progressRow}><View><Text style={styles.progressLabel}>MEISTERSCHAFTEN</Text><Text style={styles.progressValue}>{progress.completedStates.length} <Text style={styles.progressMuted}>/ 16 Bundesländer</Text></Text></View><Text style={styles.mapHint}>Antippen zum Erkunden</Text></View></Reveal>
    <Reveal delay={150}><GermanyMap progress={progress} onSelect={setSelectedId} /></Reveal>
    <Reveal delay={230}><Card accent style={styles.stateCard}>
      <View style={styles.stateHeader}><StateSeal stateId={selectedId} status={status} /><View style={styles.stateTitleCopy}><Text style={styles.stateName}>{selected.name}</Text><Text style={styles.stateCapital}>Hauptstadt · {selected.capital}</Text></View><View style={[styles.statusDot, { backgroundColor: status === 'completed' ? colors.gold : status === 'unlocked' ? colors.info : status === 'available' ? colors.gold : colors.locked }]} /></View>
      <Text style={styles.statusText}>{status === 'completed' ? 'Bundesland gemeistert' : status === 'unlocked' ? 'Spielbar und freigeschaltet' : status === 'available' ? 'Bereit zum Freischalten' : status === 'unavailable' ? 'Bald verfügbar' : 'Noch gesperrt'}</Text>
      {status === 'unavailable' ? <Text style={styles.explanation}>Die vollständigen Inhalte für dieses Bundesland folgen in einem nächsten Ausbau.</Text> : <><View style={styles.detailRow}><Text style={styles.detailLabel}>Kategorien bestanden</Text><Text style={styles.detailValue}>{completedCategories} / 6</Text></View><View style={styles.detailRow}><Text style={styles.detailLabel}>Freischaltkosten</Text><Text style={styles.detailValue}>{status === 'unlocked' || status === 'completed' ? 'bezahlt' : formatEuro(STATE_PURCHASE_COST)}</Text></View><Text style={styles.explanation}>{status === 'locked' ? 'Schließe zuerst das Finale eines Nachbar-Bundeslandes ab.' : status === 'available' && !purchase.allowed ? purchase.reason : status === 'available' ? 'Ein abgeschlossenes Nachbar-Bundesland ist vorhanden. Du kannst dieses Bundesland kaufen, sobald dein Guthaben reicht.' : 'Spiele die sechs Kategorien und schalte danach das große Finale frei.'}</Text></>}
      <View style={styles.actionRow}>{status === 'available' ? <PrimaryButton title={purchase.allowed ? `${formatEuro(STATE_PURCHASE_COST)} kaufen` : 'Noch nicht möglich'} onPress={handleAction} disabled={!purchase.allowed} style={styles.actionButton} /> : status === 'unlocked' || status === 'completed' ? <PrimaryButton title="Bundesland betreten" onPress={handleAction} style={styles.actionButton} /> : <SecondaryButton title="Details ansehen" onPress={() => undefined} disabled style={styles.actionButton} />}</View>
    </Card></Reveal>
    <Text style={styles.legend}>● grün/gold = gemeistert · ● blau = spielbar · ◇ gold = verfügbar · ● grau = gesperrt</Text>
  </Screen>;
}

const styles = StyleSheet.create({
  progressRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: spacing.sm },
  progressLabel: { color: colors.mutedText, fontSize: 10, fontWeight: '900', letterSpacing: 1.1 },
  progressValue: { color: colors.text, fontWeight: '900', fontSize: 22, marginTop: 2 },
  progressMuted: { color: colors.mutedText, fontSize: 13, fontWeight: '600' },
  mapHint: { color: colors.gold, fontSize: 11, marginBottom: 5 },
  stateCard: { marginTop: spacing.md },
  stateHeader: { flexDirection: 'row', alignItems: 'center' },
  stateIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  stateEmoji: { fontSize: 24 },
  stateTitleCopy: { flex: 1 },
  stateName: { color: colors.text, fontSize: 20, fontWeight: '900' },
  stateCapital: { color: colors.mutedText, fontSize: 12, marginTop: 3 },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  statusText: { color: colors.gold, fontWeight: '800', marginTop: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 11 },
  detailLabel: { color: colors.mutedText, fontSize: 13 },
  detailValue: { color: colors.text, fontWeight: '800', fontSize: 13 },
  explanation: { color: colors.mutedText, lineHeight: 19, fontSize: 13, marginTop: 12 },
  actionRow: { marginTop: 16 },
  actionButton: { flex: 1 },
  legend: { color: colors.mutedText, fontSize: 10, lineHeight: 16, textAlign: 'center', marginTop: 2 },
});
