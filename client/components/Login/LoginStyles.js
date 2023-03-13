// Dependencies
import {StyleSheet} from "react-native";


const styles = StyleSheet.create({
    Container:
    {
        width: "100%",
        height: "100%",
        display: "flex",
        // justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    TitleContainer:
    {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
        height: 100,
        marginTop: 60,
        // marginBottom: 20,
        // backgroundColor: "green",
    },
    Title:
    {
        fontSize: 22,
        textAlign: "center",
        fontWeight: "500",
    },
    ScrollView:
    {
        display: "flex",
        // justifyContent: "center",
        alignItems: "center",
        // width: 420,
        // height: "80%",
        minWidth: "100%",
        minHeight: "100%",
        // backgroundColor: "red",
    },
    FormContainer:
    {
        display: "flex",
        // justifyContent: "space-around",
        alignItems: "center",
        // width: 420,
        // height: "80%",
        minWidth: "100%",
        minHeight: "100%",
        // backgroundColor: "red",
    },
    PickerContainer:
    {
        width: "80%",
        height: 60,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderBottomColor: "black",
        borderBottomWidth: 2,
        marginBottom: 20,
    },
    ActivePickerContainer:
    {
        width: "80%",
        height: 60,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderBottomColor: "#6200EE",
        borderBottomWidth: 2,
        marginBottom: 20,
    },
    InvalidInputText:
    {
        fontSize: 14,
        color: "red",
        marginBottom: 15,
    },
    PickerInput:
    {
        width: "110%",
        height: 60,
    },
    PickerLabel:
    {
        fontSize: 18,
    },
    PickerDisabledLabel:
    {
        fontSize: 18,
        color: "gray",
    },
    Icon:
    {
        fontSize: 22,
    },
    RegisterContainer:
    {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
        height: 100,
        // marginTop: 10,
    },
    RegisterButton:
    {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 220,
        height: 55,
        backgroundColor: "#6200EE",
        borderRadius: 10,
    },
    DisabledRegisterButton:
    {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 220,
        height: 55,
        backgroundColor: "#6200EE80",
        borderRadius: 10,
    },
    RegisterText:
    {
        fontSize: 17,
        color: "#fff",
    },
    LoginContainer:
    {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 40,
        width: 400,
        marginTop: 20,
        marginBottom: 10,
    },
    LoginText:
    {
        fontSize: 14,
        textAlign: "center",
    },
    LoginLink:
    {
        color: "#6200EE",
    },
});


export default styles;