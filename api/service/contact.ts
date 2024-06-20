import { Request, Response } from "express";
import Contact from "../models/contact";
import { Op } from "sequelize";


export const ContactService = async (req: Request, res: Response) => {
    const { email, phoneNumber } = req.body;

    // fetch all contacts which have either matching phone or email
    let contacts = await Contact.findAll({
      where: {
        [Op.or]: [{ phoneNumber }, { email }]
      }
    });

  
    // if no contacts, create new contact
    if (contacts.length === 0) {
      const newContact = await Contact.create({
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
    contacts.sort((contact1: Contact, contact2: Contact) => {
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
    } else {
        newContact = await Contact.create({
            email,
            phoneNumber,
            linkedId: primaryContact.id,
            linkPrecedence: 'secondary'
        });
    }

    //get all non-null emails, phoneNumbers and secondary ids
    const emailSet = new Set();
    const emails: string[] = contacts.filter(contact => {
        if (contact.email && !emailSet.has(contact.email)) {
            emailSet.add(contact.email);
            return true;
        }
        return false;
    }).map(contact => contact.email as string);

    const secondaryContactsSet = new Set();
    const secondaryContactIds: number[] = contacts.filter(contact => {
        if (!secondaryContactsSet.has(contact.id)) {
            secondaryContactsSet.add(contact.id)
            return true;
        }
        return false;
    }).map(contact => contact.id);

    const phoneNumbersSet = new Set();
    const phoneNumbers: string[] = contacts.filter(contact => {
        if (contact.phoneNumber && !phoneNumbersSet.has(contact.phoneNumber)) {
            phoneNumbersSet.add(contact.phoneNumber);
            return true;
        }
        return false;
    }).map(contact => contact.phoneNumber as string);

    if (newContact) {
        secondaryContactIds.push(newContact.id);
        if (email && !emailSet.has(email))
            emails.push(email as string);
        if (phoneNumber && !phoneNumbersSet.has(phoneNumber))
            phoneNumbers.push(phoneNumber as string);
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


export const getAll = async (req: Request, res: Response) => {
    const contacts = await Contact.findAll();
    res.json(contacts);
}
