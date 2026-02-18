import request from 'supertest';
import app from '../src/index.js';

describe('API Endpoint Tests', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Welcome to the API');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('message', 'Welcome to the Express API');
      expect(response.body.data).toHaveProperty('version', '1.0.0');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Server is healthy');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status', 'ok');
      expect(response.body.data).toHaveProperty('timestamp');
    });
  });

  describe('GET /notfound', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/notfound');

      expect(response.status).toBe(404);
    });
  });
});
