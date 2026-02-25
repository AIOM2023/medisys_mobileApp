import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  IntroScreen: undefined;
  Login: undefined;
  Register: undefined;
  RegisterDetails: {
    prefix: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    mobile: string;
    idType: string;
    idNumber: string;
    gender: string;
    fullName: string;
  };
  RegisterPhoto: undefined;
  Home: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
