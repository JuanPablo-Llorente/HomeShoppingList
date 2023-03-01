// Dependencies
const {Router} = require("express");
const router = Router();
// Files
const {User, FamilyGroup} = require("../db");
const {verifyToken, signTokenForInvite} = require("../controllers/tokens");


router.post("/invitationlink/:id", async (req, res, next) => {
    const {id} = req.params;
    
    try
    {
        if(id)
        {
            const foundFamilyGroup = await FamilyGroup.findByPk(id).catch(e => console.log(e));
            
            if(foundFamilyGroup)
            {
                const token = await signTokenForInvite(id);
                
                const invitationLink = `/invitationlink/${token}`;
                
                res.status(200).json({msg: "Link created.", content: invitationLink});
            }
            else
            {
                res.status(404).json({error: "Invalid group id."});
            };
        }
        else
        {
            res.status(404).json({error: "Id not provided."});
        };
    }
    catch(error)
    {
        console.error(error);
        next();
    };
});


router.put("/invitationlink/:groupToken", async (req, res, next) => {
    const {groupToken} = req.params;
    const {authorization} = req.headers;
    
    try
    {
        if(authorization)
        {
            const userToken = authorization.split(" ").pop();
            const decodedUserToken = await verifyToken(userToken);
            const userId = decodedUserToken !== undefined ? decodedUserToken.id : null;
            
            if(userId)
            {
                const decodedGroupToken = await verifyToken(groupToken);
                const groupId = decodedGroupToken !== undefined ? decodedGroupToken.id : null;
                
                if(groupId)
                {
                    const foundFamilyGroup = await FamilyGroup.findByPk(groupId, {
                        include: {
                            model: User,
                        },
                    }).catch(e => console.error(e));
                    
                    const familyGroupUsersIds = foundFamilyGroup.dataValues.Users.map(user => {
                        return user.dataValues.id;
                    });
                    
                    if(!familyGroupUsersIds.includes(userId))
                    {
                        foundFamilyGroup.addUser(userId);
                        
                        res.status(200).json({msg: "New user added"});
                    }
                    else
                    {
                        res.status(404).json({error: "You are already in this group."});
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


module.exports = router;