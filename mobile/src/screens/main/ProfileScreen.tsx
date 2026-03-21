// ─── Profile Screen ───────────────────────────────────────────────────────────

import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuthStore }       from '../../store/useAuthStore';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import { Colors, Spacing, Radius, Typography, Shadow } from '../../theme';

function Row({
  icon, label, value, onPress, danger,
}: {
  icon: string; label: string; value?: string;
  onPress?: () => void; danger?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <Text style={styles.rowIcon}>{icon}</Text>
      <View style={styles.rowBody}>
        <Text style={[styles.rowLabel, danger && { color: Colors.error }]}>{label}</Text>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      </View>
      {onPress && <Text style={[styles.rowArrow, danger && { color: Colors.error }]}>›</Text>}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const { history, reset } = useAssessmentStore();

  const handleLogout = () => {
    Alert.alert(
      'Terminar sessão',
      'Tens a certeza que queres sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout },
      ],
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Limpar histórico',
      'Isto irá apagar todos os resultados guardados. Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: () => reset() },
      ],
    );
  };

  const firstName = user?.name?.split(' ')[0] ?? '';
  const initials  = user?.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() ?? '?';

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Header */}
        <LinearGradient
          colors={['#13102E', '#0D0D1A']}
          style={[styles.header, { paddingTop: insets.top + Spacing.md }]}
        >
          <View style={styles.avatarWrap}>
            <LinearGradient colors={Colors.primaryGradient} style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </LinearGradient>
            <View style={styles.avatarBadge}>
              <Text style={styles.avatarBadgeText}>✦</Text>
            </View>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>

          {/* Mini stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{history.length}</Text>
              <Text style={styles.statLabel}>Avaliações</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>
                {history.length > 0 ? history[0].holland_code : '—'}
              </Text>
              <Text style={styles.statLabel}>Código atual</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>
                {history.length > 0
                  ? history[0].careers.length
                  : '—'}
              </Text>
              <Text style={styles.statLabel}>Carreiras</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Account section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          <View style={[styles.card, Shadow.sm]}>
            <Row icon="👤" label="Nome"  value={user?.name} />
            <View style={styles.sep} />
            <Row icon="✉"  label="Email" value={user?.email} />
            <View style={styles.sep} />
            <Row icon="🔒" label="Palavra-passe" value="••••••••" onPress={() => {}} />
          </View>
        </View>

        {/* Assessment section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avaliações</Text>
          <View style={[styles.card, Shadow.sm]}>
            <Row
              icon="📋"
              label="Total de avaliações"
              value={`${history.length} realizadas`}
            />
            <View style={styles.sep} />
            <Row
              icon="🗑"
              label="Limpar histórico"
              onPress={handleClearHistory}
              danger
            />
          </View>
        </View>

        {/* About section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <View style={[styles.card, Shadow.sm]}>
            <Row icon="ℹ"  label="Sobre o eiVocação" value="v1.0.0" onPress={() => {}} />
            <View style={styles.sep} />
            <Row icon="🔐" label="Política de privacidade" onPress={() => {}} />
            <View style={styles.sep} />
            <Row icon="📄" label="Termos de uso"           onPress={() => {}} />
          </View>
        </View>

        {/* Logout */}
        <View style={[styles.section, { marginTop: Spacing.sm }]}>
          <TouchableOpacity
            style={[styles.logoutBtn, Shadow.sm]}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutText}>🚪  Terminar sessão</Text>
          </TouchableOpacity>
        </View>

        {/* Footer note */}
        <Text style={styles.footer}>
          eiVocação · Modelo treinado com 145 k respondentes{'\n'}
          Para uso orientativo. Consulte um psicólogo vocacional.
        </Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  avatarWrap: { position: 'relative', marginBottom: 4 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.primary,
  },
  avatarText: { fontSize: Typography['2xl'], fontWeight: '800', color: '#FFF' },
  avatarBadge: {
    position: 'absolute',
    bottom: 0, right: 0,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarBadgeText: { fontSize: 11, color: '#FFF' },

  name:  { fontSize: Typography.xl, fontWeight: '800', color: Colors.text },
  email: { fontSize: Typography.sm, color: Colors.textSecondary },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.sm,
  },
  stat:     { flex: 1, alignItems: 'center', gap: 2 },
  statNum:  { fontSize: Typography.xl, fontWeight: '800', color: Colors.text },
  statLabel:{ fontSize: Typography.xs, color: Colors.textMuted },
  statDiv:  { width: 1, height: 32, backgroundColor: Colors.border },

  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  sectionTitle: { fontSize: Typography.sm, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },

  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  sep: { height: 1, backgroundColor: Colors.border, marginLeft: 48 + Spacing.md },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  rowIcon:  { fontSize: 20, width: 28, textAlign: 'center' },
  rowBody:  { flex: 1, gap: 1 },
  rowLabel: { fontSize: Typography.base, fontWeight: '600', color: Colors.text },
  rowValue: { fontSize: Typography.sm,   color: Colors.textSecondary },
  rowArrow: { fontSize: 20, color: Colors.textMuted },

  logoutBtn: {
    backgroundColor: Colors.errorBg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error + '30',
  },
  logoutText: { fontSize: Typography.base, fontWeight: '700', color: Colors.error },

  footer: {
    textAlign: 'center',
    fontSize: Typography.xs,
    color: Colors.textMuted,
    lineHeight: 18,
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
});
