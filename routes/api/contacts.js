const router = require("express").Router();
const ctrlContacts = require("../../controller/checkContact");
      
router.get("/", ctrlContacts.get);
      
router.get("/:contactId", ctrlContacts.getById);
      
router.post("/", ctrlContacts.create);
      
router.delete("/:contactId", ctrlContacts.remove);
      
router.put("/:contactId", ctrlContacts.update);
      
router.patch("/:contactId/favorite", ctrlContacts.updateStatusContact);
      
module.exports = router;      