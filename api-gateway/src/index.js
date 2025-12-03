// SMARTQUEUE API GATEWAY - Version string (pas besoin de gql)
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

console.log('=== SMARTQUEUE API STARTING ===');

// Schéma GraphQL en string (pas besoin de gql)
const typeDefs = `
  type Query {
    hello: String
    health: Health
    queues: [Queue]
    tickets: [Ticket]
  }
  
  type Health {
    status: String!
    timestamp: String!
    service: String!
  }
  
  type Queue {
    id: ID!
    name: String!
    isActive: Boolean!
    description: String
  }
  
  type Ticket {
    id: ID!
    ticketNumber: String!
    status: String!
    position: Int
  }
`;

// Résolveurs simples
const resolvers = {
  Query: {
    hello: () => 'Bienvenue sur SmartQueue!',
    health: () => ({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'api-gateway'
    }),
    queues: () => [
      { id: '1', name: 'Pharmacie Centrale', isActive: true, description: 'Service pharmacie' },
      { id: '2', name: 'Banque Nationale', isActive: true, description: 'Guichet bancaire' },
      { id: '3', name: 'Hôpital Ville', isActive: true, description: 'Urgences médicales' }
    ],
    tickets: () => [
      { id: '1', ticketNumber: 'PHA-001', status: 'WAITING', position: 1 },
      { id: '2', ticketNumber: 'PHA-002', status: 'CALLED', position: 2 },
      { id: '3', ticketNumber: 'BNQ-001', status: 'WAITING', position: 1 }
    ]
  }
};

async function startServer() {
  console.log('Initialisation du serveur...');
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  
  // Créer Apollo Server simple
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true
  });
  
  await server.start();
  
  // Route GraphQL
  app.use('/graphql', expressMiddleware(server));
  
  // Routes REST
  app.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      service: 'smartqueue-api-gateway',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      message: 'API Gateway opérationnelle'
    });
  });
  
  app.get('/', (req, res) => {
    res.json({
      name: 'SmartQueue API Gateway',
      description: 'Système de gestion intelligente des files d\'attente',
      version: '1.0.0',
      endpoints: {
        graphql: '/graphql',
        health: '/health'
      }
    });
  });
  
  // Démarrer
  app.listen(PORT, () => {
    console.log(`🚀 Serveur prêt sur http://localhost:${PORT}`);
    console.log(`📊 GraphQL Playground: http://localhost:${PORT}/graphql`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  });
}

// Démarrer
startServer().catch(error => {
  console.error('Erreur au démarrage:', error);
  process.exit(1);
});