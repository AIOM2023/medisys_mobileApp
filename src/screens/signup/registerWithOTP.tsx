import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Input, Button } from '../../components';
import { Picker } from '@react-native-picker/picker';
import { colors, spacing, typography } from '../../theme';
import { NavigationProp } from '../../navigation/types';

export const RegisterWithOTP: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    const firstNameRef = useRef<TextInput>(null);
    const middleNameRef = useRef<TextInput>(null);
    const lastNameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const mobileRef = useRef<TextInput>(null);
    const idNumberRef = useRef<TextInput>(null);
    const otpRef = useRef<TextInput>(null);

    const [prefix, setPrefix] = useState('Mr');
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [idType, setIdType] = useState('Aadhar');
    const [idNumber, setIdNumber] = useState('');
    const [gender, setGender] = useState('Male');
    const [otp, setOtp] = useState('');

    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpLoading, setIsOtpLoading] = useState(false);

    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [idNumberError, setIdNumberError] = useState('');
    const [genderError, setGenderError] = useState('');
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

    // formatAadhar removed

    const handleSendOTP = () => {
        let isValid = true;

        // Reset errors
        setFirstNameError('');
        setLastNameError('');
        setEmailError('');
        setMobileError('');
        setIdNumberError('');
        setGenderError('');

        if (!firstName) {
            setFirstNameError('First name is required');
            isValid = false;
        }
        if (!lastName) {
            setLastNameError('Last name is required');
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
        if (!idNumber) {
            setIdNumberError('ID number is required');
            isValid = false;
        }
        if (!gender || gender === 'Select Gender') {
            setGenderError('Please select your gender');
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
            const fullName = `${prefix} ${firstName} ${middleName} ${lastName}`.replace(/\s+/g, ' ').trim();
            navigation.navigate('RegisterDetails', {
                prefix,
                firstName,
                middleName,
                lastName,
                email,
                mobile,
                idType,
                idNumber,
                gender,
                fullName
            });
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
                    <View style={styles.nameRow}>
                        <View style={styles.prefixContainer}>
                            <Text style={styles.label}>Prefix</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    selectedValue={prefix}
                                    onValueChange={(itemValue) => setPrefix(itemValue)}
                                    style={styles.picker}
                                    mode="dropdown"
                                    dropdownIconColor={colors.text.primary}>
                                    <Picker.Item label="Mr" value="Mr" />
                                    <Picker.Item label="Miss" value="Miss" />
                                    <Picker.Item label="Mrs" value="Mrs" />
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.firstNameContainer}>
                            <Input
                                ref={firstNameRef}
                                label="First Name"
                                placeholder="First name"
                                value={firstName}
                                onChangeText={(text) => {
                                    setFirstName(text);
                                    setFirstNameError('');
                                }}
                                error={firstNameError}
                                autoCapitalize="words"
                                returnKeyType="next"
                                onSubmitEditing={() => middleNameRef.current?.focus()}
                            />
                        </View>
                    </View>

                    <Input
                        ref={middleNameRef}
                        label="Middle Name"
                        placeholder="Middle name (optional)"
                        value={middleName}
                        onChangeText={(text) => setMiddleName(text)}
                        autoCapitalize="words"
                        returnKeyType="next"
                        onSubmitEditing={() => lastNameRef.current?.focus()}
                    />

                    <Input
                        ref={lastNameRef}
                        label="Last Name"
                        placeholder="Last name"
                        value={lastName}
                        onChangeText={(text) => {
                            setLastName(text);
                            setLastNameError('');
                        }}
                        error={lastNameError}
                        autoCapitalize="words"
                        returnKeyType="next"
                        onSubmitEditing={() => emailRef.current?.focus()}
                    />

                    <View style={styles.genderContainer}>
                        <Text style={styles.label}>Gender</Text>
                        <View style={[styles.pickerWrapper, genderError && styles.inputError]}>
                            <Picker
                                selectedValue={gender}
                                onValueChange={(itemValue) => {
                                    setGender(itemValue);
                                    setGenderError('');
                                }}
                                style={styles.picker}
                                mode="dropdown"
                                dropdownIconColor={colors.text.primary}>
                                <Picker.Item label="Select Gender" value="Select Gender" />
                                <Picker.Item label="Male" value="Male" />
                                <Picker.Item label="Female" value="Female" />
                                <Picker.Item label="Other" value="Other" />
                            </Picker>
                        </View>
                        {genderError && <Text style={styles.errorText}>{genderError}</Text>}
                    </View>

                    <Input
                        ref={emailRef}
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
                        returnKeyType="next"
                        onSubmitEditing={() => mobileRef.current?.focus()}
                    />

                    <Input
                        ref={mobileRef}
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
                        returnKeyType="next"
                        onSubmitEditing={() => idNumberRef.current?.focus()}
                    />

                    <View style={styles.nameRow}>
                        <View style={styles.idTypeContainer}>
                            <Text style={styles.label}>ID Type</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    selectedValue={idType}
                                    onValueChange={(itemValue) => setIdType(itemValue)}
                                    style={styles.picker}
                                    mode="dropdown"
                                    dropdownIconColor={colors.text.primary}>
                                    <Picker.Item label="Aadhar Card" value="Aadhar Card" />
                                    <Picker.Item label="PAN Card" value="PAN Card" />
                                    <Picker.Item label="Voter ID" value="Voter ID" />
                                    <Picker.Item label="Passport" value="Passport" />
                                    <Picker.Item label="Driving License" value="Driving License" />
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.idNumberContainer}>
                            <Input
                                ref={idNumberRef}
                                label="ID Number"
                                placeholder={`Enter ${idType} number`}
                                value={idNumber}
                                onChangeText={(text) => {
                                    setIdNumber(text);
                                    setIdNumberError('');
                                }}
                                error={idNumberError}
                                returnKeyType="done"
                                onSubmitEditing={handleSendOTP}
                            />
                        </View>
                    </View>

                    <Button
                        title={isLoading && !isOtpSent ? "Sending..." : "Send OTP"}
                        onPress={handleSendOTP}
                        loading={isLoading}
                        style={styles.button}
                        disabled={isLoading}
                    />

                    {isOtpSent && (
                        <>
                            <Text style={styles.statusText}>* OTP sent to mobile number</Text>

                            <Input
                                ref={otpRef}
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
                                returnKeyType="done"
                                onSubmitEditing={handleValidateOTP}
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
        </KeyboardAvoidingView >
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
        // backgroundColor: colors.white,
        // borderRadius: 12,
        padding: spacing.md,
        // shadowColor: colors.shadow,
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 8,
        // elevation: 3,
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
    nameRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    prefixContainer: {
        width: 100,
    },
    firstNameContainer: {
        flex: 1,
    },
    idTypeContainer: {
        flex: 1.2,
    },
    idNumberContainer: {
        flex: 2,
    },
    genderContainer: {
        marginBottom: spacing.md,
    },
    inputError: {
        borderColor: colors.error,
    },
    errorText: {
        color: colors.error,
        fontSize: typography.fontSize.xs,
        marginTop: spacing.xs,
    },
    label: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    pickerWrapper: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        height: 46,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    picker: {
        color: colors.text.primary,
        // height: 48,
        width: '100%',
        marginLeft: 4,
    },
});
