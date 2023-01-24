// Dependencies
const {DataTypes} = require("sequelize");

const avatars = ["pablo", "eva", "sabrina", "juan"];
const avatar = avatars[Math.floor(Math.random() * avatars.length)];

module.exports = sequelize =>
{
    sequelize.define("User",
    {
        // id:
        // {
        //     type: DataTypes.UUID,
        //     defaultValue: DataTypes.UUIDV4,
        //     allowNull: false,
        //     primaryKey: true,
        // },
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
            defaultValue: `https://unavatar.io/${avatar}`,
        },
        familyRole:
        {
            type: DataTypes.ENUM("Father", "Mother", "Son"),
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