const fs = require('fs').promises;

const path = require('path');
const shortUUID = require('short-uuid');

const contactsPath = path.join(__dirname, '/db/contacts.json');

async function parsedContacts() {
    try {
        const data = await fs.readFile(contactsPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return console.error(error.message);
    }
}

// TODO: задокументувати кожну функцію
async function listContacts() {
    try {
        const contacts = await parsedContacts();
        console.log('List of contacts:');
        console.table(contacts);
        return contacts;
    } catch (error) {
        return console.error(error.message);
    }
}

async function getContactById(contactId) {
    try {
        const contacts = await parsedContacts();
        const contact = contacts.find(({ id }) => id === contactId);

        if (!contact)
            return console.error(`Contact with ID ${contactId} not found!`)
        console.log(`Contact with ID ${contactId}:`);
        console.table(contact);
        return contact;
    } catch (error) {
        return console.error(error.message);
    }
}

async function removeContact(contactId) {
  try {
      const contacts = await parsedContacts();
      const newContacts = contacts.filter(({ id }) => id !== contactId);

      if (contacts.length === newContacts.length) {
          return console.error(`Contact with ID ${contactId} not found!`);
      }

      await fs.writeFile(
          contactsPath,
          JSON.stringify(newContacts, null, 2),
          'utf8',
      );

      console.log('Contact deleted successfully! New list of contacts:');
      console.table(newContacts);
  } catch (error) {
      return console.error(error.message);
  }
}

async function addContact(name, email, phone) {
    try {
        const contacts = await parsedContacts();

        if (
            contacts.find(
                contact => contact.name.toLowerCase() === name.toLowerCase(),
            )
        )
            return console.warn('This name already exists!');
        
        if (contacts.find(contact => contact.phone === phone))
            return console.warn('This email already exists!');

                if (contacts.find(contact => contact.email === email))
            return console.warn('This phone already exists!');

        const newContact = { id: shortUUID.generate(), name, email, phone };
        const newContacts = [...contacts, newContact];

        await fs.writeFile(
            contactsPath,
            JSON.stringify(newContacts, null, 2),
            'utf8',
        );

        console.log('Contact added successfully! New list of contacts:');
        console.table(newContacts);

        return newContacts;

    } catch (error) {
        return console.error(error.message);
    }
}

module.exports = { listContacts, getContactById, removeContact, addContact };