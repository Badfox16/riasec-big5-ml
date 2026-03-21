// ─── History Screen ───────────────────────────────────────────────────────────

import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppStackParamList, AssessmentRecord } from '../../types';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import { Colors, Spacing, Radius, Typography, Shadow } from '../../theme';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const EDUCATION_LABELS = ['', 'Ensino Básico', 'Ensino Médio', 'Licenciatura', 'Pós-graduação'];

function HistoryItem({ item, onPress }: { item: AssessmentRecord; onPress: () => void }) {
  const topLetter = item.holland_code[0];
  const color     = Colors.riasec[topLetter] ?? Colors.primary;
  const bg        = Colors.riasecBg[topLetter] ?? Colors.card;

  return (
    <TouchableOpacity style={[styles.item, Shadow.sm]} onPress={onPress} activeOpacity={0.8}>
      {/* Color accent stripe */}
      <View style={[styles.stripe, { backgroundColor: color }]} />

      <View style={styles.itemInner}>
        {/* Badge */}
        <View style={[styles.badge, { backgroundColor: bg }]}>
          <Text style={[styles.badgeCode, { color }]}>{item.holland_code}</Text>
        </View>

        {/* Info */}
        <View style={styles.itemInfo}>
          <Text style={styles.itemDate}>
            {new Date(item.date).toLocaleDateString('pt-PT', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </Text>
          <Text style={styles.itemCareers} numberOfLines={1}>
            {item.careers.slice(0, 2).map(c => c.titulo).join(' · ')}
          </Text>
          {item.demographics && (
            <Text style={styles.itemDemog}>
              {EDUCATION_LABELS[item.demographics.education]} · {item.demographics.age} anos
            </Text>
          )}
        </View>

        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HistoryScreen() {
  const insets     = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { history } = useAssessmentStore();

  return (
    <View style={styles.root}>
      {/* Header */}
      <LinearGradient
        colors={['#13102E', '#0D0D1A']}
        style={[styles.header, { paddingTop: insets.top + Spacing.md }]}
      >
        <Text style={styles.headerTitle}>Histórico</Text>
        <Text style={styles.headerSub}>
          {history.length === 0
            ? 'Ainda não fizeste nenhuma avaliação'
            : `${history.length} avaliação${history.length > 1 ? 'ões' : ''} realizadas`}
        </Text>
      </LinearGradient>

      {/* List */}
      {history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyTitle}>Sem histórico ainda</Text>
          <Text style={styles.emptySub}>
            Faz a tua primeira avaliação RIASEC para ver os resultados aqui.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <HistoryItem
              item={item}
              onPress={() => navigation.navigate('HistoryDetail', { record: item })}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: 4,
  },
  headerTitle: { fontSize: Typography['2xl'], fontWeight: '800', color: Colors.text },
  headerSub:   { fontSize: Typography.sm,    color: Colors.textSecondary },

  list: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },

  item: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stripe: { height: 3 },
  itemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  badge: {
    width: 56, height: 56, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeCode: { fontSize: Typography.lg, fontWeight: '900' },

  itemInfo:    { flex: 1, gap: 3 },
  itemDate:    { fontSize: Typography.sm, fontWeight: '600', color: Colors.text },
  itemCareers: { fontSize: Typography.xs, color: Colors.textSecondary },
  itemDemog:   { fontSize: Typography.xs, color: Colors.textMuted },
  arrow:       { fontSize: 22, color: Colors.textMuted },

  // Empty state
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { fontSize: Typography.xl, fontWeight: '800', color: Colors.text },
  emptySub:   {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
