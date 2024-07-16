const db = require('../data/dbConfig');

module.exports = {
  add,
  find,
  remove,
  findById,
  getByUserId,
  findByMessage
};

async function getByUserId(userId) {
  const notifications = await db('notifications')
    .where({ user_id: userId })
    .orderBy('created_at', 'desc');
  return notifications;
}

async function findById(id) {
  const notification = await db('notifications')
    .where({ id })
    .first();
  return notification;
}

async function findByMessage(title) {
  const foundMessage = await db('notifications').where('message', 'LIKE',title );
  return foundMessage;
}


async function remove(id) {
  const notification = await findById(id);
  if (!notification) return null;
  await db('notifications')
    .where({ id })
    .del();
  return notification;
}

async function add(newNotification) {
  const [id] = await db('notifications')
    .insert(newNotification);
  return findById(id);
}

async function find() {
  const notifications = await db('notifications');
  return notifications;
}
