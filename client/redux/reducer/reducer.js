const initialSate =
{
    user: {},
    users: [],
    familyGroups: [],
    shoppingLists: [],
};


function rootReducer(state = initialSate, {type, payload})
{
    switch(type)
    {
        case "REGISTER":
            return {...state};
        
        case "LOGIN":
            return {...state, user: payload};
        
        case "GET_USERS":
            return {...state, users: payload};
        
        default:
            return {...state};
    };
};


export default rootReducer;