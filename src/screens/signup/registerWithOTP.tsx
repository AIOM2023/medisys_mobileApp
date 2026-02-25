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
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import { Input, Button, Dropdown } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { NavigationProp } from '../../navigation/types';

export const RegisterWithOTP: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    const [fname, setFname] = useState('');
    const [mname, setMname] = useState('');
    const [lname, setLname] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [countryCode, setCountryCode] = useState<CountryCode>('IN');
    const [callingCode, setCallingCode] = useState('91');
    const [mobile, setMobile] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [documentNumber, setDocumentNumber] = useState('');
    const [otp, setOtp] = useState('');

    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpLoading, setIsOtpLoading] = useState(false);

    const [nameError, setNameError] = useState('');
    const [genderError, setGenderError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [documentTypeError, setDocumentTypeError] = useState('');
    const [documentNumberError, setDocumentNumberError] = useState('');
    const [otpError, setOtpError] = useState('');

    const genderOptions = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
    ];

    const documentTypeOptions = [
        { label: 'Aadhar Card', value: 'aadhar' },
        { label: 'PAN Card', value: 'pan' },
        { label: 'Driving Licence', value: 'driving_licence' },
    ];

    const onSelectCountry = (country: Country) => {
        setCountryCode(country.cca2);
        setCallingCode(country.callingCode[0]);
    };

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

    const formatDocumentNumber = (text: string, type: string) => {
        if (type === 'aadhar') {
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
        } else if (type === 'pan') {
            // PAN format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)
            const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
            return cleaned.slice(0, 10);
        } else if (type === 'driving_licence') {
            // Driving Licence format varies, allow alphanumeric
            const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
            return cleaned.slice(0, 16);
        }
        return text;
    };

    const getDocumentPlaceholder = (type: string) => {
        switch (type) {
            case 'aadhar':
                return 'Enter 12-digit Aadhar number';
            case 'pan':
                return 'Enter 10-character PAN number';
            case 'driving_licence':
                return 'Enter Driving Licence number';
            default:
                return 'Enter document number';
        }
    };

    const getDocumentMaxLength = (type: string) => {
        switch (type) {
            case 'aadhar':
                return 14; // 12 digits + 2 spaces
            case 'pan':
                return 10;
            case 'driving_licence':
                return 16;
            default:
                return 20;
        }
    };

    const handleSendOTP = () => {
        let isValid = true;

        // Reset errors
        setNameError('');
        setGenderError('');
        setEmailError('');
        setMobileError('');
        setDocumentTypeError('');
        setDocumentNumberError('');

        if (!fname) {
            setNameError('First Name is required');
            isValid = false;
        }
        if (!mname) {
            setNameError('Middle Name is required');
            isValid = false;
        }
        if (!lname) {
            setNameError('Last Name is required');
            isValid = false;
        }
        if (!gender) {
            setGenderError('Gender is required');
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
        if (!documentType) {
            setDocumentTypeError('Document type is required');
            isValid = false;
        }
        if (!documentNumber) {
            setDocumentNumberError('Document number is required');
            isValid = false;
        } else {
            // Validate based on document type
            if (documentType === 'aadhar' && documentNumber.replace(/\s/g, '').length !== 12) {
                setDocumentNumberError('Aadhar number must be 12 digits');
                isValid = false;
            } else if (documentType === 'pan' && documentNumber.length !== 10) {
                setDocumentNumberError('PAN number must be 10 characters');
                isValid = false;
            } else if (documentType === 'driving_licence' && documentNumber.length < 8) {
                setDocumentNumberError('Please enter a valid Driving Licence number');
                isValid = false;
            }
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
            navigation.navigate('RegisterDetails', { name: `${fname} ${mname} ${lname}` });
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
                        label="First Name"
                        placeholder="Enter your first name"
                        value={fname}
                        onChangeText={(text) => {
                            setFname(text);
                            setNameError('');
                        }}
                        error={nameError}
                        autoCapitalize="words"
                    />
                    <Input
                        label="Middle Name"
                        placeholder="Enter your middle name"
                        value={mname}
                        onChangeText={(text) => {
                            setMname(text);
                            setNameError('');
                        }}
                        error={nameError}
                        autoCapitalize="words"
                    />
                    <Input
                        label="Last Name"
                        placeholder="Enter your last name"
                        value={lname}
                        onChangeText={(text) => {
                            setLname(text);
                            setNameError('');
                        }}
                        error={nameError}
                        autoCapitalize="words"
                    />

                    <Dropdown
                        label="Gender"
                        placeholder="Select your gender"
                        value={gender}
                        options={genderOptions}
                        onSelect={(value) => {
                            setGender(value);
                            setGenderError('');
                        }}
                        error={genderError}
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

                    <View>
                        <Text style={styles.label}>Mobile</Text>
                        <View style={styles.mobileContainer}>
                            <TouchableOpacity style={styles.countryPickerButton}>
                                <CountryPicker
                                    countryCode={countryCode}
                                    withFilter
                                    withFlag
                                    withCallingCode
                                    withEmoji
                                    withCallingCodeButton
                                    onSelect={onSelectCountry}
                                    containerButtonStyle={styles.countryPickerContainer}
                                />
                                {/* <Text style={styles.callingCodeText}>+{callingCode}</Text> */}
                            </TouchableOpacity>
                            <View style={styles.mobileInputWrapper}>
                                <Input
                                    label=""
                                    placeholder="Enter mobile number"
                                    value={mobile}
                                    onChangeText={(text) => {
                                        const formatted = formatMobile(text);
                                        setMobile(formatted);
                                        setMobileError('');
                                    }}
                                    error=""
                                    keyboardType="phone-pad"
                                    maxLength={12} // 10 digits + 2 hyphens
                                    style={styles.mobileInput}
                                />
                            </View>
                        </View>
                        {mobileError ? <Text style={styles.errorText}>{mobileError}</Text> : null}
                    </View>

                    <Dropdown
                        label="Document Type"
                        placeholder="Select document type"
                        value={documentType}
                        options={documentTypeOptions}
                        onSelect={(value) => {
                            setDocumentType(value);
                            setDocumentNumber(''); // Reset document number when type changes
                            setDocumentTypeError('');
                            setDocumentNumberError('');
                        }}
                        error={documentTypeError}
                    />

                    {documentType && (
                        <Input
                            label="Document Number"
                            placeholder={getDocumentPlaceholder(documentType)}
                            value={documentNumber}
                            onChangeText={(text) => {
                                const formatted = formatDocumentNumber(text, documentType);
                                setDocumentNumber(formatted);
                                setDocumentNumberError('');
                            }}
                            error={documentNumberError}
                            keyboardType={documentType === 'aadhar' ? 'number-pad' : 'default'}
                            maxLength={getDocumentMaxLength(documentType)}
                            autoCapitalize={documentType === 'aadhar' ? 'none' : 'characters'}
                        />
                    )}

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
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    otpInput: {
        // marginTop: spacing.md,
        letterSpacing: 2,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 4,
        fontSize: typography.fontSize.md,
        color: colors.text.primary
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
    label: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    mobileContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        alignItems: 'center',
        height: 45,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        marginBottom: spacing.md,
    },
    countryPickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: colors.border,
        // borderRadius: 8,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
        backgroundColor: colors.white,
        minWidth: 100,
    },
    countryPickerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    callingCodeText: {
        fontSize: typography.fontSize.md,
        color: colors.text.primary,
        marginLeft: spacing.xs,
        fontWeight: typography.fontWeight.medium,
    },
    mobileInputWrapper: {
        flex: 1,
    },
    mobileInput: {
        top: -10,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 4,
        fontSize: typography.fontSize.md,
        color: colors.text.primary,
    },
    errorText: {
        fontSize: typography.fontSize.xs,
        color: colors.error,
        marginTop: spacing.xs,
    },
});
