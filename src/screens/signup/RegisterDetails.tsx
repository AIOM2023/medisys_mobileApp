import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Input, Button } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { NavigationProp, RootStackParamList } from '../../navigation/types';

type RegisterDetailsRouteProp = RouteProp<RootStackParamList, 'RegisterDetails'>;

export const RegisterDetails: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RegisterDetailsRouteProp>();
    const { fullName } = route.params;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = () => {
        let isValid = true;

        // Reset errors
        setUsernameError('');
        setPasswordError('');
        setConfirmPasswordError('');

        if (!username) {
            setUsernameError('Username is required');
            isValid = false;
        }

        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            isValid = false;
        }

        if (!confirmPassword) {
            setConfirmPasswordError('Please confirm your password');
            isValid = false;
        } else if (confirmPassword !== password) {
            setConfirmPasswordError('Passwords do not match');
            isValid = false;
        }

        if (isValid) {
            setIsLoading(true);
            // Simulate registration
            setTimeout(() => {
                setIsLoading(false);
                navigation.navigate('RegisterPhoto');
            }, 1500);
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
                    <Text style={styles.title}>Register</Text>
                    <Text style={styles.welcomeText}>Welcome {fullName}</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Username"
                        placeholder="Choose a username"
                        value={username}
                        onChangeText={(text) => {
                            setUsername(text);
                            setUsernameError('');
                        }}
                        error={usernameError}
                        autoCapitalize="none"
                    />

                    <Input
                        label="Password"
                        placeholder="Enter password"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setPasswordError('');
                        }}
                        error={passwordError}
                        isPassword
                        autoCapitalize="none"
                    />

                    <Input
                        label="Confirm Password"
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text);
                            setConfirmPasswordError('');
                        }}
                        error={confirmPasswordError}
                        isPassword
                        autoCapitalize="none"
                    />

                    <Button
                        title={isLoading ? "Registering..." : "Register"}
                        onPress={handleRegister}
                        loading={isLoading}
                        style={styles.button}
                        disabled={isLoading}
                    />
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
        padding: spacing.lg,
        paddingVertical: spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
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
    },
    welcomeText: {
        fontSize: typography.fontSize.md,
        color: colors.text.secondary,
        marginTop: spacing.sm,
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
    linkContainer: {
        marginTop: spacing.xl,
        alignItems: 'center',
    },
    footerText: {
        fontSize: typography.fontSize.sm,
        color: colors.text.primary,
    },
    linkText: {
        color: colors.primary,
        fontWeight: typography.fontWeight.bold,
    },
});
