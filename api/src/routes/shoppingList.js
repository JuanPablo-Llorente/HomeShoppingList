// Dependencies
const {Router} = require("express");
const router = Router();
// Files
const {User, FamilyGroup, ShoppingList} = require("../db");
const {verifyToken} = require("../controllers/tokens");
const {API_KEY} = process.env;


router.get("/shoppinglist", async (req, res, next) => {
    const {apiKey} = req.query;
    const validApiKey = apiKey === API_KEY ? true : false;
    
    try
    {
        if(validApiKey)
        {
            const allShoppingList = await ShoppingList.findAll();
            
            if(allShoppingList.length)
            {
                res.status(200).json({msg: "Found shopping lists.", content: allShoppingList});
            }
            else
            {
                res.status(404).json({msg: "No shopping lists created."});
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


// Get list
router.get("/shoppinglist/:id", async (req, res, next) => {
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
                const foundShoppingList = await ShoppingList.findByPk(id).catch(e => console.error(e));
                
                if(foundShoppingList)
                {
                    const familyGroupId = foundShoppingList.dataValues.FamilyGroupId;
                    
                    const foundFamilyGroup = await FamilyGroup.findByPk(familyGroupId, {
                        include: {
                            model: User,
                        },
                    })
                    .catch(e => console.error(e));
                    
                    const familyGroupUsersIds = foundFamilyGroup.dataValues.Users.map(user => {
                        return user.dataValues.id;
                    });
                    
                    if(familyGroupUsersIds.includes(userId))
                    {
                        res.status(200).json({msg: "Found shopping list.", content: foundShoppingList});
                    }
                    else
                    {
                        res.status(404).json({msg: "You can't access to this shopping list."});
                    };
                }
                else
                {
                    res.status(404).json({msg: "Shopping list not found."});
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


// Create list
router.post("/familygroup/:id/shoppinglist", async (req, res, next) => {
    const {id} = req.params;
    const {title, content, parentsOnly} = req.body;
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
                const foundFamilyGroup = await FamilyGroup.findByPk(id).catch(e => console.error(e));
                
                if(foundFamilyGroup)
                {
                    const foundUser = await User.findByPk(userId).catch(e => console.error(e));
                    const postVerify = foundUser && foundUser.dataValues.familyRole === "Father" | "Mother" ? true : false;
                    
                    if(postVerify)
                    {
                        const newShoppingList = await ShoppingList.create({
                            title,
                            content,
                            parentsOnly,
                        });
                        
                        foundFamilyGroup.addShoppingList(newShoppingList);
                        
                        res.status(200).json({msg: "Shopping list created.", content: newShoppingList.dataValues.id});
                    }
                    else
                    {
                        res.status(404).json({msg: "Only parents can create shopping lists."});
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
        next(error);
    };
});


// Edit list
router.put("/shoppinglist/:id", async (req, res, next) => {
    const {id} = req.params;
    const {title, content} = req.body;
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
                const foundShoppingList = await ShoppingList.findByPk(id).catch(e => console.error(e));
                
                if(foundShoppingList)
                {
                    const familyGroupId = foundShoppingList.dataValues.FamilyGroupId;
                    
                    const foundFamilyGroup = await FamilyGroup.findByPk(familyGroupId, {
                        include: {
                            model: User,
                        },
                    })
                    .catch(e => console.error(e));
                    
                    const familyGroupUsersIds = foundFamilyGroup.dataValues.Users.map(user => {
                        return user.dataValues.id;
                    });
                    
                    if(familyGroupUsersIds.includes(userId))
                    {
                        const foundUser = await User.findByPk(userId).catch(e => console.error(e));
                        const parentsOnlyMode = foundShoppingList.dataValues.parentsOnly;
                        
                        if(parentsOnlyMode)
                        {
                            const putVerify = foundUser && foundUser.dataValues.familyRole === "Father" | "Mother" ? true : false;
                            
                            if(putVerify)
                            {
                                await foundShoppingList.update({
                                    title,
                                    content,
                                },
                                {
                                    where: {id},
                                });
                                
                                res.status(200).json({msg: "Shopping list updated.", content: foundShoppingList});
                            }
                            else
                            {
                                res.status(404).json({msg: "Only parents can update the shopping list."});
                            };
                        }
                        else
                        {
                            await foundShoppingList.update({
                                title,
                                content,
                            },
                            {
                                where: {id},
                            });
                            
                            res.status(200).json({msg: "Shopping list updated.", content: foundShoppingList});
                        };
                    }
                    else
                    {
                        res.status(404).json({msg: "No authorization."});
                    };
                    
                }
                else
                {
                    res.status(404).json({msg: "Shopping list not found."});
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


// Edit parents only setting
router.put("/shoppinglist/:id/setting", async (req, res, next) => {
    const {id} = req.params;
    const {parentsOnly} = req.body;
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
                const foundShoppingList = await ShoppingList.findByPk(id).catch(e => console.error(e));
                
                if(foundShoppingList)
                {
                    const familyGroupId = foundShoppingList.dataValues.FamilyGroupId;
                    
                    const foundFamilyGroup = await FamilyGroup.findByPk(familyGroupId, {
                        include: {
                            model: User,
                        },
                    })
                    .catch(e => console.error(e));
                    
                    const familyGroupUsersIds = foundFamilyGroup.dataValues.Users.map(user => {
                        return user.dataValues.id;
                    });
                    
                    if(familyGroupUsersIds.includes(userId))
                    {
                        const foundUser = await User.findByPk(userId).catch(e => console.error(e));
                        const putVerify = foundUser && foundUser.dataValues.familyRole === "Father" | "Mother" ? true : false;
                        
                        if(putVerify)
                        {
                            await foundShoppingList.update({
                                parentsOnly,
                            },
                            {
                                where: {id},
                            });
                            
                            res.status(200).json({msg: "Parents mode updated.", content: foundShoppingList});
                        }
                        else
                        {
                            res.status(404).json({msg: "Only parents can update the parents mode."});
                        };
                    }
                    else
                    {
                        res.status(404).json({msg: "No authorization."});
                    };
                    
                }
                else
                {
                    res.status(404).json({msg: "Shopping list not found."});
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


// Delete list
router.delete("/shoppinglist/:id", async (req, res, next) => {
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
                const foundShoppingList = await ShoppingList.findByPk(id).catch(e => console.error(e));
                
                if(foundShoppingList)
                {
                    const familyGroupId = foundShoppingList.dataValues.FamilyGroupId;
                    
                    const foundFamilyGroup = await FamilyGroup.findByPk(familyGroupId, {
                        include: {
                            model: User,
                        },
                    })
                    .catch(e => console.error(e));
                    
                    const familyGroupUsersIds = foundFamilyGroup.dataValues.Users.map(user => {
                        return user.dataValues.id;
                    });
                    
                    if(familyGroupUsersIds.includes(userId))
                    {
                        const foundUser = await User.findByPk(userId).catch(e => console.error(e));
                        const parentsOnlyMode = foundShoppingList.dataValues.parentsOnly;
                        
                        if(parentsOnlyMode)
                        {
                            const deleteVerify = foundUser && foundUser.dataValues.familyRole === "Father" | "Mother" ? true : false;
                            
                            if(deleteVerify)
                            {
                                await foundShoppingList.destroy({
                                    where: {id},
                                });
                                
                                res.status(200).json({msg: "Shopping list deleted."});
                            }
                            else
                            {
                                res.status(404).json({msg: "Only parents can delete the shopping list."});
                            };
                        }
                        else
                        {
                            await foundShoppingList.destroy({
                                where: {id},
                            });
                            
                            res.status(200).json({msg: "Shopping list deleted."});
                        };
                    }
                    else
                    {
                        res.status(404).json({msg: "No authorization."});
                    };
                    
                }
                else
                {
                    res.status(404).json({msg: "Shopping list not found."});
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