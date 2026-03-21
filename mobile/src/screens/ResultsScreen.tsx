// ─── Results Screen ───────────────────────────────────────────────────────────
// Displays: Holland code, RIASEC radar, Big Five bars, career suggestions.

import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, StatusBar, SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAssessmentStore } from '../store/useAssessmentStore';
import { Colors, Radius, Shadow, Spacing, Typography } from '../theme';
import RadarChart   from '../components/RadarChart';
import BigFiveBar   from '../components/BigFiveBar';
import CareerCard   from '../components/CareerCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

const BIG5_DISPLAY = [
  { key: 'openness',          label: 'Abertura à Experiência', color: Colors.big5.openness },
  { key: 'conscientiousness', label: 'Conscienciosidade',      color: Colors.big5.conscientiousness },
  { key: 'extraversion',      label: 'Extroversão',            color: Colors.big5.extraversion },
  { key: 'agreeableness',     label: 'Amabilidade',            color: Colors.big5.agreeableness },
  { key: 'neuroticism',       label: 'Neuroticismo',           color: Colors.big5.neuroticism },
] as const;

const HOLLAND_NAMES: Record<string, string> = {
  R: 'Realista', I: 'Investigativo', A: 'Artístico',
  S: 'Social',   E: 'Empreendedor',  C: 'Convencional',
};

export default function ResultsScreen({ navigation }: Props) {
  const { results, reset } = useAssessmentStore();

  if (!results) return null;

  const { holland_code, riasec_scores, big5, careers, nota } = results;

  // Sort scores descending for display
  const sortedScores = [...riasec_scores].sort((a, b) => b.score - a.score);

  // Top 3 dimensions for the holland code breakdown
  const topDims = holland_code.split('');

  const handleRestart = () => {
    reset();
    navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* ── Hero header ──────────────────────────────────────────────── */}
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primary]}
          style={styles.hero}
        >
          <Text style={styles.heroSub}>O teu Código Holland</Text>
          <Text style={styles.heroCode}>{holland_code}</Text>

          {/* Letter breakdown */}
          <View style={styles.codeRow}>
            {topDims.map((letter) => (
              <View key={letter} style={styles.codePill}>
                <Text style={[styles.codePillLetter, { color: Colors.riasec[letter] }]}>
                  {letter}
                </Text>
                <Text style={styles.codePillName}>{HOLLAND_NAMES[letter]}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.heroNote}>
            Baseado em 145 mil respondentes internacionais
          </Text>
        </LinearGradient>

        {/* ── RIASEC Radar ─────────────────────────────────────────────── */}
        <View style={[styles.card, Shadow.sm]}>
          <Text style={styles.cardTitle}>Perfil RIASEC</Text>
          <Text style={styles.cardSub}>As tuas 6 dimensões vocacionais</Text>

          <View style={styles.radarWrap}>
            <RadarChart scores={riasec_scores} size={260} />
          </View>

          {/* Score list */}
          {sortedScores.map((s) => (
            <View key={s.letter} style={styles.scoreRow}>
              <View style={[styles.scoreDot, { backgroundColor: Colors.riasec[s.letter] }]} />
              <View style={styles.scoreInfo}>
                <Text style={styles.scoreName}>
                  <Text style={{ fontWeight: '700' }}>{s.letter}</Text>
                  {' · '}{s.dimension}
                </Text>
              </View>
              <View style={styles.scoreBarWrap}>
                <View
                  style={[
                    styles.scoreBar,
                    {
                      width: `${(s.score / 5) * 100}%`,
                      backgroundColor: Colors.riasec[s.letter],
                    },
                  ]}
                />
              </View>
              <Text style={[styles.scoreVal, { color: Colors.riasec[s.letter] }]}>
                {s.score.toFixed(1)}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Big Five ──────────────────────────────────────────────────── */}
        <View style={[styles.card, Shadow.sm]}>
          <Text style={styles.cardTitle}>Personalidade Big Five</Text>
          <Text style={styles.cardSub}>Previsão baseada no modelo TIPI (escala 1–7)</Text>

          <View style={styles.big5Wrap}>
            {BIG5_DISPLAY.map((trait) => (
              <BigFiveBar
                key={trait.key}
                label={trait.label}
                value={big5[trait.key]}
                color={trait.color}
              />
            ))}
          </View>
        </View>

        {/* ── Careers ──────────────────────────────────────────────────── */}
        <View style={[styles.card, Shadow.sm]}>
          <Text style={styles.cardTitle}>Carreiras Sugeridas</Text>
          <Text style={styles.cardSub}>
            Alinhadas com o teu código <Text style={{ color: Colors.primary, fontWeight: '700' }}>{holland_code}</Text>
          </Text>

          <View style={styles.careersWrap}>
            {careers.map((career, i) => (
              <CareerCard
                key={i}
                career={career}
                index={i}
                accentColor={Colors.riasec[topDims[0]] ?? Colors.primary}
              />
            ))}
          </View>
        </View>

        {/* ── Disclaimer ───────────────────────────────────────────────── */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerIcon}>ℹ️</Text>
          <Text style={styles.disclaimerText}>{nota}</Text>
        </View>

        {/* ── Actions ──────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.restartBtn, Shadow.primary]}
          onPress={handleRestart}
          activeOpacity={0.88}
        >
          <Text style={styles.restartBtnText}>↺ Recomeçar Avaliação</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { gap: Spacing.lg, paddingBottom: Spacing.xl },

  // ── Hero ────────────────────────────────────────────────────────────────
  hero: {
    padding: Spacing.xl,
    paddingTop: Spacing.xl + 8,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  heroSub: {
    fontSize: Typography.base,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  heroCode: {
    fontSize: 72,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 10,
  },
  codeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginVertical: Spacing.sm,
  },
  codePill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.md,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 2,
  },
  codePillLetter: {
    fontSize: Typography.xl,
    fontWeight: '900',
  },
  codePillName: {
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  heroNote: {
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.5)',
    marginTop: Spacing.sm,
  },

  // ── Card ─────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.xl,
    fontWeight: '800',
    color: Colors.text,
  },
  cardSub: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },

  // Radar
  radarWrap: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },

  // Score rows
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  scoreDot: {
    width: 10, height: 10, borderRadius: 5,
  },
  scoreInfo: { width: 120 },
  scoreName: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  scoreBarWrap: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  scoreBar: {
    height: '100%',
    borderRadius: Radius.full,
  },
  scoreVal: {
    fontSize: Typography.sm,
    fontWeight: '700',
    width: 28,
    textAlign: 'right',
  },

  // Big Five
  big5Wrap: { marginTop: Spacing.sm },

  // Careers
  careersWrap: { marginTop: Spacing.xs },

  // Disclaimer
  disclaimer: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  disclaimerIcon: { fontSize: 18, marginTop: 1 },
  disclaimerText: {
    flex: 1,
    fontSize: Typography.xs,
    color: Colors.primaryDark,
    lineHeight: 18,
  },

  // Restart
  restartBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 17,
    marginHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  restartBtnText: {
    fontSize: Typography.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
