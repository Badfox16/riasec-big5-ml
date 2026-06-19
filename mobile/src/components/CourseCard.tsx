import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useColors, ColorsType, Radius, Shadow, Spacing, Typography } from '../theme';
import { AppStackParamList, CourseRecommendation } from '../types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

interface Props {
  course: CourseRecommendation;
  index: number;
  accentColor?: string;
  provincia?: string | null;
}

const EMPREGABILIDADE_LABEL: Record<string, string> = {
  Alto: 'Alta', Médio: 'Média', Baixo: 'Baixa',
};

function employabilityColors(C: ColorsType, nivel: string) {
  if (nivel === 'Alto')  return { fg: C.success, bg: C.successBg };
  if (nivel === 'Médio') return { fg: C.warning, bg: C.warningBg };
  if (nivel === 'Baixo') return { fg: C.error,   bg: C.errorBg };
  return { fg: C.textMuted, bg: C.surface };
}

export default function CourseCard({ course, index, accentColor, provincia }: Props) {
  const C       = useColors();
  const styles  = useMemo(() => makeStyles(C), [C]);
  const accent  = accentColor ?? C.primary;
  const navigation = useNavigation<Nav>();
  const [modalVisible, setModalVisible] = useState(false);

  const nivel = course.empregabilidade_provincia;
  const hasNivel = nivel === 'Alto' || nivel === 'Médio' || nivel === 'Baixo';
  const { fg, bg } = employabilityColors(C, nivel);

  return (
    <View style={[styles.card, Shadow.sm, { borderLeftColor: accent }]}>
      <View style={[styles.badge, { backgroundColor: accent + '18' }]}>
        <Ionicons name="school-outline" size={22} color={accent} />
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: accent }]}>{course.titulo}</Text>
          {hasNivel && (
            <TouchableOpacity
              style={[styles.empBadge, { backgroundColor: bg }]}
              onPress={() => setModalVisible(true)} activeOpacity={0.7}
            >
              <Text style={[styles.empBadgeText, { color: fg }]}>{EMPREGABILIDADE_LABEL[nivel]}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.institutionBadge, { backgroundColor: accent + '12' }]}>
          <Text style={[styles.institution, { color: accent }]}>{course.instituicao}</Text>
        </View>
        <Text style={styles.desc}>{course.descricao}</Text>

        {course.universidades.length > 0 && (
          <View style={styles.uniRow}>
            {course.universidades.map(codigo => (
              <TouchableOpacity
                key={codigo}
                style={styles.uniChip}
                onPress={() => navigation.navigate('UniversityDetail', { codigo, area: course.area, cursoTitulo: course.titulo })}
                activeOpacity={0.7}
              >
                <Text style={styles.uniChipText}>{codigo}</Text>
                <Feather name="chevron-right" size={12} color={C.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={[styles.modalPill, { backgroundColor: bg }]}>
              <Text style={[styles.modalPillText, { color: fg }]}>Empregabilidade {EMPREGABILIDADE_LABEL[nivel] ?? ''}</Text>
            </View>
            <Text style={styles.modalTitle}>{course.titulo}</Text>
            <Text style={styles.modalText}>
              Empregabilidade estimada para esta área {provincia ? `na província de ${provincia}` : 'na tua província'}, com base em dados do INE e do Banco Mundial (2024).
            </Text>
            <TouchableOpacity style={[styles.modalCloseBtn, { backgroundColor: accent }]} onPress={() => setModalVisible(false)} activeOpacity={0.85}>
              <Text style={styles.modalCloseText}>Entendi</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const makeStyles = (C: ColorsType) => StyleSheet.create({
  card: {
    flexDirection: 'row', backgroundColor: C.card,
    borderRadius: Radius.lg, padding: Spacing.md,
    marginBottom: Spacing.sm, alignItems: 'flex-start',
    gap: Spacing.md, borderLeftWidth: 3, borderLeftColor: C.primary,
  },
  badge: {
    width: 44, height: 44, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  content:          { flex: 1, gap: 4 },
  titleRow:         { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  title:            { flex: 1, fontSize: Typography.base, fontWeight: '700' },
  empBadge:         { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  empBadgeText:     { fontSize: Typography.xs, fontWeight: '800' },
  institutionBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.sm },
  institution:      { fontSize: Typography.xs, fontWeight: '600' },
  desc:             { fontSize: Typography.sm, color: C.textSecondary, lineHeight: 19 },

  uniRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  uniChip:     { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: C.surface, borderRadius: Radius.full, borderWidth: 1, borderColor: C.border, paddingHorizontal: 10, paddingVertical: 4 },
  uniChipText: { fontSize: Typography.xs, fontWeight: '700', color: C.text },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  modalCard:     { width: '100%', backgroundColor: C.card, borderRadius: Radius.xl, padding: Spacing.lg, gap: Spacing.sm, borderWidth: 1, borderColor: C.border },
  modalPill:     { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  modalPillText: { fontSize: Typography.xs, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.6 },
  modalTitle:    { fontSize: Typography.lg, fontWeight: '800', color: C.text },
  modalText:     { fontSize: Typography.sm, color: C.textSecondary, lineHeight: 20 },
  modalCloseBtn: { borderRadius: Radius.lg, paddingVertical: 12, alignItems: 'center', marginTop: Spacing.xs },
  modalCloseText:{ fontSize: Typography.base, fontWeight: '700', color: '#FFF' },
});
