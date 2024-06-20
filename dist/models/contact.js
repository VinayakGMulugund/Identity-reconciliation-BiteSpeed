"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const postgres_1 = require("../config/postgres");
class Contact extends sequelize_1.Model {
}
Contact.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    linkedId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    linkPrecedence: {
        type: sequelize_1.DataTypes.ENUM('primary', 'secondary'),
        allowNull: false,
    },
}, {
    sequelize: postgres_1.sequel,
    modelName: 'Contact',
    timestamps: true,
    paranoid: true,
});
exports.default = Contact;
//# sourceMappingURL=contact.js.map