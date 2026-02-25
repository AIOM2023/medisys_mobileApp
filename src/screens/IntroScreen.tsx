import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Animated,
    StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const { width, height } = Dimensions.get('window');

interface SlideData {
    id: string;
    title: string;
    description: string;
    image: any;
    backgroundColor: string[];
}

const SLIDES: SlideData[] = [
    {
        id: '1',
        title: 'Appointments',
        description:
            'Schedule and manage your medical appointments with ease. Get reminders and stay on top of your healthcare appointments.',
        image: require('../assets/images/appointment.jpg'),
        backgroundColor: ['#fff', '#0052CC'],
    },
    {
        id: '2',
        title: 'Telemedicine',
        description:
            'Connect with healthcare professionals from the comfort of your home. Video consultations anytime, anywhere.',
        image: require('../assets/images/telemedicine.png'),
        backgroundColor: ['#0052CC', '#0052CC'],
    },
    {
        id: '3',
        title: 'Medical History',
        description:
            'Keep all your medical records in one secure place. Access your history anytime you need it.',
        image: require('../assets/images/history.png'),
        backgroundColor: ['#0052CC', '#0052CC'],
    },
    {
        id: '4',
        title: 'AI Assistant',
        description:
            'Get instant health insights with our intelligent AI assistant. Available 24/7 for your health concerns.',
        image: require('../assets/images/ai-assistant.png'),
        backgroundColor: ['#0052CC', '#0052CC'],
    },
    {
        id: '5',
        title: 'Your Profile',
        description:
            'Manage your personal health information and preferences. Keep your profile updated for better care.',
        image: require('../assets/images/profile.jpg'),
        backgroundColor: ['#0052CC', '#0052CC'],
    },
];

interface SlideProps {
    slide: SlideData;
    index: number;
}

const Slide: React.FC<SlideProps> = ({ slide, index }) => {
    return (
        <View
            // colors={slide.backgroundColor}
            style={styles.slide}
        // start={{ x: 0, y: 0 }}
        // end={{ x: 1, y: 1 }}
        >
            <View style={styles.slideContent}>
                {/* Image Container */}
                <View style={styles.imageContainer}>
                    <Image
                        source={slide.image}
                        style={styles.slideImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Text Content */}
                <View style={styles.textContainer}>
                    <Text style={styles.slideTitle}>{slide.title}</Text>
                    <Text style={styles.slideDescription}>{slide.description}</Text>
                </View>
            </View>
        </View>
    );
};

interface PaginationProps {
    slides: SlideData[];
    activeIndex: number;
}

const Pagination: React.FC<PaginationProps> = ({ slides, activeIndex }) => {
    return (
        <View style={styles.paginationContainer}>
            {slides.map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.paginationDot,
                        {
                            backgroundColor:
                                index === activeIndex ? '#0052CC' : '#E0E0E0',
                            width: index === activeIndex ? 24 : 8,
                        },
                    ]}
                />
            ))}
        </View>
    );
};

interface LandingPageIntroProps {
    onComplete?: () => void;
}

const IntroScreen: React.FC<LandingPageIntroProps> = () => {
    const navigation = useNavigation<NavigationProp>();

    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const backButtonOpacity = useRef(new Animated.Value(0)).current;
    const backButtonScale = useRef(new Animated.Value(0.8)).current;
    const nextButtonScale = useRef(new Animated.Value(1)).current;

    const onComplete = () => {
        navigation.navigate('Login');
    }
    const handleNext = () => {
        // Scale animation on press
        Animated.sequence([
            Animated.timing(nextButtonScale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(nextButtonScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        if (activeIndex < SLIDES.length - 1) {
            const nextIndex = activeIndex + 1;
            setActiveIndex(nextIndex);
            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
        } else {
            onComplete?.();
        }
    };

    const handlePrev = () => {
        // Scale animation on press
        Animated.sequence([
            Animated.timing(backButtonScale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(backButtonScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        if (activeIndex > 0) {
            const prevIndex = activeIndex - 1;
            setActiveIndex(prevIndex);
            flatListRef.current?.scrollToIndex({
                index: prevIndex,
                animated: true,
            });
        }
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            const newIndex = viewableItems[0].index;
            setActiveIndex(newIndex);

            // Animate back button appearance
            if (newIndex === 0) {
                Animated.parallel([
                    Animated.timing(backButtonOpacity, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(backButtonScale, {
                        toValue: 0.8,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]).start();
            } else {
                Animated.parallel([
                    Animated.timing(backButtonOpacity, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(backButtonScale, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    return (
        <View style={styles.container}>
            <StatusBar barStyle={'dark-content'}  />
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={({ item, index }) => <Slide slide={item} index={index} />}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
            />

            <View style={styles.paginationWrapper}>
                <Pagination slides={SLIDES} activeIndex={activeIndex} />
            </View>

            <View style={styles.buttonContainer}>
                {activeIndex !== 0 && (
                    <Animated.View
                        style={{
                            flex: 1,
                            // opacity: backButtonOpacity,
                            // transform: [{ scale: backButtonScale }],
                        }}
                    >
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handlePrev}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}

                <Animated.View
                    style={{
                        flex: 1,
                        transform: [{ scale: nextButtonScale }],
                    }}
                >
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleNext}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>
                            {activeIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            <TouchableOpacity
                style={styles.skipButton}
                onPress={onComplete}
            >
                <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    slide: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slideContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    imageContainer: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    slideImage: {
        width: width * 0.8,
        height: width * 0.8,
    },
    textContainer: {
        flex: 0.5,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    slideTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#121212',
        marginBottom: 16,
        textAlign: 'center',
    },
    slideDescription: {
        fontSize: 16,
        fontWeight: '400',
        color: '#212121',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 12,
    },
    paginationWrapper: {
        position: 'absolute',
        bottom: 120,
        width: '100%',
        alignItems: 'center',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    paginationDot: {
        height: 8,
        borderRadius: 4,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        paddingHorizontal: 24,
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        height: 56,
        backgroundColor: '#0052CC',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    skipButton: {
        position: 'absolute',
        top: 16,
        right: 24,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    skipButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0052CC',
    },
});

export default IntroScreen;