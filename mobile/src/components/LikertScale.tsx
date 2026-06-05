import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColors, ColorsType, Radius, Spacing, Typography, Shadow } from '../theme';
import { LIKERT_EMOJIS, LIKERT_LABELS } from '../data/questions';

interface Props {
  value: number | undefined;
  onChange: (value: number) => void;
  color?: string;
}

export default function LikertScale({ value, onChange, color }: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const activeColor = color ?? Colors.primary;

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
                  ? [{ backgroundColor: activeColor, borderColor: activeColor }, Shadow.sm]
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

const makeStyles = (C: ColorsType) => StyleSheet.create({
  wrapper: { width: '100%' },
  row:     { flexDirection: 'row', gap: Spacing.xs },
  btn: {
    flex: 1, paddingVertical: Spacing.sm,
    borderRadius: Radius.md, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', gap: 3,
  },
  unselected:   { backgroundColor: C.card, borderColor: C.border },
  emoji:        { fontSize: 20 },
  num:          { fontSize: Typography.sm, fontWeight: '700', color: C.textSecondary },
  numSelected:  { color: C.textInverse },
  labels:       { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.xs, paddingHorizontal: 2 },
  labelText:    { fontSize: Typography.xs, color: C.textMuted, maxWidth: '42%' },
});
