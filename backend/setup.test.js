import request from 'supertest';
import app from '../server.js';

describe('Health Check Endpoint', () => {
  test('should return health status', async () => {
    const res = await request(app)
      .get('/api/health');
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('service', 'SkillForge API');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('version');
  });
});

describe('404 Handler', () => {
  test('should return 404 for non-existent routes', async () => {
    const res = await request(app)
      .get('/api/nonexistent');
    
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('CORS and Security Headers', () => {
  test('should have proper CORS headers', async () => {
    const res = await request(app)
      .get('/api/health');
    
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  test('should have security headers from Helmet', async () => {
    const res = await request(app)
      .get('/api/health');
    
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });
});
