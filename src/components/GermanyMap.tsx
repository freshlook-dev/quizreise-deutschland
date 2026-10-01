import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';

import { STATE_BY_ID, getStateStatus } from '@/src/data/states';
import { colors } from '@/src/theme';
import { GameProgress, StateId, StateStatus } from '@/src/types';

type Position = [number, number];
type Ring = Position[];
type Geometry = { type: 'Polygon' | 'MultiPolygon'; coordinates: Ring[] | Ring[][] };
type Feature = { properties: { id: string; name: string }; geometry: Geometry };
type FeatureCollection = { features: Feature[] };

// Source: isellsoap/deutschlandGeoJSON, 2_bundeslaender/4_niedrig.geo.json.
// The source is released under The Unlicense; attribution is retained in docs/MAP_ATTRIBUTION.md.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const geo = require('@/src/data/germany-states.geo.json') as FeatureCollection;

const MAP_WIDTH = 330;
const MAP_HEIGHT = 510;

function collectPositions(geometry: Geometry): Position[] {
  if (geometry.type === 'Polygon') return (geometry.coordinates as Ring[]).flat();
  return (geometry.coordinates as Ring[][]).flat(2);
}

const allPositions = geo.features.flatMap((feature) => collectPositions(feature.geometry));
const bounds = {
  minX: Math.min(...allPositions.map(([x]) => x)),
  maxX: Math.max(...allPositions.map(([x]) => x)),
  minY: Math.min(...allPositions.map(([, y]) => y)),
  maxY: Math.max(...allPositions.map(([, y]) => y)),
};

function project([longitude, latitude]: Position): Position {
  const x = ((longitude - bounds.minX) / (bounds.maxX - bounds.minX)) * (MAP_WIDTH - 16) + 8;
  const y = ((bounds.maxY - latitude) / (bounds.maxY - bounds.minY)) * (MAP_HEIGHT - 16) + 8;
  return [x, y];
}

function ringPath(ring: Ring): string {
  return ring.map((position, index) => {
    const [x, y] = project(position);
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ') + ' Z';
}

function geometryPath(geometry: Geometry): string {
  if (geometry.type === 'Polygon') return (geometry.coordinates as Ring[]).map(ringPath).join(' ');
  return (geometry.coordinates as Ring[][]).map((polygon) => polygon.map(ringPath).join(' ')).join(' ');
}

function centroid(feature: Feature): Position {
  const positions = collectPositions(feature.geometry).map(project);
  return [positions.reduce((sum, [x]) => sum + x, 0) / positions.length, positions.reduce((sum, [, y]) => sum + y, 0) / positions.length];
}

function stateFill(status: StateStatus): string {
  if (status === 'completed') return '#B68D32';
  if (status === 'unlocked') return '#286693';
  if (status === 'available') return '#4C5267';
  if (status === 'unavailable') return '#3B465C';
  return '#303B51';
}

function stateStroke(status: StateStatus): string {
  if (status === 'available' || status === 'completed') return colors.gold;
  if (status === 'unlocked') return '#78B8DD';
  return '#6B7890';
}

export function GermanyMap({ progress, onSelect }: { progress: GameProgress; onSelect: (stateId: StateId) => void }) {
  const [zoom, setZoom] = useState(1);
  const features = useMemo(() => geo.features.map((feature) => ({ feature, id: feature.properties.id.replace('DE-', '') as StateId, center: centroid(feature) })), []);

  return <View style={styles.wrapper}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: MAP_WIDTH * zoom + 32 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ height: MAP_HEIGHT * zoom + 32 }}>
        <View style={{ width: MAP_WIDTH * zoom, height: MAP_HEIGHT * zoom, margin: 16 }}>
          <Svg width={MAP_WIDTH * zoom} height={MAP_HEIGHT * zoom} viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} accessibilityLabel="Interaktive Karte der 16 deutschen Bundesländer">
            {features.map(({ feature, id }) => {
              const status = getStateStatus(id, progress);
              return <G key={id} onPress={() => onSelect(id)} accessibilityRole="button" accessibilityLabel={`${STATE_BY_ID[id].name}, ${status}`}>
                <Path d={geometryPath(feature.geometry)} fill={stateFill(status)} stroke={stateStroke(status)} strokeWidth={status === 'available' ? 1.8 : 0.9} strokeLinejoin="round" />
              </G>;
            })}
            {features.map(({ id, center }) => {
              const status = getStateStatus(id, progress);
              const isSmall = ['HH', 'HB', 'BE', 'SL'].includes(id);
              return <Circle key={`${id}-touch`} cx={center[0]} cy={center[1]} r={isSmall ? 10 : 4.5} fill={isSmall ? stateFill(status) : 'transparent'} stroke={isSmall ? colors.gold : 'transparent'} strokeWidth={isSmall ? 1.2 : 0} onPress={() => onSelect(id)} accessibilityLabel={`${STATE_BY_ID[id].name} auswählen`} />;
            })}
            <SvgText x={MAP_WIDTH / 2} y={MAP_HEIGHT - 3} fill={colors.mutedText} fontSize="9" textAnchor="middle">Deutschland · 16 Bundesländer</SvgText>
          </Svg>
        </View>
      </ScrollView>
    </ScrollView>
    <View style={styles.zoomControls}>
      <Pressable style={styles.zoomButton} onPress={() => setZoom((value) => Math.min(1.65, value + 0.15))} accessibilityLabel="Karte vergrößern"><Text style={styles.zoomText}>+</Text></Pressable>
      <Text style={styles.zoomLabel}>{Math.round(zoom * 100)} %</Text>
      <Pressable style={styles.zoomButton} onPress={() => setZoom((value) => Math.max(0.8, value - 0.15))} accessibilityLabel="Karte verkleinern"><Text style={styles.zoomText}>−</Text></Pressable>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  wrapper: { height: 550, backgroundColor: '#152746', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  zoomControls: { position: 'absolute', right: 12, top: 12, alignItems: 'center', backgroundColor: 'rgba(16,27,56,0.9)', borderRadius: 14, padding: 5 },
  zoomButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.secondary, borderRadius: 10 },
  zoomText: { color: colors.gold, fontSize: 24, lineHeight: 26, fontWeight: '700' },
  zoomLabel: { color: colors.mutedText, fontSize: 10, paddingVertical: 4 },
});
