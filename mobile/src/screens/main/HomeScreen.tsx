// ─── Home Screen ──────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppStackParamList, IconFamily } from '../../types';
import { useAuthStore }       from '../../store/useAuthStore';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import { useColors, ColorsType, Colors, Spacing, Radius, Typography, Shadow } from '../../theme';

type Nav = NativeStackNavigationProp<AppStackParamList>;

function DimIcon({ family, name, size, color }: { family: IconFamily; name: string; size: number; color: string }) {
  return family === 'Ionicons'
    ? <Ionicons name={name as any} size={size} color={color} />
    : <Feather name={name as any} size={size} color={color} />;
}

const RIASEC_INFO = [
  { letter: 'R', name: 'Realista',      iconFamily: 'Feather' as IconFamily,  iconName: 'tool',                  color: Colors.riasec.R,
    desc: 'Prefere trabalho prático e manual. Gosta de construir, reparar e operar máquinas.' },
  { letter: 'I', name: 'Investigativo', iconFamily: 'Ionicons' as IconFamily, iconName: 'flask-outline',         color: Colors.riasec.I,
    desc: 'Orientado para análise científica. Gosta de resolver problemas complexos e pesquisar.' },
  { letter: 'A', name: 'Artístico',     iconFamily: 'Ionicons' as IconFamily, iconName: 'color-palette-outline', color: Colors.riasec.A,
    desc: 'Criativo e expressivo. Valoriza arte, música, escrita e expressão cultural.' },
  { letter: 'S', name: 'Social',        iconFamily: 'Feather' as IconFamily,  iconName: 'users',                  color: Colors.riasec.S,
    desc: 'Orientado para pessoas. Gosta de ajudar, ensinar e trabalhar em equipa.' },
  { letter: 'E', name: 'Empreendedor',  iconFamily: 'Feather' as IconFamily,  iconName: 'briefcase',              color: Colors.riasec.E,
    desc: 'Motivado por liderança e negócios. Gosta de persuadir e gerir pessoas.' },
  { letter: 'C', name: 'Convencional',  iconFamily: 'Feather' as IconFamily,  iconName: 'bar-chart-2',            color: Colors.riasec.C,
    desc: 'Metódico e organizado. Valoriza dados, procedimentos e ambientes estruturados.' },
];

export default function HomeScreen() {
  const insets  = useSafeAreaInsets();
  const Colors  = useColors();
  const styles  = useMemo(() => makeStyles(Colors), [Colors]);
  const navigation = useNavigation<Nav>();
  const { user }   = useAuthStore();
  const { history } = useAssessmentStore();
  const [activeDim, setActiveDim] = useState<string | null>(null);
  const detailAnim  = useRef(new Animated.Value(0)).current;
  const fadeAnim    = useRef(new Animated.Value(0)).current;
  const heroAnim    = useRef(new Animated.Value(-20)).current;
  const cardAnim    = useRef(new Animated.Value(30)).current;

  const toggleDim = (letter: string) => {
    const next = activeDim === letter ? null : letter;
    Animated.spring(detailAnim, { toValue: next ? 1 : 0, tension: 80, friction: 12, useNativeDriver: true }).start();
    setActiveDim(next);
  };

  useEffect(() => {
    Animated.stagger(100, [
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(heroAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
      ]),
      Animated.spring(cardAnim, { toValue: 0, tension: 50, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const lastResult = history[0] ?? null;
  const firstName  = user?.name?.split(' ')[0] ?? 'Estudante';
  const greetHour  = new Date().getHours();
  const greet      = greetHour < 12 ? 'Bom dia' : greetHour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Spacing.xxxl }}>

        <LinearGradient colors={Colors.heroGradient} style={[styles.hero, { paddingTop: insets.top + Spacing.lg }]}>
          <Animated.View style={[styles.greetRow, { opacity: fadeAnim, transform: [{ translateY: heroAnim }] }]}>
            <View style={styles.greetLeft}>
              <Text style={styles.greetText}>{greet}, {firstName}</Text>
              <Text style={styles.greetSub}>Pronto para descobrir o teu caminho?</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{firstName[0].toUpperCase()}</Text>
            </View>
          </Animated.View>
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

        <Animated.View style={[styles.ctaCard, Shadow.primary, { transform: [{ translateY: cardAnim }], opacity: fadeAnim }]}>
          <LinearGradient colors={Colors.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaGradient}>
            <View style={styles.ctaCircle1} />
            <View style={styles.ctaCircle2} />
            <View style={styles.ctaContent}>
              <Feather name="target" size={36} color="#FFF" />
              <Text style={styles.ctaTitle}>{history.length === 0 ? 'Iniciar avaliação' : 'Nova avaliação'}</Text>
              <Text style={styles.ctaDesc}>48 perguntas · 6 dimensões RIASEC · ~8 min</Text>
              <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate('AssessmentIntro')} activeOpacity={0.9}>
                <Text style={styles.ctaBtnText}>Começar agora →</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {lastResult && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Último resultado</Text>
            <TouchableOpacity style={[styles.resultPreview, Shadow.sm]} onPress={() => navigation.navigate('HistoryDetail', { record: lastResult })} activeOpacity={0.8}>
              <View style={styles.resultLeft}>
                <View style={[styles.hollandBadge, { backgroundColor: Colors.riasecBg[lastResult.holland_code[0]] }]}>
                  <Text style={[styles.hollandCode, { color: Colors.riasec[lastResult.holland_code[0]] }]}>{lastResult.holland_code}</Text>
                </View>
                <View>
                  <Text style={styles.resultDate}>{new Date(lastResult.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                  <Text style={styles.resultCareers} numberOfLines={1}>{lastResult.careers.map(c => c.titulo).join(' · ')}</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={22} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>As 6 dimensões RIASEC</Text>
          <Text style={styles.sectionSub}>O modelo de Holland identifica 6 tipos de personalidade vocacional</Text>
          <View style={styles.dimGrid}>
            {RIASEC_INFO.map((d) => {
              const isActive = activeDim === d.letter;
              return (
                <TouchableOpacity
                  key={d.letter}
                  style={[styles.dimCard, { backgroundColor: Colors.riasecBg[d.letter] }, isActive && { borderColor: d.color, borderWidth: 1.5 }]}
                  onPress={() => toggleDim(d.letter)} activeOpacity={0.75}
                >
                  <DimIcon family={d.iconFamily} name={d.iconName} size={26} color={d.color} />
                  <Text style={[styles.dimLetter, { color: d.color }]}>{d.letter}</Text>
                  <Text style={styles.dimName}>{d.name}</Text>
                  {isActive && <Feather name="chevron-up" size={10} color={d.color} />}
                </TouchableOpacity>
              );
            })}
          </View>
          {activeDim && (() => {
            const d = RIASEC_INFO.find(x => x.letter === activeDim)!;
            return (
              <Animated.View style={[styles.dimDetail, { borderColor: d.color + '50', backgroundColor: Colors.riasecBg[d.letter] }, { opacity: detailAnim, transform: [{ translateY: detailAnim.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }) }] }]}>
                <DimIcon family={d.iconFamily} name={d.iconName} size={26} color={d.color} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.dimDetailTitle, { color: d.color }]}>{d.letter} — {d.name}</Text>
                  <Text style={styles.dimDetailDesc}>{d.desc}</Text>
                </View>
              </Animated.View>
            );
          })()}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como funciona</Text>
          <View style={styles.infoList}>
            {[
              { family: 'Feather' as IconFamily,  icon: 'edit-3',          title: '48 perguntas', desc: 'Avalia a tua preferência por diferentes atividades profissionais' },
              { family: 'Feather' as IconFamily,  icon: 'cpu',             title: 'IA preditiva', desc: 'Modelo treinado com 145 mil respondentes para máxima precisão' },
              { family: 'Ionicons' as IconFamily, icon: 'school-outline',  title: 'Carreiras sugeridas', desc: 'Recebe sugestões personalizadas com base no teu perfil único' },
            ].map((item) => (
              <View key={item.title} style={[styles.infoCard, Shadow.sm]}>
                <View style={styles.infoIconWrap}>
                  <DimIcon family={item.family} name={item.icon} size={22} color={Colors.primaryLight} />
                </View>
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

const makeStyles = (C: ColorsType) => StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },

  hero: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl + Spacing.lg, gap: Spacing.md },
  greetRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greetLeft:   { flex: 1, gap: 4 },
  greetText:   { fontSize: Typography.xl, fontWeight: '800', color: C.text },
  greetSub:    { fontSize: Typography.sm, color: C.textSecondary },
  avatar:      { width: 44, height: 44, borderRadius: 22, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', ...Shadow.primary },
  avatarText:  { fontSize: Typography.lg, fontWeight: '800', color: '#FFF' },

  statsRow: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center',
    borderWidth: 1, borderColor: C.border,
  },
  statPill:    { flex: 1, alignItems: 'center', gap: 2 },
  statNum:     { fontSize: Typography.xl, fontWeight: '800', color: C.text },
  statLabel:   { fontSize: Typography.xs, color: C.textMuted },
  statDivider: { width: 1, height: 32, backgroundColor: C.border, marginHorizontal: Spacing.md },

  ctaCard:     { marginHorizontal: Spacing.lg, marginTop: -Spacing.xl, borderRadius: Radius.xl, overflow: 'hidden' },
  ctaGradient: { padding: Spacing.xl, overflow: 'hidden' },
  ctaCircle1:  { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.07)', top: -40, right: -40 },
  ctaCircle2:  { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.05)', bottom: -30, left: 20 },
  ctaContent:  { gap: Spacing.sm },
  ctaEmoji:    { fontSize: 40 },
  ctaTitle:    { fontSize: Typography['2xl'], fontWeight: '900', color: '#FFF' },
  ctaDesc:     { fontSize: Typography.sm, color: 'rgba(255,255,255,0.75)' },
  ctaBtn:      { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: Radius.lg, paddingVertical: 14, paddingHorizontal: Spacing.xl, alignSelf: 'flex-start', marginTop: Spacing.xs, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
  ctaBtnText:  { fontSize: Typography.base, fontWeight: '700', color: '#FFF' },

  section:      { paddingHorizontal: Spacing.lg, marginTop: Spacing.xl, gap: Spacing.md },
  sectionTitle: { fontSize: Typography.lg, fontWeight: '800', color: C.text },
  sectionSub:   { fontSize: Typography.sm, color: C.textSecondary, marginTop: -Spacing.sm },

  resultPreview: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.card, borderRadius: Radius.lg,
    padding: Spacing.lg, borderWidth: 1, borderColor: C.border,
  },
  resultLeft:    { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  hollandBadge:  { width: 56, height: 56, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  hollandCode:   { fontSize: Typography.lg, fontWeight: '900' },
  resultDate:    { fontSize: Typography.sm, color: C.textSecondary },
  resultCareers: { fontSize: Typography.xs, color: C.textMuted, maxWidth: 200 },
  resultArrow:   { fontSize: 24, color: C.textMuted },

  dimGrid:        { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  dimCard:        { flexBasis: '30%', flexGrow: 1, borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: C.border },
  dimLetter:      { fontSize: Typography.xl, fontWeight: '900' },
  dimName:        { fontSize: Typography.xs, color: C.textSecondary, textAlign: 'center' },
  dimDetail:      { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, padding: Spacing.md, borderRadius: Radius.lg, borderWidth: 1 },
  dimDetailTitle: { fontSize: Typography.base, fontWeight: '800', marginBottom: 4 },
  dimDetailDesc:  { fontSize: Typography.sm, color: C.textSecondary, lineHeight: 20 },

  infoList:     { gap: Spacing.sm },
  infoCard:     { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: Radius.lg, padding: Spacing.md, gap: Spacing.md, borderWidth: 1, borderColor: C.border },
  infoIconWrap: { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: C.primaryGlow, alignItems: 'center', justifyContent: 'center' },
  infoText:     { flex: 1, gap: 2 },
  infoTitle: { fontSize: Typography.base, fontWeight: '700', color: C.text },
  infoDesc:  { fontSize: Typography.sm, color: C.textSecondary, lineHeight: 18 },
});
