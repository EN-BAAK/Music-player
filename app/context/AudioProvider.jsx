import React, { Component, createContext } from "react";
import { Alert, View, Text, StyleSheet } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { DataProvider } from "recyclerlistview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { anotherAudio } from "../misc/audioController";
import { storeAudioForNextOpening } from "../misc/helper";

export const AudioContext = createContext();
export default class AudioProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            audioFiles: [],
            playList: [],
            addToPlayList: null,
            permissionError: false,
            dataProvider: new DataProvider((r1, r2) => {
                //! r => row
                r1 !== r2;
            }),
            playbackObj: null,
            soundObj: null,
            currentAudio: {},
            isPlaying: false,
            currentAudioIndex: null,
            totalAudioCount: 0,
            playbackPosition: null,
            playbackDuration: null,
        };
    }

    loadPreviousAudio = async () => {
        let previousAudio = await AsyncStorage.getItem("previousAudio");
        let currentAudio, currentAudioIndex;

        if (previousAudio === null) {
            currentAudio = this.state.audioFiles[0];
            currentAudioIndex = 0;
        } else {
            previousAudio = JSON.parse(previousAudio);
            currentAudio = previousAudio.audio;
            currentAudioIndex = previousAudio.index;
        }

        this.setState({ ...this.state, currentAudio, currentAudioIndex });
    };

    permissionAlert = () => {
        Alert.alert(
            "Permission Required",
            "This App Needs To Read Audio Files!",
            [
                { text: "I Am Ready", onPress: () => this.getPermission() },
                { text: "Cancel", onPress: () => this.permissionAlert() },
            ]
        );
    };

    getAudioFiles = async () => {
        const { dataProvider, audioFiles } = this.state;
        //+ In This Code We Can Write The Next (media) Only But If
        //+ We Want To Use media.totalCount We Should Call The
        //+ media default Effect, Or Write (value: number).
        let media = await MediaLibrary.getAssetsAsync({
            mediaType: "audio",
        });
        //+ Give You A Total Media.
        media = await MediaLibrary.getAssetsAsync({
            mediaType: "audio",
            first: media.totalCount, //! Set How Many Item You Want To Display.
        });
        this.totalAudioCount = media.totalCount;

        this.setState({
            ...this.state,
            dataProvider: dataProvider.cloneWithRows([
                ...audioFiles,
                ...media.assets,
            ]),
            audioFiles: [...audioFiles, ...media.assets],
        });
    };

    getPermission = async () => {
        const permission = await MediaLibrary.getPermissionsAsync();
        if (permission.granted) {
            this.getAudioFiles();
        }

        if (!permission.canAskAgain && !permission.granted) {
            this.setState({ ...this.state, permissionError: true });
        }

        if (!permission.granted && permission.canAskAgain) {
            const { status, canAskAgain } =
                await MediaLibrary.requestPermissionsAsync();

            if (status === "denied" && canAskAgain) {
                this.permissionAlert();
            }

            if (status === "granted") {
                this.getAudioFiles();
            }

            if (status === "denied" && !canAskAgain) {
                this.setState({ ...this.state, permissionError: true });
            }
        }
    };

    onPlaybackStatusUpdate = async (playbackStatus) => {
        if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
            this.updateState(this, {
                playbackPosition: playbackStatus.positionMillis,
                playbackDuration: playbackStatus.durationMillis,
            });
        }

        if (playbackStatus.didJustFinish) {
            const nextAudioIndex = this.state.currentAudioIndex + 1;

            // There Is No Next Video To Play
            if (nextAudioIndex >= this.totalAudioCount) {
                this.state.playbackObj.unloadAsync();
                this.updateState(this, {
                    soundObj: null,
                    currentAudio: this.state.audioFiles[0],
                    isPlaying: false,
                    currentAudioIndex: 0,
                    playbackPosition: null,
                    playbackDuration: null,
                });

                return await storeAudioForNextOpening(
                    this.state.audioFiles[0],
                    0
                );
            }

            // There Is Next Video To Play
            const audio = this.state.audioFiles[nextAudioIndex];
            const status = await anotherAudio(
                this.state.playbackObj,
                audio.uri
            );

            this.updateState(this, {
                soundObj: status,
                currentAudio: audio,
                isPlaying: true,
                currentAudioIndex: nextAudioIndex,
            });

            return await storeAudioForNextOpening(
                this.state.audioFiles[nextAudioIndex],
                nextAudioIndex
            );
        }
    };

    componentDidMount() {
        this.getPermission();

        if (this.state.playbackObj === null) {
            this.setState({ ...this.state, playbackObj: new Audio.Sound() });
        }
    }

    updateState = (prevState, newState = {}) => {
        this.setState({ ...prevState, ...newState });
    };

    render() {
        const {
            audioFiles,
            dataProvider,
            permissionError,
            playbackObj,
            soundObj,
            currentAudio,
            isPlaying,
            currentAudioIndex,
            playbackPosition,
            playbackDuration,
            playList,
            addToPlayList,
        } = this.state;
        if (permissionError)
            return (
                <View style={styles.error}>
                    <Text>It Looks Like You Haven't Accept The Permission</Text>
                </View>
            );

        return (
            <AudioContext.Provider
                value={{
                    audioFiles,
                    dataProvider,
                    playbackObj,
                    soundObj,
                    currentAudio,
                    currentAudioIndex,
                    updateState: this.updateState,
                    isPlaying,
                    totalAudioCount: this.totalAudioCount,
                    playbackDuration,
                    playbackPosition,
                    loadPreviousAudio: this.loadPreviousAudio,
                    onPlaybackStatusUpdate: this.onPlaybackStatusUpdate,
                    playList,
                    addToPlayList,
                }}
            >
                {this.props.children}
            </AudioContext.Provider>
        );
    }
}

const styles = StyleSheet.create({
    error: {
        margin: 5,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
