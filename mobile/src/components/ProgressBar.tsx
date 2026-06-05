import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors, ColorsType, Radius, Spacing, Typography } from '../theme';

interface Props {
  current: number;
  total: number;
  color?: string;
  showLabel?: boolean;
}

export default function ProgressBar({ current, total, color, showLabel = true }: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const activeColor = color ?? Colors.primary;
  const pct = Math.min((current / total) * 100, 100);

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.row}>
          <Text style={styles.label}>Progresso</Text>
          <Text style={[styles.count, { color: activeColor }]}>{current}/{total}</Text>
        </View>
      )}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: activeColor }]} />
      </View>
    </View>
  );
}

const makeStyles = (C: ColorsType) => StyleSheet.create({
  container: { width: '100%' },
  row:       { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs },
  label:     { fontSize: Typography.sm, color: C.textSecondary },
  count:     { fontSize: Typography.sm, fontWeight: '700' },
  track:     { height: 6, backgroundColor: C.border, borderRadius: Radius.full, overflow: 'hidden' },
  fill:      { height: '100%', borderRadius: Radius.full },
});
