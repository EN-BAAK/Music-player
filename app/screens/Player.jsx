import { View, Text, StyleSheet, Dimensions } from "react-native";
import Screen from "../components/Screen";
import color from "../misc/color";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import PlayerButton from "../components/PlayerButton";
import { useContext, useEffect, useState } from "react";
import { AudioContext } from "../context/AudioProvider";
import {
    changeAudio,
    selectAudio,
    pause,
    resume,
} from "../misc/audioController";
import { convertTime } from "../misc/helper";

const { width } = Dimensions.get("window");

export default Player = () => {
    const context = useContext(AudioContext);
    const { playbackPosition, playbackDuration } = context;

    const calculateSeebBar = () => {
        if (playbackPosition !== null && playbackDuration !== null) {
            return playbackPosition / playbackDuration;
        }
        return 0;
    };
    const handlePlayPause = async () => {
        await selectAudio(context.currentAudio, context);
    };

    const handlePrevious = async () => {
        await changeAudio(context, "prev");
    };

    const handleNext = async () => {
        await changeAudio(context, "next");
    };

    useEffect(() => {
        context.loadPreviousAudio();
    }, []);

    if (!context.currentAudio) return null;

    return (
        <Screen>
            <View style={styles.container}>
                <Text style={styles.audioCount}>{`${
                    context.currentAudioIndex + 1
                } / ${context.totalAudioCount}`}</Text>
                <View style={styles.midBannerContainer}>
                    <MaterialCommunityIcons
                        name="music-circle"
                        size={300}
                        color={
                            context.isPlaying
                                ? color.ACTIVE_BG
                                : color.FONT_MEDIUM
                        }
                    />
                </View>
                <View style={styles.audioPlayerContainer}>
                    <Text numberOfLines={1} style={styles.audioTitle}>
                        {context.currentAudio.filename}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingHorizontal: 15,
                        }}
                    >
                        <Text>
                            {convertTime(context.currentAudio.duration)}
                        </Text>
                        <Text>
                            {context.playbackPosition
                                ? convertTime(context.playbackPosition / 1000)
                                : "00:00"}
                        </Text>
                    </View>
                    <Slider
                        style={{ width: width, height: 40 }}
                        minimumValue={0}
                        maximumValue={1}
                        value={calculateSeebBar()}
                        minimumTrackTintColor={color.FONT_MEDIUM}
                        maximumTrackTintColor={color.ACTIVE_BG}
                    />
                    <View style={styles.audioContainer}>
                        <PlayerButton
                            iconType="PREVIOUS"
                            onPress={handlePrevious}
                        />
                        <PlayerButton
                            onPress={handlePlayPause}
                            style={{ marginHorizontal: 25 }}
                            iconType={context.isPlaying ? "PLAY" : "PAUSE"}
                        />
                        <PlayerButton iconType="NEXT" onPress={handleNext} />
                    </View>
                </View>
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    audioCount: {
        textAlign: "right",
        padding: 15,
        fontSize: 14,
        color: color.FONT_LIGHT,
    },
    midBannerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    audioTitle: {
        padding: 15,
        fontSize: 16,
        color: color.FONT,
    },
    audioContainer: {
        width,
        paddingBottom: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
});
