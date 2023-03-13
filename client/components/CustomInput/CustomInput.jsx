// Dependencies
import React, {useState, useEffect} from "react";
import {StyleSheet, View, TextInput, Animated} from "react-native";
// Files


function CustomInput({type, placeholder, actualRef, nextRef, inputName, handleInputChange, handleFilledInput, password, icon, iconContent})
{
    const [inputFocus, setInputFocus] = useState(false);
    const [blurOnSubmitState, setBlurOnSubmitState] = useState(false);
    const inputIsFocused = new Animated.Value(0);
    
    useEffect(() => {
        Animated.timing(inputIsFocused, {
            toValue: inputFocus ? 1 : 0,
            duration: 270,
            useNativeDriver: false,
        }).start();
    }, [inputFocus]);
    
    function handleInputFocus()
    {
        const filledInput = handleFilledInput(inputName);
        
        if(filledInput)
        {
            setInputFocus(true);
        }
        else
        {
            if(!inputFocus)
            {
                setInputFocus(true);
            }
            else
            {
                setInputFocus(false);
            };
        };
    };
    
    function handleNextInputFocus()
    {
        if(nextRef)
        {
            return nextRef.current.focus();
        }
        else
        {
            setBlurOnSubmitState(true);
            return null;
        };
    };
    
    const styles = StyleSheet.create({
        Container:
        {
            width: "80%",
            height: 80,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
        },
        Input:
        {
            width: "100%",
            height: 40,
            borderBottomColor: "#4F4F4F",
            borderBottomWidth: 2,
            fontSize: 18,
        },
        ActiveInput:
        {
            width: "100%",
            height: 40,
            borderBottomColor: "#6200EE",
            borderBottomWidth: 2,
            fontSize: 18,
        },
        InputPlaceholder:
        {
            position: "absolute",
            left: 0,
            top: inputIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0],
            }),
            fontSize: inputIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 15],
            }),
            color: inputIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: ["gray", "#6200EE"],
            }),
        },
        InvalidInput:
        {
            width: "100%",
            height: 40,
            borderBottomColor: "red",
            borderBottomWidth: 2,
            fontSize: 18,
        },
        IconContainer:
        {
            position: "absolute",
            top: 30,
            right: 10,
        },
    });
    
    return (
        <View style={styles.Container}>
            <Animated.Text style={styles.InputPlaceholder}>
                {placeholder}
            </Animated.Text>
            
            <TextInput
                cursorColor="#6200EE"
                style={inputFocus ? styles.ActiveInput : styles.Input}
                keyboardType={type}
                ref={actualRef}
                returnKeyType="done"
                blurOnSubmit={blurOnSubmitState}
                onChange={({nativeEvent}) => handleInputChange(nativeEvent, inputName)}
                onFocus={handleInputFocus}
                onEndEditing={handleInputFocus}
                onSubmitEditing={handleNextInputFocus}
                secureTextEntry={password}
            />
            
            <View style={styles.IconContainer}>
                {
                    icon ? iconContent : null
                }
            </View>
        </View>
    );
};


export default CustomInput;