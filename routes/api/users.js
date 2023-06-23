const router = require("express").Router();
const ctrlUsers = require("../../controller/checkUser");
const auth = require("../../auth/auth");

router.post("/signup", ctrlUsers.register);

router.post("/login", ctrlUsers.logIn);

router.get("/logout", auth, ctrlUsers.logOut);

router.get("/current", auth, ctrlUsers.getCurrent);

module.exports = router;