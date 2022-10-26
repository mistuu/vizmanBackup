import { StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Colors from "../Assets/Colors";

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    titleText: { fontSize: RFPercentage(5), color: Colors.white, margin: 5 },
    logo: { resizeMode: 'contain', padding: 24, width: '25%', aspectRatio: 1, alignSelf: 'center' },
    whiteHeading: { fontSize: RFPercentage(3.5), paddingLeft: 15, fontFamily: "poppins_regular", fontWeight: 'bold', color: Colors.white },
    textBox: { width: "95%", borderRadius: 5, backgroundColor: Colors.white, marginVertical: 5, alignSelf: 'center', borderWidth: 1, elevation: 1, borderColor: Colors.grayCCC },
    dropdownLabel: { fontSize: RFPercentage(2), color: 'green', paddingHorizontal: 10, },
    headding: { fontSize: RFPercentage(3), padding: 5, color: Colors.graye00, flex: 1, fontWeight: "bold", borderBottomWidth: 0.5 },
    subHeading: { fontSize: RFPercentage(2.6), padding: 5, color: Colors.gunMetalGrey, fontWeight: "700", alignSelf: 'flex-start' },
    answer: { fontSize: RFPercentage(2.6), padding: 5, color: Colors.GhostGrey, flex: 1, fontWeight: "600" },
    label: { fontSize: RFPercentage(2.6), padding: 5, color: Colors.white, flex: 1, fontWeight: "600" },
    notificationText: { fontSize: RFPercentage(2.2), padding: 5, color: Colors.gunMetalGrey, lineHeight: 20, flex: 1, fontWeight: "600" },
    card: { width: "95%", height: "98%", borderRadius: 10, backgroundColor: Colors.primary, elevation: 5, marginBottom: 10, alignSelf: 'center', alignItems: 'center', padding: 10 },
    complainBox: { width: "28%", aspectRatio: 1, justifyContent: 'center', backgroundColor: Colors.grayCCC, elevation: 10, margin: "2.6%", borderRadius: 10 },
    complainText: { alignSelf: 'center', color: Colors.gunMetalGrey1, fontSize: RFPercentage(2), textAlign: 'justify', padding: 3, },
    errorText: { width: "80%", color: Colors.red, fontSize: RFPercentage(2), paddingLeft: 10, alignSelf: 'flex-start' },
    imageBox: { resizeMode: 'stretch', height: 50, width: 50, alignSelf: 'center', tintColor: Colors.grayCCC },
    listInputBox: {
        fontFamily: "poppins_regular", width: '100%', borderBottomWidth: 0.7, fontSize: 17, color: '#000',
    },
    box: { flex: 1, backgroundColor: Colors.white, margin: 10, borderRadius: 10,aspectRatio:1 },
    boxText: { color: Colors.gunMetalGrey, padding: 7, fontSize: RFPercentage(2.2), textAlign: 'center' },
    boxNumberText: { color: Colors.primary, fontSize: RFPercentage(4.5), fontWeight: 'bold', textAlign: 'center' },
    smallBtnTouchableOpacityStyle: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10,
        borderRadius: 27.5,
        backgroundColor: Colors.white
    },
    smallBtnFloatingButtonStyle: {
        resizeMode: 'cover',
        width: 23,
        height: 23,
        alignSelf: 'center',
        tintColor: Colors.primary
        //backgroundColor:'black'
    },
    whiteButton: {
        backgroundColor: Colors.white,
        elevation: 10,
        aspectRatio: 7,
        marginVertical: 5,
        width: "95%",
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center'
    },
    blueBtnText: {
        color: Colors.white,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: RFPercentage(3)
    },
    blueButton: {
        backgroundColor: Colors.primary,
        aspectRatio: 5.5,
        marginVertical: 5,
        width: "95%",
        borderRadius: 5,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    whiteBtnText: {
        color: Colors.white,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: RFPercentage(3)
    },
    touchableOpacityStyle: {
        position: 'absolute',
        width: '15%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
        elevation: 10,
        borderRadius: 30,
        backgroundColor: Colors.primary
    },
    floatingButtonStyle: {
        resizeMode: 'contain',
        width: RFPercentage(4),
        height: RFPercentage(4),
        alignSelf: 'center',
        tintColor: Colors.white
        //backgroundColor:'black'
    },
});