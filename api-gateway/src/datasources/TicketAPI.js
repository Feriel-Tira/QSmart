const { RESTDataSource } = require('@apollo/datasource-rest');

class TicketAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.TICKET_SERVICE_URL || 'http://localhost:4002';
  }

  async createTicket(ticketData) {
    return this.post('/api/tickets', { body: ticketData });
  }

  async getTicket(id) {
    return this.get(`/api/tickets/${id}`);
  }

  async getUserTickets(userId) {
    return this.get(`/api/tickets/user/${userId}`);
  }

  async getQueueTickets(queueId) {
    return this.get(`/api/tickets/queue/${queueId}`);
  }

  async getCurrentTicket(queueId) {
    return this.get(`/api/tickets/queue/${queueId}/current`);
  }

  async callNextTicket(queueId) {
    return this.post(`/api/tickets/queue/${queueId}/call-next`);
  }

  async serveTicket(ticketId) {
    return this.put(`/api/tickets/${ticketId}/serve`);
  }
}

module.exports = TicketAPI;