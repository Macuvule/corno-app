import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { StyleSheet } from "react-native";
import FlashMessage from "react-native-flash-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Splash_Screen from "./splash";

import '../global.css';

export const unstable_settings = {
    initialRouteName: "(app)",
}


SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
    duration: 500,
    fade: true,
});

export default function RootLayout (){

    const [appReady, setAppReady] = React.useState(false);
    const [splashFinished, setSplashFinished] = React.useState(false);


   React.useEffect(() => {
    async function prepareApp() {
        try {
        // initializeDatabase(); seedDatabase(); ...
        } finally {
        setAppReady(true);
        }
    }
    prepareApp();
    }, []);

    const handleSplashComplete = React.useCallback(()=>{
        setSplashFinished(true);
    }, []);

    const isAppReady = appReady && splashFinished;

    if (!isAppReady){
        return(
            <Splash_Screen
                onComplete={handleSplashComplete}
            />
        )
    }
        return(
            <Providers>
                <Stack
                    screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "#f8fbea" },
                    }}
                >
                    <Stack.Screen name="(app)" options={{headerShown: false}} />
                    <Stack.Screen name="onboarding" options={{headerShown: false}} />
                </Stack>
            </Providers>
        );
}

function Providers({
    children,
}:{
    children: React.ReactNode;
}){
    return (
        <GestureHandlerRootView 
        style={styles.container} 
        >
            <SafeAreaProvider>
                <StatusBar style="dark"/>
                <KeyboardProvider>
                    <BottomSheetModalProvider>
                        {children}
                        <FlashMessage position="top" />
                    </BottomSheetModalProvider>
                </KeyboardProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },  
 })