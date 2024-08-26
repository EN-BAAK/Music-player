import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import color from "../misc/color";

export default Screen = ({ children }) => {
    return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: color.APP_BG,
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
});
