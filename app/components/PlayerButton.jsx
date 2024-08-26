import { AntDesign } from "@expo/vector-icons";
import color from "../misc/color";

export default PlayerButton = ({
    iconType,
    size = 40,
    iconColor = color.FONT,
    onPress,
    style,
}) => {
    const getIconName = (type) => {
        switch (type) {
            case "PLAY":
                return "pausecircle";
            case "PAUSE":
                return "playcircleo";
            case "NEXT":
                return "forward";
            case "PREVIOUS":
                return "banckward";
        }
    };

    return (
        <AntDesign
            onPress={onPress}
            name={getIconName(iconType)}
            size={size}
            color={iconColor}
            style={style}
        />
    );
};
