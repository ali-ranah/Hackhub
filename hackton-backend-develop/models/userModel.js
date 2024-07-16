const db = require('../data/dbConfig');

async function getUserId(id) {
  const userId = await db('users as u')
    .select('u.fullname', 'u.username', 'u.email', 'u.image_url','u.role')
    .where({id})
    .first();
  return userId;
}

const addUser = async user => {
  const newUser = await db('users')
    .insert(user)
    .returning('*')
    .then(data => data[0]);
  return newUser;
};

async function getUserBy(userValue) {
  const userData = await db('users')
    .where(userValue)
    .first();
  return userData;
}

async function findBy(filter) {
  const user = await db('users')
    .where(filter)
    .first();

  return user;
}

async function createOrFindUser(newUser) {
  let user = await findBy({ email: newUser.email });

  if (!user) {
    user = await addUser(newUser);
    return user;
  }
  if (process.env.OAUTH_DEFAULT_PWD === user.password) {
    return user;
  }
}

const confirmEmail = async id => {
  const user = await db('users')
    .where({ id })
    .update({ verified: true }, 'id')
    .then(ids => {
      const userId = ids[0];
      return findBy({ id: userId });
    });
  return user;
};
/**
 * User Profile Models
 *
 * @returns
 */
async function getUsers() {
  const users = await db('users as u')
    .select(
      'u.id',
      'u.email',
      'u.username',
      'u.fullname',
      'u.bio',
      'u.image_url'
    )
    .returning('*');
  return users;
}
async function getSingleUser(filter) {
  const singleUser = await db('users as u')
    .select(
      'u.id',
      'u.email',
      'u.username',
      'u.fullname',
      'u.country',
      'u.mobile',
      'u.region',
      'u.DOB',
      'u.role',
      'u.image_url',
      'u.C_skill',
      'u.Cpp_skill',
      'u.JAVA_skill',
      'u.PYTHON_skill'

    )
    .where(filter)
    .first();
    console.log('Users',singleUser);
  return singleUser;
}
const updateUser = async (changes, id) => {
  const user = await db('users')
    .where({ id })
    .update(changes)
    .returning(['fullname', 'username','bio', 'image_url'])
    .then(userUpdate => userUpdate[0]);
  return user;
};

module.exports = {
  getUserId,
  addUser,
  getUserBy,
  findBy,
  createOrFindUser,
  getUsers,
  getSingleUser,
  updateUser,
  confirmEmail
};
