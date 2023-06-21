const User = require("../service/userSchema");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

const validateUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

const register = async(req, res, next) => {
    const { email, password } = req.body;
    try {
        const { error } = validateUserSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message});
        }

        const userExist = await User.findOne({email});
        if(userExist) {
          return res.status(409).json({ message: "Email in use" });
        }

        const newUser = new User({ email});
        newUser.setPassword(password);
        await newUser.save();
        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
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

const getCurrent= async (req, res, next) => {
    try {
      const user = await User.findById(req.user.userId);
      console.log(user);
      if (!user) {
        return res.status(401).json({ message: "Not authorized" });
      }
      
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
    
module.exports = {
    register,
    logIn,
    logOut,
    getCurrent,
};