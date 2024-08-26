import { useContext, useEffect, useState } from "react";
import {
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import color from "../misc/color";
import PlayListInputModal from "../components/PlayListInputModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AudioContext } from "../context/AudioProvider";
import PlayListDetail from "../components/PlayListDetail";

let selectedPlayList = {};

export default PlayList = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [showPlayList, setShowPlayList] = useState(false);

    const context = useContext(AudioContext);
    const { playList, addToPlayList, updateState } = context;

    const renderPlayList = async () => {
        const result = await AsyncStorage.getItem("playlist");

        if (result === null) {
            const defaultPlayList = {
                id: Date.now(),
                title: "My Favorite",
                audios: [],
            };

            const newPlayList = [...playList, defaultPlayList];

            updateState(context, { playList: [...newPlayList] });

            return await AsyncStorage.setItem(
                "playlist",
                JSON.stringify([...newPlayList])
            );
        }

        updateState(context, { playList: JSON.parse(result) });
    };
    const createPlayList = async (playListName) => {
        const result = await AsyncStorage.getItem("playlist");
        if (result !== null) {
            const audios = [];

            if (addToPlayList) {
                audios.push(addToPlayList);
            }

            const newList = {
                id: Date.now(),
                title: playListName,
                audios: audios,
            };

            const updatedList = [...playList, newList];

            updateState(context, {
                playList: updatedList,
                addToPlayList: null,
            });
            AsyncStorage.setItem("playList", JSON.stringify(updatedList));
        }
        setModalVisible(false);
    };

    const handleBannerPress = async (playList) => {
        // Update Play List If There Is Any Selected Audio.
        if (addToPlayList) {
            const result = await AsyncStorage.getItem("playList");

            let oldList = [];
            let updatedList = [];
            let sameAudio = false;

            if (result !== null) {
                oldList = JSON.parse(result);

                updatedList = oldList.filter((list) => {
                    if (list.id === playList.id) {
                        for (let audio of list.audios) {
                            if (audio.id === addToPlayList.id) {
                                // Alert With Some Message
                                sameAudio = true;
                                return;
                            }
                        }

                        // Update The PlayList If IT Doesn't Exist
                        list.audios = [...list.audios, addToPlayList];
                    }
                    return list;
                });
            }

            if (sameAudio) {
                Alert.alert(
                    "Found Same Audio",
                    `${addToPlayList.filename} Is Already In Play List`
                );
                sameAudio = false;
                return updateState(context, { addToPlayList: null });
            }

            updateState(context, {
                addToPlayList: null,
                playList: [...updatedList],
            });
            return AsyncStorage.setItem(
                "playlist",
                JSON.stringify([...updatedList])
            );
        }

        // If There Is No Audio Selected So We WIll Open This Play List
        selectedPlayList = playList;
        setShowPlayList(true);
    };
    useEffect(() => {
        if (!playList.length) {
            renderPlayList();
        }
    }, []);

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                {playList.length
                    ? playList.map((item) => (
                          <TouchableOpacity
                              key={item.id.toString()}
                              style={styles.playListBanner}
                              onPress={() => handleBannerPress(item)}
                          >
                              <Text>{item.title}</Text>
                              <Text style={styles.audioCount}>
                                  {item.audios.length > 1
                                      ? `${item.audios.length} Songs`
                                      : `${item.audios.length} Song`}
                              </Text>
                          </TouchableOpacity>
                      ))
                    : null}
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={{ marginTop: 15 }}
                >
                    <Text style={styles.playListBtn}>+ Add New Playlist</Text>
                </TouchableOpacity>
                <PlayListInputModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onSubmit={createPlayList}
                />
            </ScrollView>
            <PlayListDetail
                visible={showPlayList}
                playList={selectedPlayList}
                onClose={() => setShowPlayList(false)}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    playListBanner: {
        backgroundColor: "rgba(204,204,204,0.3)",
        marginBottom: 15,
        padding: 5,
        borderRadius: 5,
    },
    audioCount: {
        marginTop: 3,
        fontSize: 14,
        opacity: 0.5,
    },
    playListBtn: {
        padding: 5,
        letterSpacing: 1,
        fontWeight: "600",
        fontSize: 14,
        color: color.ACTIVE_BG,
    },
});
