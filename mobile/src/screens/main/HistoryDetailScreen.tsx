// ─── History Detail Screen ────────────────────────────────────────────────────

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppStackParamList } from '../../types';
import { useColors, ColorsType, Colors, Spacing, Radius, Typography, Shadow } from '../../theme';
import RadarChart from '../../components/RadarChart';
import BigFiveBar from '../../components/BigFiveBar';
import CareerCard from '../../components/CareerCard';

type Props = NativeStackScreenProps<AppStackParamList, 'HistoryDetail'>;

const BIG5 = [
  { key: 'openness',          label: 'Abertura',          color: Colors.big5.openness },
  { key: 'conscientiousness', label: 'Conscienciosidade',  color: Colors.big5.conscientiousness },
  { key: 'extraversion',      label: 'Extroversão',        color: Colors.big5.extraversion },
  { key: 'agreeableness',     label: 'Amabilidade',        color: Colors.big5.agreeableness },
  { key: 'neuroticism',       label: 'Neuroticismo',       color: Colors.big5.neuroticism },
] as const;

export default function HistoryDetailScreen({ route, navigation }: Props) {
  const insets  = useSafeAreaInsets();
  const C       = useColors();
  const styles  = useMemo(() => makeStyles(C), [C]);
  const { record } = route.params;
  const { holland_code, riasec_scores, big5, careers, nota, date } = record;

  const topLetter   = holland_code[0];
  const accentColor = C.riasec[topLetter] ?? C.primary;
  const sortedScores = [...riasec_scores].sort((a, b) => b.score - a.score);

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <LinearGradient colors={C.heroGradient} style={[styles.hero, { paddingTop: insets.top + Spacing.sm }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={18} color={C.textSecondary} />
            <Text style={styles.backText}>Histórico</Text>
          </TouchableOpacity>
          <Text style={styles.heroDate}>{new Date(date).toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</Text>
          <Text style={[styles.heroCode, { color: accentColor }]}>{holland_code}</Text>
          <View style={styles.pillRow}>
            {holland_code.split('').map(l => (
              <View key={l} style={[styles.pill, { backgroundColor: C.riasecBg[l] }]}>
                <Text style={[styles.pillLetter, { color: C.riasec[l] }]}>{l}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <View style={[styles.card, Shadow.sm]}>
          <Text style={styles.cardTitle}>Perfil RIASEC</Text>
          <View style={styles.radarWrap}><RadarChart scores={riasec_scores} size={250} /></View>
          {sortedScores.map(s => (
            <View key={s.letter} style={styles.scoreRow}>
              <View style={[styles.dot, { backgroundColor: C.riasec[s.letter] }]} />
              <Text style={styles.scoreName}>{s.letter} · {s.dimension}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${(s.score / 5) * 100}%`, backgroundColor: C.riasec[s.letter] }]} />
              </View>
              <Text style={[styles.scoreVal, { color: C.riasec[s.letter] }]}>{s.score.toFixed(1)}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, Shadow.sm]}>
          <Text style={styles.cardTitle}>Big Five</Text>
          {BIG5.map(t => <BigFiveBar key={t.key} label={t.label} value={big5[t.key]} color={t.color} />)}
        </View>

        <View style={[styles.card, Shadow.sm]}>
          <Text style={styles.cardTitle}>Carreiras sugeridas</Text>
          {careers.map((c, i) => <CareerCard key={i} career={c} index={i} accentColor={accentColor} />)}
        </View>

        <View style={styles.nota}>
          <Feather name="info" size={14} color={C.textMuted} />
          <Text style={styles.notaText}>{nota}</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const makeStyles = (C: ColorsType) => StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.background },
  scroll: { paddingBottom: Spacing.xxxl },

  hero: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl, gap: Spacing.sm, alignItems: 'flex-start' },
  backBtn:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.sm },
  backText: { fontSize: Typography.base, color: C.textSecondary, fontWeight: '500' },

  heroDate: { fontSize: Typography.sm, color: C.textSecondary, textTransform: 'capitalize' },
  heroCode: { fontSize: 72, fontWeight: '900', letterSpacing: 6 },

  pillRow: { flexDirection: 'row', gap: Spacing.sm },
  pill:    { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.md, alignItems: 'center' },
  pillLetter: { fontSize: Typography.lg, fontWeight: '800' },

  card: {
    backgroundColor: C.card, borderRadius: Radius.xl,
    marginHorizontal: Spacing.lg, marginTop: Spacing.lg,
    padding: Spacing.lg, gap: Spacing.sm, borderWidth: 1, borderColor: C.border,
  },
  cardTitle: { fontSize: Typography.lg, fontWeight: '800', color: C.text, marginBottom: 4 },
  radarWrap: { alignItems: 'center', paddingVertical: Spacing.md },

  scoreRow:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dot:       { width: 8, height: 8, borderRadius: 4 },
  scoreName: { width: 110, fontSize: Typography.sm, color: C.textSecondary },
  barTrack:  { flex: 1, height: 5, backgroundColor: C.surface, borderRadius: Radius.full, overflow: 'hidden' },
  barFill:   { height: '100%', borderRadius: Radius.full },
  scoreVal:  { width: 28, fontSize: Typography.sm, fontWeight: '700', textAlign: 'right' },

  nota:     { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginHorizontal: Spacing.lg, marginTop: Spacing.lg, backgroundColor: C.card, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: C.border },
  notaText: { flex: 1, fontSize: Typography.xs, color: C.textMuted, lineHeight: 18 },
});
