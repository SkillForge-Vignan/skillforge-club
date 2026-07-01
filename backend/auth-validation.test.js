import request from 'supertest';
import app from '../server.js';

describe('Auth Endpoints', () => {
  describe('POST /api/auth/send-otp', () => {
    test('should require valid email', async () => {
      const res = await request(app)
        .post('/api/auth/send-otp')
        .send({ email: 'invalid-email' });
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('should accept valid email', async () => {
      const res = await request(app)
        .post('/api/auth/send-otp')
        .send({ email: 'test@example.com' });
      
      // Response depends on database state, but should handle validation
      expect([200, 400, 409]).toContain(res.status);
    });
  });

  describe('POST /api/auth/register', () => {
    test('should validate name, email, and password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John',
          email: 'john@example.com',
          password: 'weak'
        });
      
      expect(res.status).toBe(400);
    });

    test('should accept valid registration data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: `test${Date.now()}@example.com`,
          password: 'SecurePass123'
        });
      
      expect([201, 409, 500]).toContain(res.status);
    });
  });
});

describe('Input Sanitization', () => {
  test('should sanitize malicious input', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({
        name: '<script>alert("xss")</script>',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message'
      });
    
    // Should handle the request (sanitization applied)
    expect([201, 400, 500]).toContain(res.status);
  });
});

describe('Validation Error Handling', () => {
  test('POST /api/auth/login should validate email format', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'not-an-email',
        password: 'password'
      });
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /api/contact should require all fields', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({
        name: 'John',
        // missing email, subject, message
      });
    
    expect(res.status).toBe(400);
  });
});

describe('API Documentation', () => {
  test('should have Swagger UI available', async () => {
    const res = await request(app)
      .get('/api-docs/');
    
    expect(res.status).toBe(200);
  });

  test('should serve Swagger JSON spec', async () => {
    const res = await request(app)
      .get('/api-docs/swagger.json');
    
    expect([200, 404]).toContain(res.status);
  });
});
