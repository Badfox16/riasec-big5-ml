// ─── Big Five Horizontal Bar ──────────────────────────────────────────────────
// Score scale: 1-7 (TIPI), normalized to percentage for display.

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../theme';

interface Props {
  label: string;
  value: number;   // 1–7
  color: string;
  description?: string;
}

const BIG5_DESCRIPTIONS: Record<string, string> = {
  Abertura:         'Curiosidade, imaginação e apreciação pela novidade.',
  Conscienciosidade:'Organização, disciplina e orientação para objetivos.',
  Extroversão:      'Sociabilidade, assertividade e energia positiva.',
  Amabilidade:      'Cooperação, empatia e confiança nas pessoas.',
  Neuroticismo:     'Tendência para instabilidade emocional e ansiedade.',
};

export default function BigFiveBar({ label, value, color, description }: Props) {
  const anim = useRef(new Animated.Value(0)).current;
  const pct = ((value - 1) / 6) * 100; // 1-7 → 0-100%

  useEffect(() => {
    Animated.timing(anim, {
      toValue: pct,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [pct]);

  const width = anim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.score, { color }]}>{value.toFixed(1)}<Text style={styles.max}>/7</Text></Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width, backgroundColor: color }]} />
      </View>
      {description && (
        <Text style={styles.desc}>{description}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  label: {
    fontSize: Typography.base,
    fontWeight: '600',
    color: Colors.text,
  },
  score: {
    fontSize: Typography.lg,
    fontWeight: '700',
  },
  max: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
  },
  track: {
    height: 10,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  desc: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
