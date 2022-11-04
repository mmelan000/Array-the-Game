const { AuthenticationError } = require('apollo-server-express');
const { User, Thought, Reaction } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, { _id }) => {
      const params = _id ? { _id } : {};
      return User.find(params);
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const newUser = await User.create(args);
      const token = signToken(newUser);

      return { token, newUser };
    },
  },
};

module.exports = resolvers;
