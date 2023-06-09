const express = require("express");

const router = express.Router();
const ctrlContacts = require("../../controller");

router.get("/", ctrlContacts.listContacts);

router.get("/:contactId", ctrlContacts.getContactById);

router.post("/", ctrlContacts.addContact);

router.delete("/:contactId", ctrlContacts.removeContact);

router.put("/:contactId", ctrlContacts.updateContact);

router.patch("/:contactId/favorite", ctrlContacts.updateStatusContact);

module.exports = router;