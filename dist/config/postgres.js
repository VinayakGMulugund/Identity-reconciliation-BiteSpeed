"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequel = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequel = new sequelize_1.Sequelize(process.env.DB_URL, {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
});
exports.sequel = sequel;
//# sourceMappingURL=postgres.js.map