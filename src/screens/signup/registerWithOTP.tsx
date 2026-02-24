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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Input, Button } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { NavigationProp } from '../../navigation/types';

export const RegisterWithOTP: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [aadhar, setAadhar] = useState('');
    const [otp, setOtp] = useState('');

    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpLoading, setIsOtpLoading] = useState(false);

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [aadharError, setAadharError] = useState('');
    const [otpError, setOtpError] = useState('');

    const formatMobile = (text: string) => {
        // Remove all non-digits
        const cleaned = text.replace(/\D/g, '');

        // Limit to 10 digits
        const limited = cleaned.slice(0, 10);

        // Apply formatting (3-3-4)
        let formatted = limited;
        if (limited.length > 6) {
            formatted = `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`;
        } else if (limited.length > 3) {
            formatted = `${limited.slice(0, 3)}-${limited.slice(3)}`;
        }

        return formatted;
    };

    const formatAadhar = (text: string) => {
        // Remove all non-digits
        const cleaned = text.replace(/\D/g, '');

        // Limit to 12 digits
        const limited = cleaned.slice(0, 12);

        // Apply formatting (4-4-4)
        let formatted = limited;
        if (limited.length > 8) {
            formatted = `${limited.slice(0, 4)} ${limited.slice(4, 8)} ${limited.slice(8)}`;
        } else if (limited.length > 4) {
            formatted = `${limited.slice(0, 4)} ${limited.slice(4)}`;
        }

        return formatted;
    };

    const handleSendOTP = () => {
        let isValid = true;

        // Reset errors
        setNameError('');
        setEmailError('');
        setMobileError('');
        setAadharError('');

        if (!name) {
            setNameError('Name is required');
            isValid = false;
        }
        if (!email) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Please enter a valid email');
            isValid = false;
        }
        if (!mobile) {
            setMobileError('Mobile number is required');
            isValid = false;
        } else if (mobile.length < 12) {
            setMobileError('Mobile number must be at least 10 digits');
            isValid = false;
        }
        if (!aadhar) {
            setAadharError('Aadhar number is required');
            isValid = false;
        } else if (aadhar.length !== 14) { // 12 digits + 2 spaces
            setAadharError('Aadhar number must be 12 digits');
            isValid = false;
        }

        if (isValid) {
            setIsLoading(true);
            setTimeout(() => {
                setIsOtpSent(true);
                setIsLoading(false);
            }, 1500);
        }
    };

    const handleValidateOTP = () => {
        setOtpError('');
        if (!otp) {
            setOtpError('OTP is required');
            return;
        }
        if (otp.length < 4) {
            setOtpError('Please enter a valid OTP');
            return;
        }

        setIsOtpLoading(true);
        setTimeout(() => {
            setIsOtpLoading(false);
            navigation.navigate('RegisterDetails', { name });
        }, 1500);
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
                </View>

                <View style={styles.form}>
                    <Input
                        label="Name"
                        placeholder="Enter your full name"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            setNameError('');
                        }}
                        error={nameError}
                        autoCapitalize="words"
                    />

                    <Input
                        label="Contact Email"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setEmailError('');
                        }}
                        error={emailError}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Input
                        label="Mobile"
                        placeholder="Enter mobile number"
                        value={mobile}
                        onChangeText={(text) => {
                            const formatted = formatMobile(text);
                            setMobile(formatted);
                            setMobileError('');
                        }}
                        error={mobileError}
                        keyboardType="phone-pad"
                        maxLength={12} // 10 digits + 2 hyphens
                    />

                    <Input
                        label="Aadhar Number"
                        placeholder="Enter 12-digit Aadhar number"
                        value={aadhar}
                        onChangeText={(text) => {
                            const formatted = formatAadhar(text);
                            setAadhar(text.endsWith(' ') && text.length < aadhar.length ? text.trim() : formatted);
                            setAadharError('');
                        }}
                        error={aadharError}
                        keyboardType="number-pad"
                        maxLength={14} // 12 digits + 2 spaces
                    />

                    <Button
                        title={isLoading && !isOtpSent ? "Sending..." : "Send OTP"}
                        onPress={handleSendOTP}
                        loading={isLoading}
                        style={styles.button}
                        disabled={isLoading}
                    />

                    {isOtpSent && (
                        <>
                            <Text style={styles.statusText}>* OTP sent to aadhar number</Text>

                            <Input
                                label="OTP"
                                placeholder="Enter OTP"
                                value={otp}
                                onChangeText={(text) => {
                                    setOtp(text);
                                    setOtpError('');
                                }}
                                error={otpError}
                                keyboardType="number-pad"
                                style={styles.otpInput}
                            />

                            <Button
                                title={isOtpLoading ? "Validating..." : "Validate OTP"}
                                onPress={handleValidateOTP}
                                style={styles.button}
                                disabled={isOtpLoading}
                                loading={isOtpLoading}
                            />
                        </>
                    )}

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        style={styles.linkContainer}>
                        <Text style={styles.footerText}>
                            Already have Account ? <Text style={styles.linkText}>Login</Text>
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
    statusText: {
        fontSize: typography.fontSize.xs,
        color: colors.text.secondary,
        fontStyle: 'italic',
        marginTop: spacing.sm,
        marginBottom: spacing.xs,
    },
    otpInput: {
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
