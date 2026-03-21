import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, StatusBar, SafeAreaView, TextInput,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Demographics } from '../types';
import { useAssessmentStore, MOCK_RESULTS } from '../store/useAssessmentStore';
import { Colors, Radius, Shadow, Spacing, Typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Demographics'>;

const GENDER_OPTIONS: { label: string; value: 1 | 2 | 3 }[] = [
  { label: 'Masculino', value: 1 },
  { label: 'Feminino',  value: 2 },
  { label: 'Outro',     value: 3 },
];

const EDU_OPTIONS: { label: string; value: 1 | 2 | 3 | 4 }[] = [
  { label: 'Ensino Básico',     value: 1 },
  { label: 'Ensino Secundário', value: 2 },
  { label: 'Licenciatura',      value: 3 },
  { label: 'Pós-graduação',     value: 4 },
];

export default function DemographicsScreen({ navigation }: Props) {
  const [age, setAge]           = useState('');
  const [gender, setGender]     = useState<1 | 2 | 3 | null>(null);
  const [education, setEdu]     = useState<1 | 2 | 3 | 4 | null>(null);

  const { setDemographics, setResults } = useAssessmentStore();

  const proceed = (skip = false) => {
    if (!skip && gender && education) {
      setDemographics({
        age:       parseInt(age || '17', 10),
        gender:    gender,
        education: education,
      });
    }
    // Use mock results (replace with real API call when backend is available)
    setResults(MOCK_RESULTS);
    navigation.navigate('Loading');
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>Dados Opcionais</Text>
            <Text style={styles.sub}>
              Ajudam a personalizar as sugestões de carreira.
              Podes ignorar se preferires.
            </Text>
          </View>
        </View>

        {/* Age */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Idade</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 17"
            placeholderTextColor={Colors.textMuted}
            keyboardType="number-pad"
            value={age}
            onChangeText={setAge}
            maxLength={3}
          />
        </View>

        {/* Gender */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Género</Text>
          <View style={styles.optionRow}>
            {GENDER_OPTIONS.map((o) => (
              <TouchableOpacity
                key={o.value}
                style={[
                  styles.option,
                  gender === o.value && styles.optionSelected,
                ]}
                onPress={() => setGender(o.value)}
                activeOpacity={0.75}
              >
                <Text style={[
                  styles.optionText,
                  gender === o.value && styles.optionTextSelected,
                ]}>
                  {o.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Nível de Escolaridade</Text>
          <View style={styles.eduGrid}>
            {EDU_OPTIONS.map((o) => (
              <TouchableOpacity
                key={o.value}
                style={[
                  styles.eduOption,
                  education === o.value && styles.optionSelected,
                ]}
                onPress={() => setEdu(o.value)}
                activeOpacity={0.75}
              >
                <Text style={[
                  styles.optionText,
                  education === o.value && styles.optionTextSelected,
                ]}>
                  {o.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notice */}
        <View style={styles.notice}>
          <Text style={styles.noticeIcon}>🔒</Text>
          <Text style={styles.noticeText}>
            Os dados são processados localmente e não são armazenados.
          </Text>
        </View>

        {/* CTAs */}
        <View style={styles.btnGroup}>
          <TouchableOpacity
            style={[styles.btnPrimary, Shadow.primary]}
            onPress={() => proceed(false)}
            activeOpacity={0.88}
          >
            <Text style={styles.btnPrimaryText}>Ver Resultados →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnSkip}
            onPress={() => proceed(true)}
          >
            <Text style={styles.btnSkipText}>Ignorar e continuar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: {
    padding: Spacing.lg,
    gap: Spacing.xl,
    paddingBottom: 48,
  },

  // Header
  header: { gap: Spacing.sm },
  back: {
    fontSize: Typography.xl,
    fontWeight: '700',
    color: Colors.primary,
  },
  headerCenter: { gap: Spacing.xs },
  title: {
    fontSize: Typography['3xl'],
    fontWeight: '800',
    color: Colors.text,
  },
  sub: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  // Sections
  section: { gap: Spacing.sm },
  sectionLabel: {
    fontSize: Typography.base,
    fontWeight: '700',
    color: Colors.text,
  },

  input: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: Typography.lg,
    color: Colors.text,
    fontWeight: '600',
  },

  optionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  optionText: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  optionTextSelected: {
    color: Colors.primary,
  },

  eduGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  eduOption: {
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },

  // Notice
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  noticeIcon: { fontSize: 18 },
  noticeText: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.primary,
    lineHeight: 19,
  },

  // Buttons
  btnGroup: { gap: Spacing.sm, marginTop: Spacing.sm },
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 17,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontSize: Typography.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btnSkip: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnSkipText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
