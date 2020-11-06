const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

const constructUserResponse = (code, success, message) => {
  return {
    code,
    success,
    message,
  };
};

const generateJWT = (payload) => {
  return jwt.sign(payload, process.env.jwt_secret, {
    expiresIn: "5 days", // For development purpose
    algorithm: "HS256",
  });
};

module.exports = {
  Query: {
    async getUser(_, { userId }) {
      try {
        const data = await User.findOne({
          where: {
            id: userId,
          },
        });
        if (data)
          return {
            ...constructUserResponse(200, true, "User retrieved successfully"),
            token: "12334",
            data,
          };
        else
          return {
            ...constructUserResponse(404, false, "User not found"),
          };
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async register(
      _,
      {
        registerInput: {
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
        },
      }
    ) {
      if (password !== confirmPassword)
        return {
          ...constructUserResponse(
            400,
            false,
            "password and confirm password must match"
          ),
        };
      const avatarUrl = gravatar.url(email, { protocol: "https", s: "100" });
      let newUser = {
        id: nanoid(),
        firstName,
        lastName,
        email,
        avatarUrl,
      };
      try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        newUser = await User.create({ ...newUser, password: hashPassword });
        return {
          ...constructUserResponse(200, true, "User created successfully"),
          token: generateJWT(newUser.dataValues),
          data: newUser,
        };
      } catch (err) {
        if (err.original.code == "ER_DUP_ENTRY")
          return {
            ...constructUserResponse(400, false, "User already exist"),
          };
        throw new Error(err);
      }
    },
    async login(_, { email, password }) {
      try {
        const user = await User.findOne({
          where: {
            email,
          },
        });
        if (!user)
          return {
            ...constructUserResponse(404, false, "User not found"),
          };
        if (await bcrypt.compare(password, user.password)) {
          return {
            ...constructUserResponse(200, true, "Login successful"),
            token: generateJWT(user.dataValues),
            data: user,
          };
        } else {
          return {
            ...constructUserResponse(400, false, "Invalid credentials"),
          };
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
