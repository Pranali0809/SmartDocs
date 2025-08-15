// backend/graphql/resolvers/index.js
const userResolver = require('./UserResolver');
const documentResolver = require('./DocumentResolver');

module.exports = {
  Query: {
    ...userResolver.Query,
    ...documentResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...documentResolver.Mutation,
  },
  Subscription: {
    ...documentResolver.Subscription,
  },
};