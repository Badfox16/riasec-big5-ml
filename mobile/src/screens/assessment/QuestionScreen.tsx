// ─── Question Screen ──────────────────────────────────────────────────────────
// One question per "page" with animated card transitions.
// 30 questions total; auto-advances to Demographics when complete.

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Dimensions, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppStackParamList } from '../../types';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import { DIMENSION_GROUPS } from '../../data/questions';
import { Colors, Spacing, Radius, Typography, Shadow } from '../../theme';

type Props = NativeStackScreenProps<AppStackParamList, 'Question'>;

const { width } = Dimensions.get('window');

// Flat list of all 30 questions in order
const ALL_QUESTIONS = DIMENSION_GROUPS.flatMap(g =>
  g.questions.map(q => ({
    ...q,
    dimColor: g.color,
    dimBg:    g.bgColor,
    dimEmoji: g.emoji,
    dimName:  g.name,
    dimGradient: Colors.riasecGradient[g.dimension] ?? Colors.primaryGradient,
  })),
);

const TOTAL = ALL_QUESTIONS.length;

const OPTIONS = [
  { value: 1, label: 'Não gostaria nada', emoji: '😣' },
  { value: 2, label: 'Não gostaria',       emoji: '😕' },
  { value: 3, label: 'Neutro',             emoji: '😐' },
  { value: 4, label: 'Gostaria',           emoji: '🙂' },
  { value: 5, label: 'Gostaria muito',     emoji: '😄' },
];

export default function QuestionScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { answers, setAnswer } = useAssessmentStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected]         = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Card animation values
  const cardOpacity   = useRef(new Animated.Value(1)).current;
  const cardTranslateX = useRef(new Animated.Value(0)).current;
  // Option stagger anims (5 options)
  const optionAnims   = useRef(OPTIONS.map(() => new Animated.Value(0))).current;
  // Selection scale per option
  const selectAnims   = useRef(OPTIONS.map(() => new Animated.Value(1))).current;

  const q = ALL_QUESTIONS[currentIndex];

  // Animate options in on mount / question change
  const animateOptionsIn = useCallback(() => {
    optionAnims.forEach(a => a.setValue(0));
    Animated.stagger(
      60,
      optionAnims.map(a =>
        Animated.spring(a, { toValue: 1, tension: 80, friction: 10, useNativeDriver: true }),
      ),
    ).start();
  }, [currentIndex]);

  useEffect(() => {
    // Restore previously selected answer if user goes back
    setSelected(answers[q.code] ?? null);
    animateOptionsIn();
  }, [currentIndex]);

  const transitionToQuestion = (nextIndex: number, direction: 'forward' | 'back') => {
    const fromX  = direction === 'forward' ? -width : width;
    const enterX = direction === 'forward' ? width   : -width;

    setIsTransitioning(true);

    // Slide out current
    Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(cardTranslateX, { toValue: fromX, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      cardTranslateX.setValue(enterX);
      setCurrentIndex(nextIndex);
      // Slide in new
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(cardTranslateX, { toValue: 0, tension: 80, friction: 12, useNativeDriver: true }),
      ]).start(() => setIsTransitioning(false));
    });
  };

  const handleSelect = (value: number) => {
    if (isTransitioning) return;

    // Animate the tapped option
    const idx = value - 1;
    Animated.sequence([
      Animated.spring(selectAnims[idx], { toValue: 0.92, tension: 200, friction: 5, useNativeDriver: true }),
      Animated.spring(selectAnims[idx], { toValue: 1,    tension: 200, friction: 5, useNativeDriver: true }),
    ]).start();

    setAnswer(q.code, value);
    setSelected(value);

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentIndex + 1 >= TOTAL) {
        navigation.replace('Demographics');
      } else {
        transitionToQuestion(currentIndex + 1, 'forward');
      }
    }, 450);
  };

  const handleBack = () => {
    if (isTransitioning) return;
    if (currentIndex === 0) {
      navigation.goBack();
    } else {
      transitionToQuestion(currentIndex - 1, 'back');
    }
  };

  // Progress per dimension (which of the 6 sections are we in?)
  const dimIndex  = Math.floor(currentIndex / 5);
  const dimQ      = (currentIndex % 5) + 1;
  const progress  = (currentIndex + 1) / TOTAL;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Full-screen gradient matching dimension color */}
      <LinearGradient
        colors={[`${q.dimColor}18`, '#0D0D1A', '#0D0D1A']}
        locations={[0, 0.35, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: `${progress * 100}%`,
                backgroundColor: q.dimColor,
              },
            ]}
          />
        </View>

        <Text style={styles.progressLabel}>{currentIndex + 1}/{TOTAL}</Text>
      </View>

      {/* Dimension badge */}
      <View style={styles.dimBadgeRow}>
        <View style={[styles.dimBadge, { backgroundColor: `${q.dimColor}20`, borderColor: `${q.dimColor}40` }]}>
          <Text style={styles.dimEmoji}>{q.dimEmoji}</Text>
          <Text style={[styles.dimName, { color: q.dimColor }]}>{q.dimName}</Text>
          <Text style={styles.dimProgress}>· {dimQ}/5</Text>
        </View>
      </View>

      {/* Animated question card */}
      <Animated.View
        style={[
          styles.questionCard,
          {
            opacity: cardOpacity,
            transform: [{ translateX: cardTranslateX }],
          },
        ]}
      >
        <View style={styles.questionInner}>
          {/* Question number accent */}
          <Text style={[styles.qNumber, { color: `${q.dimColor}60` }]}>
            {String(currentIndex + 1).padStart(2, '0')}
          </Text>

          {/* Question text */}
          <Text style={styles.questionText}>
            Eu gostaria de…{'\n'}
            <Text style={styles.questionAction}>{q.text.toLowerCase()}</Text>
          </Text>
        </View>
      </Animated.View>

      {/* Options */}
      <View style={[styles.optionsWrap, { paddingBottom: Math.max(insets.bottom, Spacing.lg) }]}>
        {OPTIONS.map((opt, i) => {
          const isSelected = selected === opt.value;
          return (
            <Animated.View
              key={opt.value}
              style={{
                opacity:   optionAnims[i],
                transform: [
                  { scale: selectAnims[i] },
                  {
                    translateY: optionAnims[i].interpolate({
                      inputRange: [0, 1], outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity
                style={[
                  styles.option,
                  isSelected && styles.optionSelected,
                  isSelected && { borderColor: q.dimColor },
                ]}
                onPress={() => handleSelect(opt.value)}
                activeOpacity={0.75}
              >
                {isSelected && (
                  <LinearGradient
                    colors={[`${q.dimColor}25`, `${q.dimColor}08`]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                )}
                <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                <Text style={[styles.optionLabel, isSelected && { color: q.dimColor, fontWeight: '700' }]}>
                  {opt.label}
                </Text>
                {isSelected && (
                  <View style={[styles.checkMark, { backgroundColor: q.dimColor }]}>
                    <Text style={styles.checkIcon}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  backIcon: { fontSize: 18, color: Colors.text },
  progressTrack: {
    flex: 1, height: 5,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: Radius.full },
  progressLabel: {
    fontSize: Typography.sm,
    fontWeight: '700',
    color: Colors.textMuted,
    width: 36,
    textAlign: 'right',
  },

  // Dimension badge
  dimBadgeRow: { paddingHorizontal: Spacing.lg, marginTop: Spacing.xs },
  dimBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  dimEmoji:    { fontSize: 16 },
  dimName:     { fontSize: Typography.sm, fontWeight: '700' },
  dimProgress: { fontSize: Typography.sm, color: Colors.textMuted },

  // Question card
  questionCard: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  questionInner: { gap: Spacing.md },
  qNumber: {
    fontSize: Typography['4xl'],
    fontWeight: '900',
    letterSpacing: -1,
  },
  questionText: {
    fontSize: Typography.xl,
    color: Colors.textSecondary,
    lineHeight: 30,
    fontWeight: '400',
  },
  questionAction: {
    color: Colors.text,
    fontWeight: '800',
    fontSize: Typography['2xl'],
    lineHeight: 34,
  },

  // Options
  optionsWrap: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    minHeight: 52,
  },
  optionSelected: {
    borderWidth: 1.5,
    ...Shadow.sm,
  },
  optionEmoji:   { fontSize: 22, width: 28, textAlign: 'center' },
  optionLabel: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  checkMark: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
  },
  checkIcon: { fontSize: 12, color: '#FFF', fontWeight: '700' },
});
