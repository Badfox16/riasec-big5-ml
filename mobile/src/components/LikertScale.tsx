import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, Typography, Shadow } from '../theme';
import { LIKERT_EMOJIS, LIKERT_LABELS } from '../data/questions';

interface Props {
  value: number | undefined;
  onChange: (value: number) => void;
  color?: string;
}

export default function LikertScale({
  value,
  onChange,
  color = Colors.primary,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {[1, 2, 3, 4, 5].map((n) => {
          const selected = value === n;
          return (
            <TouchableOpacity
              key={n}
              onPress={() => onChange(n)}
              activeOpacity={0.75}
              style={[
                styles.btn,
                selected
                  ? [{ backgroundColor: color, borderColor: color }, Shadow.sm]
                  : styles.unselected,
              ]}
            >
              <Text style={styles.emoji}>{LIKERT_EMOJIS[n]}</Text>
              <Text style={[styles.num, selected && styles.numSelected]}>{n}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.labels}>
        <Text style={styles.labelText}>{LIKERT_LABELS[1]}</Text>
        <Text style={styles.labelText}>{LIKERT_LABELS[5]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%' },
  row: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  btn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  unselected: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
  },
  emoji: { fontSize: 20 },
  num: {
    fontSize: Typography.sm,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  numSelected: {
    color: Colors.textInverse,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
    paddingHorizontal: 2,
  },
  labelText: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    maxWidth: '42%',
  },
});
