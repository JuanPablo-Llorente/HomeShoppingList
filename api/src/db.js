// Dependencies
require("dotenv").config();
const {Sequelize} = require("sequelize");
const fs = require("fs");
const path = require("path");
// Files
const {DB_USER, DB_PASSWORD, DB_HOST} = process.env;
// Models import
const modelsRoute = path.join(__dirname + "/models");
const allModels = fs.readdirSync(modelsRoute);
const models = [];

allModels.forEach(e => {
    const modelRequire = require(path.join(modelsRoute, e));
    models.push(modelRequire);
});


// Sequelize starter
const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/home_shopping_list`, {
    logging: false,
});

// Sequelize injection
models.forEach(model => model(sequelize));

// RELATIONS
const {User, FamilyGroup, ShoppingList} = sequelize.models;

// User and FamilyGroup
User.hasMany(FamilyGroup);
FamilyGroup.belongsTo(User);

// FamilyGroup and ShoppingList
FamilyGroup.hasMany(ShoppingList);
ShoppingList.belongsTo(FamilyGroup);


module.exports =
{
    ...sequelize.models,
    db: sequelize,
};