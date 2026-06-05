import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors, ColorsType, Radius, Shadow, Spacing, Typography } from '../theme';
import { CourseRecommendation } from '../types';

interface Props {
  course: CourseRecommendation;
  index: number;
  accentColor?: string;
}

const RANK_EMOJIS = ['🎓', '📚', '🏫'];

export default function CourseCard({ course, index, accentColor }: Props) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const accent = accentColor ?? Colors.primary;

  return (
    <View style={[styles.card, Shadow.sm, { borderLeftColor: accent }]}>
      <View style={[styles.badge, { backgroundColor: accent + '18' }]}>
        <Text style={styles.rankEmoji}>{RANK_EMOJIS[index] ?? '🎓'}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: accent }]}>{course.titulo}</Text>
        <View style={[styles.institutionBadge, { backgroundColor: accent + '12' }]}>
          <Text style={[styles.institution, { color: accent }]}>{course.instituicao}</Text>
        </View>
        <Text style={styles.desc}>{course.descricao}</Text>
      </View>
    </View>
  );
}

const makeStyles = (C: ColorsType) => StyleSheet.create({
  card: {
    flexDirection: 'row', backgroundColor: C.card,
    borderRadius: Radius.lg, padding: Spacing.md,
    marginBottom: Spacing.sm, alignItems: 'flex-start',
    gap: Spacing.md, borderLeftWidth: 3, borderLeftColor: C.primary,
  },
  badge: {
    width: 44, height: 44, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  rankEmoji:        { fontSize: 22 },
  content:          { flex: 1, gap: 4 },
  title:            { fontSize: Typography.base, fontWeight: '700' },
  institutionBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.sm },
  institution:      { fontSize: Typography.xs, fontWeight: '600' },
  desc:             { fontSize: Typography.sm, color: C.textSecondary, lineHeight: 19 },
});
