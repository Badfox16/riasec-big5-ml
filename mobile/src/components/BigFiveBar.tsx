// ─── Big Five Horizontal Bar ──────────────────────────────────────────────────

import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useColors, ColorsType, Radius, Spacing, Typography } from '../theme';

interface Props {
  label: string;
  value: number;
  color: string;
  description?: string;
}

export default function BigFiveBar({ label, value, color, description }: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  const anim = useRef(new Animated.Value(0)).current;
  const pct = ((value - 1) / 6) * 100;

  useEffect(() => {
    Animated.timing(anim, { toValue: pct, duration: 900, useNativeDriver: false }).start();
  }, [pct]);

  const width = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.score, { color }]}>{value.toFixed(1)}<Text style={styles.max}>/7</Text></Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width, backgroundColor: color }]} />
      </View>
      {description && <Text style={styles.desc}>{description}</Text>}
    </View>
  );
}

const makeStyles = (C: ColorsType) => StyleSheet.create({
  container: { marginBottom: Spacing.md },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'baseline', marginBottom: 6,
  },
  label: { fontSize: Typography.base, fontWeight: '600', color: C.text },
  score: { fontSize: Typography.lg, fontWeight: '700' },
  max:   { fontSize: Typography.sm, color: C.textMuted },
  track: {
    height: 10, backgroundColor: C.border,
    borderRadius: Radius.full, overflow: 'hidden',
  },
  fill:  { height: '100%', borderRadius: Radius.full },
  desc:  { fontSize: Typography.xs, color: C.textSecondary, marginTop: 4 },
});
