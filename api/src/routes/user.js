// Dependencies
const {Router} = require("express");
const router = Router();
// Files
const {User, FamilyGroup} = require("../db");
const {encrypt} = require("../controllers/bcrypt");
const {signToken, verifyToken} = require("../controllers/tokens");
const {API_KEY} = process.env;


router.get("/user", async (req, res, next) => {
    const {apiKey} = req.query;
    const validApiKey = apiKey === API_KEY ? true : false;
    
    try
    {
        if(validApiKey)
        {
            const allUsers = await User.findAll();
            const totalUsers = allUsers.length;
            
            if(allUsers.length)
            {
                res.status(200).json({msg: `${totalUsers} ${totalUsers === 1 ? "user" : "users"} found.` , content: allUsers});
            }
            else
            {
                res.status(404).json({msg: "No users created."});
            };
        }
        else
        {
            res.status(404).json({msg: "No authorization."});
        };
    }
    catch(error)
    {
        console.error(error);
        next();
    };
});


router.get("/user/:id", async (req, res, next) => {
    const {id} = req.params;
    const {authorization} = req.headers;
    const {apiKey} = req.query;
    const validApiKey = apiKey === API_KEY ? true : false;
    
    try
    {
        if(validApiKey && authorization)
        {
            const token = authorization.split(" ").pop();
            const decodedToken = await verifyToken(token);
            const userId = decodedToken !== undefined ? decodedToken.id : null;
            
            if(userId)
            {
                const foundUser = await User.findByPk(id, {
                    include: [
                        {
                            model: FamilyGroup,
                        },
                    ],
                })
                .catch(e => console.error(e));
                
                if(foundUser)
                {
                    res.status(200).json({msg: "User found.", content: foundUser});
                }
                else
                {
                    res.status(404).json({msg: "User not found."});
                };
            }
            else
            {
                res.status(404).json({msg: "Invalid token."});
            };
        }
        else
        {
            res.status(404).json({msg: "No authorization"});
        };
    }
    catch(error)
    {
        console.error(error);
        next();
    };
});


router.put("/user/:id", async (req, res, next) => {
    const {id} = req.params;
    const {name, lastName, userName, password, profilePhoto, familyRole} = req.body;
    const {authorization} = req.headers;
    
    try
    {
        if(authorization)
        {
            const token = authorization.split(" ").pop();
            const decodedToken = await verifyToken(token);
            const userId = decodedToken !== undefined ? decodedToken.id : null;
            
            if(userId)
            {
                const foundUser = await User.findByPk(id).catch(e => console.error(e));
                const putVerify = foundUser && foundUser.dataValues.id == userId ? true : false;
                const hashedPassword = await encrypt(password);
                
                if(putVerify)
                {
                    const foundUser = await User.findByPk(id);
                    
                    await foundUser.update({
                        name,
                        lastName,
                        userName,
                        password: hashedPassword,
                        profilePhoto,
                        familyRole,
                    },
                    {
                        where: {id},
                    });
                    
                    const token = await signToken(foundUser);
                    
                    res.status(200).json({msg: "User updated.", content:{foundUser, token}});
                }
                else
                {
                    res.status(404).json({msg: "Cannot update this user."});
                };
            }
            else
            {
                res.status(404).json({msg: "Invalid token."});
            };
        }
        else
        {
            res.status(404).json({msg: "No authorization"});
        };
    }
    catch(error)
    {
        console.error(error);
        next();
    };
});


router.delete("/user/:id", async (req, res, next) => {
    const {id} = req.params;
    const {authorization} = req.headers;
    
    try
    {
        if(authorization)
        {
            const token = authorization.split(" ").pop();
            const decodedToken = await verifyToken(token);
            const userId = decodedToken !== undefined ? decodedToken.id : null;
            
            const foundUser = await User.findByPk(id).catch(e => console.error(e));
            const deleteVerify = foundUser && foundUser.dataValues.id == userId ? true : false;
            
            if(deleteVerify)
            {
                await User.destroy({
                    where: {id},
                });
                
                res.status(200).json({msg: "User deleted."});
            }
            else
            {
                res.status(404).json({msg: "Cannot delete this user."});
            };
        }
        else
        {
            res.status(404).json({msg: "No authorization."});
        };
    }
    catch(error)
    {
        console.error(error);
        next();
    };
});


module.exports = router;