import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen, HomeScreen, RegisterWithOTP, RegisterDetails, RegisterPhoto } from '../screens';
import { RootStackParamList } from './types';
import { colors } from '../theme';
import IntroScreen from '../screens/IntroScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="IntroScreen"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}>
        <Stack.Screen
          name="IntroScreen"
          component={IntroScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterWithOTP}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RegisterDetails"
          component={RegisterDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RegisterPhoto"
          component={RegisterPhoto}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
           headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
