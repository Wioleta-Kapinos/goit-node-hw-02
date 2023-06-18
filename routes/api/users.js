const express = require("express");
const router = express.Router;
const ctrlUsers = require("../../controller/checkUser");
const auth = require("../../auth/auth");

router.post("/users/signup", ctrlUsers.register);

router.post("/users/login", ctrlUsers.logIn);

router.post("/users/logout", auth, ctrlUsers.logOut);

router.get("/users/current", auth, ctrlUsers.getCurrent);

router.patch("/users", auth, ctrlUsers.updateSubscription);

module.exports = router;