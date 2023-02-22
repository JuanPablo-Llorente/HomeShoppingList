// Dependencies
const {Router} = require("express");
const router = Router();
// Files
const {User, FamilyGroup, ShoppingList} = require("../db");
const {verifyToken} = require("../controllers/tokens");
const {API_KEY} = process.env;


router.get("/familygroup", async (req, res, next) => {
    const {apiKey} = req.query;
    const validApiKey = apiKey === API_KEY ? true : false;
    
    try
    {
        if(validApiKey)
        {
            const allFamilyGroups = await FamilyGroup.findAll();
            
            if(allFamilyGroups.length)
            {
                res.send(allFamilyGroups);
            }
            else
            {
                res.status(404).json({error: "No family groups created."});
            };
        }
        else
        {
            res.status(404).json({error: "No authorization."});
        };
    }
    catch(error)
    {
        console.error(error);
        next();
    };
});


router.get("/familygroup/:id", async (req, res, next) => {
    const {id} = req.params;
    const {apiKey} = req.query;
    const validApiKey = apiKey === API_KEY ? true : false;
    const {authorization} = req.headers;
    
    try
    {
        if(validApiKey && authorization)
        {
            const token = authorization.split(" ").pop();
            const decodedToken = await verifyToken(token);
            const userId = decodedToken !== undefined ? decodedToken.id : null;
            
            if(userId)
            {
                const foundFamilyGroup = await FamilyGroup.findByPk(id, {
                    include: [
                        {
                            model: User,
                        },
                        {
                            model: ShoppingList,
                        },
                    ],
                })
                .catch(e => console.error(e));
                
                if(foundFamilyGroup)
                {
                    res.send(foundFamilyGroup);
                }
                else
                {
                    res.status(404).json({error: "Group not found."});
                };
            }
            else
            {
                res.status(404).json({error: "Invalid token."});
            };
        }
        else
        {
            res.status(404).json({error: "No authorization"});
        };
    }
    catch(error)
    {
        console.error(error);
        next();
    };
});


router.post("/familygroup", async (req, res, next) => {
    const {name} = req.body;
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
                const newFamilyGroup = await FamilyGroup.create({name});
                
                newFamilyGroup.addUser(userId);
                
                // res.send("Group created.");
                res.send(newFamilyGroup.dataValues.id);
            };
        }
        else
        {
            res.status(404).json({error: "No authorization"});
        };
    }
    catch(error)
    {
        next(error);
    };
});


router.put("/familygroup/:id", async (req, res, next) => {
    const {id} = req.params;
    const {name} = req.body;
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
                const foundFamilyGroup = await FamilyGroup.findByPk(id, {
                    include: {
                        model: User,
                    },
                }).catch(e => console.error(e));
                
                if(foundFamilyGroup)
                {
                    const familyGroupUsersIds = foundFamilyGroup.dataValues.Users.map(user => {
                        return user.dataValues.id;
                    });
                    
                    if(familyGroupUsersIds.includes(userId))
                    {
                        const foundUser = await User.findByPk(userId).catch(e => console.error(e));
                        const putVerify = foundUser && foundUser.dataValues.familyRole === "Father" || "Mother" ? true : false;
                        
                        if(putVerify)
                        {
                            await foundFamilyGroup.update({
                                name,
                            },
                            {
                                where: {id},
                            });
                            
                            res.send("Group updated.");
                        }
                        else
                        {
                            res.status(404).json({error: "Cannot update the group."});
                        };
                    }
                    else
                    {
                        res.status(404).json({error: "No authorization."});
                    };
                    
                }
                else
                {
                    res.status(404).json({error: "Group not found."});
                };
            }
            else
            {
                res.status(404).json({error: "Invalid token."});
            };
        }
        else
        {
            res.status(404).json({error: "No authorization"});
        };
    }
    catch(error)
    {
        console.error(error);
        next();
    };
});


router.delete("/familygroup/:id", async (req, res, next) => {
    const {id} = req.params;
    const {authorization} = req.headers
    
    try
    {
        if(authorization)
        {
            const token = authorization.split(" ").pop();
            const decodedToken = await verifyToken(token);
            const userId = decodedToken !== undefined ? decodedToken.id : null;
            
            if(userId)
            {
                const foundFamilyGroup = await FamilyGroup.findByPk(id, {
                    include: {
                        model: User,
                    },
                }).catch(e => console.error(e));
                
                if(foundFamilyGroup)
                {
                    const familyGroupUsersIds = foundFamilyGroup.dataValues.Users.map(user => {
                        return user.dataValues.id;
                    });
                    
                    if(familyGroupUsersIds.includes(userId))
                    {
                        const foundUser = await User.findByPk(userId).catch(e => console.error(e));
                        const deleteVerify = foundUser && foundUser.dataValues.familyRole === "Father" | "Mother" ? true : false;
                        
                        if(deleteVerify)
                        {
                            await foundFamilyGroup.destroy({
                                where: {id},
                            });
                            
                            res.send("Group deleted.");
                        }
                        else
                        {
                            res.status(404).json({error: "Cannot delete the group."});
                        };
                    }
                    else
                    {
                        res.status(404).json({error: "No authorization."});
                    };
                    
                }
                else
                {
                    res.status(404).json({error: "Group not found."});
                };
            }
            else
            {
                res.status(404).json({error: "Invalid token."});
            };
        }
        else
        {
            res.status(404).json({error: "No authorization."});
        };
    }
    catch(error)
    {
        console.error(error);
        next();
    };
});


module.exports = router;