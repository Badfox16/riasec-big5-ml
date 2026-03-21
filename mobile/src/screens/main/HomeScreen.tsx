// ─── Home Screen ──────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppStackParamList } from '../../types';
import { useAuthStore }      from '../../store/useAuthStore';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import { Colors, Spacing, Radius, Typography, Shadow } from '../../theme';

type Nav = NativeStackNavigationProp<AppStackParamList>;


const RIASEC_INFO = [
  { letter: 'R', name: 'Realista',      emoji: '🔧', color: Colors.riasec.R,
    desc: 'Prefere trabalho prático e manual. Gosta de construir, reparar e operar máquinas.' },
  { letter: 'I', name: 'Investigativo', emoji: '🔬', color: Colors.riasec.I,
    desc: 'Orientado para análise científica. Gosta de resolver problemas complexos e pesquisar.' },
  { letter: 'A', name: 'Artístico',     emoji: '🎨', color: Colors.riasec.A,
    desc: 'Criativo e expressivo. Valoriza arte, música, escrita e expressão cultural.' },
  { letter: 'S', name: 'Social',        emoji: '🤝', color: Colors.riasec.S,
    desc: 'Orientado para pessoas. Gosta de ajudar, ensinar e trabalhar em equipa.' },
  { letter: 'E', name: 'Empreendedor',  emoji: '💼', color: Colors.riasec.E,
    desc: 'Motivado por liderança e negócios. Gosta de persuadir e gerir pessoas.' },
  { letter: 'C', name: 'Convencional',  emoji: '📊', color: Colors.riasec.C,
    desc: 'Metódico e organizado. Valoriza dados, procedimentos e ambientes estruturados.' },
];

export default function HomeScreen() {
  const insets     = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { user }   = useAuthStore();
  const { history } = useAssessmentStore();
  const [activeDim, setActiveDim] = useState<string | null>(null);
  const detailAnim = useRef(new Animated.Value(0)).current;

  const toggleDim = (letter: string) => {
    const next = activeDim === letter ? null : letter;
    Animated.spring(detailAnim, {
      toValue: next ? 1 : 0, tension: 80, friction: 12, useNativeDriver: true,
    }).start();
    setActiveDim(next);
  };

  const lastResult = history[0] ?? null;

  // Animations
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const heroAnim   = useRef(new Animated.Value(-20)).current;
  const cardAnim   = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(heroAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
      ]),
      Animated.spring(cardAnim, { toValue: 0, tension: 50, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const firstName = user?.name?.split(' ')[0] ?? 'Estudante';
  const greetHour = new Date().getHours();
  const greet = greetHour < 12 ? 'Bom dia' : greetHour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Spacing.xxxl }}
      >
        {/* ── Hero header ──────────────────────────────────────────────── */}
        <LinearGradient
          colors={['#13102E', '#0D0D1A']}
          style={[styles.hero, { paddingTop: insets.top + Spacing.lg }]}
        >
          {/* Greeting */}
          <Animated.View
            style={[styles.greetRow, { opacity: fadeAnim, transform: [{ translateY: heroAnim }] }]}
          >
            <View style={styles.greetLeft}>
              <Text style={styles.greetText}>{greet}, {firstName} 👋</Text>
              <Text style={styles.greetSub}>Pronto para descobrir o teu caminho?</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{firstName[0].toUpperCase()}</Text>
            </View>
          </Animated.View>

          {/* Stats row */}
          {history.length > 0 && (
            <Animated.View style={[styles.statsRow, { opacity: fadeAnim }]}>
              <View style={styles.statPill}>
                <Text style={styles.statNum}>{history.length}</Text>
                <Text style={styles.statLabel}>avaliações</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statPill}>
                <Text style={[styles.statNum, { color: Colors.riasec[lastResult.holland_code[0]] }]}>
                  {lastResult.holland_code}
                </Text>
                <Text style={styles.statLabel}>último código</Text>
              </View>
            </Animated.View>
          )}
        </LinearGradient>

        {/* ── Main CTA card ─────────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.ctaCard,
            Shadow.primary,
            { transform: [{ translateY: cardAnim }], opacity: fadeAnim },
          ]}
        >
          <LinearGradient
            colors={Colors.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            {/* Decorative circles */}
            <View style={styles.ctaCircle1} />
            <View style={styles.ctaCircle2} />

            <View style={styles.ctaContent}>
              <Text style={styles.ctaEmoji}>🎯</Text>
              <Text style={styles.ctaTitle}>
                {history.length === 0 ? 'Iniciar avaliação' : 'Nova avaliação'}
              </Text>
              <Text style={styles.ctaDesc}>
                30 perguntas · 6 dimensões RIASEC · ~5 min
              </Text>
              <TouchableOpacity
                style={styles.ctaBtn}
                onPress={() => navigation.navigate('AssessmentIntro')}
                activeOpacity={0.9}
              >
                <Text style={styles.ctaBtnText}>Começar agora →</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ── Last result preview ───────────────────────────────────────── */}
        {lastResult && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Último resultado</Text>
            <TouchableOpacity
              style={[styles.resultPreview, Shadow.sm]}
              onPress={() => navigation.navigate('HistoryDetail', { record: lastResult })}
              activeOpacity={0.8}
            >
              <View style={styles.resultLeft}>
                <View
                  style={[
                    styles.hollandBadge,
                    { backgroundColor: Colors.riasecBg[lastResult.holland_code[0]] },
                  ]}
                >
                  <Text style={[styles.hollandCode, { color: Colors.riasec[lastResult.holland_code[0]] }]}>
                    {lastResult.holland_code}
                  </Text>
                </View>
                <View>
                  <Text style={styles.resultDate}>
                    {new Date(lastResult.date).toLocaleDateString('pt-PT', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </Text>
                  <Text style={styles.resultCareers} numberOfLines={1}>
                    {lastResult.careers.map(c => c.titulo).join(' · ')}
                  </Text>
                </View>
              </View>
              <Text style={styles.resultArrow}>›</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── What is RIASEC ────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>As 6 dimensões RIASEC</Text>
          <Text style={styles.sectionSub}>
            O modelo de Holland identifica 6 tipos de personalidade vocacional
          </Text>

          <View style={styles.dimGrid}>
            {RIASEC_INFO.map((d) => {
              const isActive = activeDim === d.letter;
              return (
                <TouchableOpacity
                  key={d.letter}
                  style={[
                    styles.dimCard,
                    { backgroundColor: Colors.riasecBg[d.letter] },
                    isActive && { borderColor: d.color, borderWidth: 1.5 },
                  ]}
                  onPress={() => toggleDim(d.letter)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.dimEmoji}>{d.emoji}</Text>
                  <Text style={[styles.dimLetter, { color: d.color }]}>{d.letter}</Text>
                  <Text style={styles.dimName}>{d.name}</Text>
                  {isActive && <Text style={[styles.dimArrow, { color: d.color }]}>▲</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Expanded description */}
          {activeDim && (() => {
            const d = RIASEC_INFO.find(x => x.letter === activeDim)!;
            return (
              <Animated.View
                style={[
                  styles.dimDetail,
                  { borderColor: d.color + '50', backgroundColor: Colors.riasecBg[d.letter] },
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

        {/* ── Info cards ────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como funciona</Text>
          <View style={styles.infoList}>
            {[
              { icon: '📝', title: '30 perguntas', desc: 'Avalia a tua preferência por diferentes atividades profissionais' },
              { icon: '🧠', title: 'IA preditiva', desc: 'Modelo treinado com 145 mil respondentes para máxima precisão' },
              { icon: '🎓', title: 'Carreiras sugeridas', desc: 'Recebe sugestões personalizadas com base no teu perfil único' },
            ].map((item) => (
              <View key={item.title} style={[styles.infoCard, Shadow.sm]}>
                <Text style={styles.infoIcon}>{item.icon}</Text>
                <View style={styles.infoText}>
                  <Text style={styles.infoTitle}>{item.title}</Text>
                  <Text style={styles.infoDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  // ── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl + Spacing.lg,
    gap: Spacing.md,
  },
  greetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetLeft:  { flex: 1, gap: 4 },
  greetText:  { fontSize: Typography.xl, fontWeight: '800', color: Colors.text },
  greetSub:   { fontSize: Typography.sm, color: Colors.textSecondary },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.primary,
  },
  avatarText: { fontSize: Typography.lg, fontWeight: '800', color: '#FFF' },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statPill:    { flex: 1, alignItems: 'center', gap: 2 },
  statNum:     { fontSize: Typography.xl, fontWeight: '800', color: Colors.text },
  statLabel:   { fontSize: Typography.xs, color: Colors.textMuted },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border, marginHorizontal: Spacing.md },

  // ── CTA Card ─────────────────────────────────────────────────────────────
  ctaCard: {
    marginHorizontal: Spacing.lg,
    marginTop: -Spacing.xl,
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  ctaGradient: {
    padding: Spacing.xl,
    overflow: 'hidden',
  },
  ctaCircle1: {
    position: 'absolute',
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -40, right: -40,
  },
  ctaCircle2: {
    position: 'absolute',
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -30, left: 20,
  },
  ctaContent: { gap: Spacing.sm },
  ctaEmoji:   { fontSize: 40 },
  ctaTitle:   { fontSize: Typography['2xl'], fontWeight: '900', color: '#FFF' },
  ctaDesc:    { fontSize: Typography.sm, color: 'rgba(255,255,255,0.75)' },
  ctaBtn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: Radius.lg,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl,
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  ctaBtnText: { fontSize: Typography.base, fontWeight: '700', color: '#FFF' },

  // ── Sections ─────────────────────────────────────────────────────────────
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  sectionTitle: { fontSize: Typography.lg, fontWeight: '800', color: Colors.text },
  sectionSub:   { fontSize: Typography.sm, color: Colors.textSecondary, marginTop: -Spacing.sm },

  // Last result
  resultPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resultLeft:    { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  hollandBadge: {
    width: 56, height: 56, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  hollandCode:   { fontSize: Typography.lg, fontWeight: '900' },
  resultDate:    { fontSize: Typography.sm, color: Colors.textSecondary },
  resultCareers: { fontSize: Typography.xs, color: Colors.textMuted, maxWidth: 200 },
  resultArrow:   { fontSize: 24, color: Colors.textMuted },

  // Dimension grid
  dimGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.sm,
  },
  dimCard: {
    flexBasis: '31%',
    flexGrow: 1,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dimEmoji:  { fontSize: 28 },
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

  // Info cards
  infoList: { gap: Spacing.sm },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoIcon:  { fontSize: 28 },
  infoText:  { flex: 1, gap: 2 },
  infoTitle: { fontSize: Typography.base, fontWeight: '700', color: Colors.text },
  infoDesc:  { fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: 18 },
});
