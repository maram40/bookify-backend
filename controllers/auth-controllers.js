const User = require("../models/userModel");
const generateToken = require("../utils/get-jwt");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  try {
    const user = await User.create({
      ...req.body,
      role: "student",
      imageUrl: req.file ? req.file.filename : "default-user.webp",
    });

    const token = generateToken(user);
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      token,
      data: { user },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Error in signup: ${error.message}`,
    });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Email and Password are required.",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const comparePasswords = await bcrypt.compare(password, user.password);
    if (!comparePasswords) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    user.password = undefined;
    const token = generateToken(user);

    res.status(200).json({
      status: "success",
      token,
      data: { user },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Error in signin: ${error.message}`,
    });
  }
};

module.exports = { signup, signin };
