const { ApolloServer } = require('@apollo/server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { readFileSync } = require('fs');
const path = require('path');

// Load schema
const typeDefs = readFileSync(
  path.join(__dirname, '../schema/schema.graphql'),
  'utf8'
);

const resolvers = {
  Query: {
    me: (_, __, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return { id: context.user.userId, email: context.user.email };
    },
    queues: async (_, __, { dataSources }) => {
      return dataSources.queueAPI.getQueues();
    },
    queue: async (_, { id }, { dataSources }) => {
      return dataSources.queueAPI.getQueue(id);
    },
    myTickets: async (_, __, { user, dataSources }) => {
      if (!user) throw new Error('Not authenticated');
      return dataSources.ticketAPI.getUserTickets(user.userId);
    },
    queueStats: async (_, { queueId }, { dataSources }) => {
      return dataSources.analyticsAPI.getQueueStats(queueId);
    },
  },
  Mutation: {
    registerUser: async (_, { email, name, password, phone }, { dataSources }) => {
      return dataSources.userAPI.registerUser({ email, name, password, phone });
    },
    loginUser: async (_, { email, password }, { dataSources }) => {
      return dataSources.userAPI.loginUser({ email, password });
    },
    createTicket: async (_, { queueId, priority }, { user, dataSources }) => {
      if (!user) throw new Error('Not authenticated');
      return dataSources.ticketAPI.createTicket({
        queueId,
        userId: user.userId,
        priority,
      });
    },
    callNextTicket: async (_, { queueId }, { user, dataSources }) => {
      if (!user || user.role !== 'AGENT') throw new Error('Not authorized');
      return dataSources.ticketAPI.callNextTicket(queueId);
    },
  },
  Subscription: {
    ticketUpdated: {
      subscribe: (_, { queueId }, { pubsub }) => {
        return pubsub.asyncIterator(`TICKET_UPDATED_${queueId}`);
      },
    },
  },
  Queue: {
    tickets: async (parent, _, { dataSources }) => {
      return dataSources.ticketAPI.getQueueTickets(parent.id);
    },
    currentTicket: async (parent, _, { dataSources }) => {
      return dataSources.ticketAPI.getCurrentTicket(parent.id);
    },
    stats: async (parent, _, { dataSources }) => {
      return dataSources.analyticsAPI.getQueueStats(parent.id);
    },
  },
  Ticket: {
    user: async (parent, _, { dataSources }) => {
      if (!parent.userId) return null;
      return dataSources.userAPI.getUser(parent.userId);
    },
    queue: async (parent, _, { dataSources }) => {
      return dataSources.queueAPI.getQueue(parent.queueId);
    },
  },
};

module.exports = { typeDefs, resolvers };