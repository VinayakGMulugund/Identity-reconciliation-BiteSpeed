"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.ContactService = void 0;
const contact_1 = __importDefault(require("../models/contact"));
const sequelize_1 = require("sequelize");
const ContactService = async (req, res) => {
    const { email, phoneNumber } = req.body;
    // fetch all contacts which have either matching phone or email
    let contacts = await contact_1.default.findAll({
        where: {
            [sequelize_1.Op.or]: [{ phoneNumber }, { email }]
        }
    });
    // if no contacts, create new contact
    if (contacts.length === 0) {
        const newContact = await contact_1.default.create({
            email,
            phoneNumber,
            linkPrecedence: 'primary'
        });
        return res.status(200).json({
            contact: {
                primaryContactId: newContact.id,
                emails: [newContact.email],
                phoneNumbers: [newContact.phoneNumber],
                secondaryContactIds: []
            }
        });
    }
    //sort based on the time and first contact would be the primary contact - always
    contacts.sort((contact1, contact2) => {
        return contact1.createdAt.getTime() - contact2.createdAt.getTime();
    });
    const primaryContact = contacts[0];
    //no need to add new contact to DB before sorting because the new contact cannot be primary if there -
    // are contacts with same phone/email already present in the DB
    let contactAlreadyExists = false;
    let existingContact = undefined;
    for (let contact of contacts) {
        if (contact.email === email && contact.phoneNumber === phoneNumber) {
            contactAlreadyExists = true;
            existingContact = contact;
            break;
        }
    }
    //create new contact only if the old one doesnt exist
    let newContact = undefined;
    if (contactAlreadyExists) {
        //update to change updatedAt - not specified in the requirement
    }
    else {
        newContact = await contact_1.default.create({
            email,
            phoneNumber,
            linkedId: primaryContact.id,
            linkPrecedence: 'secondary'
        });
    }
    //get all non-null emails, phoneNumbers and secondary ids
    const emailSet = new Set();
    const emails = contacts.filter(contact => {
        if (contact.email && !emailSet.has(contact.email)) {
            emailSet.add(contact.email);
            return true;
        }
        return false;
    }).map(contact => contact.email);
    const secondaryContactsSet = new Set();
    const secondaryContactIds = contacts.filter(contact => {
        if (!secondaryContactsSet.has(contact.id)) {
            secondaryContactsSet.add(contact.id);
            return true;
        }
        return false;
    }).map(contact => contact.id);
    const phoneNumbersSet = new Set();
    const phoneNumbers = contacts.filter(contact => {
        if (contact.phoneNumber && !phoneNumbersSet.has(contact.phoneNumber)) {
            phoneNumbersSet.add(contact.phoneNumber);
            return true;
        }
        return false;
    }).map(contact => contact.phoneNumber);
    if (newContact) {
        secondaryContactIds.push(newContact.id);
        if (email && !emailSet.has(email))
            emails.push(email);
        if (phoneNumber && !phoneNumbersSet.has(phoneNumber))
            phoneNumbers.push(phoneNumber);
    }
    return res.status(200).json({
        contact: {
            primaryContactId: primaryContact.id,
            emails,
            phoneNumbers,
            secondaryContactIds: secondaryContactIds.slice(1) //secondaryContactIds has first element as primaryContactId
        }
    });
};
exports.ContactService = ContactService;
const getAll = async (req, res) => {
    const contacts = await contact_1.default.findAll();
    res.json(contacts);
};
exports.getAll = getAll;
//# sourceMappingURL=contact.js.map