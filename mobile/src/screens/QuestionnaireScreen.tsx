// ─── Questionnaire Screen ────────────────────────────────────────────────────
// Flow: Dimension intro → 5 questions one-by-one (auto-advance on selection) → next dimension

import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, SafeAreaView, Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { DIMENSION_GROUPS, TOTAL_QUESTIONS } from '../data/questions';
import { useAssessmentStore } from '../store/useAssessmentStore';
import { Colors, Radius, Shadow, Spacing, Typography } from '../theme';
import ProgressBar from '../components/ProgressBar';
import LikertScale from '../components/LikertScale';

type Props = NativeStackScreenProps<RootStackParamList, 'Questionnaire'>;

type Phase = 'intro' | 'question';

const { width } = Dimensions.get('window');

export default function QuestionnaireScreen({ navigation }: Props) {
  const [dimIdx, setDimIdx]   = useState(0);
  const [qIdx, setQIdx]       = useState(0);
  const [phase, setPhase]     = useState<Phase>('intro');

  const cardAnim = useRef(new Animated.Value(0)).current;
  const { setAnswer, answers, getTotalAnswered } = useAssessmentStore();

  const dim = DIMENSION_GROUPS[dimIdx];
  const question = dim.questions[qIdx];
  const totalAnswered = getTotalAnswered();

  // ── Transition animation ───────────────────────────────────────────────────
  const animateIn = useCallback((cb: () => void) => {
    Animated.timing(cardAnim, {
      toValue: -width * 0.35,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      cardAnim.setValue(width * 0.35); // snap to right off-screen
      cb();                            // update state
      Animated.timing(cardAnim, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }).start();
    });
  }, [cardAnim]);

  // ── Handle answer selection ────────────────────────────────────────────────
  const handleAnswer = (value: number) => {
    setAnswer(question.code, value);

    // Short delay so the selection is visible before transition
    setTimeout(() => {
      const lastQuestion = qIdx === dim.questions.length - 1;
      const lastDimension = dimIdx === DIMENSION_GROUPS.length - 1;

      if (lastQuestion && lastDimension) {
        navigation.navigate('Demographics');
        return;
      }

      if (lastQuestion) {
        animateIn(() => {
          setDimIdx((d) => d + 1);
          setQIdx(0);
          setPhase('intro');
        });
      } else {
        animateIn(() => setQIdx((q) => q + 1));
      }
    }, 350);
  };

  // ── Handle back ───────────────────────────────────────────────────────────
  const handleBack = () => {
    if (phase === 'question' && qIdx > 0) {
      animateIn(() => setQIdx((q) => q - 1));
    } else if (phase === 'question' && qIdx === 0 && dimIdx > 0) {
      animateIn(() => {
        setDimIdx((d) => d - 1);
        setQIdx(DIMENSION_GROUPS[dimIdx - 1].questions.length - 1);
      });
    } else if (phase === 'intro' && dimIdx > 0) {
      setDimIdx((d) => d - 1);
      setPhase('question');
      setQIdx(DIMENSION_GROUPS[dimIdx - 1].questions.length - 1);
    } else {
      navigation.goBack();
    }
  };

  // ── Dimension Intro ───────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: dim.bgColor }]}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={[styles.backArrow, { color: dim.color }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.dimCounter, { color: dim.color }]}>
            Dimensão {dimIdx + 1} de {DIMENSION_GROUPS.length}
          </Text>
        </View>

        <ProgressBar
          current={totalAnswered}
          total={TOTAL_QUESTIONS}
          color={dim.color}
          showLabel
        />

        {/* Intro card */}
        <View style={styles.introCenter}>
          <Text style={styles.introEmoji}>{dim.emoji}</Text>
          <Text style={[styles.introLetter, { color: dim.color }]}>{dim.dimension}</Text>
          <Text style={styles.introName}>{dim.name}</Text>
          <Text style={styles.introDesc}>{dim.description}</Text>
          <Text style={styles.introHint}>
            {dim.questions.length} perguntas nesta secção
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.startBtn, { backgroundColor: dim.color }, Shadow.md]}
          onPress={() => setPhase('question')}
          activeOpacity={0.85}
        >
          <Text style={styles.startBtnText}>Começar Secção →</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── Question Phase ────────────────────────────────────────────────────────
  const currentAnswer = answers[question.code];
  const qNumber = DIMENSION_GROUPS.slice(0, dimIdx).reduce((s, g) => s + g.questions.length, 0) + qIdx + 1;

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[styles.backArrow, { color: dim.color }]}>←</Text>
        </TouchableOpacity>
        <View style={[styles.dimPill, { backgroundColor: dim.bgColor }]}>
          <Text style={[styles.dimPillText, { color: dim.color }]}>
            {dim.emoji} {dim.name}
          </Text>
        </View>
      </View>

      <ProgressBar
        current={totalAnswered}
        total={TOTAL_QUESTIONS}
        color={dim.color}
        showLabel
      />

      {/* Question card */}
      <Animated.View
        style={[styles.card, Shadow.md, { transform: [{ translateX: cardAnim }] }]}
      >
        {/* Question number badge */}
        <View style={[styles.qBadge, { backgroundColor: dim.bgColor }]}>
          <Text style={[styles.qBadgeText, { color: dim.color }]}>
            {qIdx + 1}/{dim.questions.length}
          </Text>
        </View>

        <Text style={styles.qLabel}>Quanto gostarias de...</Text>
        <Text style={styles.qText}>{question.text}</Text>

        {/* Dimension mini-progress dots */}
        <View style={styles.miniDots}>
          {dim.questions.map((_, i) => (
            <View
              key={i}
              style={[
                styles.miniDot,
                i < qIdx
                  ? { backgroundColor: dim.color }
                  : i === qIdx
                  ? { backgroundColor: dim.color, width: 18 }
                  : { backgroundColor: Colors.border },
              ]}
            />
          ))}
        </View>
      </Animated.View>

      {/* Likert scale */}
      <View style={styles.scaleWrap}>
        <LikertScale
          value={currentAnswer}
          onChange={handleAnswer}
          color={dim.color}
        />
      </View>

      {/* Overall question counter */}
      <Text style={styles.overallCount}>
        Pergunta {qNumber} de {TOTAL_QUESTIONS}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: Spacing.lg,
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backArrow: {
    fontSize: Typography.xl,
    fontWeight: '700',
  },
  dimCounter: {
    fontSize: Typography.sm,
    fontWeight: '600',
  },
  dimPill: {
    borderRadius: Radius.full,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  dimPillText: {
    fontSize: Typography.sm,
    fontWeight: '700',
  },

  // ── Intro ────────────────────────────────────────────────────────────────
  introCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  introEmoji: { fontSize: 72 },
  introLetter: {
    fontSize: Typography['4xl'],
    fontWeight: '900',
    letterSpacing: 2,
  },
  introName: {
    fontSize: Typography['2xl'],
    fontWeight: '800',
    color: Colors.text,
  },
  introDesc: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  introHint: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  startBtn: {
    borderRadius: Radius.full,
    paddingVertical: 17,
    alignItems: 'center',
  },
  startBtnText: {
    fontSize: Typography.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── Question card ─────────────────────────────────────────────────────────
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    minHeight: 200,
    justifyContent: 'center',
  },
  qBadge: {
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  qBadgeText: {
    fontSize: Typography.xs,
    fontWeight: '700',
  },
  qLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  qText: {
    fontSize: Typography.xl,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 28,
  },
  miniDots: {
    flexDirection: 'row',
    gap: 5,
    marginTop: Spacing.sm,
  },
  miniDot: {
    height: 6,
    width: 8,
    borderRadius: Radius.full,
  },

  // Scale
  scaleWrap: { paddingHorizontal: Spacing.xs },

  // Counter
  overallCount: {
    textAlign: 'center',
    fontSize: Typography.sm,
    color: Colors.textMuted,
  },
});
