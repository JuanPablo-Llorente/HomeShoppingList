// Dependencies
const {Router} = require("express");
const router = Router();
// Files
const user = require("./user");
const register = require("./register");
const login = require("./login");
const familyGroup = require("./familyGroup");
const invitationLink = require("./invitationLink");
const shoppingList = require("./shoppingList");


// Routers settings
router.use(user);
router.use(register);
router.use(login);
router.use(familyGroup);
router.use(invitationLink);
router.use(shoppingList);


module.exports = router;