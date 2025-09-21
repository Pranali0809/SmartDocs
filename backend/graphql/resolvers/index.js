// backend/graphql/resolvers/index.js
const userResolver = require('./UserResolver');
const documentResolver = require('./DocumentResolver');
const aiResolver = require('./AIResolver');

module.exports = {
  Query: {
    ...userResolver.Query,
    ...documentResolver.Query,
    ...aiResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...documentResolver.Mutation,
  },
  Subscription: {
    ...documentResolver.Subscription,
  },
};