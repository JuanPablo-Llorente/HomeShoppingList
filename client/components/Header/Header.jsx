// Dependencies
import React from "react";
import {View, Text, StatusBar} from "react-native";
// Files
import styles from "./HeaderStyles";


function Header({headerContent})
{
    return (
        <View style={styles.Container}>
            <Text>{headerContent}</Text>
        </View>
    );
};


export default Header;