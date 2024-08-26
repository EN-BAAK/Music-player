import React from "react";
import {
    View,
    StyleSheet,
    Modal,
    TextInput,
    Dimensions,
    TouchableWithoutFeedback,
    Text,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import color from "../misc/color";

export default PlayListInputModal = ({ visible, onClose, onSubmit }) => {
    const [playListName, setPlayListName] = React.useState("");
    const handleOnSubmit = () => {
        if (!playListName.trim()) {
            onClose();
        } else {
            onSubmit(playListName);
            setPlayListName("");
            onClose();
        }
    };

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.inputContainer}>
                    <Text style={{ color: color.ACTIVE_BG, fontWeight: "600" }}>
                        Create New PlayList
                    </Text>
                    <TextInput
                        value={playListName}
                        onChangeText={(text) => setPlayListName(text)}
                        style={styles.input}
                    />
                    <AntDesign
                        name="check"
                        size={24}
                        color={color.ACTIVE_FONT}
                        style={styles.submitIcon}
                        onPress={handleOnSubmit}
                    />
                </View>
            </View>
            <TouchableWithoutFeedback onPress={onClose}>
                <View
                    style={[styles.modalBG, StyleSheet.absoluteFillObject]}
                ></View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    inputContainer: {
        backgroundColor: color.ACTIVE_FONT,
        width: width - 20,
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    input: {
        width: width - 40,
        borderBottomWidth: 1,
        borderBottomColor: color.BG,
    },
    submitIcon: {
        backgroundColor: color.ACTIVE_BG,
        marginTop: 30,
        padding: 10,
        borderRadius: 50,
    },
    modalBG: {
        backgroundColor: color.MODAL_BG,
        zIndex: -1,
    },
});
