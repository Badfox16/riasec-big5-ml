// ─── About Screen — modelos científicos e o projecto ─────────────────────────

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Polygon, Line, Text as SvgText } from 'react-native-svg';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppStackParamList, IconFamily } from '../../types';
import { useColors, ColorsType, Spacing, Radius, Typography, Shadow } from '../../theme';

type Props = NativeStackScreenProps<AppStackParamList, 'About'>;

const HOLLAND_AXES: { key: string; name: string; angle: number }[] = [
  { key: 'R', name: 'Realista',      angle: -90 },
  { key: 'I', name: 'Investigativo', angle: -30 },
  { key: 'A', name: 'Artístico',     angle:  30 },
  { key: 'S', name: 'Social',        angle:  90 },
  { key: 'E', name: 'Empreendedor',  angle: 150 },
  { key: 'C', name: 'Convencional',  angle: 210 },
];

function HollandHexagon({ size = 220 }: { size?: number }) {
  const C = useColors();
  const cx = size / 2, cy = size / 2;
  const r = size * 0.36;
  const labelR = r + 26;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const xy = (radius: number, angle: number) => ({
    x: cx + radius * Math.cos(toRad(angle)),
    y: cy + radius * Math.sin(toRad(angle)),
  });
  const points = HOLLAND_AXES.map(a => xy(r, a.angle));
  const polygon = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <Svg width={size} height={size}>
      <Polygon points={polygon} fill={C.primary + '15'} stroke={C.primary} strokeWidth={2} strokeLinejoin="round" />
      {HOLLAND_AXES.map((a, i) => {
        const next = HOLLAND_AXES[(i + 1) % HOLLAND_AXES.length];
        const p1 = xy(r, a.angle), p2 = xy(r, next.angle);
        return <Line key={`edge-${a.key}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={C.riasec[a.key]} strokeWidth={2.5} />;
      })}
      {HOLLAND_AXES.map(a => {
        const pos = xy(labelR, a.angle);
        return (
          <SvgText key={`label-${a.key}`} x={pos.x} y={pos.y + 5} fontSize={14} fontWeight="800" fill={C.riasec[a.key]} textAnchor="middle">
            {a.key}
          </SvgText>
        );
      })}
    </Svg>
  );
}

function SectionIcon({ family, name, size, color }: { family: IconFamily; name: string; size: number; color: string }) {
  return family === 'Ionicons'
    ? <Ionicons name={name as any} size={size} color={color} />
    : <Feather name={name as any} size={size} color={color} />;
}

const BIG5_TRAITS = [
  { letter: 'O', name: 'Abertura à Experiência', family: 'Ionicons' as IconFamily, icon: 'bulb-outline',
    desc: 'Curiosidade intelectual, imaginação e abertura a novas ideias e experiências.' },
  { letter: 'C', name: 'Conscienciosidade',       family: 'Feather' as IconFamily,  icon: 'check-square',
    desc: 'Organização, disciplina e orientação para objectivos e responsabilidade.' },
  { letter: 'E', name: 'Extroversão',             family: 'Ionicons' as IconFamily, icon: 'megaphone-outline',
    desc: 'Sociabilidade, energia e tendência para buscar estimulação no convívio social.' },
  { letter: 'A', name: 'Amabilidade',             family: 'Feather' as IconFamily,  icon: 'heart',
    desc: 'Cooperação, empatia e preocupação com o bem-estar dos outros.' },
  { letter: 'N', name: 'Neuroticismo',            family: 'Feather' as IconFamily,  icon: 'activity',
    desc: 'Tendência para experienciar emoções negativas como ansiedade e instabilidade emocional.' },
];

const FLOW_STEPS = [
  { family: 'Feather' as IconFamily,  icon: 'edit-3',         title: 'Respondo ao RIASEC', desc: '48 perguntas sobre preferências por actividades profissionais.' },
  { family: 'Feather' as IconFamily,  icon: 'cpu',            title: 'O sistema calcula o meu perfil', desc: 'Um modelo de Machine Learning infere o Código Holland e os traços Big Five.' },
  { family: 'Ionicons' as IconFamily, icon: 'school-outline', title: 'O sistema sugere carreiras e cursos moçambicanos', desc: 'Recomendações ligadas a universidades reais e à empregabilidade por província.' },
];

const REFERENCES = [
  { ref: 'Holland, J. L. (1997)', desc: 'Making Vocational Choices: A Theory of Vocational Personalities and Work Environments — base teórica do modelo RIASEC usado nesta aplicação.' },
  { ref: 'McCrae, R. R., & Costa, P. T. (1997)', desc: 'Personality Trait Structure as a Human Universal — fundamenta o modelo Big Five (OCEAN) previsto pelo modelo de ML.' },
  { ref: 'Banco Mundial (2024)', desc: 'Dados de emprego por sector e região em Moçambique (data.worldbank.org/country/MZ) — usados na estimativa de empregabilidade por província.' },
  { ref: 'INE Moçambique (2020)', desc: 'Inquérito ao Orçamento Familiar (IOF) 2019‑2020 e IV Recenseamento Geral da População e Habitação (2017) — dados demográficos e de emprego por província.' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const C      = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return (
    <View style={[styles.card, Shadow.sm]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export default function AboutScreen({ navigation }: Props) {
  const insets  = useSafeAreaInsets();
  const C       = useColors();
  const styles  = useMemo(() => makeStyles(C), [C]);

  return (
    <View style={styles.root}>
      <LinearGradient colors={C.heroGradient} style={[styles.hero, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={18} color={C.textSecondary} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.heroTitle}>Sobre a Aplicação</Text>
        <Text style={styles.heroSub}>Os modelos científicos por detrás do eiVocação</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + Spacing.xl }]}>

        <Section title="O que é o RIASEC?">
          <Text style={styles.bodyText}>
            O modelo RIASEC, criado por John Holland, descreve 6 tipos de personalidade vocacional —
            Realista, Investigativo, Artístico, Social, Empreendedor e Convencional — organizados num
            hexágono onde tipos vizinhos partilham mais semelhanças entre si. O teu Código Holland
            (ex: <Text style={{ fontWeight: '800' }}>ISA</Text>) combina os 3 tipos mais fortes do teu perfil.
          </Text>
          <View style={styles.hexWrap}><HollandHexagon /></View>
        </Section>

        <Section title="O que é o Big Five?">
          <Text style={styles.bodyText}>
            O Big Five (OCEAN) é o modelo mais usado em psicologia para descrever a personalidade
            através de 5 dimensões. Esta aplicação não pede um segundo questionário — um modelo de
            Machine Learning treinado com 145 mil respondentes infere os teus traços Big Five
            directamente a partir das respostas ao RIASEC.
          </Text>
          <View style={styles.traitList}>
            {BIG5_TRAITS.map(t => (
              <View key={t.letter} style={styles.traitRow}>
                <View style={styles.traitIconWrap}>
                  <SectionIcon family={t.family} name={t.icon} size={18} color={C.primaryLight} />
                </View>
                <View style={styles.traitText}>
                  <Text style={styles.traitName}>{t.name}</Text>
                  <Text style={styles.traitDesc}>{t.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Como a aplicação funciona?">
          <View style={styles.flowList}>
            {FLOW_STEPS.map((step, i) => (
              <React.Fragment key={step.title}>
                <View style={styles.flowStep}>
                  <View style={styles.flowIconWrap}>
                    <SectionIcon family={step.family} name={step.icon} size={20} color={C.accentLight} />
                  </View>
                  <View style={styles.flowText}>
                    <Text style={styles.flowTitle}>{step.title}</Text>
                    <Text style={styles.flowDesc}>{step.desc}</Text>
                  </View>
                </View>
                {i < FLOW_STEPS.length - 1 && (
                  <View style={styles.flowArrow}><Feather name="arrow-down" size={16} color={C.textMuted} /></View>
                )}
              </React.Fragment>
            ))}
          </View>
        </Section>

        <Section title="Fontes e referências">
          {REFERENCES.map(r => (
            <View key={r.ref} style={styles.refRow}>
              <Feather name="book" size={14} color={C.textMuted} style={styles.refIcon} />
              <Text style={styles.refText}>
                <Text style={styles.refCite}>{r.ref}</Text> — {r.desc}
              </Text>
            </View>
          ))}
        </Section>

        <Section title="Sobre este projecto">
          <Text style={styles.bodyText}>
            O eiVocação foi desenvolvido como monografia de licenciatura na Universidade Zambeze
            (UniZambeze), com o objectivo de demonstrar a aplicação de Machine Learning à orientação
            vocacional de estudantes moçambicanos, ligando perfis RIASEC a cursos e universidades reais
            do país e à realidade do mercado de trabalho por província.
          </Text>
        </Section>

        <Text style={styles.footerNote}>
          Previsão orientativa com base numa amostra de 145 mil respondentes. Consulte um psicólogo
          vocacional para uma avaliação completa.
        </Text>

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

  card:         { backgroundColor: C.card, borderRadius: Radius.xl, padding: Spacing.lg, gap: Spacing.md, borderWidth: 1, borderColor: C.border },
  sectionTitle: { fontSize: Typography.lg, fontWeight: '800', color: C.text },
  bodyText:     { fontSize: Typography.sm, color: C.textSecondary, lineHeight: 21 },

  hexWrap: { alignItems: 'center', paddingVertical: Spacing.sm },

  traitList: { gap: Spacing.sm },
  traitRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  traitIconWrap: { width: 32, height: 32, borderRadius: Radius.md, backgroundColor: C.primaryGlow, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  traitText: { flex: 1 },
  traitName: { fontSize: Typography.sm, fontWeight: '700', color: C.text },
  traitDesc: { fontSize: Typography.xs, color: C.textSecondary, lineHeight: 17 },

  flowList: { gap: 4 },
  flowStep: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  flowIconWrap: { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: C.accentGlow, alignItems: 'center', justifyContent: 'center' },
  flowText:  { flex: 1, paddingTop: 2 },
  flowTitle: { fontSize: Typography.sm, fontWeight: '800', color: C.text },
  flowDesc:  { fontSize: Typography.xs, color: C.textSecondary, lineHeight: 17, marginTop: 2 },
  flowArrow: { marginLeft: 19, paddingVertical: 2 },

  refRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  refIcon: { marginTop: 3 },
  refText: { flex: 1, fontSize: Typography.xs, color: C.textSecondary, lineHeight: 18 },
  refCite: { fontWeight: '700', color: C.text },

  footerNote: { textAlign: 'center', fontSize: Typography.xs, color: C.textMuted, lineHeight: 18, paddingHorizontal: Spacing.lg, marginTop: Spacing.sm },
});
