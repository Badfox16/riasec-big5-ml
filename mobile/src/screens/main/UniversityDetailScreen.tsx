// ─── University Detail Screen ─────────────────────────────────────────────────

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppStackParamList, UniversityRequirement } from '../../types';
import { fetchUniversityRequirement, ApiError } from '../../services/api';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import { useColors, ColorsType, Spacing, Radius, Typography, Shadow } from '../../theme';

type Props = NativeStackScreenProps<AppStackParamList, 'UniversityDetail'>;

export default function UniversityDetailScreen({ route, navigation }: Props) {
  const { codigo, area, cursoTitulo } = route.params;
  const insets  = useSafeAreaInsets();
  const C       = useColors();
  const styles  = useMemo(() => makeStyles(C), [C]);
  const { toggleFavorite, isFavorite } = useAssessmentStore();

  const favKey  = `${codigo}:${area}`;
  const [data,    setData]    = useState<UniversityRequirement | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchUniversityRequirement(codigo, area)
      .then(r => { if (!cancelled) setData(r); })
      .catch((err: ApiError) => { if (!cancelled) setErrorMsg(err.message ?? 'Não foi possível obter os requisitos.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [codigo, area]);

  const handleVisitWebsite = () => { if (data) Linking.openURL(data.website).catch(() => {}); };
  const handleSave = () => {
    toggleFavorite(favKey);
    Alert.alert(isFavorite(favKey) ? 'Removido dos favoritos' : 'Guardado', '');
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={C.heroGradient} style={[styles.hero, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={18} color={C.textSecondary} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.heroTitle}>{data?.universidade ?? codigo}</Text>
        {data && (
          <View style={styles.cityRow}>
            <Feather name="map-pin" size={14} color={C.textSecondary} />
            <Text style={styles.heroCity}>{data.cidade}</Text>
          </View>
        )}
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + Spacing.xl }]}>
        {loading && (
          <View style={styles.center}><ActivityIndicator color={C.primaryLight} /></View>
        )}

        {!loading && errorMsg && (
          <View style={styles.errorBox}>
            <Feather name="alert-triangle" size={16} color={C.error} />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {!loading && data && (
          <>
            <View style={[styles.card, Shadow.sm]}>
              <Text style={styles.courseTitle}>{cursoTitulo || data.curso_titulo}</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Feather name="clock" size={14} color={C.textSecondary} />
                  <Text style={styles.metaText}>{data.duracao}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Feather name="book-open" size={14} color={C.textSecondary} />
                  <Text style={styles.metaText}>{data.modalidade}</Text>
                </View>
              </View>
            </View>

            <View style={[styles.card, Shadow.sm]}>
              <Text style={styles.cardTitle}>Disciplinas do ensino secundário</Text>
              <View style={styles.chipsWrap}>
                {data.disciplinas_exigidas.map(d => (
                  <View key={d} style={styles.chip}><Text style={styles.chipText}>{d}</Text></View>
                ))}
              </View>
            </View>

            <View style={[styles.card, Shadow.sm]}>
              <Text style={styles.cardTitle}>Nota mínima / processo de admissão</Text>
              <Text style={styles.bodyText}>{data.nota_minima}</Text>
            </View>

            <View style={[styles.card, Shadow.sm]}>
              <Text style={styles.cardTitle}>Documentos necessários</Text>
              {data.documentos.map(doc => (
                <View key={doc} style={styles.docRow}>
                  <Feather name="check" size={14} color={C.success} />
                  <Text style={styles.docText}>{doc}</Text>
                </View>
              ))}
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={[styles.saveBtn, Shadow.sm]} onPress={handleSave} activeOpacity={0.85}>
                <Feather name={isFavorite(favKey) ? 'bookmark' : 'bookmark'} size={16} color={isFavorite(favKey) ? C.accentLight : C.textSecondary} />
                <Text style={[styles.saveBtnText, isFavorite(favKey) && { color: C.accentLight }]}>{isFavorite(favKey) ? 'Guardado' : 'Guardar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.websiteBtn, Shadow.primary]} onPress={handleVisitWebsite} activeOpacity={0.9}>
                <LinearGradient colors={C.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.websiteGradient}>
                  <Feather name="external-link" size={16} color="#FFF" />
                  <Text style={styles.websiteBtnText}>Visitar Website</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.contactBox}>
              <Feather name="mail" size={14} color={C.textMuted} />
              <Text style={styles.contactText}>{data.contacto}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const makeStyles = (C: ColorsType) => StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },

  hero:     { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg, gap: Spacing.xs },
  backBtn:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.sm },
  backText: { fontSize: Typography.base, color: C.textSecondary, fontWeight: '500' },
  heroTitle:{ fontSize: Typography['2xl'], fontWeight: '900', color: C.text },
  cityRow:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroCity: { fontSize: Typography.sm, color: C.textSecondary },

  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, gap: Spacing.md },
  center: { paddingVertical: Spacing.xl, alignItems: 'center' },

  errorBox:  { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, backgroundColor: C.errorBg, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: C.error + '40' },
  errorText: { flex: 1, fontSize: Typography.sm, color: C.error },

  card:      { backgroundColor: C.card, borderRadius: Radius.xl, padding: Spacing.lg, gap: Spacing.sm, borderWidth: 1, borderColor: C.border },
  cardTitle: { fontSize: Typography.base, fontWeight: '800', color: C.text },

  courseTitle: { fontSize: Typography.lg, fontWeight: '800', color: C.text },
  metaRow:     { flexDirection: 'row', gap: Spacing.lg, marginTop: 2 },
  metaItem:    { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText:    { fontSize: Typography.sm, color: C.textSecondary },

  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip:      { backgroundColor: C.primaryGlow, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 6 },
  chipText:  { fontSize: Typography.sm, fontWeight: '600', color: C.primaryLight },

  bodyText: { fontSize: Typography.sm, color: C.textSecondary, lineHeight: 20 },

  docRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, paddingVertical: 3 },
  docText: { flex: 1, fontSize: Typography.sm, color: C.textSecondary, lineHeight: 20 },

  actions:        { flexDirection: 'row', gap: Spacing.sm },
  saveBtn:        { flex: 1, flexDirection: 'row', gap: Spacing.xs, alignItems: 'center', justifyContent: 'center', backgroundColor: C.card, borderRadius: Radius.lg, paddingVertical: 14, borderWidth: 1, borderColor: C.border },
  saveBtnText:    { fontSize: Typography.base, fontWeight: '700', color: C.textSecondary },
  websiteBtn:     { flex: 2, borderRadius: Radius.lg, overflow: 'hidden' },
  websiteGradient:{ flexDirection: 'row', gap: Spacing.xs, alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
  websiteBtnText: { fontSize: Typography.base, fontWeight: '700', color: '#FFF' },

  contactBox:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, justifyContent: 'center', paddingVertical: Spacing.sm },
  contactText: { fontSize: Typography.xs, color: C.textMuted },
});
