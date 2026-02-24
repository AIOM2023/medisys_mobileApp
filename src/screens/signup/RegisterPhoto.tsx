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
    Image,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Button } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { NavigationProp } from '../../navigation/types';

export const RegisterPhoto: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            const result = await request(PERMISSIONS.ANDROID.CAMERA);
            return result === RESULTS.GRANTED;
        }
        // For iOS if needed
        // const result = await request(PERMISSIONS.IOS.CAMERA);
        // return result === RESULTS.GRANTED;
        return true;
    };

    const handleCapturePhoto = async () => {
        const hasPermission = await requestCameraPermission();

        if (!hasPermission) {
            Alert.alert(
                'Permission Denied',
                'Camera permission is required to take a photo. Please enable it in settings.'
            );
            return;
        }

        try {
            const image = await ImagePicker.openCamera({
                width: 300,
                height: 300,
                cropping: true,
                useFrontCamera: true,
            });
            setCapturedImage(image.path);
        } catch (error: any) {
            if (error.code !== 'E_PICKER_CANCELLED') {
                console.log('Camera Error:', error);
                Alert.alert('Error', 'Failed to open camera');
            }
        }
    };

    const handleSelectFromGallery = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 300,
                height: 300,
                cropping: true,
                multiple: false,
                mediaType: 'photo',
            });
            setCapturedImage(image.path);
        } catch (error: any) {
            if (error.code !== 'E_PICKER_CANCELLED') {
                console.log('Gallery Error:', error);
                Alert.alert('Error', 'Failed to open gallery');
            }
        }
    };

    const handleUploadPhoto = () => {
        if (!capturedImage) {
            return;
        }
        setIsLoading(true);
        // Simulate registration step
        setTimeout(() => {
            setIsLoading(false);
            // Photo "uploaded"
            navigation.navigate('Home'); // Navigate to the next screen after upload
        }, 1500);
    };

    const handleNext = () => {
        navigation.navigate('Home');
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
                    <Text style={styles.title}>Take a photo for profile image</Text>
                </View>

                <View style={styles.cameraContainer}>
                    {capturedImage ? (
                        <Image source={{ uri: capturedImage }} style={styles.previewImage} />
                    ) : (
                        <TouchableOpacity style={styles.cameraPlaceholder} onPress={handleCapturePhoto}>
                            <Text style={styles.cameraIcon}>📷</Text>
                            <Text style={styles.cameraText}>camera to capture the face photo</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.footer}>
                    {capturedImage ? <Button
                        title="Take Photo"
                        onPress={handleCapturePhoto}
                        style={styles.button}
                        variant={capturedImage ? "outline" : "primary"}
                    /> : null}

                    <Button
                        title="Choose from Gallery"
                        onPress={handleSelectFromGallery}
                        style={styles.button}
                        variant={capturedImage ? "outline" : "primary"}
                    />

                    {capturedImage ? <Button
                        title="Upload"
                        onPress={handleUploadPhoto}
                        style={styles.button}
                    /> : null}

                    <Button
                        title="Next"
                        onPress={handleNext}
                        style={[styles.button, !capturedImage && { marginTop: spacing.md }]}
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
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    logoContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    logoIcon: {
        fontSize: 30,
    },
    title: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.primary,
        textAlign: 'center',
    },
    cameraContainer: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: colors.white,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.xl,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cameraPlaceholder: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    cameraIcon: {
        fontSize: 50,
        marginBottom: spacing.md,
    },
    cameraText: {
        fontSize: typography.fontSize.md,
        color: colors.text.secondary,
        textAlign: 'center',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    footer: {
        gap: spacing.md,
    },
    button: {
        width: '100%',
    },
});
