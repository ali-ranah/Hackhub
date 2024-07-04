const db = require('../data/dbConfig');

async function getByEventId(id) {
  const eventSelected = await db('event_participants as e')
    .join('users as u', 'u.id', 'e.user_id')
    .select(
      'e.user_id',
      'u.email as participants_email',
      'u.fullname as participants_name',
      'u.username as participants_username',
      'u.verified',
      'e.event_id'
    )
    .where('e.event_id', id);
  return eventSelected;
}

async function addCredentials(credentials) {
  const newCredentials = await db('event_participants')
    .insert(credentials)
    .returning('*')
    .then(data => data[0]);
  return newCredentials;
}

async function checkParticipants(id) {
  const count = await db('event_participants')
    .where('event_id', id)
    .count('id')
    .first();

  console.log('Count:', count['count(`id`)']);

  return parseInt(count['count(`id`)'], 10);
}


async function getEventById(id) {
  const event = await db('events').where('id', id).first();
  return event;
}


// eslint-disable-next-line camelcase
async function remove(user_id, event_id) {
  const deleteEvent = await db('event_participants as e')
    .where('e.user_id', user_id)
    .where('e.event_id', event_id)
    .del();
  return deleteEvent;
}


const getByUserIdAndEventId = async (id,eventId) => {
  return db('event_participants as p')
    .join('users as u', 'u.id', 'p.user_id')
    .join('events as e', 'e.id', 'p.event_id')
    .select(
      'p.id',
      'p.event_id',
      'p.user_id',
      'p.question',
      'p.guidelines',
      'p.description',
      'e.event_title',
      'e.start_date',
      'e.end_date',
      'e.location',
      'e.allowed_time',
      'u.fullname as organizer_name',
      'u.email as organizer_email',
      'u.username as organizer_username',
      'u.verified'
    )
    .where({ user_id: id,event_id:eventId });
};

const getByUserId = async (id) => {
  return db('event_participants as p')
    .join('users as u', 'u.id', 'p.user_id')
    .join('events as e', 'e.id', 'p.event_id')
    .select(
      'p.id',
      'p.event_id',
      'p.user_id',
      'p.question',
      'p.guidelines',
      'p.description',
      'e.event_title',
      'e.start_date',
      'e.end_date',
      'e.location',
      'u.fullname as organizer_name',
      'u.email as organizer_email',
      'u.username as organizer_username',
      'u.verified'
    )
    .where({ user_id: id });
};

module.exports = {
  getByEventId,
  getByUserIdAndEventId,
  addCredentials,
  checkParticipants,
  getEventById,
  remove,
  getByUserId
};
