import React, { Component } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { AudioContext } from "../context/AudioProvider";
import { RecyclerListView, LayoutProvider } from "recyclerlistview";
import AudioListItems from "../components/AudioListItems";
import Screen from "../components/Screen";
import OptionModal from "../components/OptionModal";
import { selectAudio } from "../misc/audioController";

export class AudioList extends Component {
    static contextType = AudioContext;

    constructor(props) {
        super(props);

        this.state = {
            optionModalVisible: false,
        };

        this.currentItem = {};
    }

    handleAudioPress = async (audio) => {
        await selectAudio(audio, this.context);
        //     const { soundObj, playbackObj, currentAudio, updateState, audioFiles } =
        //         this.context;

        //     // Playing Audio For The First Time
        //     if (soundObj === null) {
        //         const playbackObj = new Audio.Sound();
        //         const status = await play(playbackObj, audio.uri);
        //         const index = audioFiles.indexOf(audio);

        //         updateState(this.context, {
        //             currentAudio: audio,
        //             playbackObj: playbackObj,
        //             soundObj: status,
        //             isPlaying: true,
        //             currentAudioIndex: index,
        //         });
        //         playbackObj.setOnPlaybackStatusUpdate(
        //             this.context.onPlaybackStatusUpdate
        //         );

        //         return storeAudioForNextOpening(audio, index);
        //     }

        //     // Pause Audio
        //     if (
        //         soundObj.isLoaded &&
        //         soundObj.isPlaying &&
        //         currentAudio.id === audio.id
        //     ) {
        //         const status = await pause(playbackObj);

        //         return updateState(this.context, {
        //             soundObj: status,
        //             isPlaying: false,
        //         });
        //     }

        //     // Resume Audio
        //     if (
        //         soundObj.isLoaded &&
        //         !soundObj.isPlaying &&
        //         currentAudio.id === audio.id
        //     ) {
        //         const status = await resume(playbackObj);

        //         return updateState(this.context, {
        //             soundObj: status,
        //             isPlaying: true,
        //         });
        //     }

        //     // Select Another Audio
        //     await playbackObj.stopAsync();
        //     await playbackObj.unloadAsync();

        //     const status = await play(playbackObj, audio.uri);
        //     const index = audioFiles.indexOf(audio);

        //     updateState(this.context, {
        //         currentAudio: audio,
        //         playbackObj: playbackObj,
        //         soundObj: status,
        //         isPlaying: true,
        //         currentAudioIndex: index,
        //     });
        //     return storeAudioForNextOpening(audio, index);
    };

    layoutProvider = new LayoutProvider(
        (i) => "audio",
        (type, dim) => {
            //+ type (Optional)
            //! dim => dimension
            dim.width = Dimensions.get("window").width;
            dim.height = 70;
        }
    );

    componentDidMount() {
        this.context.loadPreviousAudio();
    }

    rowRenderer = (type, item, index, extendedState) => {
        //+ type (Optional)
        return (
            <AudioListItems
                title={item.filename}
                duration={item.duration}
                onAudioPress={() => this.handleAudioPress(item)}
                onOptionPress={() => {
                    this.currentItem = item;
                    this.setState({ ...this.state, optionModalVisible: true });
                }}
                isPlaying={extendedState.isPlaying}
                activeListItem={this.context.currentAudioIndex === index}
            />
        );
    };

    render() {
        return (
            <AudioContext.Consumer>
                {({ dataProvider, isPlaying }) => {
                    if (!dataProvider._data.length) return null;
                    return (
                        <Screen>
                            <RecyclerListView
                                dataProvider={dataProvider}
                                layoutProvider={this.layoutProvider}
                                rowRenderer={this.rowRenderer}
                                extendedState={{ isPlaying }}
                            />
                            <OptionModal
                                currentItem={this.currentItem}
                                visible={this.state.optionModalVisible}
                                onclose={() =>
                                    this.setState({
                                        ...this.state,
                                        optionModalVisible: false,
                                    })
                                }
                                onPlayPress={() => console.log("Play Audio")}
                                onPlayListPress={() => {
                                    this.context.updateState(this.context, {
                                        addToPlayList: this.currentItem,
                                    });
                                    this.props.navigation.navigate("PlayList");
                                }}
                            />
                        </Screen>
                    );
                }}
            </AudioContext.Consumer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    audioItems: {
        padding: 10,
        borderBottomWidth: 2,
        borderBottomColor: "red",
    },
});

export default AudioList;
