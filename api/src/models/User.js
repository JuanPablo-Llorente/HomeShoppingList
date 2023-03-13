// Dependencies
const {DataTypes} = require("sequelize");

module.exports = sequelize =>
{
    sequelize.define("User",
    {
        id:
        {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        name:
        {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName:
        {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userName:
        {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email:
        {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password:
        {
            type: DataTypes.STRING,
            allowNull: false,
        },
        profilePhoto:
        {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: "https://i.pinimg.com/564x/20/0d/72/200d72a18492cf3d7adac8a914ef3520.jpg",
        },
        familyRole:
        {
            type: DataTypes.ENUM("Father", "Mother", "Son", "Daughter"),
            allowNull: false,
        },
        userRole:
        {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    });
};