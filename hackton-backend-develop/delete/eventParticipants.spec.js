const request = require('supertest');
const server = require('../api/server');
const db = require('../data/dbConfig');
const mockEvents = require('../data/mock/event.mock');
const mockUsers = require('../data/mock/auth.mock');

const app = request(server);

let token;
let eventId;
let categoryId;
const invalidId = '849612';

beforeEach(async () => { await db.raw('TRUNCATE TABLE event_categories, users, event_participants, events RESTART IDENTITY CASCADE');
 

  const userResponse = await app
    .post('/api/auth/register')
    .set('Content-Type', 'application/json')
    .send(mockUsers.validInput1);
  token = userResponse.body.body.token;

  const categoryResponse = await app
    .post('/api/event-category')
    .set('Authorization', token)
    .set('Content-Type', 'application/json')
    .send({ category_name: 'Lambda winter hackathon' });
  categoryId = categoryResponse.body.body.category_id;

  const eventResponse = await app
    .post('/api/events')
    .set('Authorization', token)
    .set('Content-Type', 'application/json')
    .send({ ...mockEvents.event1, category_id: categoryId });
  eventId = eventResponse.body.body.event_id;
});

describe('Event participants endpoints', () => {
  test('user can register as a participant for an event', async done => {
    const eventRegister = await app
      .post(`/api/events/${eventId}/participants`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');

    expect(eventRegister.status).toBe(201);
    expect(eventRegister.body.success).toEqual(true);
    expect(eventRegister.body.message).toEqual('Event registered successfully');
    done();
  });

  test('user can not unregister as a participant for an event he didnt register for', async done => {
    const eventUnregister = await app
      .delete(`/api/events/2/participants/`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');
    expect(eventUnregister.status).toBe(404);
    expect(eventUnregister.statusCode).toBe(404);
    expect(eventUnregister.body.success).toEqual(false);
    expect(eventUnregister.body.message).toEqual(
      'This event id cannot be found,please provide a valid event id'
    );
    done();
  });

  test('user can not unregister as a participant for an invalid event', async done => {
    const eventUnregister = await app
      .delete(`/api/events/${invalidId}/participants/`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json');
    expect(eventUnregister.status).toBe(404);
    expect(eventUnregister.statusCode).toBe(404);
    expect(eventUnregister.body.success).toEqual(false);
    expect(eventUnregister.body.message).toEqual(
      'This event id cannot be found,please provide a valid event id'
    );
    done();
  });

  test('judges or organisers should not be allowed to register', async done => {
    const response2 = await app
      .post('/api/auth/register')
      .set('Content-Type', 'application/json')
      .send(mockUsers.validInput2);
    token2 = await response2.body.body.token;

    const response = await app
      .post(`/api/events/${eventId}/team`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send({ email: mockUsers.validInput2.email, role_type: 'judge' });
    expect(response.status).toEqual(200);

    const eventRegister = await app
      .post(`/api/events/${eventId}/participants`)
      .set('Authorization', token2)
      .set('Content-Type', 'application/json');
    expect(eventRegister.status).toBe(403);
    expect(eventRegister.body.message).toEqual(
      'Event judges or organisers are not allowed to participate'
    );
    done();
  });
});
