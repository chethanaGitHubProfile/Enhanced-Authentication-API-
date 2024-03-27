const User = require("../models/user-model");
const userRegisterationSchema = {
  profile: {
    name: {
      notEmpty: {
        errorMessage: "name is required",
      },
      trim: true,
    },
    bio: {
      notEmpty: {
        errorMessage: "bio id required",
      },
    },
  },
  email: {
    notEmpty: {
      errorMessage: "email is required",
    },
    trim: true,
    normalizeEmail: true,
    custom: {
      options: async function (value) {
        const user = await User.findOne({ email: value });
        if (!user) {
          return true;
        } else {
          throw new Error("email already exists");
        }
      },
    },
    isEmail: {
      errorMessage: "email should be in valid format",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "password is required",
    },
    trim: true,
  },
};

const userLoginSchema = {
  email: {
    trim: true,
    normalizeEmail: true,
    notEmpty: {
      errorMessage: "Email is required",
    },
  },
  password: {
    trim: true,
    notEmpty: {
      errorMessage: "password is required",
    },

    isLength: {
      options: { min: 6, max: 128 },
      errorMessage: "password should be between 6 to 128 chacters",
    },
  },
  role: {
    notEmpty: {
      errorMessage: "role is required",
    },
  },
  imagePath: String,
};

module.exports = {
  userRegisterationSchema,
  userLoginSchema,
};
