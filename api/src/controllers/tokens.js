// Dependencies
const jwt = require("jsonwebtoken");
// Files
const {JWT_SECRET} = process.env


async function signToken(user)
{
    return jwt.sign(
        {
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
            profilePhoto: user.profilePhoto,
            familyRole: user.familyRole,
            userRole: user.userRole,
        },
        JWT_SECRET,
        {
            // expiresIn: "24h",
        },
    );
};


async function signTokenForResetPassword(user)
{
    return jwt.sign(
        {
            id: user.id,
        },
        JWT_SECRET,
        {
            expiresIn: 300,
        },
    );
};


async function signTokenForInvite(id)
{
    return jwt.sign(
        {
            id: id,
        },
        JWT_SECRET,
        {
            expiresIn: "24h",
        },
    );
};


async function verifyToken(token, next)
{
    try
    {
        return jwt.verify(token, JWT_SECRET);
    }
    catch(error)
    {
        return next;
    };
};


module.exports =
{
    signToken,
    signTokenForResetPassword,
    signTokenForInvite,
    verifyToken,
};