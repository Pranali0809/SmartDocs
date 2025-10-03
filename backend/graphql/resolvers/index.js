// backend/graphql/resolvers/index.js
const userResolver = require('./UserResolver');
const documentResolver = require('./DocumentResolver');
const aiResolver = require('./AIResolver');
const ragResolver = require('./RAGResolver');
const profileResolver = require('./ProfileResolver');

module.exports = {
  Query: {
    ...userResolver.Query,
    ...documentResolver.Query,
    ...aiResolver.Query,
    ...ragResolver.Query,
    ...profileResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...documentResolver.Mutation,
    ...profileResolver.Mutation,
  },
  Subscription: {
    ...documentResolver.Subscription,
  },
};