// ─── Demographics Screen ──────────────────────────────────────────────────────

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppStackParamList, Demographics, FaixaEtaria, TipoEscola, ClasseActual, Provincia, PROVINCIAS, IconFamily,
} from '../../types';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import { useColors, ColorsType, Spacing, Radius, Typography, Shadow } from '../../theme';

type Props = NativeStackScreenProps<AppStackParamList, 'Demographics'>;

function DimIcon({ family, name, size, color }: { family: IconFamily; name: string; size: number; color: string }) {
  return family === 'Ionicons'
    ? <Ionicons name={name as any} size={size} color={color} />
    : <Feather name={name as any} size={size} color={color} />;
}

const GENDERS = [
  { value: 1, label: 'Masculino', family: 'Ionicons' as IconFamily, icon: 'male' },
  { value: 2, label: 'Feminino',  family: 'Ionicons' as IconFamily, icon: 'female' },
  { value: 3, label: 'Outro',     family: 'Ionicons' as IconFamily, icon: 'transgender-outline' },
] as const;
const EDUCATION = [
  { value: 1, label: 'Ensino Básico',   family: 'Feather' as IconFamily,  icon: 'book' },
  { value: 2, label: 'Ensino Médio',    family: 'Feather' as IconFamily,  icon: 'book-open' },
  { value: 3, label: 'Licenciatura',    family: 'Ionicons' as IconFamily, icon: 'school-outline' },
  { value: 4, label: 'Pós-graduação',   family: 'Feather' as IconFamily,  icon: 'award' },
] as const;
const TIPOS_ESCOLA: TipoEscola[] = ['Pública', 'Privada', 'Semi-privada'];
const CLASSES: ClasseActual[] = [
  '10ª classe', '11ª classe', '12ª classe',
  'Universitário 1º ano', 'Universitário 2º ano',
  'Já formado', 'Profissional',
];
const FAIXAS: { value: FaixaEtaria; label: string }[] = [
  { value: '15-17', label: '15-17' },
  { value: '18-20', label: '18-20' },
  { value: '21-24', label: '21-24' },
  { value: '25-30', label: '25-30' },
  { value: '30+',   label: 'Mais de 30' },
];

function ChipGroup<T extends string>({ options, value, onChange }: {
  options: T[]; value: T | null; onChange: (v: T) => void;
}) {
  const C      = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return (
    <View style={styles.tagGrid}>
      {options.map(opt => {
        const active = value === opt;
        return (
          <TouchableOpacity
            key={opt}
            style={[styles.tag, active && { borderColor: C.primaryLight }]}
            onPress={() => onChange(opt)} activeOpacity={0.8}
          >
            {active && <LinearGradient colors={[`${C.primary}30`, `${C.primary}10`]} style={StyleSheet.absoluteFill} />}
            <Text style={[styles.tagLabel, active && { color: C.primaryLight, fontWeight: '700' }]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function DemographicsScreen({ navigation }: Props) {
  const insets  = useSafeAreaInsets();
  const C       = useColors();
  const styles  = useMemo(() => makeStyles(C), [C]);
  const { setDemographics } = useAssessmentStore();

  const [provincia,    setProvincia]    = useState<Provincia | null>(null);
  const [cidade,       setCidade]       = useState('');
  const [tipoEscola,   setTipoEscola]   = useState<TipoEscola | null>(null);
  const [classeActual, setClasseActual] = useState<ClasseActual | null>(null);
  const [gender,       setGender]       = useState<1|2|3|null>(null);
  const [education,    setEducation]    = useState<1|2|3|4|null>(null);
  const [faixaEtaria,  setFaixaEtaria]  = useState<FaixaEtaria | null>(null);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const canSubmit = !!(
    provincia && cidade.trim() && tipoEscola && classeActual &&
    gender && education && faixaEtaria
  );

  const proceed = () => {
    if (!canSubmit) return;
    const data: Demographics = {
      provincia, cidade: cidade.trim(), tipo_escola: tipoEscola!,
      classe_actual: classeActual!, gender: gender!, education: education!,
      faixa_etaria: faixaEtaria!,
    } as Demographics;
    setDemographics(data);
    navigation.replace('Loading');
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={C.heroGradient} style={StyleSheet.absoluteFill} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + Spacing.lg, paddingBottom: insets.bottom + 160 }]}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

          <View style={styles.header}>
            <Text style={styles.badge}>Obrigatório</Text>
            <Text style={styles.title}>Dados adicionais</Text>
            <Text style={styles.subtitle}>Estes dados permitem indicar a empregabilidade dos cursos na tua província e melhorar a precisão das sugestões. São necessários para continuar.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Província de residência</Text>
            <ChipGroup options={[...PROVINCIAS]} value={provincia} onChange={setProvincia} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Cidade</Text>
            <View style={styles.ageInputWrap}>
              <Feather name="map-pin" size={18} color={C.textMuted} />
              <TextInput
                style={styles.cidadeInput} value={cidade} onChangeText={setCidade}
                placeholder="Ex: Beira" placeholderTextColor={C.textMuted}
                selectionColor={C.primaryLight}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Tipo de escola</Text>
            <ChipGroup options={TIPOS_ESCOLA} value={tipoEscola} onChange={setTipoEscola} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Classe actual / último ano concluído</Text>
            <ChipGroup options={CLASSES} value={classeActual} onChange={setClasseActual} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Faixa etária</Text>
            <View style={styles.chipRow}>
              {FAIXAS.map(f => (
                <TouchableOpacity
                  key={f.value}
                  style={[styles.chip, faixaEtaria === f.value && { borderColor: C.primaryLight }]}
                  onPress={() => setFaixaEtaria(f.value)} activeOpacity={0.8}
                >
                  {faixaEtaria === f.value && (
                    <LinearGradient colors={[`${C.primary}30`, `${C.primary}10`]} style={StyleSheet.absoluteFill} />
                  )}
                  <Text style={[styles.chipLabel, faixaEtaria === f.value && { color: C.primaryLight, fontWeight: '700' }]}>{f.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Género</Text>
            <View style={styles.chipRow}>
              {GENDERS.map(g => (
                <TouchableOpacity
                  key={g.value}
                  style={[styles.chip, gender === g.value && { borderColor: C.primaryLight }]}
                  onPress={() => setGender(g.value)} activeOpacity={0.8}
                >
                  {gender === g.value && (
                    <LinearGradient colors={[`${C.primary}30`, `${C.primary}10`]} style={StyleSheet.absoluteFill} />
                  )}
                  <DimIcon family={g.family} name={g.icon} size={22} color={gender === g.value ? C.primaryLight : C.textSecondary} />
                  <Text style={[styles.chipLabel, gender === g.value && { color: C.primaryLight, fontWeight: '700' }]}>{g.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Nível de escolaridade</Text>
            <View style={styles.eduGrid}>
              {EDUCATION.map(e => (
                <TouchableOpacity
                  key={e.value}
                  style={[styles.eduCard, education === e.value && { borderColor: C.accent }]}
                  onPress={() => setEducation(e.value)} activeOpacity={0.8}
                >
                  {education === e.value && (
                    <LinearGradient colors={[`${C.accent}20`, `${C.accent}08`]} style={StyleSheet.absoluteFill} />
                  )}
                  <DimIcon family={e.family} name={e.icon} size={24} color={education === e.value ? C.accentLight : C.textSecondary} />
                  <Text style={[styles.eduLabel, education === e.value && { color: C.accentLight, fontWeight: '700' }]}>{e.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.privacyNote}>
            <Feather name="lock" size={14} color={C.textSecondary} />
            <Text style={styles.privacyText}>Os dados são usados apenas para melhorar as sugestões e para fins de investigação académica. Não são partilhados.</Text>
          </View>

        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.lg) }]}>
        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled, Shadow.primary]}
          onPress={proceed} disabled={!canSubmit} activeOpacity={0.9}
        >
          <LinearGradient
            colors={canSubmit ? C.primaryGradient : [C.surface, C.surface]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitGradient}
          >
            <Text style={styles.submitText}>Continuar →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const makeStyles = (C: ColorsType) => StyleSheet.create({
  root:    { flex: 1, backgroundColor: C.background },
  scroll:  { paddingHorizontal: Spacing.lg },
  content: { gap: Spacing.xl },

  header:   { gap: Spacing.sm },
  badge:    { alignSelf: 'flex-start', fontSize: Typography.xs, fontWeight: '700', color: C.accent, backgroundColor: C.accentGlow, paddingHorizontal: 10, paddingVertical: 3, borderRadius: Radius.full, textTransform: 'uppercase', letterSpacing: 0.8, borderWidth: 1, borderColor: C.accent + '40' },
  title:    { fontSize: Typography['2xl'], fontWeight: '900', color: C.text },
  subtitle: { fontSize: Typography.base, color: C.textSecondary, lineHeight: 22 },

  section:      { gap: Spacing.sm },
  sectionLabel: { fontSize: Typography.sm, fontWeight: '700', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: 0.6 },

  ageInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: Radius.lg, borderWidth: 1, borderColor: C.border, paddingHorizontal: Spacing.md, height: 56, gap: Spacing.md },
  cidadeInput: { flex: 1, fontSize: Typography.lg, fontWeight: '700', color: C.text, height: '100%' },

  chipRow:  { flexDirection: 'row', gap: Spacing.sm },
  chip:     { flex: 1, height: 68, backgroundColor: C.card, borderRadius: Radius.lg, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center', gap: 4, overflow: 'hidden' },
  chipLabel:{ fontSize: Typography.xs, fontWeight: '600', color: C.textSecondary },

  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  tag:     { paddingHorizontal: Spacing.md, paddingVertical: 12, backgroundColor: C.card, borderRadius: Radius.full, borderWidth: 1.5, borderColor: C.border, overflow: 'hidden' },
  tagLabel:{ fontSize: Typography.sm, fontWeight: '600', color: C.textSecondary },

  eduGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  eduCard:   { width: '47%', height: 80, backgroundColor: C.card, borderRadius: Radius.lg, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center', gap: 4, overflow: 'hidden' },
  eduLabel:  { fontSize: Typography.xs, fontWeight: '600', color: C.textSecondary, textAlign: 'center' },

  privacyNote: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, backgroundColor: C.infoBg, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: C.info + '30' },
  privacyText: { flex: 1, fontSize: Typography.sm, color: C.textSecondary, lineHeight: 18 },

  footer:           { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.lg, backgroundColor: C.background, borderTopWidth: 1, borderTopColor: C.border, gap: Spacing.sm },
  submitBtn:        { borderRadius: Radius.lg, overflow: 'hidden' },
  submitBtnDisabled:{ opacity: 0.5 },
  submitGradient:   { paddingVertical: 16, alignItems: 'center' },
  submitText:       { fontSize: Typography.lg, fontWeight: '800', color: '#FFF' },
});
