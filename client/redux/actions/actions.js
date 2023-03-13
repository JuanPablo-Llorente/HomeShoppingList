// Dependencies
import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// Files
import {API_URL, API_KEY} from "@env";


export function register(values)
{
    return async function(dispatch)
    {
        const data = (await axios.post(`${API_URL}/register`, values)).data;
        
        return dispatch({type: "REGISTER", payload: data});
    };
};

export function login(values)
{
    return async function(dispatch)
    {
        const data = (await axios.post(`${API_URL}/login`, values)).data;
        
        return dispatch({type: "LOGIN", payload: data});
    };
};

export function getUsers()
{
    return async function(dispatch)
    {
        const data = (await axios(`${API_URL}/user?apiKey=${API_KEY}`)).data;
        
        return dispatch({type: "GET_USERS", payload: data});
    };
};

export function getProfile(userData, id)
{
    return async function(dispatch)
    {
        if(userData)
        {
            const userDataJson = JSON.parse(userData);
            const token = userDataJson.token;
            const config =
            {
                headers:
                {
                    authorization: `Bearer ${token}`,
                },
            };
            // const data = (await axios(`${API_URL}/user/:${id}`, values)).data;
            
            return dispatch({type: "LOGIN", payload: data});
        };
    };
};