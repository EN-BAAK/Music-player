import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";
import AudioProvider from "./app/context/AudioProvider";
import color from "./app/misc/color";

const myTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: color.App,
    },
};

export default function App() {
    return (
        <AudioProvider>
            <NavigationContainer theme={myTheme}>
                <AppNavigator />
            </NavigationContainer>
        </AudioProvider>
    );
}
