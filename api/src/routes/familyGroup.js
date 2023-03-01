// Dependencies
const {Router} = require("express");
const router = Router();
// Files
const {User, FamilyGroup, ShoppingList} = require("../db");
const {verifyToken} = require("../controllers/tokens");
const {API_KEY} = process.env;


// Get group lists
router.get("/familygroup/:id", async (req, res, next) => {
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
                const foundFamilyGroup = await FamilyGroup.findByPk(id, {
                    include: [
                        {
                            model: ShoppingList,
                        }
                    ],
                })
                .catch(e => console.error(e));
                
                if(foundFamilyGroup)
                {
                    res.status(200).json({msg: "Group found.", content: foundFamilyGroup});
                }
                else
                {
                    res.status(404).json({msg: "Group not found."});
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


// Get group users
router.get("/familygroup/:id/users", async (req, res, next) => {
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
                const foundFamilyGroup = await FamilyGroup.findByPk(id, {
                    include: [
                        {
                            model: User,
                        }
                    ],
                })
                .catch(e => console.error(e));
                
                if(foundFamilyGroup)
                {
                    res.status(200).json({msg: "Group found.", content: foundFamilyGroup});
                }
                else
                {
                    res.status(404).json({msg: "Group not found."});
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


// Create group
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
                
                res.status(200).json({msg: "Group created.", content: newFamilyGroup.dataValues.id});
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
        next(error);
    };
});


// Edit group
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
                        const putVerify = foundUser && foundUser.dataValues.familyRole === "Father" | "Mother" ? true : false;
                        
                        if(putVerify)
                        {
                            await foundFamilyGroup.update({
                                name,
                            },
                            {
                                where: {id},
                            });
                            
                            res.status(200).json({msg: "Group updated."});
                        }
                        else
                        {
                            res.status(404).json({msg: "Only parents can update the group."});
                        };
                    }
                    else
                    {
                        res.status(404).json({msg: "No authorization."});
                    };
                    
                }
                else
                {
                    res.status(404).json({msg: "Group not found."});
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


// Delete group
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
                            
                            res.status(200).json({msg: "Group deleted."});
                        }
                        else
                        {
                            res.status(404).json({msg: "Only parents can delete the group."});
                        };
                    }
                    else
                    {
                        res.status(404).json({msg: "No authorization."});
                    };
                    
                }
                else
                {
                    res.status(404).json({msg: "Group not found."});
                };
            }
            else
            {
                res.status(404).json({msg: "Invalid token."});
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


// Remove user
router.delete("/familygroup/:groupId/users/:id", async (req, res, next) => {
    const {groupId, id} = req.params;
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
                const foundFamilyGroup = await FamilyGroup.findByPk(groupId, {
                    include: {
                        model: User,
                    },
                }).catch(e => console.error(e));
                
                if(foundFamilyGroup)
                {
                    const familyGroupUsersIds = foundFamilyGroup.dataValues.Users.map(user => {
                        return user.dataValues.id;
                    });
                    
                    if(familyGroupUsersIds.includes(userId) && familyGroupUsersIds.includes(id))
                    {
                        const foundUser = await User.findByPk(userId).catch(e => console.error(e));
                        const deleteVerify = foundUser && foundUser.dataValues.familyRole === "Father" | "Mother" ? true : false;
                        
                        if(deleteVerify)
                        {
                            foundFamilyGroup.removeUser(id);
                            
                            res.status(200).json({msg: "User removed."});
                        }
                        else
                        {
                            res.status(404).json({msg: "Only parents can remove users."});
                        };
                    }
                    else
                    {
                        res.status(404).json({msg: "No authorization."});
                    };
                    
                }
                else
                {
                    res.status(404).json({msg: "Group not found."});
                };
            }
            else
            {
                res.status(404).json({msg: "Invalid token."});
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


// Leave group
router.delete("/familygroup/:id/users", async (req, res, next) => {
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
                    foundFamilyGroup.removeUser(userId);
                    
                    res.status(200).json({msg: "Group leaved."});
                }
                else
                {
                    res.status(404).json({msg: "Group not found."});
                };
            }
            else
            {
                res.status(404).json({msg: "Invalid token."});
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