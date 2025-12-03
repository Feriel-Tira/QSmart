const { RESTDataSource } = require('@apollo/datasource-rest');

class QueueAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.QUEUE_SERVICE_URL || 'http://localhost:4001';
  }

  async getQueues() {
    return this.get('/api/queues');
  }

  async getQueue(id) {
    return this.get(`/api/queues/${id}`);
  }

  async createQueue(queueData) {
    return this.post('/api/queues', { body: queueData });
  }

  async updateQueue(id, queueData) {
    return this.put(`/api/queues/${id}`, { body: queueData });
  }
}

module.exports = QueueAPI;