// Dependencies
import React, {useState, useEffect, useRef} from "react";
import {View, Text, TouchableOpacity, ScrollView} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import {Picker} from '@react-native-picker/picker';
import Icon from "react-native-vector-icons/Entypo";
// Files
import {register, getUsers} from "../../redux/actions/actions";
import Header from "../Header/Header";
import CustomInput from "../CustomInput/CustomInput";
import Loader from "../Loader/Loader";
import styles from "./LoginStyles";


function Login()
{
    const dispatch = useDispatch();
    const navigation = useNavigation();
    
    const users = useSelector(state => state.users);
    
    const [input, setInput] = useState({
        name: "",
        lastName: "",
        userName: "",
        familyRole: "",
        email: "",
        password: "",
        repeatPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [validForm, setValidForm] = useState(false);
    
    // Show or hide password
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatedPassword, setShowRepeatedPassword] = useState(false);
    // Icons for show password
    const showPasswordIcon = <Icon style={styles.Icon} name="eye" onPress={handleShowPassword} />;
    const hidePasswordIcon = <Icon style={styles.Icon} name="eye-with-line" onPress={handleShowPassword}/>;
    const showRepeatedPasswordIcon = <Icon style={styles.Icon} name="eye" onPress={handleShowRepeatedPassword} />;
    const hideRepeatedPasswordIcon = <Icon style={styles.Icon} name="eye-with-line" onPress={handleShowRepeatedPassword} />;
    
    // Inputs refs
    const nameRef = useRef();
    const lastNameRef = useRef();
    const userNameRef = useRef();
    const familyRoleRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const repeatPasswordRef = useRef();
    
    // useEffect(() => dispatch(getUsers()), [dispatch]);
    useEffect(() => handleEnableSubmit(), [handleInputChange]);
    
    function handleInputChange(event, inputName)
    {
        setInput({...input, [inputName] : event.text});
        setErrors(validateInputs({...input, [inputName] : event.text}));
    };
    
    function handleFilledInput(name)
    {
        if(input[name].trim() !== "")
        {
            return true;
        }
        else
        {
            return false;
        };
    };
    
    function handleNavigate()
    {
        navigation.navigate("Login");
    };
    
    function handleShowPassword()
    {
        setShowPassword(!showPassword);
    };
    
    function handleShowRepeatedPassword()
    {
        setShowRepeatedPassword(!showRepeatedPassword);
    };
    
    function validateInputs(input)
    {
        const errors = {};
        const users = ["juampi.llorente@gmail.com", "asdksah"];
        const foundEmail = users.filter(e => e === input.email);
        const regExp= /^[^]+@[^ ]+\.[a-z]{2,3}$/;
        const verifyEmail = regExp.test(input.email);
        
        if(!input.name)
        {
            errors.name = true;
        }
        else if(!input.lastName)
        {
            errors.lastName = true;
        }
        else if(!input.userName)
        {
            errors.userName = true;
        }
        else if(!input.familyRole)
        {
            errors.familyRole = true;
        }
        else if(foundEmail.length)
        {
            errors.email = <Text style={styles.InvalidInputText}>This email is already in use. Please try another.</Text>;
        }
        else if(!verifyEmail)
        {
            errors.email = <Text style={styles.InvalidInputText}>Enter a valid email.</Text>;
        }
        else if(input.password.length < 6)
        {
            errors.password = <Text style={styles.InvalidInputText}>Password must be at least 8 characters.</Text>;
        }
        else if(input.password !== input.repeatPassword)
        {
            errors.repeatPassword = <Text style={styles.InvalidInputText}>Passwords do not match.</Text>;
        }
        
        return errors;
    };
    
    function handleEnableSubmit()
    {
        if(!Object.keys(errors).length)
        {
            setValidForm(true);
        }
        else
        {
            setValidForm(false);
        };
    };
    
    function handleSubmit()
    {
        if(validForm)
        {
            dispatch(register(input)).then(dispatch(getUsers()));
            
            setInput({
                name: "",
                lastName: "",
                userName: "",
                familyRole: "",
                email: "",
                password: "",
                repeatPassword: "",
            });
            
            // navigation.navigate("Login");
        }
        else
        {
            return false;
        };
    };
    
    return (
        <View style={styles.Container}>
            <ScrollView
                contentContainerStyle={styles.ScrollView}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.TitleContainer}>
                    <Text style={styles.Title}>Complete these fields to have your account.</Text>
                </View>
                
                <CustomInput
                    type="text"
                    placeholder="Name"
                    actualRef={nameRef}
                    nextRef={lastNameRef}
                    inputName={"name"}
                    handleInputChange={handleInputChange}
                    handleFilledInput={handleFilledInput}
                    password={false}
                />
                
                <CustomInput
                    type="text"
                    placeholder="Last name"
                    actualRef={lastNameRef}
                    nextRef={userNameRef}
                    inputName={"lastName"}
                    handleInputChange={handleInputChange}
                    handleFilledInput={handleFilledInput}
                    password={false}
                />
                
                <CustomInput
                    type="text"
                    placeholder="Username"
                    actualRef={userNameRef}
                    nextRef={emailRef}
                    inputName={"userName"}
                    handleInputChange={handleInputChange}
                    handleFilledInput={handleFilledInput}
                    password={false}
                />
                
                <View style={input.familyRole === "" ? styles.PickerContainer : styles.ActivePickerContainer}>
                    <Picker
                        style={styles.PickerInput}
                        ref={familyRoleRef}
                        onValueChange={(value) => setInput({...input, "familyRole" : value})}
                        selectedValue={input.familyRole}
                        mode="dropdown"
                    >
                        <Picker.Item style={styles.PickerDisabledLabel} label="Select your family role" value={null} enabled={false}/>
                        <Picker.Item style={styles.PickerLabel} label="Father" value="Father"/>
                        <Picker.Item style={styles.PickerLabel} label="Mother" value="Mother"/>
                        <Picker.Item style={styles.PickerLabel} label="Son" value="Son"/>
                        <Picker.Item style={styles.PickerLabel} label="Daughter" value="Daughter"/>
                    </Picker>
                </View>
                
                <CustomInput
                    type="email-address"
                    placeholder="Email"
                    actualRef={emailRef}
                    nextRef={passwordRef}
                    inputName={"email"}
                    handleInputChange={handleInputChange}
                    handleFilledInput={handleFilledInput}
                    password={false}
                />
                {
                    errors.email && errors.email
                }
                <CustomInput
                    type="text"
                    placeholder="Password"
                    actualRef={passwordRef}
                    nextRef={repeatPasswordRef}
                    inputName={"password"}
                    handleInputChange={handleInputChange}
                    handleFilledInput={handleFilledInput}
                    password={!showPassword ? true : false}
                    icon={true}
                    iconContent={!showPassword ? showPasswordIcon : hidePasswordIcon}
                />
                {
                    errors.password && errors.password
                }
                <CustomInput
                    type="text"
                    placeholder="Repeat password"
                    actualRef={repeatPasswordRef}
                    inputName={"repeatPassword"}
                    handleInputChange={handleInputChange}
                    handleFilledInput={handleFilledInput}
                    password={!showRepeatedPassword ? true : false}
                    icon={true}
                    iconContent={!showRepeatedPassword ? showRepeatedPasswordIcon : hideRepeatedPasswordIcon}
                />
                {
                    errors.repeatPassword && errors.repeatPassword
                }
                
                <View style={styles.RegisterContainer}>
                    <TouchableOpacity
                        style={validForm ? styles.RegisterButton : styles.DisabledRegisterButton}
                        activeOpacity={0.8}
                        disabled={!validForm}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.RegisterText}>Login</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.LoginContainer}>
                    <Text style={styles.LoginText}>
                        You already have an account?{"\n"}
                        <Text style={styles.LoginLink} onPress={handleNavigate}>Log in</Text>
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};


export default Login;