const router = require("express").Router();
const ctrlUsers = require("../../controller/checkUser");
const auth = require("../../auth/auth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const tempFolder = "./tmp";
      if(!fs.existsSync(tempFolder)) {
        fs.mkdirSync(tempFolder);
      }
      cb(null, "./tmp");
    },
    filename: (req, file, cb) => {
      cb(null,file.originalname);
    },
    limits: {
      fileSize: 1048576,
    },
});

const upload = multer({
    storage: storage,
});

router.post("/signup", ctrlUsers.register);

router.post("/login", ctrlUsers.logIn);

router.get("/logout", auth, ctrlUsers.logOut);

router.get("/current", auth, ctrlUsers.getCurrent);

router.patch("/avatars", auth, upload.single("avatar"), ctrlUsers.setAvatar);

module.exports = router;