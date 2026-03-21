import React, { useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Dimensions, StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Colors, Radius, Shadow, Spacing, Typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    emoji: '📋',
    title: 'Responde ao Questionário',
    body: '30 perguntas curtas sobre atividades que gostas ou não gostas de fazer. Sem respostas certas ou erradas.',
    bg: Colors.primaryLight,
    accent: Colors.primary,
  },
  {
    emoji: '🧭',
    title: 'Descobre o Teu Perfil RIASEC',
    body: 'O teu perfil é composto por 6 dimensões de Holland: Realista, Investigativo, Artístico, Social, Empreendedor e Convencional.',
    bg: '#FEF3C7',
    accent: Colors.riasec.R,
  },
  {
    emoji: '🎯',
    title: 'Explora Carreiras Sugeridas',
    body: 'Com base no teu código Holland e personalidade Big Five, recebees sugestões de carreira personalizadas para o teu perfil.',
    bg: '#D1FAE5',
    accent: Colors.riasec.S,
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);

  const goNext = () => {
    if (page < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (page + 1) * width, animated: true });
      setPage(page + 1);
    } else {
      navigation.navigate('Questionnaire');
    }
  };

  const onScroll = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setPage(idx);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* Skip */}
      <TouchableOpacity
        style={styles.skip}
        onPress={() => navigation.navigate('Questionnaire')}
      >
        <Text style={styles.skipText}>Ignorar</Text>
      </TouchableOpacity>

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        scrollEventThrottle={16}
        style={styles.slider}
      >
        {SLIDES.map((slide, i) => (
          <View key={i} style={styles.slide}>
            <View style={[styles.iconWrap, { backgroundColor: slide.bg }]}>
              <Text style={styles.icon}>{slide.emoji}</Text>
            </View>
            <Text style={[styles.slideStep, { color: slide.accent }]}>
              {i + 1} de {SLIDES.length}
            </Text>
            <Text style={styles.slideTitle}>{slide.title}</Text>
            <Text style={styles.slideBody}>{slide.body}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === page && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* Next / Start */}
      <TouchableOpacity
        style={[styles.btn, Shadow.primary]}
        onPress={goNext}
        activeOpacity={0.88}
      >
        <Text style={styles.btnText}>
          {page < SLIDES.length - 1 ? 'Próximo' : 'Começar Avaliação →'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    paddingBottom: 48,
  },
  skip: {
    alignSelf: 'flex-end',
    padding: Spacing.md,
    marginTop: 50,
    marginRight: Spacing.sm,
  },
  skipText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    fontWeight: '600',
  },

  slider: { flex: 1, width },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  iconWrap: {
    width: 120, height: 120,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  icon: { fontSize: 56 },
  slideStep: {
    fontSize: Typography.sm,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  slideTitle: {
    fontSize: Typography['2xl'],
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 30,
  },
  slideBody: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 23,
    maxWidth: 320,
  },

  dots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.xl,
  },
  dot: {
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },

  btn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 17,
    paddingHorizontal: 48,
  },
  btnText: {
    fontSize: Typography.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
