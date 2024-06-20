import { sequel } from "../config/postgres";
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
        return contact1.createdAt.getMilliseconds() < contact2.createdAt.getMilliseconds() ? 1 : -1
    });

    const primaryContact = contacts[0];

    //no need to add new contact to DB before sorting because the new contact cannot be primary if there -
    // are contacts with same phone/email already present in the DB
    const newContact = await Contact.create({
        email,
        phoneNumber,
        linkedId: primaryContact.id,
        linkPrecedence: 'secondary'
    });
    //get all non-null emails, phoneNumbers and secondary ids
    const emails: string[] = contacts.filter(contact => contact.email).map(contact => contact.email as string);
    const secondaryContactIds: number[] = contacts.map(contact => contact.id);
    const phoneNumbers: string[] = contacts.filter(contact => contact.phoneNumber).map(contact => contact.phoneNumber as string);
    

    secondaryContactIds.push(newContact.id);
    if (email)
        emails.push(newContact.email as string);
    if (phoneNumber)
        phoneNumbers.push(newContact.phoneNumber as string);

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
