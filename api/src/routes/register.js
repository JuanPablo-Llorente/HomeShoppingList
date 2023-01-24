// Dependencies
const {Router} = require("express");
const router = Router();
// Files
const {User} = require("../db");
const {encrypt} = require("../controllers/bcrypt");
const {ADMIN_PASSWORD} = process.env;


router.post("/register", async (req, res, next) => {
    const {name, lastName, userName, email, password, profilePhoto, familyRole} = req.body;
    const foundUser = await User.findOne({
        where:
        {
            email: email,
        },
    });
    
    try
    {
        if(foundUser)
        {
            res.status(404).json({error: "This email is already in use. Please try another."});
        }
        else
        {
            if(name, lastName, userName, email, password, familyRole)
            {
                const definedRole = password === ADMIN_PASSWORD ? "admin" : "user";
                const hashedPassword = await encrypt(password);
                
                await User.create({
                    name,
                    lastName,
                    userName,
                    email,
                    password: hashedPassword,
                    profilePhoto,
                    familyRole,
                    userRole: definedRole,
                });
                
                res.send("User created successfully.");
            }
            else
            {
                res.status(404).json({error: "All fields are required."});
            };
        };
    }
    catch(error)
    {
        next(error);
    };
});


module.exports = router;