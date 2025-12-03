const { RESTDataSource } = require('@apollo/datasource-rest');

class UserAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.USER_SERVICE_URL || 'http://localhost:4003';
  }

  async registerUser(userData) {
    return this.post('/api/users/register', { body: userData });
  }

  async loginUser(credentials) {
    return this.post('/api/users/login', { body: credentials });
  }

  async getUser(id) {
    return this.get(`/api/users/${id}`);
  }

  async updateUser(id, userData) {
    return this.put(`/api/users/${id}`, { body: userData });
  }
}

module.exports = UserAPI;