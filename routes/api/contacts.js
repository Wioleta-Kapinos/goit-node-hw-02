const express = require("express");
const router = express.Router();
const ctrlContacts = require("../../controller/checkContact");
const auth = require("../../auth/auth");
      
router.get("/", auth, ctrlContacts.get);
      
router.get("/:contactId", auth, ctrlContacts.getById);
      
router.post("/", auth, ctrlContacts.create);
      
router.delete("/:contactId", auth, ctrlContacts.remove);
      
router.put("/:contactId", auth, ctrlContacts.update);
      
router.patch("/:contactId/favorite", auth, ctrlContacts.updateStatusContact);
      
module.exports = router;      