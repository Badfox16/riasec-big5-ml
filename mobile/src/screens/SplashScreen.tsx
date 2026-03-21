import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Dimensions, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Colors, Radius, Shadow, Spacing, Typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const { height } = Dimensions.get('window');

export default function SplashScreen({ navigation }: Props) {
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const slideAnim  = useRef(new Animated.Value(40)).current;
  const btnAnim    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
      Animated.delay(200),
      Animated.timing(btnAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={['#3730A3', '#5B4FE8', '#7C3AED']} style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Decorative circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Logo mark */}
        <View style={styles.logoWrap}>
          <Text style={styles.logoIcon}>🎯</Text>
        </View>

        <Text style={styles.brand}>eiVocação</Text>
        <Text style={styles.headline}>Descobre o Teu{'\n'}Caminho Profissional</Text>
        <Text style={styles.sub}>
          Orientação vocacional baseada no modelo Holland RIASEC
          e inteligência artificial — 145 mil respondentes.
        </Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { value: '30',    label: 'Perguntas' },
            { value: '6',     label: 'Dimensões' },
            { value: '~5min', label: 'Duração' },
          ].map((s) => (
            <View key={s.label} style={styles.stat}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* CTA Button */}
      <Animated.View style={[styles.btnWrap, { opacity: btnAnim }]}>
        <TouchableOpacity
          style={[styles.btn, Shadow.primary]}
          onPress={() => navigation.navigate('Onboarding')}
          activeOpacity={0.88}
        >
          <Text style={styles.btnText}>Começar Avaliação</Text>
          <Text style={styles.btnArrow}>→</Text>
        </TouchableOpacity>
        <Text style={styles.disclaimer}>
          Gratuito · Confidencial · Sem registo
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
    paddingBottom: 48,
    paddingTop: 60,
  },

  // Decorative
  circle1: {
    position: 'absolute', top: -80, right: -80,
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  circle2: {
    position: 'absolute', bottom: 80, left: -100,
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  // Content
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  logoWrap: {
    width: 88, height: 88, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  logoIcon: { fontSize: 40 },

  brand: {
    fontSize: Typography['2xl'],
    fontWeight: '800',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  headline: {
    fontSize: Typography['3xl'],
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: Spacing.md,
  },
  sub: {
    fontSize: Typography.base,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
    maxWidth: 300,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: Radius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  stat: { alignItems: 'center' },
  statValue: {
    fontSize: Typography.xl,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },

  // CTA
  btnWrap: { alignItems: 'center', gap: Spacing.md },
  btn: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.full,
    paddingVertical: 17,
    paddingHorizontal: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  btnText: {
    fontSize: Typography.lg,
    fontWeight: '800',
    color: Colors.primary,
  },
  btnArrow: {
    fontSize: Typography.lg,
    fontWeight: '800',
    color: Colors.primary,
  },
  disclaimer: {
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.5,
  },
});
