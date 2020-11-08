const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");

const {
  models: { user: User },
} = require("../../sequelize");
const { constructResponse } = require("../../utils/responseUtil");

const generateJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
    algorithm: process.env.JWT_ALGORITHM,
  });
};

module.exports = {
  Query: {
    async getUser(_, { userId }) {
      try {
        const data = await User.findByPk(userId);
        if (data)
          return {
            ...constructResponse(200, true, "User retrieved successfully"),
            token: "12334",
            data,
          };
        else
          return {
            ...constructResponse(404, false, "User not found"),
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
          ...constructResponse(
            400,
            false,
            "password and confirm password must match"
          ),
        };
      const avatarUrl = gravatar.url(email, {
        protocol: process.env.GRAVATAR_PROTOCOL,
        s: process.env.GRAVATAR_SIZE,
      });
      let newUser = {
        id: nanoid(),
        firstName,
        lastName,
        email,
        avatarUrl,
      };
      try {
        const hashPassword = await bcrypt.hash(
          password,
          Number(process.env.BCRYPT_SALT_ROUNDS)
        );
        newUser = await User.create({ ...newUser, password: hashPassword });
        return {
          ...constructResponse(200, true, "User created successfully"),
          token: generateJWT(newUser.dataValues),
          data: newUser,
        };
      } catch (err) {
        if (err.original && err.original.code == "ER_DUP_ENTRY")
          return {
            ...constructResponse(400, false, "User already exist"),
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
            ...constructResponse(404, false, "User not found"),
          };
        if (await bcrypt.compare(password, user.password)) {
          return {
            ...constructResponse(200, true, "Login successful"),
            token: generateJWT(user.dataValues),
            data: user,
          };
        } else {
          return {
            ...constructResponse(400, false, "Invalid credentials"),
          };
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
