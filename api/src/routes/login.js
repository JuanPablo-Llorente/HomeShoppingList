// Dependencies
const {Router} = require("express");
const router = Router();
// Files
const {User} = require("../db");
const {compare} = require("../controllers/bcrypt");
const {signToken} = require("../controllers/tokens");


router.post("/login", async (req, res, next) => {
    const {email, password} = req.body;
    
    try
    {
        if(email && password)
        {
            const foundUser = await User.findOne({
                where:
                {
                    email: email,
                },
            });
            
            if(foundUser)
            {
                const foundPassword = foundUser.dataValues.password;
                const checkPassword = await compare(password, foundPassword);
                const token = await signToken(foundUser.dataValues);
                
                if(checkPassword)
                {
                    res.send({foundUser, token});
                }
                else
                {
                    res.status(404).json({error: "Incorrect password."});
                }
            }
            else
            {
                res.status(404).json({error: "The entered email is not registered."});
            };
        }
        else
        {
            res.status(404).json({error: "All fields are required."});
        };
    }
    catch(error)
    {
        next(error);
    };
});


module.exports = router;