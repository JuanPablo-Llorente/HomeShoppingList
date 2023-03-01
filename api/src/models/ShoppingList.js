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
        title:
        {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        content:
        {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: false,
        },
        parentsOnly:
        {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        timestamps: false,
    });
};