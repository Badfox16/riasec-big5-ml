import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated,
  StatusBar, Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Colors, Spacing, Typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Loading'>;

const STEPS = [
  'A calcular dimensões RIASEC...',
  'A prever traços de personalidade...',
  'A mapear sugestões de carreira...',
  'A preparar o teu perfil...',
];

export default function LoadingScreen({ navigation }: Props) {
  const spin   = useRef(new Animated.Value(0)).current;
  const pulse  = useRef(new Animated.Value(1)).current;
  const stepAnim = useRef(new Animated.Value(1)).current;
  const [step, setStep] = React.useState(0);

  // Spinner
  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1, duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  // Pulse on logo
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1.0,  duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  // Step cycling
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      Animated.timing(stepAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        current = (current + 1) % STEPS.length;
        setStep(current);
        Animated.timing(stepAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    }, 900);
    return () => clearInterval(interval);
  }, []);

  // Navigate after 3.8s
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Results');
    }, 3800);
    return () => clearTimeout(timer);
  }, []);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={[Colors.primaryDark, Colors.primary, '#7C3AED']}
      style={styles.root}
    >
      <StatusBar barStyle="light-content" />

      {/* Decorative rings */}
      <View style={styles.ring1} />
      <View style={styles.ring2} />

      {/* Logo pulse */}
      <Animated.View style={[styles.logoWrap, { transform: [{ scale: pulse }] }]}>
        <Text style={styles.logoEmoji}>🎯</Text>
      </Animated.View>

      {/* Spinner */}
      <Animated.View style={[styles.spinner, { transform: [{ rotate }] }]}>
        <View style={styles.spinnerArc} />
      </Animated.View>

      <Text style={styles.title}>A analisar o teu perfil</Text>

      <Animated.Text style={[styles.step, { opacity: stepAnim }]}>
        {STEPS[step]}
      </Animated.Text>

      {/* Progress dots */}
      <View style={styles.dots}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },

  // Decorative
  ring1: {
    position: 'absolute',
    width: 320, height: 320,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  ring2: {
    position: 'absolute',
    width: 220, height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },

  // Logo
  logoWrap: {
    width: 90, height: 90,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: { fontSize: 42 },

  // Spinner (CSS-style arc)
  spinner: {
    width: 56, height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
    borderTopColor: '#FFFFFF',
  },
  spinnerArc: {}, // visual achieved via border trick above

  title: {
    fontSize: Typography['2xl'],
    fontWeight: '800',
    color: '#FFFFFF',
  },
  step: {
    fontSize: Typography.base,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },

  dots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.sm,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 20,
  },
});
