const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    me: User
  }
  type User {
    _id: ID
    username: String
    email: String
  }
  type Auth {
    token: ID!
    user: User
  }
  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;
