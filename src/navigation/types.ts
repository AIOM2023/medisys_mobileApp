import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  IntroScreen: undefined;
  Login: undefined;
  Register: undefined;
  RegisterDetails: { name: string };
  RegisterPhoto: undefined;
  Home: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
