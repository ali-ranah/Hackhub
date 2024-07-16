/* eslint-disable no-use-before-define */
const db = require('../data/dbConfig');

module.exports = {
  add,
  find,
  remove,
  update,
  findById,
  findByTitle,
  getByUserId
};

async function getByUserId(perPage , currentPage , id) {
  const pagination = {};
  const page = Math.max(currentPage, 1);
  const offset = (page - 1) * perPage;
  return Promise.all([
    db('events as e')
      .clone()
      .count('* as count')
      .where('e.creator_id', `${id}`)
      .first(),
    db('events as e')
      .limit(perPage)
      .offset(offset)
      .join('users as u', ' u.id', 'e.creator_id')
      .select(
        'e.id',
        'e.event_title',
        'e.numberOfParticipants',
        'e.start_date',
        'e.end_date',
        'e.location',
        'e.creator_id',
        'e.preferedLanguage',
        'e.prizeAmount',
        'e.allowed_time',
        'e.levelOfParticipant',
        'u.fullname as organizer_name',
        'u.email as organizer_email',
        'u.username as organizer_username',
        'u.image_url as organizer_profile_pic'
      )
      .where('e.creator_id', `${id}`)
  ]).then(([total, rows]) => {
    const { count } = total;
    pagination.total = parseInt(count, 10);
    pagination.perPage = perPage;
    pagination.offset = offset;
    pagination.to = offset + rows.length;
    pagination.last_page = Math.ceil(count / perPage);
    pagination.currentPage = page;
    pagination.from = offset;
    pagination.data = rows;
    pagination.totalEvents = rows; // Add totalEvents response
    return pagination;
  });
}


async function findByTitle(title) {
  const foundTitle = await db('events').where('event_title', 'LIKE', title);
  return foundTitle;
}

async function findById(id) {
  const eventId = await db('events as e')
    .join('users as u', ' u.id', 'e.creator_id')
    .select(
      'e.id',
      'e.event_title',
      'e.numberOfParticipants',
      'e.start_date',
      'e.end_date',
      'e.location',
      'e.creator_id',
      'e.preferedLanguage',
      'e.prizeAmount',
      'e.levelOfParticipant',
      'u.fullname as organizer_name',
      'u.email as organizer_email',
      'u.username as organizer_username',
      'u.image_url as organizer_profile_pic'
    )
    .where('e.id', `${id}`);
  return eventId;
}


async function update(id, event) {
  const eventUpdate = await db('events')
    .where({ id })
    .update(event)
    .returning('*')
    .then(newEvent => newEvent[0]);
  return eventUpdate;
}

async function remove(id) {
  const eventId = await db('events')
    .where({ id })
    .delete();
  return eventId;
}

async function add(event) {
  const newEvent = await db('events')
    .insert(event)
    .returning('id');
  return newEvent;
}




// async function find() {
//   const foundEvents = await db('events as e')
//     .join('users as u', 'u.id', 'e.creator_id')
//     .leftJoin('event_participants as ep', 'ep.event_id', 'e.id')
//     .select(
//       'e.id',
//       'e.event_title',
//       'e.numberOfParticipants',
//       'e.start_date',
//       'e.end_date',
//       'e.location',
//       'e.creator_id',
//       'e.preferedLanguage',
//       'e.question',
//       'e.guidelines',
//       'e.description',
//       'e.prizeAmount',
//       'e.allowed_time',
//       'e.levelOfParticipant',
//       'u.fullname as organizer_name',
//       'u.email as organizer_email',
//       'u.username as organizer_username',
//       'u.image_url as organizer_profile_pic',
//       db.raw('COUNT(ep.id) as joinedParticipants')
//     )
//     .groupBy('e.id');

//     const totalEvents = foundEvents.length;
//     const totalRating = foundEvents.reduce((acc, event) => acc + ((event.numberOfParticipants === 0 ? 0 : event.joinedParticipants / event.numberOfParticipants) * 100), 0);
//     const ratingInEvents = totalEvents > 0 ? totalRating / totalEvents : 0;
//     console.log(`Rating: ${totalRating}`);
//     console.log(`Events: ${totalEvents}`);
//     console.log(`Rating In Events: ${ratingInEvents.toFixed(2)}`);


//   const eventsWithAverageRate = foundEvents.map((event) => ({
//     ...event,
//     averageRate: (event.numberOfParticipants === 0 ? 0 : event.joinedParticipants / event.numberOfParticipants)*100,
//     ratingInEvents: ratingInEvents.toFixed(2)
//   }));

//   return eventsWithAverageRate;
// }


async function find() {
  const foundEvents = await db('events as e')
    .join('users as u', 'u.id', 'e.creator_id')
    .leftJoin('event_participants as ep', 'ep.event_id', 'e.id')
    .select(
      'e.id',
      'e.event_title',
      'e.numberOfParticipants',
      'e.start_date',
      'e.end_date',
      'e.location',
      'e.creator_id',
      'e.preferedLanguage',
      'e.question',
      'e.guidelines',
      'e.description',
      'e.prizeAmount',
      'e.allowed_time',
      'e.levelOfParticipant',
      'u.fullname as organizer_name',
      'u.email as organizer_email',
      'u.username as organizer_username',
      'u.image_url as organizer_profile_pic',
      db.raw('COUNT(ep.id) as joinedParticipants')
    )
    .groupBy('e.id');

  
  const eventsWithAverageRate = foundEvents.map((event) => ({
    ...event,
    averageRate: (event.numberOfParticipants === 0 ? 0 : event.joinedParticipants / event.numberOfParticipants) * 100,
  }));


  const rankedEvents = eventsWithAverageRate
  .sort((a, b) => b.averageRate - a.averageRate)
  .map((event, index) => ({
    ...event,
    ratingInEventsRank: index + 1
  }));

  rankedEvents.forEach((event) => {
    console.log(`Event ID: ${event.id}, Rating Rank: ${event.ratingInEventsRank}`);
  });
  return rankedEvents;
}
