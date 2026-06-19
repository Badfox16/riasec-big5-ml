// ─── Compare Assessments Screen ───────────────────────────────────────────────

import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppStackParamList, AssessmentRecord } from '../../types';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import { useColors, ColorsType, Spacing, Radius, Typography, Shadow } from '../../theme';
import RadarChart from '../../components/RadarChart';

type Props = NativeStackScreenProps<AppStackParamList, 'Compare'>;

const DIM_NAMES: Record<string, string> = {
  R: 'Realista', I: 'Investigativo', A: 'Artístico',
  S: 'Social', E: 'Empreendedor', C: 'Convencional',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' });
}

function DateChip({ record, selected, onPress, color }: { record: AssessmentRecord; selected: boolean; onPress: () => void; color: string }) {
  const C      = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return (
    <TouchableOpacity
      style={[styles.dateChip, selected && { borderColor: color, backgroundColor: color + '15' }]}
      onPress={onPress} activeOpacity={0.8}
    >
      <Text style={[styles.dateChipCode, { color: selected ? color : C.textSecondary }]}>{record.holland_code}</Text>
      <Text style={[styles.dateChipDate, selected && { color: C.text, fontWeight: '700' }]}>{formatDate(record.date)}</Text>
    </TouchableOpacity>
  );
}

export default function CompareScreen({ navigation }: Props) {
  const insets  = useSafeAreaInsets();
  const C       = useColors();
  const styles  = useMemo(() => makeStyles(C), [C]);
  const { history } = useAssessmentStore();

  const [fromId, setFromId] = useState<string>(history[1]?.id ?? history[0]?.id ?? '');
  const [toId,   setToId]   = useState<string>(history[0]?.id ?? '');

  const fromRecord = history.find(r => r.id === fromId) ?? null;
  const toRecord   = history.find(r => r.id === toId) ?? null;
  const sameRecord = !!fromRecord && !!toRecord && fromRecord.id === toRecord.id;

  const deltas = useMemo(() => {
    if (!fromRecord || !toRecord || sameRecord) return [];
    return toRecord.riasec_scores.map(toScore => {
      const fromScore = fromRecord.riasec_scores.find(s => s.letter === toScore.letter);
      const before = fromScore?.score ?? toScore.score;
      const diff   = toScore.score - before;
      const pct    = before > 0 ? Math.round((diff / before) * 100) : 0;
      return { letter: toScore.letter, before, after: toScore.score, diff, pct };
    });
  }, [fromRecord, toRecord, sameRecord]);

  const biggest = useMemo(() => {
    if (deltas.length === 0) return null;
    return deltas.reduce((a, b) => (Math.abs(b.pct) > Math.abs(a.pct) ? b : a));
  }, [deltas]);

  const hollandChanged = !!fromRecord && !!toRecord && !sameRecord && fromRecord.holland_code !== toRecord.holland_code;

  if (history.length < 2) {
    return (
      <View style={styles.root}>
        <View style={styles.center}>
          <Feather name="bar-chart-2" size={40} color={C.textMuted} />
          <Text style={styles.emptyTitle}>Precisas de pelo menos 2 avaliações</Text>
          <Text style={styles.emptySub}>Faz uma nova avaliação para poderes comparar a evolução do teu perfil.</Text>
          <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
            <Text style={styles.backLinkText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient colors={C.heroGradient} style={[styles.hero, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={18} color={C.textSecondary} />
          <Text style={styles.backText}>Histórico</Text>
        </TouchableOpacity>
        <Text style={styles.heroTitle}>Comparar Avaliações</Text>
        <Text style={styles.heroSub}>Vê como o teu perfil RIASEC evoluiu ao longo do tempo</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <View style={styles.selectorBlock}>
          <Text style={styles.selectorLabel}>De (mais antiga)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {history.map(r => (
              <DateChip key={r.id} record={r} selected={r.id === fromId} onPress={() => setFromId(r.id)} color={C.textMuted} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.selectorBlock}>
          <Text style={styles.selectorLabel}>Para (mais recente)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {history.map(r => (
              <DateChip key={r.id} record={r} selected={r.id === toId} onPress={() => setToId(r.id)} color={C.primaryLight} />
            ))}
          </ScrollView>
        </View>

        {sameRecord ? (
          <View style={styles.warnBox}>
            <Feather name="alert-triangle" size={16} color={C.warning} />
            <Text style={styles.warnText}>Escolhe duas avaliações diferentes para comparar.</Text>
          </View>
        ) : fromRecord && toRecord && (
          <>
            <View style={[styles.card, Shadow.sm]}>
              <Text style={styles.cardTitle}>Perfil RIASEC</Text>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: C.textMuted }]} />
                  <Text style={styles.legendText}>{formatDate(fromRecord.date)}</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: C.primary }]} />
                  <Text style={styles.legendText}>{formatDate(toRecord.date)}</Text>
                </View>
              </View>
              <View style={styles.radarWrap}>
                <RadarChart scores={toRecord.riasec_scores} compareScores={fromRecord.riasec_scores} compareColor={C.textMuted} size={240} />
              </View>

              {deltas.map(d => (
                <View key={d.letter} style={styles.deltaRow}>
                  <Text style={[styles.deltaLetter, { color: C.riasec[d.letter] }]}>{d.letter}</Text>
                  <Text style={styles.deltaName} numberOfLines={1}>{DIM_NAMES[d.letter]}</Text>
                  <Feather
                    name={d.diff > 0 ? 'trending-up' : d.diff < 0 ? 'trending-down' : 'minus'}
                    size={14}
                    color={d.diff > 0 ? C.success : d.diff < 0 ? C.error : C.textMuted}
                  />
                  <Text style={[styles.deltaPct, { color: d.diff > 0 ? C.success : d.diff < 0 ? C.error : C.textMuted }]}>
                    {d.pct > 0 ? '+' : ''}{d.pct}%
                  </Text>
                </View>
              ))}
            </View>

            {biggest && biggest.diff !== 0 && (
              <View style={[styles.card, Shadow.sm, styles.highlightCard]}>
                <Feather name={biggest.diff > 0 ? 'trending-up' : 'trending-down'} size={20} color={biggest.diff > 0 ? C.success : C.error} />
                <Text style={styles.highlightText}>
                  O teu interesse <Text style={{ fontWeight: '800', color: C.text }}>{DIM_NAMES[biggest.letter]}</Text>{' '}
                  {biggest.diff > 0 ? 'cresceu' : 'diminuiu'} {Math.abs(biggest.pct)}% desde {formatDate(fromRecord.date)}.
                  Isto é normal e saudável — os nossos interesses evoluem com a experiência.
                </Text>
              </View>
            )}

            {hollandChanged && (
              <View style={[styles.card, Shadow.sm, styles.highlightCard]}>
                <Feather name="award" size={20} color={C.accentLight} />
                <Text style={styles.highlightText}>
                  O teu Código Holland evoluiu de <Text style={{ fontWeight: '800', color: C.text }}>{fromRecord.holland_code}</Text>{' '}
                  para <Text style={{ fontWeight: '800', color: C.text }}>{toRecord.holland_code}</Text>! Os interesses vocacionais mudam
                  naturalmente com a idade e a experiência — continua a explorar.
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const makeStyles = (C: ColorsType) => StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },

  hero:     { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg, gap: Spacing.xs },
  backBtn:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.sm },
  backText: { fontSize: Typography.base, color: C.textSecondary, fontWeight: '500' },
  heroTitle:{ fontSize: Typography['2xl'], fontWeight: '900', color: C.text },
  heroSub:  { fontSize: Typography.sm, color: C.textSecondary },

  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, gap: Spacing.md },

  selectorBlock: { gap: Spacing.sm },
  selectorLabel: { fontSize: Typography.sm, fontWeight: '700', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: 0.6 },
  chipRow:       { gap: Spacing.sm, paddingRight: Spacing.lg },

  dateChip:     { backgroundColor: C.card, borderRadius: Radius.lg, borderWidth: 1.5, borderColor: C.border, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, alignItems: 'center', gap: 2, minWidth: 100 },
  dateChipCode: { fontSize: Typography.base, fontWeight: '900' },
  dateChipDate: { fontSize: Typography.xs, color: C.textMuted },

  warnBox:  { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, backgroundColor: C.warningBg, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: C.warning + '40' },
  warnText: { flex: 1, fontSize: Typography.sm, color: C.text },

  card:      { backgroundColor: C.card, borderRadius: Radius.xl, padding: Spacing.lg, gap: Spacing.sm, borderWidth: 1, borderColor: C.border },
  cardTitle: { fontSize: Typography.lg, fontWeight: '800', color: C.text },

  legendRow:  { flexDirection: 'row', gap: Spacing.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot:  { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: Typography.xs, color: C.textSecondary },

  radarWrap: { alignItems: 'center', paddingVertical: Spacing.sm },

  deltaRow:    { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 4 },
  deltaLetter: { fontSize: Typography.base, fontWeight: '900', width: 16 },
  deltaName:   { flex: 1, fontSize: Typography.sm, color: C.textSecondary },
  deltaPct:    { fontSize: Typography.sm, fontWeight: '800', width: 48, textAlign: 'right' },

  highlightCard: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  highlightText: { flex: 1, fontSize: Typography.sm, color: C.textSecondary, lineHeight: 20 },

  center:        { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.md },
  emptyTitle:    { fontSize: Typography.lg, fontWeight: '800', color: C.text, textAlign: 'center' },
  emptySub:      { fontSize: Typography.base, color: C.textSecondary, textAlign: 'center', lineHeight: 22 },
  backLink:      { marginTop: Spacing.sm, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: Radius.lg, borderWidth: 1, borderColor: C.border },
  backLinkText:  { fontSize: Typography.base, fontWeight: '700', color: C.textSecondary },
});
