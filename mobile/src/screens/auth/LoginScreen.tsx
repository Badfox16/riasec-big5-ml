// ─── Login Screen ─────────────────────────────────────────────────────────────

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

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const insets  = useSafeAreaInsets();
  const Colors  = useColors();
  const styles  = useMemo(() => makeStyles(Colors), [Colors]);
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    clearError();
    try { await login(email.trim().toLowerCase(), password); } catch {}
  };

  const isValid = email.includes('@') && password.length >= 6;

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient colors={Colors.authGradient} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />
      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom]} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          <View style={styles.brand}>
            <LinearGradient colors={Colors.primaryGradient} style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🎯</Text>
            </LinearGradient>
            <Text style={styles.appName}>eiVocação</Text>
            <Text style={styles.tagline}>Descobre o teu caminho profissional</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Bem-vindo de volta</Text>
            <Text style={styles.subtitle}>Inicia sessão para continuar</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.inputIcon}>✉</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="o.teu@email.com"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  selectionColor={Colors.primaryLight}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Palavra-passe</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={!showPass}
                  autoCapitalize="none"
                  selectionColor={Colors.primaryLight}
                />
                <TouchableOpacity onPress={() => setShowPass(v => !v)} style={styles.eyeBtn}>
                  <Text style={styles.eyeIcon}>{showPass ? '👁' : '🙈'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>⚠ {error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.ctaBtn, !isValid && styles.ctaBtnDisabled, Shadow.primary]}
              onPress={handleLogin}
              disabled={!isValid || isLoading}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={isValid ? Colors.primaryGradient : [Colors.surface, Colors.surface]}
                style={styles.ctaGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.ctaText}>Entrar</Text>}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.demoBtn}
              onPress={() => { setEmail('demo@eivocacao.co.mz'); setPassword('demo1234'); }}
              activeOpacity={0.7}
            >
              <Text style={styles.demoBtnText}>Usar conta demo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.registerRow}>
            <Text style={styles.registerHint}>Ainda não tens conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Criar conta</Text>
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

  blob: { position: 'absolute', width: 300, height: 300, borderRadius: 150, opacity: 0.15 },
  blobTop:    { backgroundColor: C.primary, top: -80, right: -80 },
  blobBottom: { backgroundColor: C.accent,  bottom: -100, left: -100 },

  brand: { alignItems: 'center', marginBottom: Spacing.xl, gap: Spacing.sm },
  logoCircle: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4, ...Shadow.primary,
  },
  logoEmoji: { fontSize: 32 },
  appName:   { fontSize: Typography['2xl'], fontWeight: '800', color: C.text, letterSpacing: -0.5 },
  tagline:   { fontSize: Typography.sm, color: C.textSecondary },

  card: {
    backgroundColor: C.card, borderRadius: Radius.xl,
    padding: Spacing.xl, borderWidth: 1, borderColor: C.border, gap: Spacing.md, ...Shadow.md,
  },
  title:    { fontSize: Typography['2xl'], fontWeight: '800', color: C.text },
  subtitle: { fontSize: Typography.base, color: C.textSecondary, marginTop: -Spacing.sm },

  fieldGroup: { gap: Spacing.xs },
  label:      { fontSize: Typography.sm, fontWeight: '600', color: C.textSecondary, marginLeft: 2 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.surface, borderRadius: Radius.md,
    borderWidth: 1, borderColor: C.border,
    paddingHorizontal: Spacing.md, height: 52, gap: Spacing.sm,
  },
  inputIcon: { fontSize: 16, color: C.textMuted },
  input:     { flex: 1, fontSize: Typography.base, color: C.text, height: '100%' },
  eyeBtn:    { padding: 4 },
  eyeIcon:   { fontSize: 16 },

  errorBanner: {
    backgroundColor: C.errorBg, borderRadius: Radius.sm,
    padding: Spacing.sm, borderWidth: 1, borderColor: C.error + '40',
  },
  errorText: { fontSize: Typography.sm, color: C.error, fontWeight: '500' },

  ctaBtn:         { borderRadius: Radius.lg, overflow: 'hidden', marginTop: Spacing.xs },
  ctaBtnDisabled: { opacity: 0.5 },
  ctaGradient:    { paddingVertical: 16, alignItems: 'center' },
  ctaText:        { fontSize: Typography.lg, fontWeight: '700', color: '#FFF', letterSpacing: 0.3 },

  divider:     { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { fontSize: Typography.sm, color: C.textMuted },

  demoBtn: {
    paddingVertical: Spacing.md, alignItems: 'center',
    borderRadius: Radius.lg, borderWidth: 1, borderColor: C.borderActive,
  },
  demoBtnText: { fontSize: Typography.base, fontWeight: '600', color: C.textSecondary },

  registerRow:  { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
  registerHint: { fontSize: Typography.base, color: C.textSecondary },
  registerLink: { fontSize: Typography.base, fontWeight: '700', color: C.primaryLight },
});
