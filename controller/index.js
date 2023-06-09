const service = require("../service/contacts");

const listContacts = async (req, res, next) => {
    try {
      const results = await service.listContacts;
      res.json({
        status: "success",
        code: 200,
        data: {
          contacts: results,
        },
      }) 
    } catch (error) {
      console.error(error);
      next(error);
    }
}

const getContactById = async (req, res, next) => {
    const { id } = req.params;
    try {
      const result = await service.getContactById(id);
      if (result) {
        res.json({
          status: "success",
          code: 200,
          data: { contact: result },
        })
      } else {
        res.status(404).json({
          status: "error",
          code: 404,
          message: `Not found contact id: ${id}`,
          data: "Not Found",
        })
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
}

const addContact = async (req, res, next) => {
    try {
      const result = await service.addContact(req.body);
      res.status(201).json({
        status: "success",
        code: 201,
        data: { contact: result },
      })
    } catch (error) {
      console.error(error);
      next(error);
    }
}

const removeContact = async (req, res, next) => {
    const { id } = req.params;
    try {
      const result = await service.removeContact(id);
      if (result) {
        res.json({
          status: "success",
          code: 200,
          data: { contact: result },
        })
      } else {
        res.status(404).json({
          status: "error",
          code: 404,
          message: `Not found contact id: ${id}`,
          data: "Not Found",
        })
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
}

const updateContact = async (req, res, next) => {
    const { id } = req.params;
    try {
      const result = await service.updateContact(id, req.body);
      if (result) {
        res.json({
          status: "success",
          code: 200,
          data: { contact: result },
        })
      } else {
        res.status(404).json({
          status: "error",
          code: 404,
          message: `Not found contact id: ${id}`,
          data: "Not Found",
        })
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
}

const updateStatusContact = async (req, res, next) => {
    const { id } = req.params;
    const { favorite } = req.body;
    try {
      const result = await service.updateStatusContact(id, favorite);
      if (!favorite) {
        res.status(400).json({ message: "missing field favorite" });
        return;
      }
      if (result) {
        res.json({
          status: "success",
          code: 200,
          data: { contact: result },
        })
      } else {
        res.status(404).json({
          status: "error",
          code: 404,
          message: `Not found contact id: ${id}`,
          data: "Not Found",
        })
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
}
  
module.exports = {
    listContacts,
    getContactById,
    addContact,
    removeContact,
    updateContact,
    updateStatusContact,
}