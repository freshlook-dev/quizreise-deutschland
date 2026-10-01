import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Card, Header, PrimaryButton, Screen, SecondaryButton } from '@/src/components/ui';
import { useGame } from '@/src/state/GameProvider';
import { colors, spacing } from '@/src/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { progress, resetProgress, toggleSetting } = useGame();

  function reset() {
    Alert.alert('Demo-Fortschritt löschen?', 'Damit werden Wallet, Freischaltungen und Bestwerte auf diesem Gerät zurückgesetzt.', [{ text: 'Abbrechen', style: 'cancel' }, { text: 'Zurücksetzen', style: 'destructive', onPress: resetProgress }]);
  }

  return <Screen><Header title="EINSTELLUNGEN" subtitle="Quizreise Deutschland" onBack={() => router.back()} /><Card><Text style={styles.cardTitle}>Spielkonto</Text><Text style={styles.body}>Du spielst aktuell anonym im lokalen Demo-Modus. Wenn du die App deinstallierst, kann dieser nicht synchronisierte Fortschritt verloren gehen.</Text><View style={styles.status}><Text style={styles.dot}>●</Text><Text style={styles.statusText}>Lokaler Demo-Modus aktiv</Text></View></Card><Card><Text style={styles.cardTitle}>Präferenzen</Text><View style={styles.preferenceRow}><View><Text style={styles.preferenceTitle}>Soundeffekte</Text><Text style={styles.bodySmall}>Für die erste Version vorbereitet</Text></View><SecondaryButton compact title={progress.settings.sound ? 'An' : 'Aus'} onPress={() => toggleSetting('sound')} /></View><View style={styles.preferenceRow}><View><Text style={styles.preferenceTitle}>Haptik</Text><Text style={styles.bodySmall}>Für die erste Version vorbereitet</Text></View><SecondaryButton compact title={progress.settings.haptics ? 'An' : 'Aus'} onPress={() => toggleSetting('haptics')} /></View></Card><Card><Text style={styles.cardTitle}>Über die Karte</Text><Text style={styles.body}>Die Bundesländer-Grenzen basieren auf deutschlandGeoJSON. Details und Lizenzhinweis stehen in der Projektdatei docs/MAP_ATTRIBUTION.md.</Text></Card><PrimaryButton title="Demo-Fortschritt zurücksetzen" onPress={reset} /><Text style={styles.footer}>Quiz-Euro sind rein virtuell und nicht gegen echtes Geld einlösbar.</Text></Screen>;
}

const styles = StyleSheet.create({
  cardTitle: { color: colors.text, fontSize: 17, fontWeight: '900', marginBottom: 8 },
  body: { color: colors.mutedText, lineHeight: 20, fontSize: 13 },
  bodySmall: { color: colors.mutedText, fontSize: 11, marginTop: 3 },
  status: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  dot: { color: colors.correct, marginRight: 6 },
  statusText: { color: colors.text, fontWeight: '800', fontSize: 12 },
  preferenceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 9 },
  preferenceTitle: { color: colors.text, fontWeight: '800', fontSize: 14 },
  footer: { color: colors.mutedText, textAlign: 'center', fontSize: 10, marginTop: spacing.md },
});
