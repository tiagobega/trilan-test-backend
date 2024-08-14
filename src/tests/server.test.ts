import { shutdown, application } from '../server';
import request from 'supertest';

describe('Start Application', () => {
  afterAll((done) => {
    shutdown(done);
  });

  it('Application has the proper test environment ', async () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(application).toBeDefined();
  }, 10000);

  it('Returns all options allowed to be called by customers (http methods)', async () => {
    const response = await request(application).options('/');

    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-methods']).toBe(
      'PUT, POST, PATCH, DELETE, GET'
    );
  });

  it('verify if not found is working', async () => {
    const response = await request(application).get('/not-found');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Route Not Found');
  });
});
