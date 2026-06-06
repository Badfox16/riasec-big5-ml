// ─── Demographics Screen ──────────────────────────────────────────────────────

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppStackParamList, Demographics } from '../../types';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import { useColors, ColorsType, Spacing, Radius, Typography, Shadow } from '../../theme';

type Props = NativeStackScreenProps<AppStackParamList, 'Demographics'>;

const GENDERS   = [{ value: 1, label: 'Masculino', emoji: '♂' }, { value: 2, label: 'Feminino', emoji: '♀' }, { value: 3, label: 'Outro', emoji: '⚧' }] as const;
const EDUCATION = [{ value: 1, label: 'Ensino Básico', emoji: '📚' }, { value: 2, label: 'Ensino Médio', emoji: '🏫' }, { value: 3, label: 'Licenciatura', emoji: '🎓' }, { value: 4, label: 'Pós-graduação', emoji: '🔬' }] as const;

export default function DemographicsScreen({ navigation }: Props) {
  const insets  = useSafeAreaInsets();
  const C       = useColors();
  const styles  = useMemo(() => makeStyles(C), [C]);
  const { setDemographics } = useAssessmentStore();

  const [age,       setAge]       = useState('');
  const [gender,    setGender]    = useState<1|2|3|null>(null);
  const [education, setEducation] = useState<1|2|3|4|null>(null);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const proceed = (withData: boolean) => {
    if (withData && gender && education) {
      const ageNum = parseInt(age, 10);
      setDemographics({ age: ageNum >= 13 && ageNum <= 100 ? ageNum : 25, gender, education });
    }
    navigation.replace('Loading');
  };

  const canSubmit = gender !== null && education !== null;

  return (
    <View style={styles.root}>
      <LinearGradient colors={C.heroGradient} style={StyleSheet.absoluteFill} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + Spacing.lg, paddingBottom: insets.bottom + 160 }]}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

          <View style={styles.header}>
            <Text style={styles.badge}>Opcional</Text>
            <Text style={styles.title}>Dados adicionais</Text>
            <Text style={styles.subtitle}>Estas informações melhoram a precisão das sugestões de carreira. Podes saltar se preferires.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Idade</Text>
            <View style={styles.ageInputWrap}>
              <Text style={styles.ageIcon}>🎂</Text>
              <TextInput
                style={styles.ageInput} value={age} onChangeText={v => setAge(v.replace(/\D/g, ''))}
                placeholder="Ex: 20" placeholderTextColor={C.textMuted}
                keyboardType="number-pad" maxLength={3} selectionColor={C.primaryLight}
              />
              <Text style={styles.ageUnit}>anos</Text>
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
                  <Text style={styles.chipEmoji}>{g.emoji}</Text>
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
                  <Text style={styles.eduEmoji}>{e.emoji}</Text>
                  <Text style={[styles.eduLabel, education === e.value && { color: C.accentLight, fontWeight: '700' }]}>{e.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.privacyNote}>
            <Text style={styles.privacyText}>🔒 Os dados são usados apenas para melhorar as sugestões. Não são partilhados.</Text>
          </View>

        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.lg) }]}>
        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled, Shadow.primary]}
          onPress={() => proceed(true)} disabled={!canSubmit} activeOpacity={0.9}
        >
          <LinearGradient
            colors={canSubmit ? C.primaryGradient : [C.surface, C.surface]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitGradient}
          >
            <Text style={styles.submitText}>Continuar →</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipBtn} onPress={() => proceed(false)}>
          <Text style={styles.skipText}>Saltar este passo</Text>
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
  ageIcon:  { fontSize: 20 },
  ageInput: { flex: 1, fontSize: Typography.xl, fontWeight: '700', color: C.text, height: '100%' },
  ageUnit:  { fontSize: Typography.base, color: C.textMuted, fontWeight: '500' },

  chipRow:  { flexDirection: 'row', gap: Spacing.sm },
  chip:     { flex: 1, height: 68, backgroundColor: C.card, borderRadius: Radius.lg, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center', gap: 4, overflow: 'hidden' },
  chipEmoji:{ fontSize: 22 },
  chipLabel:{ fontSize: Typography.xs, fontWeight: '600', color: C.textSecondary },

  eduGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  eduCard:   { width: '47%', height: 80, backgroundColor: C.card, borderRadius: Radius.lg, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center', gap: 4, overflow: 'hidden' },
  eduEmoji:  { fontSize: 24 },
  eduLabel:  { fontSize: Typography.xs, fontWeight: '600', color: C.textSecondary, textAlign: 'center' },

  privacyNote: { backgroundColor: C.infoBg, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: C.info + '30' },
  privacyText: { fontSize: Typography.sm, color: C.textSecondary, lineHeight: 18 },

  footer:           { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.lg, backgroundColor: C.background, borderTopWidth: 1, borderTopColor: C.border, gap: Spacing.sm },
  submitBtn:        { borderRadius: Radius.lg, overflow: 'hidden' },
  submitBtnDisabled:{ opacity: 0.5 },
  submitGradient:   { paddingVertical: 16, alignItems: 'center' },
  submitText:       { fontSize: Typography.lg, fontWeight: '800', color: '#FFF' },
  skipBtn:          { alignItems: 'center', paddingVertical: Spacing.sm },
  skipText:         { fontSize: Typography.base, color: C.textMuted, fontWeight: '500' },
});
