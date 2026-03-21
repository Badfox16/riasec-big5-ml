// ─── Demographics Screen ──────────────────────────────────────────────────────
// Optional demographics. Large tap targets, no text fields except age.

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, TextInput, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppStackParamList, Demographics } from '../../types';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import { Colors, Spacing, Radius, Typography, Shadow } from '../../theme';

type Props = NativeStackScreenProps<AppStackParamList, 'Demographics'>;

const GENDERS = [
  { value: 1, label: 'Masculino', emoji: '♂' },
  { value: 2, label: 'Feminino',  emoji: '♀' },
  { value: 3, label: 'Outro',     emoji: '⚧' },
] as const;

const EDUCATION = [
  { value: 1, label: 'Ensino Básico',      emoji: '📚' },
  { value: 2, label: 'Ensino Médio',       emoji: '🏫' },
  { value: 3, label: 'Licenciatura',       emoji: '🎓' },
  { value: 4, label: 'Pós-graduação',      emoji: '🔬' },
] as const;

export default function DemographicsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
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
      setDemographics({
        age:       ageNum >= 13 && ageNum <= 100 ? ageNum : 25,
        gender:    gender,
        education: education,
      });
    }
    navigation.replace('Loading');
  };

  const canSubmit = gender !== null && education !== null;

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#13102E', '#0D0D1A']} style={StyleSheet.absoluteFill} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + Spacing.lg, paddingBottom: insets.bottom + 100 },
        ]}
      >
        <Animated.View
          style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.badge}>Opcional</Text>
            <Text style={styles.title}>Dados adicionais</Text>
            <Text style={styles.subtitle}>
              Estas informações melhoram a precisão das sugestões de carreira. Podes saltar se preferires.
            </Text>
          </View>

          {/* Age */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Idade</Text>
            <View style={styles.ageInputWrap}>
              <Text style={styles.ageIcon}>🎂</Text>
              <TextInput
                style={styles.ageInput}
                value={age}
                onChangeText={v => setAge(v.replace(/\D/g, ''))}
                placeholder="Ex: 20"
                placeholderTextColor={Colors.textMuted}
                keyboardType="number-pad"
                maxLength={3}
                selectionColor={Colors.primaryLight}
              />
              <Text style={styles.ageUnit}>anos</Text>
            </View>
          </View>

          {/* Gender */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Género</Text>
            <View style={styles.chipRow}>
              {GENDERS.map(g => (
                <TouchableOpacity
                  key={g.value}
                  style={[
                    styles.chip,
                    gender === g.value && styles.chipSelected,
                    gender === g.value && { borderColor: Colors.primaryLight },
                  ]}
                  onPress={() => setGender(g.value)}
                  activeOpacity={0.8}
                >
                  {gender === g.value && (
                    <LinearGradient
                      colors={[`${Colors.primary}30`, `${Colors.primary}10`]}
                      style={StyleSheet.absoluteFill}
                    />
                  )}
                  <Text style={styles.chipEmoji}>{g.emoji}</Text>
                  <Text style={[
                    styles.chipLabel,
                    gender === g.value && { color: Colors.primaryLight, fontWeight: '700' },
                  ]}>
                    {g.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Education */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Nível de escolaridade</Text>
            <View style={styles.eduGrid}>
              {EDUCATION.map(e => (
                <TouchableOpacity
                  key={e.value}
                  style={[
                    styles.eduCard,
                    education === e.value && styles.eduCardSelected,
                    education === e.value && { borderColor: Colors.accent },
                  ]}
                  onPress={() => setEducation(e.value)}
                  activeOpacity={0.8}
                >
                  {education === e.value && (
                    <LinearGradient
                      colors={[`${Colors.accent}20`, `${Colors.accent}08`]}
                      style={StyleSheet.absoluteFill}
                    />
                  )}
                  <Text style={styles.eduEmoji}>{e.emoji}</Text>
                  <Text style={[
                    styles.eduLabel,
                    education === e.value && { color: Colors.accentLight, fontWeight: '700' },
                  ]}>
                    {e.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Privacy note */}
          <View style={styles.privacyNote}>
            <Text style={styles.privacyText}>
              🔒 Os dados são usados apenas para melhorar as sugestões. Não são partilhados.
            </Text>
          </View>

        </Animated.View>
      </ScrollView>

      {/* Bottom actions */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.lg) }]}>
        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled, Shadow.primary]}
          onPress={() => proceed(true)}
          disabled={!canSubmit}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={canSubmit ? Colors.primaryGradient : ['#2D2D4A', '#2D2D4A']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.submitGradient}
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

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg },
  content: { gap: Spacing.xl },

  header: { gap: Spacing.sm },
  badge: {
    alignSelf: 'flex-start',
    fontSize: Typography.xs,
    fontWeight: '700',
    color: Colors.accent,
    backgroundColor: Colors.accentGlow,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    borderWidth: 1,
    borderColor: Colors.accent + '40',
  },
  title:    { fontSize: Typography['2xl'], fontWeight: '900', color: Colors.text },
  subtitle: { fontSize: Typography.base, color: Colors.textSecondary, lineHeight: 22 },

  section: { gap: Spacing.sm },
  sectionLabel: {
    fontSize: Typography.sm,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  ageInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 56,
    gap: Spacing.md,
  },
  ageIcon:  { fontSize: 20 },
  ageInput: {
    flex: 1,
    fontSize: Typography.xl,
    fontWeight: '700',
    color: Colors.text,
    height: '100%',
  },
  ageUnit: { fontSize: Typography.base, color: Colors.textMuted, fontWeight: '500' },

  chipRow: { flexDirection: 'row', gap: Spacing.sm },
  chip: {
    flex: 1, height: 68,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    overflow: 'hidden',
  },
  chipSelected: {},
  chipEmoji:   { fontSize: 22 },
  chipLabel: { fontSize: Typography.xs, fontWeight: '600', color: Colors.textSecondary },

  eduGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  eduCard: {
    width: '47%',
    height: 80,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    overflow: 'hidden',
  },
  eduCardSelected: {},
  eduEmoji: { fontSize: 24 },
  eduLabel: { fontSize: Typography.xs, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },

  privacyNote: {
    backgroundColor: Colors.infoBg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.info + '30',
  },
  privacyText: { fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: 18 },

  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: Spacing.lg,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  submitBtn:         { borderRadius: Radius.lg, overflow: 'hidden' },
  submitBtnDisabled: { opacity: 0.5 },
  submitGradient:    { paddingVertical: 16, alignItems: 'center' },
  submitText:        { fontSize: Typography.lg, fontWeight: '800', color: '#FFF' },

  skipBtn:  { alignItems: 'center', paddingVertical: Spacing.sm },
  skipText: { fontSize: Typography.base, color: Colors.textMuted, fontWeight: '500' },
});
