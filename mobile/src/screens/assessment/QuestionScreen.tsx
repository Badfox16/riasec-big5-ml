// ─── Question Screen ──────────────────────────────────────────────────────────

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppStackParamList, IconFamily } from '../../types';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import { DIMENSION_GROUPS } from '../../data/questions';
import { useColors, ColorsType, Colors, Spacing, Radius, Typography, Shadow } from '../../theme';

type Props = NativeStackScreenProps<AppStackParamList, 'Question'>;

const { width } = Dimensions.get('window');

function DimIcon({ family, name, size, color }: { family: IconFamily; name: string; size: number; color: string }) {
  return family === 'Ionicons'
    ? <Ionicons name={name as any} size={size} color={color} />
    : <Feather name={name as any} size={size} color={color} />;
}

const ALL_QUESTIONS = DIMENSION_GROUPS.flatMap(g =>
  g.questions.map(q => ({
    ...q,
    dimColor:      g.color,
    dimBg:         g.bgColor,
    dimIconFamily: g.iconFamily,
    dimIconName:   g.iconName,
    dimName:       g.name,
    dimGradient:   Colors.riasecGradient[g.dimension] ?? Colors.primaryGradient,
  })),
);

const TOTAL = ALL_QUESTIONS.length;

const OPTIONS: { value: number; label: string; family: IconFamily; icon: string }[] = [
  { value: 1, label: 'Não gostaria nada', family: 'Ionicons', icon: 'sad-outline' },
  { value: 2, label: 'Não gostaria',       family: 'Ionicons', icon: 'thumbs-down-outline' },
  { value: 3, label: 'Neutro',             family: 'Feather',  icon: 'minus-circle' },
  { value: 4, label: 'Gostaria',           family: 'Ionicons', icon: 'thumbs-up-outline' },
  { value: 5, label: 'Gostaria muito',     family: 'Ionicons', icon: 'happy-outline' },
];

export default function QuestionScreen({ navigation }: Props) {
  const insets  = useSafeAreaInsets();
  const C       = useColors();
  const styles  = useMemo(() => makeStyles(C), [C]);
  const { answers, setAnswer } = useAssessmentStore();

  const [currentIndex,     setCurrentIndex]     = useState(0);
  const [selected,         setSelected]         = useState<number | null>(null);
  const [isTransitioning,  setIsTransitioning]  = useState(false);

  const cardOpacity    = useRef(new Animated.Value(1)).current;
  const cardTranslateX = useRef(new Animated.Value(0)).current;
  const optionAnims    = useRef(OPTIONS.map(() => new Animated.Value(0))).current;
  const selectAnims    = useRef(OPTIONS.map(() => new Animated.Value(1))).current;

  const q = ALL_QUESTIONS[currentIndex];

  const animateOptionsIn = useCallback(() => {
    optionAnims.forEach(a => a.setValue(0));
    Animated.stagger(60, optionAnims.map(a => Animated.spring(a, { toValue: 1, tension: 80, friction: 10, useNativeDriver: true }))).start();
  }, [currentIndex]);

  useEffect(() => {
    setSelected(answers[q.code] ?? null);
    animateOptionsIn();
  }, [currentIndex]);

  const transitionToQuestion = (nextIndex: number, direction: 'forward' | 'back') => {
    const fromX  = direction === 'forward' ? -width : width;
    const enterX = direction === 'forward' ? width   : -width;
    setIsTransitioning(true);
    Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(cardTranslateX, { toValue: fromX, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      cardTranslateX.setValue(enterX);
      setCurrentIndex(nextIndex);
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(cardTranslateX, { toValue: 0, tension: 80, friction: 12, useNativeDriver: true }),
      ]).start(() => setIsTransitioning(false));
    });
  };

  const handleSelect = (value: number) => {
    if (isTransitioning) return;
    const idx = value - 1;
    Animated.sequence([
      Animated.spring(selectAnims[idx], { toValue: 0.92, tension: 200, friction: 5, useNativeDriver: true }),
      Animated.spring(selectAnims[idx], { toValue: 1,    tension: 200, friction: 5, useNativeDriver: true }),
    ]).start();
    setAnswer(q.code, value);
    setSelected(value);
    setTimeout(() => {
      if (currentIndex + 1 >= TOTAL) navigation.replace('Demographics');
      else transitionToQuestion(currentIndex + 1, 'forward');
    }, 450);
  };

  const handleBack = () => {
    if (isTransitioning) return;
    if (currentIndex === 0) navigation.goBack();
    else transitionToQuestion(currentIndex - 1, 'back');
  };

  const progress = (currentIndex + 1) / TOTAL;
  const dimQ     = (currentIndex % 8) + 1;

  return (
    <View style={styles.root}>
      <StatusBar barStyle={C === C ? 'light-content' : 'dark-content'} />
      <LinearGradient colors={[`${q.dimColor}18`, C.background, C.background]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />

      <View style={[styles.topBar, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Feather name="arrow-left" size={18} color={C.text} />
        </TouchableOpacity>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: q.dimColor }]} />
        </View>
        <Text style={styles.progressLabel}>{currentIndex + 1}/{TOTAL}</Text>
      </View>

      <View style={styles.dimBadgeRow}>
        <View style={[styles.dimBadge, { backgroundColor: `${q.dimColor}20`, borderColor: `${q.dimColor}40` }]}>
          <DimIcon family={q.dimIconFamily} name={q.dimIconName} size={16} color={q.dimColor} />
          <Text style={[styles.dimName, { color: q.dimColor }]}>{q.dimName}</Text>
          <Text style={styles.dimProgress}>· {dimQ}/8</Text>
        </View>
      </View>

      <Animated.View style={[styles.questionCard, { opacity: cardOpacity, transform: [{ translateX: cardTranslateX }] }]}>
        <View style={styles.questionInner}>
          <Text style={[styles.qNumber, { color: `${q.dimColor}60` }]}>{String(currentIndex + 1).padStart(2, '0')}</Text>
          <Text style={styles.questionText}>
            Eu gostaria de…{'\n'}
            <Text style={styles.questionAction}>{q.text.toLowerCase()}</Text>
          </Text>
        </View>
      </Animated.View>

      <View style={[styles.optionsWrap, { paddingBottom: Math.max(insets.bottom, Spacing.lg) }]}>
        {OPTIONS.map((opt, i) => {
          const isSelected = selected === opt.value;
          return (
            <Animated.View key={opt.value} style={{ opacity: optionAnims[i], transform: [{ scale: selectAnims[i] }, { translateY: optionAnims[i].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
              <TouchableOpacity
                style={[styles.option, isSelected && styles.optionSelected, isSelected && { borderColor: q.dimColor }]}
                onPress={() => handleSelect(opt.value)} activeOpacity={0.75}
              >
                {isSelected && (
                  <LinearGradient colors={[`${q.dimColor}25`, `${q.dimColor}08`]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
                )}
                <View style={styles.optionIconWrap}>
                  <DimIcon family={opt.family} name={opt.icon} size={20} color={isSelected ? q.dimColor : C.textSecondary} />
                </View>
                <Text style={[styles.optionLabel, isSelected && { color: q.dimColor, fontWeight: '700' }]}>{opt.label}</Text>
                {isSelected && (
                  <View style={[styles.checkMark, { backgroundColor: q.dimColor }]}>
                    <Feather name="check" size={12} color="#FFF" />
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

const makeStyles = (C: ColorsType) => StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },

  topBar:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, gap: Spacing.md },
  backBtn:       { width: 36, height: 36, borderRadius: 18, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  progressTrack: { flex: 1, height: 5, backgroundColor: C.surface, borderRadius: Radius.full, overflow: 'hidden' },
  progressFill:  { height: '100%', borderRadius: Radius.full },
  progressLabel: { fontSize: Typography.sm, fontWeight: '700', color: C.textMuted, width: 36, textAlign: 'right' },

  dimBadgeRow: { paddingHorizontal: Spacing.lg, marginTop: Spacing.xs },
  dimBadge:    { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, alignSelf: 'flex-start', paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: Radius.full, borderWidth: 1 },
  dimName:     { fontSize: Typography.sm, fontWeight: '700' },
  dimProgress: { fontSize: Typography.sm, color: C.textMuted },

  questionCard:   { flex: 1, paddingHorizontal: Spacing.lg, justifyContent: 'center' },
  questionInner:  { gap: Spacing.md },
  qNumber:        { fontSize: Typography['4xl'], fontWeight: '900', letterSpacing: -1 },
  questionText:   { fontSize: Typography.xl, color: C.textSecondary, lineHeight: 30, fontWeight: '400' },
  questionAction: { color: C.text, fontWeight: '800', fontSize: Typography['2xl'], lineHeight: 34 },

  optionsWrap:    { paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  option:         { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: Radius.lg, padding: Spacing.md, gap: Spacing.md, borderWidth: 1, borderColor: C.border, overflow: 'hidden', minHeight: 52 },
  optionSelected: { borderWidth: 1.5, ...Shadow.sm },
  optionIconWrap: { width: 28, alignItems: 'center' },
  optionLabel:    { flex: 1, fontSize: Typography.base, color: C.textSecondary, fontWeight: '500' },
  checkMark:      { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
});
