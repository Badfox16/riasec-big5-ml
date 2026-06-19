// ─── Profile Screen ───────────────────────────────────────────────────────────

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore }       from '../../store/useAuthStore';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import { useThemeStore }      from '../../store/useThemeStore';
import { useColors, ColorsType, Spacing, Radius, Typography, Shadow } from '../../theme';
import { AppStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

function Row({ icon, label, value, onPress, danger, right }: {
  icon: keyof typeof Feather.glyphMap; label: string; value?: string;
  onPress?: () => void; danger?: boolean; right?: React.ReactNode;
}) {
  const Colors = useColors();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={onPress ? 0.7 : 1} disabled={!onPress && !right}>
      <View style={styles.rowIconWrap}>
        <Feather name={icon} size={18} color={danger ? Colors.error : Colors.textSecondary} />
      </View>
      <View style={styles.rowBody}>
        <Text style={[styles.rowLabel, danger && { color: Colors.error }]}>{label}</Text>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      </View>
      {right ?? (onPress && <Feather name="chevron-right" size={18} color={danger ? Colors.error : Colors.textMuted} />)}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const insets  = useSafeAreaInsets();
  const Colors  = useColors();
  const styles  = useMemo(() => makeStyles(Colors), [Colors]);
  const { user, logout } = useAuthStore();
  const { history, reset } = useAssessmentStore();
  const { isDark, toggle } = useThemeStore();
  const navigation = useNavigation<Nav>();

  const handleLogout = () => {
    Alert.alert('Terminar sessão', 'Tens a certeza que queres sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  const handleClearHistory = () => {
    Alert.alert('Limpar histórico', 'Isto irá apagar todos os resultados guardados. Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: () => reset() },
    ]);
  };

  const firstName = user?.name?.split(' ')[0] ?? '';
  const initials  = user?.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() ?? '?';

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        <LinearGradient colors={Colors.heroGradient} style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <View style={styles.avatarWrap}>
            <LinearGradient colors={Colors.primaryGradient} style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </LinearGradient>
            <View style={styles.avatarBadge}>
              <Feather name="star" size={11} color="#FFF" />
            </View>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{history.length}</Text>
              <Text style={styles.statLabel}>Avaliações</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>{history.length > 0 ? history[0].holland_code : '—'}</Text>
              <Text style={styles.statLabel}>Código atual</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>{history.length > 0 ? history[0].careers.length : '—'}</Text>
              <Text style={styles.statLabel}>Carreiras</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          <View style={[styles.card, Shadow.sm]}>
            <Row icon="user"  label="Nome"  value={user?.name} />
            <View style={styles.sep} />
            <Row icon="mail"  label="Email" value={user?.email} />
            <View style={styles.sep} />
            <Row icon="lock"  label="Palavra-passe" value="••••••••" onPress={() => {}} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aparência</Text>
          <View style={[styles.card, Shadow.sm]}>
            <Row
              icon={isDark ? 'moon' : 'sun'}
              label="Tema"
              value={isDark ? 'Escuro' : 'Claro'}
              right={
                <Switch
                  value={isDark}
                  onValueChange={toggle}
                  trackColor={{ false: Colors.border, true: Colors.primaryGlow }}
                  thumbColor={Colors.primary}
                />
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avaliações</Text>
          <View style={[styles.card, Shadow.sm]}>
            <Row icon="clipboard" label="Total de avaliações" value={`${history.length} realizadas`} />
            <View style={styles.sep} />
            <Row icon="trash-2" label="Limpar histórico" onPress={handleClearHistory} danger />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <View style={[styles.card, Shadow.sm]}>
            <Row icon="info"      label="Sobre o eiVocação" value="v1.0.0" onPress={() => navigation.navigate('About')} />
            <View style={styles.sep} />
            <Row icon="shield"    label="Política de privacidade" onPress={() => {}} />
            <View style={styles.sep} />
            <Row icon="file-text" label="Termos de uso" onPress={() => {}} />
          </View>
        </View>

        <View style={[styles.section, { marginTop: Spacing.sm }]}>
          <TouchableOpacity style={[styles.logoutBtn, Shadow.sm]} onPress={handleLogout} activeOpacity={0.8}>
            <Feather name="log-out" size={16} color={Colors.error} />
            <Text style={styles.logoutText}>Terminar sessão</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          eiVocação · Modelo treinado com 145 k respondentes{'\n'}
          Para uso orientativo. Consulte um psicólogo vocacional.
        </Text>

      </ScrollView>
    </View>
  );
}

const makeStyles = (C: ColorsType) => StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },

  header:          { alignItems: 'center', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl, gap: Spacing.sm },
  avatarWrap:      { position: 'relative', marginBottom: 4 },
  avatar:          { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', ...Shadow.primary },
  avatarText:      { fontSize: Typography['2xl'], fontWeight: '800', color: '#FFF' },
  avatarBadge:     { position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  avatarBadgeText: { fontSize: 11, color: '#FFF' },
  name:            { fontSize: Typography.xl, fontWeight: '800', color: C.text },
  email:           { fontSize: Typography.sm, color: C.textSecondary },

  statsRow: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: Radius.lg, paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl, borderWidth: 1,
    borderColor: C.border, marginTop: Spacing.sm,
  },
  stat:      { flex: 1, alignItems: 'center', gap: 2 },
  statNum:   { fontSize: Typography.xl, fontWeight: '800', color: C.text },
  statLabel: { fontSize: Typography.xs, color: C.textMuted },
  statDiv:   { width: 1, height: 32, backgroundColor: C.border },

  section:      { paddingHorizontal: Spacing.lg, marginTop: Spacing.xl, gap: Spacing.sm },
  sectionTitle: { fontSize: Typography.sm, fontWeight: '700', color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },

  card:  { backgroundColor: C.card, borderRadius: Radius.lg, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  sep:   { height: 1, backgroundColor: C.border, marginLeft: 48 + Spacing.md },

  row:        { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.md },
  rowIconWrap:{ width: 28, alignItems: 'center' },
  rowBody:    { flex: 1, gap: 1 },
  rowLabel:   { fontSize: Typography.base, fontWeight: '600', color: C.text },
  rowValue:   { fontSize: Typography.sm, color: C.textSecondary },

  logoutBtn:  { flexDirection: 'row', gap: Spacing.xs, backgroundColor: C.errorBg, borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.error + '30' },
  logoutText: { fontSize: Typography.base, fontWeight: '700', color: C.error },

  footer: { textAlign: 'center', fontSize: Typography.xs, color: C.textMuted, lineHeight: 18, marginTop: Spacing.xl, paddingHorizontal: Spacing.xl },
});
