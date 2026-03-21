// ─── History Detail Screen ────────────────────────────────────────────────────
// Reuses the Results layout to show a past assessment record.

import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppStackParamList } from '../../types';
import { Colors, Spacing, Radius, Typography, Shadow } from '../../theme';
import RadarChart  from '../../components/RadarChart';
import BigFiveBar  from '../../components/BigFiveBar';
import CareerCard  from '../../components/CareerCard';

type Props = NativeStackScreenProps<AppStackParamList, 'HistoryDetail'>;

const BIG5 = [
  { key: 'openness',          label: 'Abertura',         color: Colors.big5.openness },
  { key: 'conscientiousness', label: 'Conscienciosidade', color: Colors.big5.conscientiousness },
  { key: 'extraversion',      label: 'Extroversão',      color: Colors.big5.extraversion },
  { key: 'agreeableness',     label: 'Amabilidade',      color: Colors.big5.agreeableness },
  { key: 'neuroticism',       label: 'Neuroticismo',     color: Colors.big5.neuroticism },
] as const;

export default function HistoryDetailScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { record } = route.params;
  const { holland_code, riasec_scores, big5, careers, nota, date } = record;

  const topLetter    = holland_code[0];
  const accentColor  = Colors.riasec[topLetter] ?? Colors.primary;
  const sortedScores = [...riasec_scores].sort((a, b) => b.score - a.score);

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <LinearGradient
          colors={[Colors.riasecBg[topLetter] ? '#1A1030' : '#13102E', '#0D0D1A']}
          style={[styles.hero, { paddingTop: insets.top + Spacing.sm }]}
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Histórico</Text>
          </TouchableOpacity>

          <Text style={styles.heroDate}>
            {new Date(date).toLocaleDateString('pt-PT', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            })}
          </Text>
          <Text style={[styles.heroCode, { color: accentColor }]}>{holland_code}</Text>

          <View style={styles.pillRow}>
            {holland_code.split('').map(l => (
              <View key={l} style={[styles.pill, { backgroundColor: Colors.riasecBg[l] }]}>
                <Text style={[styles.pillLetter, { color: Colors.riasec[l] }]}>{l}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Radar */}
        <View style={[styles.card, Shadow.sm]}>
          <Text style={styles.cardTitle}>Perfil RIASEC</Text>
          <View style={styles.radarWrap}>
            <RadarChart scores={riasec_scores} size={250} />
          </View>
          {sortedScores.map(s => (
            <View key={s.letter} style={styles.scoreRow}>
              <View style={[styles.dot, { backgroundColor: Colors.riasec[s.letter] }]} />
              <Text style={styles.scoreName}>{s.letter} · {s.dimension}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, {
                  width: `${(s.score / 5) * 100}%`,
                  backgroundColor: Colors.riasec[s.letter],
                }]} />
              </View>
              <Text style={[styles.scoreVal, { color: Colors.riasec[s.letter] }]}>
                {s.score.toFixed(1)}
              </Text>
            </View>
          ))}
        </View>

        {/* Big Five */}
        <View style={[styles.card, Shadow.sm]}>
          <Text style={styles.cardTitle}>Big Five</Text>
          {BIG5.map(t => (
            <BigFiveBar key={t.key} label={t.label} value={big5[t.key]} color={t.color} />
          ))}
        </View>

        {/* Careers */}
        <View style={[styles.card, Shadow.sm]}>
          <Text style={styles.cardTitle}>Carreiras sugeridas</Text>
          {careers.map((c, i) => (
            <CareerCard key={i} career={c} index={i} accentColor={accentColor} />
          ))}
        </View>

        {/* Disclaimer */}
        <View style={styles.nota}>
          <Text style={styles.notaText}>ℹ  {nota}</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: Spacing.xxxl },

  hero: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  backBtn:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.sm },
  backIcon: { fontSize: 20, color: Colors.textSecondary },
  backText: { fontSize: Typography.base, color: Colors.textSecondary, fontWeight: '500' },

  heroDate: { fontSize: Typography.sm, color: Colors.textSecondary, textTransform: 'capitalize' },
  heroCode: { fontSize: 72, fontWeight: '900', letterSpacing: 6 },

  pillRow: { flexDirection: 'row', gap: Spacing.sm },
  pill: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: Radius.md, alignItems: 'center',
  },
  pillLetter: { fontSize: Typography.lg, fontWeight: '800' },

  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: { fontSize: Typography.lg, fontWeight: '800', color: Colors.text, marginBottom: 4 },

  radarWrap: { alignItems: 'center', paddingVertical: Spacing.md },

  scoreRow:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dot:       { width: 8, height: 8, borderRadius: 4 },
  scoreName: { width: 110, fontSize: Typography.sm, color: Colors.textSecondary },
  barTrack:  { flex: 1, height: 5, backgroundColor: Colors.surface, borderRadius: Radius.full, overflow: 'hidden' },
  barFill:   { height: '100%', borderRadius: Radius.full },
  scoreVal:  { width: 28, fontSize: Typography.sm, fontWeight: '700', textAlign: 'right' },

  nota: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notaText: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    lineHeight: 18,
  },
});
