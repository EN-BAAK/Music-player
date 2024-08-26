import {
    View,
    Text,
    StyleSheet,
    Modal,
    FlatList,
    Dimensions,
    TouchableWithoutFeedback,
} from "react-native";
import color from "../misc/color";
import AudioListItems from "./AudioListItems";

export default PlayListDetail = ({ visible, playList, onClose }) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <Text style={styles.title}>{playList.title}</Text>
                <FlatList
                    contentContainerStyle={styles.listContainer}
                    data={playList.audios}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={{ marginBottom: 10 }}>
                            <AudioListItems
                                title={item.filename}
                                duration={item.duration}
                            />
                        </View>
                    )}
                />
            </View>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={[StyleSheet.absoluteFillObject, styles.modalBG]} />
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        width: width - 20,
        height: height - 150,
        alignSelf: "center",
        position: "absolute",
        bottom: 0,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
    },
    title: {
        paddingVertical: 5,
        textAlign: "center",
        fontWeight: "600",
        fontSize: 20,
        color: color.ACTIVE_BG,
    },
    modalBG: {
        backgroundColor: color.MODAL_BG,
        zIndex: -1,
    },
    listContainer: {
        padding: 20,
    },
});
