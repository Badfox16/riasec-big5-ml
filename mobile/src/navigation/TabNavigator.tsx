// ─── Tab Navigator — Custom Animated Bottom Bar ───────────────────────────────

import React, { useRef, useEffect, useMemo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors, ColorsType, Spacing, Typography } from '../theme';
import { TabParamList } from '../types';

import HomeScreen    from '../screens/main/HomeScreen';
import HistoryScreen from '../screens/main/HistoryScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ITEMS: Array<{ name: keyof TabParamList; label: string; icon: keyof typeof Feather.glyphMap }> = [
  { name: 'Home',    label: 'Início',    icon: 'home' },
  { name: 'History', label: 'Histórico', icon: 'clock' },
  { name: 'Profile', label: 'Perfil',    icon: 'user' },
];

function CustomTabBar({ state, navigation }: any) {
  const insets  = useSafeAreaInsets();
  const Colors  = useColors();
  const styles  = useMemo(() => makeStyles(Colors), [Colors]);
  const anims   = useRef(TAB_ITEMS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    TAB_ITEMS.forEach((_, i) => {
      Animated.spring(anims[i], {
        toValue: state.index === i ? 1 : 0,
        tension: 120, friction: 8, useNativeDriver: true,
      }).start();
    });
  }, [state.index]);

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.bar}>
        {TAB_ITEMS.map((item, i) => {
          const isActive     = state.index === i;
          const scale        = anims[i].interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] });
          const labelOpacity = anims[i].interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });
          const dotScale     = anims[i].interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

          return (
            <TouchableOpacity key={item.name} style={styles.tabItem} onPress={() => navigation.navigate(item.name)} activeOpacity={0.7}>
              <Animated.View style={[styles.activePill, { transform: [{ scaleX: dotScale }, { scaleY: dotScale }] }]} />
              <Animated.View style={[styles.iconWrap, isActive && styles.iconWrapActive, { transform: [{ scale }] }]}>
                <Feather name={item.icon} size={20} color={isActive ? Colors.tabActive : Colors.tabInactive} />
              </Animated.View>
              <Animated.Text style={[styles.label, isActive && styles.labelActive, { opacity: labelOpacity }]}>
                {item.label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator tabBar={props => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home"    component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const makeStyles = (C: ColorsType) => StyleSheet.create({
  container: { backgroundColor: C.tabBackground, borderTopWidth: 1, borderTopColor: C.tabBorder },
  bar:       { flexDirection: 'row', paddingTop: 10, paddingHorizontal: Spacing.md },
  tabItem:   { flex: 1, alignItems: 'center', gap: 4 },
  activePill: {
    position: 'absolute', top: -10, width: 28, height: 3,
    borderRadius: 2, backgroundColor: C.primaryLight,
  },
  iconWrap:       { width: 40, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  iconWrapActive: { backgroundColor: C.primaryGlow },
  label:          { fontSize: Typography.xs, fontWeight: '500', color: C.tabInactive },
  labelActive:    { color: C.tabActive, fontWeight: '700' },
});
