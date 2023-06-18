const Contact = require("./contactSchema");

const getAllContacts = async (owner, favorite, page, limit) => {
    const skip = (page - 1) * limit;
    if (favorite && favorite.toLowerCase() === "true") {
        return Contact.find({ owner, favorite: true }).skip(skip).limit(limit);
    }
    return Contact.find({ owner }).skip(skip).limit(limit);
};

const getContactById = async (contactId, owner) => {
    return Contact.findById({_id: contactId, owner});
};

const removeContact = async (contactId, owner) => {
    return Contact.findByIdAndRemove({_id: contactId, owner});
};

const createContact = async (name, email, phone, owner) => {
    return Contact.create(name, email, phone, owner);
};

const updateContact = async (contactId, owner, fields) => {
    return Contact.findByIdAndUpdate({_id: contactId, owner }, fields);
};

const updateStatusContact = async (contactId, favorite, owner) => {
    const contact = Contact.findById({_id: contactId, owner});
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