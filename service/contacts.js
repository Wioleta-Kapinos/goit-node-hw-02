const Contact = require("./schema");

const listContacts = async () => {
  return Contact.find();
}

const getContactById = async (contactId) => {
  return Contact.findById(contactId);
}

const removeContact = async (contactId) => {
  return Contact.findByIdAndRemove(contactId);
}

const addContact = async (body) => {
  return Contact.create(body);
}

const updateContact = async (contactId, body) => {
  return Contact.findByIdAndUpdate(contactId, body, { new: true});
}

const updateStatusContact = async (contactId, favorite) => {
  const contact = Contact.findById(contactId);
    if(!contact) {
      return null;
    }
  contact.favorite = favorite;
  return await contact.save;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
}