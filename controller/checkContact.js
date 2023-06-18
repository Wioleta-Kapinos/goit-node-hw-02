const service = require("../service/contacts");
const Joi = require("joi");

const postSchema = Joi.object({
    name: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(8).required(),
});

const putSchema = Joi.object({
    name: Joi.string().min(4),
    email: Joi.string().email(),
    phone: Joi.string().min(8),
});

const updateStatusSchema = Joi.object({
    favorite: Joi.bool().required(),
});

const get = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const results = await service.getAllContacts( 
        req.user._id,
        req.query.favorite,
        page,
        limit
        );
        res.status(200).json(results); 
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const getById = async (req, res, next) => {
    const { contactId } = req.params;
    try {
      const result = await service.getContactById(contactId, req.user._id);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({
          message: `Not found contact id: ${contactId}`,
        });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
};

const create = async (req, res, next) => {
    const { name, email, phone } = req.body;
    const owner = req.user._id;
    try {
      const { error } = postSchema.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.message });
      } else {
        const result = await service.createContact({ name, email, phone, owner });
        res.status(201).json(result);
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
};

const remove = async (req, res, next) => {
    const { contactId } = req.params;
    const owner = req.user._id;
    try {
      const result = await service.removeContact(contactId, owner);
      if (result) {
        res.status(200).json({ message: "contact deleted" });
      } else {
        res.status(404).json({
          message: `Not found contact id: ${contactId}`,
        });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
};

const update = async (req, res, next) => {
    const { contactId } = req.params;
    const { name, email, phone } = req.body;
    const owner = req.user._id;
    try {
      const { error } = putSchema.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.message });
      } else {
        const result = await service.updateContact(contactId, owner,{
          name, email, phone,
        });
        if (result) {
          res.status(200).json(result);
        } else {
          res.status(404).json({
            message: `Not found contact id: ${contactId}`,
          });
        }
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
};

const updateStatusContact = async (req, res, next) => {
    const { contactId } = req.params;
    const { favorite = false } = req.body;
    const owner = req.user._id;
    try {
      const { error } = updateStatusSchema.validate(req.body);
      if (error) {
        res.status(400).json({ message: "missing field favorite" });
      } else {
        const result = await service.updateStatusContact(contactId, owner, { favorite });
        if (result) {
          res.status(200).json(result);
        } else {
          res.status(404).json({
            message: `Not found contact id: ${contactId}`,
          });
        }
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
};

module.exports = {
    get,
    getById,
    create,
    remove,
    update,
    updateStatusContact,
};