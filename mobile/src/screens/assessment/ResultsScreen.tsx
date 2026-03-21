// ─── Results Screen ───────────────────────────────────────────────────────────
// Dark premium layout: Holland code hero, RIASEC radar, Big Five, Careers.

import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppStackParamList } from '../../types';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import { Colors, Spacing, Radius, Typography, Shadow } from '../../theme';
import RadarChart from '../../components/RadarChart';
import BigFiveBar from '../../components/BigFiveBar';
import CareerCard from '../../components/CareerCard';

type Props = NativeStackScreenProps<AppStackParamList, 'Results'>;

const BIG5 = [
  { key: 'openness',          label: 'Abertura à Experiência', color: Colors.big5.openness },
  { key: 'conscientiousness', label: 'Conscienciosidade',      color: Colors.big5.conscientiousness },
  { key: 'extraversion',      label: 'Extroversão',            color: Colors.big5.extraversion },
  { key: 'agreeableness',     label: 'Amabilidade',            color: Colors.big5.agreeableness },
  { key: 'neuroticism',       label: 'Neuroticismo',           color: Colors.big5.neuroticism },
] as const;

const LETTER_NAMES: Record<string, string> = {
  R: 'Realista', I: 'Investigativo', A: 'Artístico',
  S: 'Social',   E: 'Empreendedor',  C: 'Convencional',
};

export default function ResultsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { results, reset } = useAssessmentStore();

  // Section animations
  const heroAnim    = useRef(new Animated.Value(0)).current;
  const section1Anim = useRef(new Animated.Value(40)).current;
  const section2Anim = useRef(new Animated.Value(40)).current;
  const section3Anim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.spring(heroAnim,    { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }),
      Animated.spring(section1Anim,{ toValue: 0, tension: 50, friction: 10, useNativeDriver: true }),
      Animated.spring(section2Anim,{ toValue: 0, tension: 50, friction: 10, useNativeDriver: true }),
      Animated.spring(section3Anim,{ toValue: 0, tension: 50, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  if (!results) return null;

  const { holland_code, riasec_scores, big5, careers, nota } = results;
  const topLetter    = holland_code[0];
  const accentColor  = Colors.riasec[topLetter] ?? Colors.primary;
  const accentGrad   = Colors.riasecGradient[topLetter] ?? Colors.primaryGradient;
  const sortedScores = [...riasec_scores].sort((a, b) => b.score - a.score);

  const handleRestart = () => {
    reset();
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <Animated.View style={{ opacity: heroAnim }}>
          <LinearGradient
            colors={[`${accentColor}20`, `${accentColor}08`, '#0D0D1A']}
            locations={[0, 0.5, 1]}
            style={[styles.hero, { paddingTop: insets.top + Spacing.lg }]}
          >
            {/* Decorative large letter bg */}
            <Text style={styles.heroBgLetter}>{holland_code[0]}</Text>

            <Text style={styles.heroLabel}>O teu Código Holland</Text>

            <Text style={[styles.heroCode, { color: accentColor }]}>
              {holland_code}
            </Text>

            {/* Letter pills */}
            <View style={styles.pillsRow}>
              {holland_code.split('').map((l, i) => (
                <Animated.View
                  key={l}
                  style={[
                    styles.pill,
                    { backgroundColor: Colors.riasecBg[l], borderColor: Colors.riasec[l] + '40' },
                    {
                      transform: [{
                        scale: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }),
                      }],
                      opacity: heroAnim,
                    },
                  ]}
                >
                  <Text style={[styles.pillLetter, { color: Colors.riasec[l] }]}>{l}</Text>
                  <Text style={styles.pillName}>{LETTER_NAMES[l]}</Text>
                </Animated.View>
              ))}
            </View>

            <Text style={styles.heroNote}>Baseado em 145 mil respondentes</Text>
          </LinearGradient>
        </Animated.View>

        {/* ── RIASEC Section ─────────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ translateY: section1Anim }],
              opacity: section1Anim.interpolate({ inputRange: [0, 40], outputRange: [1, 0] }),
            },
          ]}
        >
          <Text style={styles.cardTitle}>Perfil RIASEC</Text>
          <Text style={styles.cardSub}>As tuas 6 dimensões vocacionais</Text>

          <View style={styles.radarWrap}>
            <RadarChart scores={riasec_scores} size={250} />
          </View>

          {sortedScores.map((s, i) => (
            <View key={s.letter} style={styles.scoreRow}>
              {i === 0 && <View style={[styles.topBadge, { backgroundColor: Colors.riasecBg[s.letter] }]}>
                <Text style={[styles.topBadgeText, { color: Colors.riasec[s.letter] }]}>Top</Text>
              </View>}
              {i !== 0 && <View style={[styles.dot, { backgroundColor: Colors.riasec[s.letter] }]} />}
              <View style={styles.scoreInfo}>
                <Text style={[styles.scoreLetter, { color: Colors.riasec[s.letter] }]}>{s.letter}</Text>
                <Text style={styles.scoreDim} numberOfLines={1}>{s.dimension}</Text>
              </View>
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
        </Animated.View>

        {/* ── Big Five Section ───────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ translateY: section2Anim }],
              opacity: section2Anim.interpolate({ inputRange: [0, 40], outputRange: [1, 0] }),
            },
          ]}
        >
          <Text style={styles.cardTitle}>Personalidade Big Five</Text>
          <Text style={styles.cardSub}>Previsão baseada no modelo TIPI (escala 1–7)</Text>

          <View style={styles.big5Wrap}>
            {BIG5.map(trait => (
              <BigFiveBar
                key={trait.key}
                label={trait.label}
                value={big5[trait.key]}
                color={trait.color}
              />
            ))}
          </View>
        </Animated.View>

        {/* ── Careers Section ────────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ translateY: section3Anim }],
              opacity: section3Anim.interpolate({ inputRange: [0, 40], outputRange: [1, 0] }),
            },
          ]}
        >
          <Text style={styles.cardTitle}>Carreiras Sugeridas</Text>
          <Text style={styles.cardSub}>
            Compatíveis com o código{' '}
            <Text style={{ color: accentColor, fontWeight: '800' }}>{holland_code}</Text>
          </Text>

          <View style={styles.careersWrap}>
            {careers.map((c, i) => (
              <CareerCard key={i} career={c} index={i} accentColor={accentColor} />
            ))}
          </View>
        </Animated.View>

        {/* ── Disclaimer ─────────────────────────────────────────────────── */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>ℹ  {nota}</Text>
        </View>

        {/* ── Actions ────────────────────────────────────────────────────── */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.restartBtn, Shadow.sm]}
            onPress={handleRestart}
            activeOpacity={0.8}
          >
            <Text style={styles.restartText}>↺  Nova avaliação</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.homeBtn, Shadow.primary]}
            onPress={handleRestart}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={accentGrad}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.homeBtnGradient}
            >
              <Text style={styles.homeBtnText}>Ver histórico →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: insets.bottom + Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.background },
  scroll: { gap: Spacing.lg },

  // ── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
    overflow: 'hidden',
  },
  heroBgLetter: {
    position: 'absolute',
    fontSize: 220,
    fontWeight: '900',
    opacity: 0.04,
    color: '#FFF',
    top: -20,
    right: -20,
  },
  heroLabel: { fontSize: Typography.base, color: Colors.textSecondary, fontWeight: '500' },
  heroCode: {
    fontSize: 80,
    fontWeight: '900',
    letterSpacing: 10,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 20,
    textShadowOffset: { width: 0, height: 4 },
  },
  pillsRow: { flexDirection: 'row', gap: Spacing.sm, marginVertical: Spacing.xs },
  pill: {
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: Radius.md, alignItems: 'center', gap: 3,
    borderWidth: 1,
  },
  pillLetter: { fontSize: Typography.xl, fontWeight: '900' },
  pillName:   { fontSize: Typography.xs, color: Colors.textMuted },
  heroNote:   { fontSize: Typography.xs, color: Colors.textMuted },

  // ── Card ─────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  cardTitle: { fontSize: Typography.lg, fontWeight: '800', color: Colors.text },
  cardSub:   { fontSize: Typography.sm, color: Colors.textSecondary, marginBottom: 4 },

  // Radar
  radarWrap: { alignItems: 'center', paddingVertical: Spacing.sm },

  // Score rows
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  topBadge: {
    width: 32, height: 20, borderRadius: Radius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  topBadgeText: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
  dot: { width: 8, height: 8, borderRadius: 4, marginLeft: 4, marginRight: 12 - 4 },
  scoreInfo: { width: 100, flexDirection: 'row', alignItems: 'center', gap: 4 },
  scoreLetter: { fontSize: Typography.base, fontWeight: '900', width: 14 },
  scoreDim:    { fontSize: Typography.xs, color: Colors.textSecondary, flex: 1 },
  barTrack: {
    flex: 1, height: 6,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: Radius.full },
  scoreVal: { width: 30, fontSize: Typography.sm, fontWeight: '700', textAlign: 'right' },

  // Big Five
  big5Wrap: { gap: Spacing.sm, marginTop: 4 },

  // Careers
  careersWrap: { gap: Spacing.sm, marginTop: 4 },

  // Disclaimer
  disclaimer: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  disclaimerText: { fontSize: Typography.xs, color: Colors.textMuted, lineHeight: 18 },

  // Actions
  actions: {
    marginHorizontal: Spacing.lg,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  restartBtn: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  restartText: { fontSize: Typography.base, fontWeight: '700', color: Colors.textSecondary },

  homeBtn:         { flex: 2, borderRadius: Radius.lg, overflow: 'hidden' },
  homeBtnGradient: { paddingVertical: 14, alignItems: 'center' },
  homeBtnText:     { fontSize: Typography.base, fontWeight: '700', color: '#FFF' },
});
