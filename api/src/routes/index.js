// Dependencies
const {Router} = require("express");
const router = Router();
// Files
const user = require("./user");
const register = require("./register");
const login = require("./login");


// Routers settings
router.use(user);
router.use(register);
router.use(login);


module.exports = router;