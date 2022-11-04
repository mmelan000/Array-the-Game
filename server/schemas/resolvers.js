const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models/User');

const resolvers = {
  Query: {
    me: async (parent, { _id }) => {
      const params = _id ? { _id } : {};
      return User.find(params);
    },
  },
};

module.exports = resolvers;
