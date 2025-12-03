const { RESTDataSource } = require('@apollo/datasource-rest');

class AnalyticsAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.ANALYTICS_SERVICE_URL || 'http://localhost:4004';
  }

  async getQueueStats(queueId) {
    return this.get(`/api/analytics/queue/${queueId}/stats`);
  }

  async getDailyStats(queueId, date) {
    return this.get(`/api/analytics/queue/${queueId}/daily?date=${date}`);
  }

  async getPeakHours(queueId) {
    return this.get(`/api/analytics/queue/${queueId}/peak-hours`);
  }
}

module.exports = AnalyticsAPI;