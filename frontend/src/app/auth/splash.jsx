import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";
import { useVendorAuthStore } from "../../store/vendorAuthStore";

const FestoraSplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const navigation = useNavigation();
  const {user,checkAuth} = useAuthStore();
  const {vendor} = useVendorAuthStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      setIsVisible(false);
      if(user) navigation.replace("home");
      
      if(vendor) navigation.replace("vendorHome");
      navigation.replace("roleSelection");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const LoadingDots = () => {
    const dot1 = useRef(new Animated.Value(0.5)).current;
    const dot2 = useRef(new Animated.Value(0.5)).current;
    const dot3 = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
      const animateDots = () => {
        Animated.sequence([
          Animated.timing(dot1, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot1, {
            toValue: 0.5,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot2, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot2, {
            toValue: 0.5,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot3, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot3, {
            toValue: 0.5,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => animateDots());
      };
      animateDots();
    }, []);

    useEffect(()=>{
      checkAuth();
    },[])

    return (
      <View style={styles.loadingContainer}>
        <Animated.View style={[styles.dot, { opacity: dot1 }]} />
        <Animated.View style={[styles.dot, { opacity: dot2 }]} />
        <Animated.View style={[styles.dot, { opacity: dot3 }]} />
      </View>
    );
  };

  if (!isVisible) {
    return null; 
  }

  return (
    <View style={styles.splashContainer}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Image
              source={require("../../assets/festora icon.jpeg")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>

        <Text style={styles.appTitle}>FESTORA</Text>
        <Text style={styles.appSubtitle}>Plan it, Price it, Perfect it.</Text>

        <LoadingDots />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#ff6b6b",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    alignItems: "center",
    justifyContent: "center",
  },

  logoContainer: {
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },

  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },

  logoImage: {
    width: "100%",
    height: "100%",
  },

  appTitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    letterSpacing: 3,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },

  appSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "300",
    marginBottom: 40,
    letterSpacing: 1,
    textAlign: "center",
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
    marginHorizontal: 6,
  },
});

export default FestoraSplashScreen;
