// ─── Register Screen ──────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Animated, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { useColors, ColorsType, Spacing, Radius, Typography, Shadow } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const insets  = useSafeAreaInsets();
  const Colors  = useColors();
  const styles  = useMemo(() => makeStyles(Colors), [Colors]);
  const { register, isLoading, error, clearError } = useAuthStore();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleRegister = async () => {
    clearError();
    try { await register(name.trim(), email.trim().toLowerCase(), password); } catch {}
  };

  const isValid = name.trim().length >= 2 && email.includes('@') && password.length >= 6;

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ['transparent', Colors.error, Colors.warning, Colors.success];
  const strengthLabels = ['', 'Fraca', 'Razoável', 'Forte'];

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient colors={Colors.authGradient} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />
      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom]} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + Spacing.lg, paddingBottom: insets.bottom + Spacing.xl }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <LinearGradient colors={Colors.accentGradient} style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>✨</Text>
            </LinearGradient>
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>Começa a tua jornada vocacional</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nome completo</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput
                  style={styles.input} value={name} onChangeText={setName}
                  placeholder="O teu nome" placeholderTextColor={Colors.textMuted}
                  autoCapitalize="words" selectionColor={Colors.accentLight}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.inputIcon}>✉</Text>
                <TextInput
                  style={styles.input} value={email} onChangeText={setEmail}
                  placeholder="o.teu@email.com" placeholderTextColor={Colors.textMuted}
                  keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
                  selectionColor={Colors.accentLight}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Palavra-passe</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input} value={password} onChangeText={setPassword}
                  placeholder="mínimo 6 caracteres" placeholderTextColor={Colors.textMuted}
                  secureTextEntry={!showPass} autoCapitalize="none"
                  selectionColor={Colors.accentLight}
                />
                <TouchableOpacity onPress={() => setShowPass(v => !v)} style={styles.eyeBtn}>
                  <Text style={styles.eyeIcon}>{showPass ? '👁' : '🙈'}</Text>
                </TouchableOpacity>
              </View>
              {password.length > 0 && (
                <View style={styles.strengthRow}>
                  {[1, 2, 3].map(i => (
                    <View key={i} style={[styles.strengthSegment, { backgroundColor: i <= strength ? strengthColors[strength] : Colors.surface }]} />
                  ))}
                  <Text style={[styles.strengthLabel, { color: strengthColors[strength] }]}>{strengthLabels[strength]}</Text>
                </View>
              )}
            </View>

            {error ? (
              <View style={styles.errorBanner}><Text style={styles.errorText}>⚠ {error}</Text></View>
            ) : null}

            <Text style={styles.termsNote}>
              Ao criares conta, concordas com os nossos{' '}
              <Text style={styles.termsLink}>Termos de Uso</Text> e{' '}
              <Text style={styles.termsLink}>Política de Privacidade</Text>.
            </Text>

            <TouchableOpacity
              style={[styles.ctaBtn, !isValid && styles.ctaBtnDisabled, Shadow.accent]}
              onPress={handleRegister} disabled={!isValid || isLoading} activeOpacity={0.88}
            >
              <LinearGradient
                colors={isValid ? Colors.accentGradient : [Colors.surface, Colors.surface]}
                style={styles.ctaGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.ctaText}>Criar conta</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.loginRow}>
            <Text style={styles.loginHint}>Já tens conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Iniciar sessão</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (C: ColorsType) => StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.background },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg },

  blob:       { position: 'absolute', width: 280, height: 280, borderRadius: 140, opacity: 0.12 },
  blobTop:    { backgroundColor: C.accent,  top: -60,    left: -80 },
  blobBottom: { backgroundColor: C.primary, bottom: -80, right: -80 },

  backBtn:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.lg },
  backIcon: { fontSize: 20, color: C.textSecondary },
  backText: { fontSize: Typography.base, color: C.textSecondary, fontWeight: '500' },

  header:    { alignItems: 'center', marginBottom: Spacing.xl, gap: Spacing.sm },
  logoCircle: {
    width: 64, height: 64, borderRadius: 32,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4, ...Shadow.accent,
  },
  logoEmoji: { fontSize: 28 },
  title:     { fontSize: Typography['2xl'], fontWeight: '800', color: C.text },
  subtitle:  { fontSize: Typography.base, color: C.textSecondary },

  card: {
    backgroundColor: C.card, borderRadius: Radius.xl,
    padding: Spacing.xl, borderWidth: 1, borderColor: C.border, gap: Spacing.md, ...Shadow.md,
  },
  fieldGroup: { gap: Spacing.xs },
  label:      { fontSize: Typography.sm, fontWeight: '600', color: C.textSecondary, marginLeft: 2 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface,
    borderRadius: Radius.md, borderWidth: 1, borderColor: C.border,
    paddingHorizontal: Spacing.md, height: 52, gap: Spacing.sm,
  },
  inputIcon: { fontSize: 16, color: C.textMuted },
  input:     { flex: 1, fontSize: Typography.base, color: C.text, height: '100%' },
  eyeBtn:    { padding: 4 },
  eyeIcon:   { fontSize: 16 },

  strengthRow:    { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: 6 },
  strengthSegment:{ flex: 1, height: 3, borderRadius: 2 },
  strengthLabel:  { fontSize: Typography.xs, fontWeight: '600', width: 52, textAlign: 'right' },

  errorBanner: {
    backgroundColor: C.errorBg, borderRadius: Radius.sm,
    padding: Spacing.sm, borderWidth: 1, borderColor: C.error + '40',
  },
  errorText: { fontSize: Typography.sm, color: C.error, fontWeight: '500' },

  termsNote: { fontSize: Typography.xs, color: C.textMuted, lineHeight: 18, textAlign: 'center' },
  termsLink: { color: C.accentLight, fontWeight: '600' },

  ctaBtn:         { borderRadius: Radius.lg, overflow: 'hidden' },
  ctaBtnDisabled: { opacity: 0.5 },
  ctaGradient:    { paddingVertical: 16, alignItems: 'center' },
  ctaText:        { fontSize: Typography.lg, fontWeight: '700', color: '#FFF' },

  loginRow:  { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
  loginHint: { fontSize: Typography.base, color: C.textSecondary },
  loginLink: { fontSize: Typography.base, fontWeight: '700', color: C.primaryLight },
});
