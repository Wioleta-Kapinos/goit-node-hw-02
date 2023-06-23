const Contact = require("./contactSchema");

const getAllContacts = async () => {
    return Contact.find();
};

const getContactById = async (contactId) => {
    return Contact.findById({ _id: contactId});
};

const removeContact = async (contactId) => {
    return Contact.findByIdAndRemove({_id: contactId});
};

const createContact = async (name, email, phone) => {
    return Contact.create(name, email, phone);
};

const updateContact = async (contactId, body) => {
    return Contact.findByIdAndUpdate({_id: contactId }, body);
};

const updateStatusContact = async (contactId, favorite) => {
    const contact = Contact.findById({_id: contactId});
        if(!contact) {
            return null;
        }
    contact.favorite = favorite;
        return await contact.save;
};  

module.exports = {
    getAllContacts,
    getContactById,
    removeContact,
    createContact,
    updateContact,
    updateStatusContact,
};