import request from 'supertest';
import app from '../app';

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('devrait retourner 400 si les données sont invalides', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'invalid' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('devrait retourner 401 avec des identifiants invalides', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'wrong@email.com', password: 'wrong' });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/health', () => {
    it('devrait retourner le status ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
    });
  });
});
