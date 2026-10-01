# Quizreise Deutschland

Ein deutscher Trivia-Abenteuer-Prototyp für Android und iOS mit Expo, React Native, TypeScript und Expo Router.

## Was bereits funktioniert

- Startbildschirm mit Karriere- und Schnellquiz-Modus
- Lokaler Demo-Spielstand mit AsyncStorage
- Interaktive Deutschlandkarte mit allen 16 Bundesländern
- Echte Bundesländer-Geometrien aus `deutschlandGeoJSON` mit Lizenzhinweis in `docs/MAP_ATTRIBUTION.md`
- Hamburg vollständig spielbar: sechs Kategorien, Rewards und großes Finale
- Starter-Inhalte für Niedersachsen und Schleswig-Holstein
- 10-Fragen-Kategorien mit zufälliger Auswahl, Antwort-Shuffle, Erklärungen und Bestwert-Rewards
- 15-Fragen-Finale: 15/15 erforderlich, drei Joker, kostenlose Wiederholungen, einmalige 1.500-Quiz-Euro-Belohnung
- Zustandskäufe für Niedersachsen und Schleswig-Holstein für 3.500 Quiz-Euro mit Nachbar- und Guthabenprüfung
- Separates Schnellquiz mit 15 Fragen, drei Jokern und einer virtuellen Preisleiter bis 1.000.000 €
- Fortschritt, Wallet, Freischaltungen, Bestwerte und laufende Quiz-Sessions werden lokal gespeichert
- Supabase-Client, `.env.example` und sichere RPC-Schema-Grundlage für das spätere Produktions-Backend

## Starten

Voraussetzung: Node.js und ein aktuelles Expo-kompatibles Android/iOS-Setup.

```bash
npm install
npm run start
```

Danach im Expo DevTools-Fenster:

- Android-Emulator oder Android-Gerät starten: `npm run android`
- iOS-Simulator starten: `npm run ios` (macOS erforderlich)
- Web-Vorschau starten: `npm run web`

Supabase ist für den Demo-Modus nicht erforderlich.

## TestFlight

Für TestFlight brauchst du ein Apple-Developer-Konto. Auf dem Computer im Projektordner ausführen:

```bash
npx testflight
```

Expo/EAS erstellt den signierten iOS-Build in der Cloud und lädt ihn zu App Store Connect hoch. Beim ersten Lauf wirst du nach deinem Expo-Login, deiner Apple-Developer-Anmeldung und der Verwaltung der Signatur-Zertifikate gefragt. Nach der Apple-Verarbeitung öffnest du auf dem iPhone TestFlight und installierst die App über die interne Einladung.

Der aktuelle Bundle Identifier ist `com.quizreise.deutschland`. Falls dieser bereits vergeben ist, ändere ihn in `app.json` zu einem eindeutigen Wert.

Für einen sofortigen lokalen Test ohne TestFlight: Expo Go installieren, auf dem Computer `npm run start` ausführen und den QR-Code mit der iPhone-Kamera öffnen.

## Qualität prüfen

```bash
npm run typecheck
npm test
npm run validate:questions
npx expo-doctor
```

## Supabase-Konfiguration

Kopiere `.env.example` zu `.env` und trage später ein:

```text
EXPO_PUBLIC_SUPABASE_URL=https://dein-projekt.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key
```

Der `service_role`-Key darf niemals in die mobile App. Die Produktions-SQL-Grundlage liegt in `supabase/schema.sql`. Wallet-Transaktionen und Freischaltungen müssen dort über serverseitig validierte RPC-Funktionen laufen, bevor ein synchronisierter Produktionsmodus aktiviert wird.

## Projektstruktur

```text
app/                         Expo-Router-Screens
  index.tsx                  Startbildschirm
  career/map.tsx             Deutschlandkarte
  career/state/[stateId].tsx Bundesland-Übersicht
  quiz/[mode].tsx            Kategorie, Finale und Schnellquiz
  result.tsx                 Ergebnisbildschirm
src/components/              Wiederverwendbare UI und SVG-Karte
src/data/                    Bundesländer, Nachbarn, Fragen und GeoJSON
src/game/rules.ts             Pure Gameplay-Regeln
src/state/GameProvider.tsx    Lokaler Fortschritt und Session-Restore
src/backend/                  Supabase-Konfigurationsgrenze
scripts/                     Frage-Datenvalidierung
tests/                       Regeltests
supabase/                    Produktions-Schema-Grundlage
```

## Noch nicht fertig

- Supabase-Login, anonymer Auth-Flow und geräteübergreifende Synchronisierung sind vorbereitet, aber noch nicht an die Screens angeschlossen.
- Die vollständigen Quizbanken für die übrigen 13 Bundesländer und ihre lokalen Kategorien fehlen noch.
- Profilverknüpfung, Achievements, Sound/Haptik und Store-Build-Konfiguration sind nächste Ausbaustufen.
- Die aktuelle Karte unterstützt Pan/Scroll und Zoom-Schaltflächen; echtes Pinch-to-Zoom kann später ergänzt werden.

Alle Quiz-Euro sind fiktiv und nicht gegen echtes Geld einlösbar.
