// ─── Assessment Intro Screen ──────────────────────────────────────────────────

import React, { useRef, useEffect, useState } from 'react';
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

type Props = NativeStackScreenProps<AppStackParamList, 'AssessmentIntro'>;

const DIMENSIONS = [
  { letter: 'R', name: 'Realista',      emoji: '🔧', color: Colors.riasec.R, bg: Colors.riasecBg.R,
    desc: 'Prefere trabalho prático e manual. Gosta de construir, reparar e operar máquinas ou ferramentas.' },
  { letter: 'I', name: 'Investigativo', emoji: '🔬', color: Colors.riasec.I, bg: Colors.riasecBg.I,
    desc: 'Orientado para a análise e investigação científica. Gosta de resolver problemas complexos e pesquisar.' },
  { letter: 'A', name: 'Artístico',     emoji: '🎨', color: Colors.riasec.A, bg: Colors.riasecBg.A,
    desc: 'Criativo e expressivo. Valoriza a arte, música, escrita e outras formas de expressão cultural.' },
  { letter: 'S', name: 'Social',        emoji: '🤝', color: Colors.riasec.S, bg: Colors.riasecBg.S,
    desc: 'Orientado para pessoas. Gosta de ajudar, ensinar, aconselhar e trabalhar em equipa.' },
  { letter: 'E', name: 'Empreendedor',  emoji: '💼', color: Colors.riasec.E, bg: Colors.riasecBg.E,
    desc: 'Liderança e persuasão. Motivado por negócios, gestão e influenciar os outros.' },
  { letter: 'C', name: 'Convencional',  emoji: '📊', color: Colors.riasec.C, bg: Colors.riasecBg.C,
    desc: 'Metódico e organizado. Valoriza dados, procedimentos e ambientes estruturados.' },
];

export default function AssessmentIntroScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { reset } = useAssessmentStore();

  const [activeDim, setActiveDim] = useState<string | null>(null);
  const detailAnim = useRef(new Animated.Value(0)).current;

  const toggleDim = (letter: string) => {
    const next = activeDim === letter ? null : letter;
    Animated.spring(detailAnim, {
      toValue: next ? 1 : 0,
      tension: 80,
      friction: 12,
      useNativeDriver: true,
    }).start();
    setActiveDim(next);
  };

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleStart = () => {
    reset();
    navigation.replace('Question');
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#13102E', '#0D0D1A', '#0D0D1A']} style={StyleSheet.absoluteFill} />

      {/* Decorative bg circle */}
      <View style={styles.bgCircle} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.xl },
        ]}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Close button */}
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>

          {/* Hero */}
          <View style={styles.hero}>
            <LinearGradient colors={Colors.primaryGradient} style={styles.heroIcon}>
              <Text style={{ fontSize: 36 }}>🎯</Text>
            </LinearGradient>
            <Text style={styles.heroTitle}>Avaliação RIASEC</Text>
            <Text style={styles.heroSub}>
              Descobre o teu perfil vocacional em apenas 5 minutos
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { icon: '❓', value: '30', label: 'Questões' },
              { icon: '🧩', value: '6',  label: 'Dimensões' },
              { icon: '⏱',  value: '~5', label: 'Minutos' },
            ].map(s => (
              <View key={s.label} style={styles.stat}>
                <Text style={styles.statIcon}>{s.icon}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* How it works */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Como funciona</Text>
            {[
              { n: '1', text: 'Responde a 30 perguntas sobre atividades profissionais' },
              { n: '2', text: 'Indica o quanto gostarias de fazer cada atividade (1–5)' },
              { n: '3', text: 'Recebe o teu perfil RIASEC, Big Five e sugestões de carreira' },
            ].map(step => (
              <View key={step.n} style={styles.step}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>{step.n}</Text>
                </View>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            ))}
          </View>

          {/* Dimensions preview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>As 6 dimensões avaliadas</Text>
            <View style={styles.dimGrid}>
              {DIMENSIONS.map(d => {
                const isActive = activeDim === d.letter;
                return (
                  <TouchableOpacity
                    key={d.letter}
                    style={[
                      styles.dimChip,
                      { backgroundColor: d.bg },
                      isActive && { borderColor: d.color, borderWidth: 1.5 },
                    ]}
                    onPress={() => toggleDim(d.letter)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.dimEmoji}>{d.emoji}</Text>
                    <Text style={[styles.dimLetter, { color: d.color }]}>{d.letter}</Text>
                    <Text style={styles.dimName}>{d.name}</Text>
                    {isActive && (
                      <Text style={[styles.dimArrow, { color: d.color }]}>▲</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Expanded description */}
            {activeDim && (() => {
              const d = DIMENSIONS.find(x => x.letter === activeDim)!;
              return (
                <Animated.View
                  style={[
                    styles.dimDetail,
                    { borderColor: d.color + '50', backgroundColor: d.bg },
                    {
                      opacity: detailAnim,
                      transform: [{ translateY: detailAnim.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }) }],
                    },
                  ]}
                >
                  <Text style={styles.dimDetailEmoji}>{d.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.dimDetailTitle, { color: d.color }]}>
                      {d.letter} — {d.name}
                    </Text>
                    <Text style={styles.dimDetailDesc}>{d.desc}</Text>
                  </View>
                </Animated.View>
              );
            })()}
          </View>

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              🔒 As tuas respostas são confidenciais e não serão partilhadas com terceiros.
            </Text>
          </View>

        </Animated.View>
      </ScrollView>

      {/* Bottom CTA — always visible */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.lg) }]}>
        <TouchableOpacity
          style={[styles.startBtn, Shadow.primary]}
          onPress={handleStart}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={Colors.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startGradient}
          >
            <Text style={styles.startText}>Começar avaliação →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg, gap: Spacing.xl },

  bgCircle: {
    position: 'absolute',
    width: 400, height: 400, borderRadius: 200,
    backgroundColor: Colors.primary,
    opacity: 0.06,
    top: -150, alignSelf: 'center',
  },

  closeBtn: {
    alignSelf: 'flex-end',
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  closeIcon: { fontSize: 14, color: Colors.textSecondary },

  hero: { alignItems: 'center', gap: Spacing.sm, paddingTop: Spacing.sm },
  heroIcon: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.primary,
  },
  heroTitle: { fontSize: Typography['3xl'], fontWeight: '900', color: Colors.text, textAlign: 'center' },
  heroSub:   { fontSize: Typography.base, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: 2,
  },
  statIcon:  { fontSize: 22 },
  statValue: { fontSize: Typography['2xl'], fontWeight: '900', color: Colors.text },
  statLabel: { fontSize: Typography.xs, color: Colors.textMuted },

  section: { gap: Spacing.md },
  sectionTitle: { fontSize: Typography.lg, fontWeight: '800', color: Colors.text },

  step: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  stepNum: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primaryGlow,
    borderWidth: 1, borderColor: Colors.primaryLight + '40',
    alignItems: 'center', justifyContent: 'center',
    marginTop: 1,
  },
  stepNumText: { fontSize: Typography.sm, fontWeight: '800', color: Colors.primaryLight },
  stepText:    { flex: 1, fontSize: Typography.base, color: Colors.textSecondary, lineHeight: 22 },

  dimGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.sm,
  },
  dimChip: {
    flexBasis: '31%',
    flexGrow: 1,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dimEmoji:  { fontSize: 24 },
  dimLetter: { fontSize: Typography.xl, fontWeight: '900' },
  dimName:   { fontSize: Typography.xs, color: Colors.textSecondary, textAlign: 'center' },
  dimArrow:  { fontSize: 8, marginTop: 2 },

  dimDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  dimDetailEmoji: { fontSize: 28, marginTop: 2 },
  dimDetailTitle: { fontSize: Typography.base, fontWeight: '800', marginBottom: 4 },
  dimDetailDesc:  { fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: 20 },

  disclaimer: {
    backgroundColor: Colors.infoBg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.info + '30',
  },
  disclaimerText: { fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: 18 },

  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  startBtn:      { borderRadius: Radius.lg, overflow: 'hidden' },
  startGradient: { paddingVertical: 18, alignItems: 'center' },
  startText:     { fontSize: Typography.lg, fontWeight: '800', color: '#FFF', letterSpacing: 0.3 },
});
