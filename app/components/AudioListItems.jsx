import React from "react";
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableWithoutFeedback,
} from "react-native";
import { Entypo, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import color from "../misc/color";
import { convertTime } from "../misc/helper";

const getThumbnailText = (text) => text[0];

const renderPlayPauseIcon = (isPlaying) => {
    if (isPlaying) {
        return (
            <MaterialIcons name="pause" size={24} color={color.ACTIVE_FONT} />
        );
    }
    return <FontAwesome6 name="play" size={24} color={color.ACTIVE_FONT} />;
};

export default AudioListItem = ({
    title,
    duration,
    onOptionPress,
    onAudioPress,
    isPlaying,
    activeListItem,
}) => {
    return (
        <>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={onAudioPress}>
                    <View style={styles.leftContainer}>
                        <View
                            style={[
                                styles.thumbnail,
                                {
                                    backgroundColor: activeListItem
                                        ? color.ACTIVE_BG
                                        : color.FONT_LIGHT,
                                },
                            ]}
                        >
                            <Text style={styles.thumbnailText}>
                                {activeListItem
                                    ? renderPlayPauseIcon(isPlaying)
                                    : getThumbnailText(title)}
                            </Text>
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title} numberOfLines={1}>
                                {title}
                            </Text>
                            <Text style={styles.time}>
                                {convertTime(duration)}
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.rightContainer}>
                    <Entypo
                        onPress={onOptionPress}
                        name="dots-three-vertical"
                        size={20}
                        color={color.Font_MEDIUM}
                        style={{ padding: 10 }}
                    />
                </View>
            </View>
            <View style={styles.separator} />
        </>
    );
};

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        width: width - 20,
        flexDirection: "row",
        alignSelf: "center",
    },
    leftContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    rightContainer: {
        width: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    thumbnail: {
        backgroundColor: color.MODAL_BG,
        height: 50,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
    },
    thumbnailText: {
        width: 50,
        height: 50,
        lineHeight: 50,
        textAlign: "center",
        fontWeight: "600",
        fontSize: 22,
        color: color.FONT,
    },
    titleContainer: {
        width: width - 120,
        paddingLeft: 10,
    },
    title: {
        fontSize: 16,
        color: color.FONT,
    },
    time: {
        fontSize: 14,
        color: color.FONT_LIGHT,
    },
    separator: {
        backgroundColor: "#333",
        width: width - 60,
        height: 0.5,
        marginTop: 10,
        alignSelf: "center",
        opacity: 0.3,
    },
});
