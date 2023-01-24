// Dependencies
const {DataTypes} = require("sequelize");

module.exports = sequelize =>
{
    sequelize.define("ShoppingList",
    {
        id:
        {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        content:
        {
            type: DataTypes.JSON,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    });
};