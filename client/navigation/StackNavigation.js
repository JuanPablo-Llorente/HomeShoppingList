// Dependencies
import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
// Files
import Register from "../components/Register/Register";
import Login from "../components/Login/Login";


function StackNavigation()
{
    const Stack = createNativeStackNavigator();
    
    return (
        <Stack.Navigator
            screenOptions={{
                contentStyle: {
                    // backgroundColor: "#171b26",
                },
            }}
        >
            <Stack.Screen
                name="Register"
                component={Register}
                options={{
                    headerShown: false,
                    // animation: "slide_from_right",
                }}
            />
            
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    headerShown: false,
                    // animation: "slide_from_right",
                }}
            />
        </Stack.Navigator>
    );
};


export default StackNavigation;