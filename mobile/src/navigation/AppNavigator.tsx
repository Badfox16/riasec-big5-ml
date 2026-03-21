// ─── Root Navigator ────────────────────────────────────────────────────────────
// Auth stack  → shown when user is not logged in
// App stack   → shown when user is logged in (tabs + assessment full-screen flow)

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthStore }  from '../store/useAuthStore';
import { AuthStackParamList, AppStackParamList } from '../types';

// Navigators
import TabNavigator from './TabNavigator';

// Auth screens
import LoginScreen    from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Assessment screens (full-screen, hides tab bar)
import AssessmentIntroScreen from '../screens/assessment/AssessmentIntroScreen';
import QuestionScreen        from '../screens/assessment/QuestionScreen';
import DemographicsScreen    from '../screens/assessment/DemographicsScreen';
import LoadingScreen         from '../screens/assessment/LoadingScreen';
import ResultsScreen         from '../screens/assessment/ResultsScreen';
import HistoryDetailScreen   from '../screens/main/HistoryDetailScreen';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack  = createNativeStackNavigator<AppStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ animation: 'fade' }}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main tabs */}
      <AppStack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ animation: 'fade' }}
      />

      {/* Assessment flow — overlays tabs */}
      <AppStack.Screen
        name="AssessmentIntro"
        component={AssessmentIntroScreen}
        options={{ animation: 'slide_from_bottom', gestureEnabled: false }}
      />
      <AppStack.Screen
        name="Question"
        component={QuestionScreen}
        options={{ animation: 'fade', gestureEnabled: false }}
      />
      <AppStack.Screen
        name="Demographics"
        component={DemographicsScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <AppStack.Screen
        name="Loading"
        component={LoadingScreen}
        options={{ animation: 'fade', gestureEnabled: false }}
      />
      <AppStack.Screen
        name="Results"
        component={ResultsScreen}
        options={{ animation: 'slide_from_bottom', gestureEnabled: false }}
      />

      {/* History detail */}
      <AppStack.Screen
        name="HistoryDetail"
        component={HistoryDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </AppStack.Navigator>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────

export default function RootNavigator() {
  const user = useAuthStore(s => s.user);

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
