"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const postgres_1 = require("./config/postgres");
const contact_1 = require("./service/contact");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
app.post('/identify', contact_1.ContactService);
app.get('', contact_1.getAll);
postgres_1.sequel.sync({ force: false }).then(() => {
    console.log('Database synced');
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});
//# sourceMappingURL=index.js.map