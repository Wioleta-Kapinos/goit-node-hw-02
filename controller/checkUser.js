const User = require("../service/userSchema");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;
const gravatar = require("gravatar");
const fs = require("fs");
const operationAvatar = require("../service/avatar");
const { sendVerificationEmail } = require("../service/email");
const { v4: uuidv4 } = require("uuid");

const validateUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

const validateEmail = Joi.object({
    email: Joi.string().email().required(),
});

const register = async(req, res, next) => {
    const { email, password } = req.body;
    const verificationToken = uuidv4();
    const avatarURL = gravatar.url(email, { s: "250", r: "pg", d: "retro" }, true);
    try {
        const { error } = validateUserSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message});
        }

        const user = await User.findOne({email});
        if(user) {
          return res.status(409).json({ message: "Email in use" });
        }

        const newUser = new User({ email, avatarURL, verificationToken });
        newUser.setPassword(password);
        await newUser.save();
        await sendVerificationEmail(email, verificationToken);
        res.status(201).json({
            user: {
                email: newUser.email,
                avatarURL: newUser.avatarURL,
                subscription: newUser.subscription,
                verificationToken: newUser.verificationToken,
            },
        });
    } catch (error) {
        console.error(error);
        next(error);
    }   
};

const logIn = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const { error } = validateUserSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.message });
      }

      const user = await User.findOne({ email });
      if(!user || !user.validPassword(password)) {
          return res.status(401).json({ message: "Email or password is wrong" });
      }

      if (user.verify === false) {
        return res.status(401).json({ message: "User not verified" });
      }

      const payload = {
          id: user.id,
      };
    
      const token = jwt.sign(payload, secret, { expiresIn: "1h" });
      user.setToken(token);
      await user.save();
      res.status(200).json({
            data: {
                token: user.token,
                user: {
                  email: user.email,
                  subscription: user.subscription,
                },
            },
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const logOut = async (req, res, next) => {
    const { _id } = req.user;
    const user = await User.findById({ _id });
  
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
  
    user.token = null;
    await user.save();
    return res.status(204).send();
};

const getCurrent = async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Not authorized" });
      }
      console.log(user);
      res.status(200).json({
        data: {
          user: {
            email: user.email,
            subscription: user.subscription,
          },
        },
      });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const setAvatar = async (req, res, next) => {
  try {
    const avatar = req.file;
    const { user } = req;
    if (!user) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    const filename = Date.now() + "-" + avatar.originalname; 
    const avatarFolder = "./public/avatars";

    if (!fs.existsSync(avatarFolder)) {
      fs.mkdirSync(avatarFolder, { recursive: true });
    }
    
    await operationAvatar(avatar, filename);

    user.avatarURL = `/avatars/${filename}`;
    await user.save();

    return res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verify) {
      return res.status(400).json({ message: "Verification has already been passed" });
    }

    user.verificationToken = "null";
    user.verify = true;
    await user.save();
    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
      next(error);
  }
};

const resendEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { error } = validateEmail.validate(req.body);
        if (error) {
            return res.status(400).json({ message: "missing required field email"});
        }

        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        if (user.verify) {
          return res.status(400).json({ message: "Verification has already been passed" });
        }

        const verificationToken = uuidv4();
        user.verificationToken = verificationToken;
        await user.save();

        await sendVerificationEmail(email, verificationToken);
        res.status(200).json({ message: "Verification email sent" });
  
  } catch (error) {
      next(error);
  }
};

module.exports = {
    register,
    logIn,
    logOut,
    getCurrent,
    setAvatar,
    verifyEmail,
    resendEmail,
};