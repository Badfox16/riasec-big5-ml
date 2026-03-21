// ─── Loading Screen ───────────────────────────────────────────────────────────
// Makes the real POST /predict call. Shows animated steps while waiting.

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppStackParamList } from '../../types';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import { predict } from '../../services/api';
import { Colors, Spacing, Radius, Typography } from '../../theme';

type Props = NativeStackScreenProps<AppStackParamList, 'Loading'>;

const STEPS = [
  { emoji: '📊', text: 'A analisar as tuas respostas…' },
  { emoji: '🧠', text: 'A calcular o perfil RIASEC…' },
  { emoji: '🔮', text: 'A prever traços de personalidade…' },
  { emoji: '🎯', text: 'A identificar carreiras compatíveis…' },
];

export default function LoadingScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { answers, demographics, setResults, saveToHistory } = useAssessmentStore();

  const [stepIndex, setStepIndex]   = useState(0);
  const [errorMsg,  setErrorMsg]    = useState<string | null>(null);
  const [isDone,    setIsDone]      = useState(false);

  // Animations
  const spinAnim    = useRef(new Animated.Value(0)).current;
  const pulseAnim   = useRef(new Animated.Value(1)).current;
  const stepFade    = useRef(new Animated.Value(1)).current;
  const progressAnim= useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  // Spin animation
  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
    );
    spin.start();
    return () => spin.stop();
  }, []);

  // Pulse animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 700, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Step cycling
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(stepFade, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setStepIndex(i => Math.min(i + 1, STEPS.length - 1));
        Animated.timing(stepFade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    }, 900);
    return () => clearInterval(interval);
  }, []);

  // API call
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        // Animate progress bar to 80% while waiting
        Animated.timing(progressAnim, { toValue: 0.8, duration: 2000, useNativeDriver: false }).start();

        const result = await predict(answers, demographics);

        if (cancelled) return;

        // Fill to 100%
        Animated.timing(progressAnim, { toValue: 1, duration: 400, useNativeDriver: false }).start();

        setResults(result);
        saveToHistory();
        setIsDone(true);

        // Success animation before navigating
        Animated.spring(successAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }).start();
        setTimeout(() => {
          if (!cancelled) navigation.replace('Results');
        }, 700);
      } catch (err: any) {
        if (cancelled) return;
        setErrorMsg(err.message ?? 'Erro ao processar. Verifica a tua ligação.');
        Animated.timing(progressAnim, { toValue: 0, duration: 300, useNativeDriver: false }).start();
      }
    };

    run();
    return () => { cancelled = true; };
  }, []);

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#13102E', '#0D0D1A']}
        style={StyleSheet.absoluteFill}
      />
      {/* Background glow */}
      <Animated.View
        style={[styles.glow, { transform: [{ scale: pulseAnim }] }]}
      />

      <View style={[styles.center, { paddingTop: insets.top }]}>

        {isDone ? (
          // Success state
          <Animated.View
            style={[
              styles.successCircle,
              {
                transform: [
                  {
                    scale: successAnim.interpolate({
                      inputRange: [0, 1], outputRange: [0.5, 1],
                    }),
                  },
                ],
                opacity: successAnim,
              },
            ]}
          >
            <LinearGradient colors={Colors.accentGradient} style={styles.successGradient}>
              <Text style={styles.successEmoji}>✓</Text>
            </LinearGradient>
          </Animated.View>
        ) : (
          // Spinner
          <Animated.View style={{ transform: [{ rotate: spinInterpolate }] }}>
            <LinearGradient
              colors={Colors.primaryGradient}
              style={styles.spinner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.spinnerInner} />
            </LinearGradient>
          </Animated.View>
        )}

        {/* Logo */}
        <Animated.Text style={[styles.logo, { transform: [{ scale: pulseAnim }] }]}>
          🎯
        </Animated.Text>

        <Text style={styles.title}>
          {isDone ? 'Perfil calculado!' : 'A processar…'}
        </Text>

        {/* Step text */}
        {!isDone && !errorMsg && (
          <Animated.Text style={[styles.stepText, { opacity: stepFade }]}>
            {STEPS[stepIndex].emoji}  {STEPS[stepIndex].text}
          </Animated.Text>
        )}

        {/* Error */}
        {errorMsg && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>⚠  Algo correu mal</Text>
            <Text style={styles.errorMsg}>{errorMsg}</Text>
            <Text style={styles.errorHint}>
              Verifica se o servidor está disponível em{'\n'}localhost:8000
            </Text>
          </View>
        )}

        {/* Progress bar */}
        {!errorMsg && (
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1], outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        )}

        {/* Steps indicator */}
        {!isDone && !errorMsg && (
          <View style={styles.stepsRow}>
            {STEPS.map((s, i) => (
              <View
                key={i}
                style={[
                  styles.stepDot,
                  { backgroundColor: i <= stepIndex ? Colors.primaryLight : Colors.surface },
                ]}
              />
            ))}
          </View>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  glow: {
    position: 'absolute',
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: Colors.primary,
    opacity: 0.08,
    top: '50%',
    alignSelf: 'center',
    marginTop: -150,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },

  spinner: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center',
  },
  spinnerInner: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: Colors.background,
  },

  successCircle: { width: 80, height: 80, borderRadius: 40, overflow: 'hidden' },
  successGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  successEmoji:   { fontSize: 36, color: '#FFF', fontWeight: '900' },

  logo: { fontSize: 48 },

  title: {
    fontSize: Typography['2xl'],
    fontWeight: '900',
    color: Colors.text,
    textAlign: 'center',
  },
  stepText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  errorBox: {
    backgroundColor: Colors.errorBg,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.error + '40',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  errorTitle: { fontSize: Typography.lg, fontWeight: '800', color: Colors.error },
  errorMsg:   { fontSize: Typography.base, color: Colors.error, textAlign: 'center' },
  errorHint:  { fontSize: Typography.sm, color: Colors.textMuted, textAlign: 'center', lineHeight: 18 },

  progressTrack: {
    width: '70%',
    height: 4,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
  },

  stepsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.xs,
  },
  stepDot: {
    width: 8, height: 8, borderRadius: 4,
  },
});
