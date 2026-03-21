import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../theme';

interface Props {
  current: number;
  total: number;
  color?: string;
  showLabel?: boolean;
}

export default function ProgressBar({
  current,
  total,
  color = Colors.primary,
  showLabel = true,
}: Props) {
  const pct = Math.min((current / total) * 100, 100);

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.row}>
          <Text style={styles.label}>Progresso</Text>
          <Text style={[styles.count, { color }]}>
            {current}/{total}
          </Text>
        </View>
      )}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  count: {
    fontSize: Typography.sm,
    fontWeight: '700',
  },
  track: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});
