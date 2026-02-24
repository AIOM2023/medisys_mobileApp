import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Input, Button } from '../components';
import { colors, spacing, typography } from '../theme';
import { NavigationProp } from '../navigation/types';
import { useAuth } from '../hooks/useAuth';

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { login, isLoading, error } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async () => {
    let isValid = true;

    // Reset errors
    setUsernameError('');
    setPasswordError('');

    // Validate username
    if (!username) {
      setUsernameError('Username is required');
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    if (isValid) {
      try {
        const response = await login({ username, password });
        Alert.alert('Success', response.message);
        navigation.navigate('Home');
      } catch (err) {
        Alert.alert('Login Failed', error || 'An error occurred');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>⚕️</Text>
          </View>
          <Text style={styles.title}>Medisys</Text>
          {/* <Text style={styles.subtitle}></Text> */}
        </View>

        <View style={styles.form}>
          <Input
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChangeText={text => {
              setUsername(text);
              setUsernameError('');
            }}
            error={usernameError}
            autoCapitalize="none"
            autoComplete="username"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={text => {
              setPassword(text);
              setPasswordError('');
            }}
            error={passwordError}
            isPassword
            autoCapitalize="none"
            autoComplete="password"
          />

          <Button
            title={isLoading ? "Logging in..." : "Login"}
            onPress={handleLogin}
            style={styles.button}
            disabled={isLoading}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.linkContainer}>
            <Text style={styles.footerText}>
              Don't have an account? <Text style={styles.linkText}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  logoIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  form: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    marginTop: spacing.md,
  },
  footerText: {
    textAlign: 'center',
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    marginTop: spacing.md,
  },
  linkContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  linkText: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
});
