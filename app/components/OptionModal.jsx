import {
    Modal,
    StatusBar,
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
} from "react-native";
import color from "../misc/color";

export default OptionModal = ({
    visible,
    currentItem,
    onclose,
    onPlayPress,
    onPlayListPress,
}) => {
    const { filename } = currentItem;

    return (
        <>
            <Modal animationType="slide" transparent visible={visible}>
                <View style={styles.modal}>
                    <Text style={styles.title} numberOfLines={1}>
                        {filename}
                    </Text>

                    <View style={styles.optionContainer}>
                        <TouchableWithoutFeedback onPress={onPlayPress}>
                            <Text style={styles.option}>Play</Text>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={onPlayListPress}>
                            <Text style={styles.option}>Add To Playlist</Text>
                        </TouchableWithoutFeedback>
                    </View>
                </View>

                <TouchableWithoutFeedback onPress={onclose}>
                    <View style={styles.modalBG} />
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    modal: {
        backgroundColor: color.APP_BG,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 1000,
    },
    optionContainer: {
        padding: 20,
    },
    title: {
        padding: 20,
        paddingBottom: 0,
        fontWeight: "600",
        fontSize: 18,
        color: color.FONT_MEDIUM,
    },
    option: {
        paddingVertical: 10,
        letterSpacing: 1,
        fontWeight: "600",
        fontSize: 16,
        color: color.FONT,
    },
    modalBG: {
        backgroundColor: color.MODAL_BG,
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
});
