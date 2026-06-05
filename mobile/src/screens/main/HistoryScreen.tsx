// ─── History Screen ───────────────────────────────────────────────────────────

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppStackParamList, AssessmentRecord } from '../../types';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import { useColors, ColorsType, Spacing, Radius, Typography, Shadow } from '../../theme';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const EDUCATION_LABELS = ['', 'Ensino Básico', 'Ensino Médio', 'Licenciatura', 'Pós-graduação'];

function HistoryItem({ item, onPress }: { item: AssessmentRecord; onPress: () => void }) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const color  = Colors.riasec[item.holland_code[0]] ?? Colors.primary;
  const bg     = Colors.riasecBg[item.holland_code[0]] ?? Colors.card;

  return (
    <TouchableOpacity style={[styles.item, Shadow.sm]} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.stripe, { backgroundColor: color }]} />
      <View style={styles.itemInner}>
        <View style={[styles.badge, { backgroundColor: bg }]}>
          <Text style={[styles.badgeCode, { color }]}>{item.holland_code}</Text>
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemDate}>{new Date(item.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
          <Text style={styles.itemCareers} numberOfLines={1}>{item.careers.slice(0, 2).map(c => c.titulo).join(' · ')}</Text>
          {item.demographics && (
            <Text style={styles.itemDemog}>{EDUCATION_LABELS[item.demographics.education]} · {item.demographics.age} anos</Text>
          )}
        </View>
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HistoryScreen() {
  const insets  = useSafeAreaInsets();
  const Colors  = useColors();
  const styles  = useMemo(() => makeStyles(Colors), [Colors]);
  const navigation = useNavigation<Nav>();
  const { history } = useAssessmentStore();

  return (
    <View style={styles.root}>
      <LinearGradient colors={Colors.heroGradient} style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text style={styles.headerTitle}>Histórico</Text>
        <Text style={styles.headerSub}>
          {history.length === 0 ? 'Ainda não fizeste nenhuma avaliação' : `${history.length} avaliação${history.length > 1 ? 'ões' : ''} realizadas`}
        </Text>
      </LinearGradient>

      {history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyTitle}>Sem histórico ainda</Text>
          <Text style={styles.emptySub}>Faz a tua primeira avaliação RIASEC para ver os resultados aqui.</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <HistoryItem item={item} onPress={() => navigation.navigate('HistoryDetail', { record: item })} />
          )}
        />
      )}
    </View>
  );
}

const makeStyles = (C: ColorsType) => StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },

  header:      { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl, gap: 4 },
  headerTitle: { fontSize: Typography['2xl'], fontWeight: '800', color: C.text },
  headerSub:   { fontSize: Typography.sm, color: C.textSecondary },

  list: { padding: Spacing.lg, gap: Spacing.sm },

  item:      { backgroundColor: C.card, borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: C.border },
  stripe:    { height: 3 },
  itemInner: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.md },
  badge:     { width: 56, height: 56, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  badgeCode: { fontSize: Typography.lg, fontWeight: '900' },

  itemInfo:    { flex: 1, gap: 3 },
  itemDate:    { fontSize: Typography.sm, fontWeight: '600', color: C.text },
  itemCareers: { fontSize: Typography.xs, color: C.textSecondary },
  itemDemog:   { fontSize: Typography.xs, color: C.textMuted },
  arrow:       { fontSize: 22, color: C.textMuted },

  empty:      { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.md },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { fontSize: Typography.xl, fontWeight: '800', color: C.text },
  emptySub:   { fontSize: Typography.base, color: C.textSecondary, textAlign: 'center', lineHeight: 22 },
});
