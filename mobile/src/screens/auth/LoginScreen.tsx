// ─── Login Screen ─────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Animated,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { Colors, Spacing, Radius, Typography, Shadow } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Entrance animations
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
    try {
      await login(email.trim().toLowerCase(), password);
    } catch {
      // error is handled in store
    }
  };

  const isValid = email.includes('@') && password.length >= 6;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Background gradient */}
      <LinearGradient
        colors={['#0D0D1A', '#13102E', '#0D0D1A']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative blobs */}
      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom]} />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Logo / brand */}
          <View style={styles.brand}>
            <LinearGradient
              colors={Colors.primaryGradient}
              style={styles.logoCircle}
            >
              <Text style={styles.logoEmoji}>🎯</Text>
            </LinearGradient>
            <Text style={styles.appName}>eiVocação</Text>
            <Text style={styles.tagline}>Descobre o teu caminho profissional</Text>
          </View>

          {/* Form card */}
          <View style={styles.card}>
            <Text style={styles.title}>Bem-vindo de volta</Text>
            <Text style={styles.subtitle}>Inicia sessão para continuar</Text>

            {/* Email */}
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

            {/* Password */}
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

            {/* Error */}
            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>⚠ {error}</Text>
              </View>
            ) : null}

            {/* CTA */}
            <TouchableOpacity
              style={[styles.ctaBtn, !isValid && styles.ctaBtnDisabled, Shadow.primary]}
              onPress={handleLogin}
              disabled={!isValid || isLoading}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={isValid ? Colors.primaryGradient : ['#2D2D4A', '#2D2D4A']}
                style={styles.ctaGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading
                  ? <ActivityIndicator color="#FFF" />
                  : <Text style={styles.ctaText}>Entrar</Text>
                }
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Demo access */}
            <TouchableOpacity
              style={styles.demoBtn}
              onPress={() => { setEmail('demo@eivocacao.co.mz'); setPassword('demo1234'); }}
              activeOpacity={0.7}
            >
              <Text style={styles.demoBtnText}>Usar conta demo</Text>
            </TouchableOpacity>
          </View>

          {/* Register link */}
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
  },

  // Blobs
  blob: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.15,
  },
  blobTop: {
    backgroundColor: Colors.primary,
    top: -80,
    right: -80,
  },
  blobBottom: {
    backgroundColor: Colors.accent,
    bottom: -100,
    left: -100,
  },

  // Brand
  brand: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    ...Shadow.primary,
  },
  logoEmoji: {
    fontSize: 32,
  },
  appName: {
    fontSize: Typography['2xl'],
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },

  // Card
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
    ...Shadow.md,
  },
  title: {
    fontSize: Typography['2xl'],
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginTop: -Spacing.sm,
  },

  // Fields
  fieldGroup: { gap: Spacing.xs },
  label: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: 2,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 52,
    gap: Spacing.sm,
  },
  inputIcon: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  input: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.text,
    height: '100%',
  },
  eyeBtn: { padding: 4 },
  eyeIcon: { fontSize: 16 },

  // Error
  errorBanner: {
    backgroundColor: Colors.errorBg,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.error + '40',
  },
  errorText: {
    fontSize: Typography.sm,
    color: Colors.error,
    fontWeight: '500',
  },

  // CTA
  ctaBtn: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  ctaBtnDisabled: {
    opacity: 0.5,
  },
  ctaGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: Typography.lg,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 0.3,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
  },

  // Demo
  demoBtn: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderActive,
  },
  demoBtnText: {
    fontSize: Typography.base,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  // Register row
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  registerHint: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  registerLink: {
    fontSize: Typography.base,
    fontWeight: '700',
    color: Colors.primaryLight,
  },
});
